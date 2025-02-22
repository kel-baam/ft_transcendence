from channels.generic.websocket         import AsyncWebsocketConsumer
from asgiref.sync                       import sync_to_async
from channels.db                        import database_sync_to_async
from django.conf                        import settings
from django.db                          import models
from asgiref.sync                       import async_to_sync
from channels.layers                    import get_channel_layer
from django.contrib.contenttypes.models import ContentType

from .models                            import Player, User, Match, Tournament, PlayerTournament
from .serializers                       import UserSerializer, MatchSerializer, NotificationSerializers
from .exceptions                        import CustomAPIException

import json
import asyncio
import jwt
import random
import string

class Matchmaking(AsyncWebsocketConsumer):
    waiting_player = None
    is_redirected  = False

    async def connect(self):
        print("--------> opened")

        self.user_id = None 
        for header_name, header_value in self.scope["headers"]:
            if header_name == b'cookie':

                cookies_str = header_value.decode("utf-8")
                cookies     = {}
                for cookie in cookies_str.split("; "):
                    key, value   = cookie.split("=", 1)  
                    cookies[key] = value          
                try:

                    payload           = jwt.decode(cookies.get("access_token").encode("utf-8"), settings.SECRET_KEY, algorithms=["HS256"])
                    self.access_token = cookies.get("access_token")
                    user              = await sync_to_async(User.objects.filter(email=payload["email"]).first)()
                    if user:
                        self.scope['user_id'] = user
                        self.user_id          = user.id
                        self.scope['email']   = payload["email"]
                        
                        existing_match = await self.get_existing_match(self.user_id)
                        if existing_match:
                            self.room_group_name = f"match_{existing_match.room_name}"
                        else:
                            self.room_group_name = f"matchmaking"

                        await self.channel_layer.group_add(
                            self.room_group_name,
                            self.channel_name
                        )
                        await self.accept()
                        
                        await self.send_json({
                            'action': 'user_data',
                            'user'  : UserSerializer(user, fields=['id', 'username', 'picture']).data,
                        })
                    else:
                        await self.send_json({"error": "user doesn't exist"})
                except Exception as e:
                        await self.send_json({"error": "token expired"})

    async def disconnect(self, close_code):
        print(f"Disconnected: {self.user_id}")

        if Matchmaking.waiting_player and Matchmaking.waiting_player['user_id'] == self.user_id:
            Matchmaking.waiting_player = None

        existing_match = await self.get_existing_match(self.user_id)
        user           = await self.get_user(self.user_id)
        if existing_match:
            opponent_user = await self.get_opponent_user(existing_match, self.user_id)
            
            print("+++>>> :", self.is_redirected)

            if not self.is_redirected:
                self.is_redirected = False # to re-check 
                await self.mark_match_exited(existing_match)
            if opponent_user and not self.is_redirected:
                await self.channel_layer.group_send(
                    f"{existing_match.room_name}",
                    {
                        "type"   : "opponent_disconnected",
                        "message": f"Your opponent {user.username} has disconnected.",
                    }
                )
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

        await self.close()

    async def opponent_disconnected(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            "action" : "opponent_disconnected",
            "message": message, 
        }))

    @database_sync_to_async
    def mark_match_exited(self, match):
        """Update match status to 'exited' when a player disconnects."""
        match.status = "exited"
        match.save()
        

    async def receive(self, text_data):
        print("---------> receive")

        data   = json.loads(text_data)
        action = data.get('action')

        if action == 'find_opponent':
            await self.pair_pvp_players()
        if action == 'online_tournament':
            await self.pair_online_tournament_players(data.get('tournamentId'))
        if action == 'local_tournament':
            await self.pair_local_tournament_players(data.get('tournamentId'))
        if action == 'start_match':
            await self.start_tournament_match(data.get('matchId'))
        if action == 'ready_for_redirect':
            self.is_redirected = True
            print("--+>>> :", self.is_redirected)

            match_id  = data.get('match_id')
            room_name = data.get('room_name')
            
            await self.channel_layer.group_send(
                room_name,
                {   
                    "type"     : "redirect_player",
                    "id"       : match_id,
                    "room_name": room_name,
                }
            )
        #local tournament

    async def redirect_player(self, event):
        await self.send_json({
            "action"   : "redirect_players",
            "id"       : event['id'],
            "room_name": event['room_name']
        })


# ------------------------------------------PVP----------------------------

    async def pair_pvp_players(self):
        existing_match = await self.get_existing_match(self.user_id)
        if existing_match:
            opponent      = await self.get_opponent_user(existing_match, self.user_id)
            opponent_user = await self.get_user(opponent.id)
            
            print(f"♻️ {self.user_id} is rejoining match with {opponent_user.username}")

            await self.send_json({
                "action"    : "match_found",
                "id"        : existing_match.id,
                "opponent"  : UserSerializer(opponent_user, fields=['id', 'username', 'picture']).data,
                "room_name" : existing_match.room_name,
            })
            return

        if Matchmaking.waiting_player is None or Matchmaking.waiting_player["user_id"] == self.user_id:
            Matchmaking.waiting_player = {
                "user_id"  : self.user_id,
                "websocket": self
            }

            print(f"Player {self.user_id} is waiting for an opponent...")

            try:
                await asyncio.wait_for(self.wait_for_opponent(), timeout=15)
            except asyncio.TimeoutError:
                await self.notify_timeout()

        else:
            matched_player = Matchmaking.waiting_player
            Matchmaking.waiting_player = None

            print(f"Match found: {self.user_id} vs {matched_player['user_id']}")

            opponent = await self.get_user(matched_player["user_id"])
            user     = await self.get_user(self.user_id)

            room_name = self.generate_room_name(self.user_id, matched_player["user_id"])
            match     = await self.create_match(self.user_id, matched_player["user_id"], room_name)
            print("---------> ", match)
            await self.channel_layer.group_add(room_name, self.channel_name)
            await self.channel_layer.group_add(room_name, matched_player["websocket"].channel_name)

            await self.send_json({
                "action"    : "match_found",
                "id"        : match['id'],
                "opponent"  : UserSerializer(opponent, fields=['id', 'username', 'picture']).data,
                "room_name" : room_name,
            })

            await matched_player["websocket"].send_json({
                "action"    : "match_found",
                "id"        : match['id'],
                "opponent"  : UserSerializer(user, fields=['id', 'username', 'picture']).data,
                "room_name" : room_name,
            })

    @database_sync_to_async
    def get_opponent_user(self, existing_match, user_id):
        """Get the user object of the opponent player from the existing match."""

        opponent_player = existing_match.player1 if existing_match.player2.id == user_id else existing_match.player2
        return opponent_player

    @sync_to_async
    def create_match(self, player1_id, player2_id, room_name):
        """Save the match in the database using the serializer."""

        player1, _ = Player.objects.get_or_create(user_id=player1_id)
        player2, _ = Player.objects.get_or_create(user_id=player2_id)

        match_data = {
            "player1"  : player1.id,
            "player2"  : player2.id,
            "status"   : "pending",
            "room_name": room_name,
        }
        serializer = MatchSerializer(data=match_data)
        if serializer.is_valid():
            match = serializer.save()
            return MatchSerializer(match).data
        else:
            return {"error": "Failed to create match", "details": serializer.errors}


    @database_sync_to_async
    def get_existing_match(self, user_id):
        """Check if the user is already in an active match (pending status) with a null tournament."""

        try:
            player = Player.objects.get(user_id=user_id)
            match  = Match.objects.filter(
                (models.Q(player1=player) | models.Q(player2=player)) &
                models.Q(status="pending") &
                models.Q(tournament__isnull=True)
            ).first()
            return match
        except Player.DoesNotExist:
            return None

    def generate_room_name(self, user1, user2):
        """Ensure room names are consistent regardless of player order"""

        return f"match_{min(user1, user2)}_{max(user1, user2)}"

    async def wait_for_opponent(self):
        for _ in range(15):
            if Matchmaking.waiting_player is None:
                return
            await asyncio.sleep(1)

    async def notify_timeout(self):
        """Notify the user if no opponent is found within the timeout period."""

        await self.send_json({
            "action" : "match_not_found",
            "message": "No opponent found within the time limit. Please try again later."
        })

    @sync_to_async
    def get_user(self, user_id):
        return User.objects.get(id=user_id)

# ----------------------------------online-------------------------------------------------

    async def pair_online_tournament_players(self, id):

        if not id:
            await self.send_json({
                'success': False,
                'error'  : 'Tournament ID is required'
            })
            return

        try:
            tournament = await self.get_online_tournament(id)

            print("tournament status : ", tournament.status, "id", id)

            if tournament.status == 'started':
                matches = await self.first_round_matches(id) 
                await self.send_json({
                    'success': True,
                    'matches': matches,
                })

                return

            player_entries = await self.get_online_tournament_players(id)
            players        = await self.get_players(player_entries)

            players_with_mmv = []
            for player in players:
                mmv = await self.calculate_mmv(player)
                players_with_mmv.append((player, mmv))

            sorted_players = sorted(players_with_mmv, key=lambda x: x[1])

            group_name   = await self.add_players_to_group(sorted_players, id)
            content_type = await sync_to_async(ContentType.objects.get_for_model)(tournament)
            creator_id   = await sync_to_async(lambda: tournament.creator.id)()
            notif_data   = {
                'sender'      : creator_id,
                'receiver'    : None,
                'type'        : 'enter_tournament',
                'content_type': content_type.id,
                'object_id'   : tournament.id,
                'message'     : f'The tournament {tournament.name} is started.',
            }

            for player in players:
                user_id = await sync_to_async(lambda: player.user.id)()
                if user_id != creator_id:
                    notif_data['receiver'] = user_id
                    notif_serializer       = NotificationSerializers(data=notif_data)
                    is_valid               = await sync_to_async(notif_serializer.is_valid)(raise_exception=True)
                    if is_valid:
                        await sync_to_async(notif_serializer.save)()

            await self.broadcast_group_notification(group_name, notif_serializer.instance)

            matches = []
            for i in range(0, len(sorted_players), 2):
                player1 = sorted_players[i][0]
                player2 = sorted_players[i + 1][0]

                room_name = f"{tournament.name}_{self.generate_room_name(player1.id, player2.id)}"
                match     = await self.create_online_match(tournament.id, player1, player2, room_name)
                if match:
                    player1_tournament = await self.get_playerTournament(player1, id)
                    player2_tournament = await self.get_playerTournament(player2, id)

                    matches.append({
                        'player1_id': match.get('player1'),
                        'player1'   : player1_tournament.nickname if player1_tournament else None,
                        'avatar1'   : player1_tournament.avatar.url if player1_tournament and player1_tournament.avatar else None,
                        'player2_id': match.get('player2'),
                        'player2'   : player2_tournament.nickname if player2_tournament else None,
                        'avatar2'   : player2_tournament.avatar.url if player2_tournament and player2_tournament.avatar else None,
                        'status'    : match.get('status'),
                        'match_id'  : match.get('id')
                    })

            await self.send_json({
                'success': True,
                'matches': matches,
            })
        
            await self.update_online_tournament_status(id, 'started')

        except CustomAPIException as e:
            await self.send_json({
                'success': False,
                'error'  : e.message,
                'code'   : e.code
            })
        except Exception as e:
            print(f"Unexpected error during matchmaking: {str(e)}")
            raise CustomAPIException(f"An unexpected error occurred during matchmaking: {str(e)}")

    @database_sync_to_async
    def get_online_tournament(self, tournament_id):
        try:
            tournament = Tournament.objects.get(id=tournament_id)

            return tournament
        except Tournament.DoesNotExist:
            raise CustomAPIException(f"Tournament with ID {tournament_id} does not exist.", code=404)
        
    @database_sync_to_async
    def create_online_match(self, tournament_id, player1, player2, room_name):
            tournament = Tournament.objects.get(id=tournament_id)
            match_data = {
                "player1"    : player1.id,
                "player2"    : player2.id,
                "tournament" : tournament.id,
                "status"     : 'pending',
                "room_name"  : room_name
            }
            serializer = MatchSerializer(data=match_data)
            if serializer.is_valid():
                match = serializer.save()
                return MatchSerializer(match).data
            else:
                return {"error": "Failed to create match", "details": serializer.errors}

    @database_sync_to_async
    def get_playerTournament(self, player, tournament_id):
        try:
            return PlayerTournament.objects.get(player=player, tournament_id=tournament_id)
        except PlayerTournament.DoesNotExist:
            return None

    @database_sync_to_async
    def get_online_tournament_players(self, id):        
        """  Fetches players from the given tournament ID. """

        try:
            tournament      = Tournament.objects.get(id=id)
            player_entries  = PlayerTournament.objects.filter(tournament=tournament, status='accepted')
            
            return player_entries
        except Tournament.DoesNotExist:
            raise CustomAPIException(f"Tournament with ID {id} does not exist.")
        except Exception as e:
            raise CustomAPIException(f"An error occurred while fetching player entries: {str(e)}")

    @sync_to_async
    def get_players(self, player_entries):
        """ Extracts player objects from player entries. """

        try:
            if not player_entries:
                raise ValueError("No player entries found.")
            return [entry.player for entry in player_entries]
        except AttributeError:
            raise CustomAPIException("Invalid player entry structure.")
        except Exception as e:
            raise CustomAPIException(f"An error occurred while extracting players: {str(e)}")

    @sync_to_async
    def calculate_mmv(self, player):
        """ Calculate the matchmaking value (MMV) for a player based on their level, score, and rank. """
        weight_level = 1
        weight_score = 2
        weight_rank  = 3

        mmv = (player.level * weight_level) + (player.score * weight_score) + (player.rank * weight_rank)
        return mmv
    
    @database_sync_to_async
    def update_online_tournament_status(self, tournament_id, status):
        try:
            tournament        = Tournament.objects.get(id=tournament_id)
            tournament.status = status

            tournament.save()
        except Tournament.DoesNotExist:
            raise CustomAPIException(f"Tournament with ID {tournament_id} does not exist.", code=404)


    @database_sync_to_async
    def first_round_matches(self, tournament_id):
        try:
            tournament = Tournament.objects.get(id=tournament_id)
            matches    = Match.objects.select_related('player1', 'player2').filter(tournament=tournament)
            
            match_data = []
            for match in matches:
                player1_tournament = PlayerTournament.objects.get(player=match.player1, tournament=tournament)
                player2_tournament = PlayerTournament.objects.get(player=match.player2, tournament=tournament)

                match_data.append({
                    'player1_id': match.player1.id,
                    'player1'   : player1_tournament.nickname,
                    'player2_id': match.player2.id,
                    'player2'   : player2_tournament.nickname,
                    'avatar1'   : player1_tournament.avatar.url if player1_tournament.avatar else None,
                    'avatar2'   : player2_tournament.avatar.url if player2_tournament.avatar else None,
                    'status'    : match.status,
                    'match_id'  : match.id
                })
            return match_data
        except Tournament.DoesNotExist:
            return []
        
    async def add_players_to_group(self, players, match_id):
        room_name = f"tournament_{match_id}"
        for player in players:
            await self.channel_layer.group_add(
                room_name,
                self.channel_name
            )
        return room_name

    async def broadcast_group_notification(self, group_name, notification):
        
        channel_layer = get_channel_layer()
        await channel_layer.group_send(
            group_name,
            {
                'type'          : 'send_notification',
                'notification'  : {
                    'id'        : notification.id,
                    'message'   : notification.message,
                    'type'      : notification.type,
                    'created_at': notification.time.isoformat(),
                    'read_at'   : notification.read_at,
                }
            }
        )

    async def send_json(self, data):
        """Helper function to send JSON messages"""
        await self.send(text_data=json.dumps(data))


    async def start_tournament_match(self, match_id):

        match           = await sync_to_async(Match.objects.select_related('player1__user', 'player2__user').get)(id=match_id)
        player1_user_id = match.player1.user.id
        player2_user_id = match.player2.user.id

        if self.user_id == player1_user_id or self.user_id == player2_user_id:
            await self.send_json({
                'is_user' : True,
                'match_id': match_id,
            })
        else:
            await self.send_json({
                'is_user': False
            })

# ----------------------------LOCAL--------------------------------------------------------------------

    async def pair_local_tournament_players(self, id):
        if not id:
            await self.send_json(({
                'success' : False,
                'error'   : 'Tournament ID is required'
            }))
            return

        try:
            tournament   = await self.get_local_tournament(id)
            participants = await self.get_local_players(id)

            if tournament.status == 'matchmaking':
                matches      = await self.get_local_match(id)
                matches_list = []
                match_index  = 0

                for i in range(0, len(participants) - 1, 2):
                    if match_index >= len(matches):
                        break

                    player1 = participants[i]
                    player2 = participants[i + 1]
                    match   = matches[match_index]

                    matches_list.append({
                        'player1' : player1.nickname,
                        'player2' : player2.nickname,
                        'avatar1' : player1.avatar.url if player1.avatar else None,
                        'avatar2' : player2.avatar.url if player2.avatar else None,
                        'status'  : match.status,
                        'match_id': match.id
                    })
                    match_index += 1

                await self.send_json(({
                    'success': True,
                    'matches': matches_list
                }))

            print(len(participants))
            if len(participants) < 2:
                await self.send_json(({
                    'success': False,
                    'error'  : 'No participants found in the tournament'
                }))
                return

            matches = []
            for i in range(0, len(participants) - 1, 2):

                player1   = participants[i]
                player2   = participants[i + 1]
                room_name = await self.generate_unique_room_code()

                match = await self.create_local_match(tournament, room_name)
                matches.append({
                    'player1'  : player1.nickname,
                    'player2'  : player2.nickname,
                    'avatar1'  : player1.avatar.url if player1.avatar else None,
                    'avatar2'  : player2.avatar.url if player2.avatar else None,
                    'status'   : match['status'],
                    'match_id' : match['id']
                })

                await self.send_json(({
                    'success': True,
                    'matches': matches
                }))

            await self.update_local_tournament_status(id, 'matchmaking')

        except Tournament.DoesNotExist:
            await self.send_json(({
                'success': False,
                'error'  : 'Tournament not found'
            }))
        except Exception as e:
            raise CustomAPIException("An error occurred during matchmaking: " + str(e))

    @database_sync_to_async
    def generate_unique_room_code(self):
        while True:
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=3))
            if not Match.objects.filter(room_name=code, status="pending").exists():
                return code

    @database_sync_to_async
    def get_local_tournament(self, tournament_id):
        try:
            tournament = Tournament.objects.get(id=tournament_id)
            return tournament
        except Tournament.DoesNotExist:
            raise CustomAPIException(f"Tournament with ID {tournament_id} does not exist.", code=404)


    @database_sync_to_async
    def update_local_tournament_status(self, tournament_id, status):
        try:
            tournament          = Tournament.objects.get(id=tournament_id)
            tournament.status   = status

            tournament.save()
        except Tournament.DoesNotExist:
            raise CustomAPIException(f"Tournament with ID {tournament_id} does not exist.", code=404)

    @sync_to_async
    def create_local_match(self, tournament, room_name):
        try:
            match_data = {
                "tournament" : tournament.id,
                "status"     : 'pending',
                "room_name"  : room_name
            }
            serializer = MatchSerializer(data=match_data)
            if serializer.is_valid():
                match = serializer.save()
                return MatchSerializer(match).data
            else:
                return {"error": "Failed to create match", "details": serializer.errors}
        except Exception as e:
            print(f"Error creating match: {e}")
            return None
        
    @sync_to_async
    def get_local_players(self, tournament_id):
        try:
            participants = PlayerTournament.objects.filter(tournament_id=tournament_id)
            return list(participants)
        except PlayerTournament.DoesNotExist:
            return []

    @sync_to_async
    def get_local_match(self, tournament_id):
        try:
            match = Match.objects.filter(tournament_id=tournament_id)
            return list(match)
        except Match.DoesNotExist:
            return []