from channels.generic.websocket         import AsyncWebsocketConsumer
from asgiref.sync                       import sync_to_async
from channels.db                        import database_sync_to_async
from django.conf                        import settings
from django.db                          import models
from asgiref.sync                       import async_to_sync
from channels.layers                    import get_channel_layer
from django.contrib.contenttypes.models import ContentType

from .models                            import Player, User, Match, Tournament, PlayerTournament
from .serializers                       import *
from .exceptions                        import CustomAPIException

import json
import asyncio
import jwt
import random
import string
from django.core.exceptions import ObjectDoesNotExist

class Matchmaking(AsyncWebsocketConsumer):
    waiting_player = None
    is_redirected  = False

    async def connect(self):
        print("--------> opened")

        self.user_id = None 
        self.notification_group_name = None
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
                        await self.accept()
                       
                        self.tournament_id    = self.scope["query_string"].decode().split("tournamentId=")[-1] if "tournamentId=" in self.scope["query_string"].decode() else None
                        
                        if self.tournament_id:
                            self.group_name = f"tournament_{self.tournament_id}"

                        existing_match = await self.get_existing_match(self.user_id)

                        if existing_match:
                            self.group_name = f"match_{existing_match.room_name}"
                        else:
                            self.group_name = f"matchmaking"


                        await self.channel_layer.group_add(
                            self.group_name,
                            self.channel_name
                        )

                        if self.tournament_id is None:        
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

        if existing_match: #for pvp 
            opponent_user = await self.get_opponent_user(existing_match, self.user_id)
            
            if not self.is_redirected:
                await self.mark_match_exited(existing_match)

            if opponent_user and not self.is_redirected:
                await self.channel_layer.group_send(
                    f"{existing_match.room_name}",
                    {
                        "type"   : "opponent_disconnected",
                        "message": f"Your opponent {user.username} has disconnected.",
                    }
                )

        if self.notification_group_name:
            await self.channel_layer.group_discard(
                self.notification_group_name,
                self.channel_name
            )

        await self.channel_layer.group_discard(
            self.group_name,
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
            await self.pair_online_tournament_players()

        if action == 'local_tournament':
            await self.pair_local_tournament_players()

        if action == 'start_match':
            print("start_match +++++++++++++++++++++++++++++++++++")
            await self.start_tournament_match(data.get('match_id'))

        # if action == 'ready_for_redirect':
        #     print("in redirect player action")

        #     self.is_redirected = True

        #     match_id  = data.get('match_id')
        #     room_name = data.get('room_name')

        #     print("room name: ", room_name, match_id)

        #     await self.channel_layer.group_send(
        #         room_name,
        #         {   
        #             "type"     : "redirect_player",
        #             "id"       : match_id,
        #             "room_name": room_name,
        #         }
        #     )
        

    async def redirect_player(self, event):
        print("redirect_player handler ========================================")

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

            self.group_name = self.generate_room_name(self.user_id, matched_player["user_id"])
            match           = await self.create_match(self.user_id, matched_player["user_id"], self.group_name)

            if self.group_name == "matchmaking":
                await self.channel_layer.group_discard("matchmaking", self.channel_name)
                await self.channel_layer.group_discard("matchmaking", matched_player["websocket"].channel_name)

            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.channel_layer.group_add(self.group_name, matched_player["websocket"].channel_name)

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type"     : "broadcast_pvp",
                    "match_id" : match["id"],
                    "user_1"   : UserSerializer(user, fields=["id", "username", "picture"]).data,
                    "user_2"   : UserSerializer(opponent, fields=["id", "username", "picture"]).data,
                    "room_name": self.group_name,
                }
            )

    async def broadcast_pvp(self, event):
        self.is_redirected = True
        if self.user_id == event["user_1"]["id"]:
            opponent = event["user_2"] 
        else:
            opponent = event["user_1"]

        await self.send_json({
            "action"   : "match_found",
            "id"       : event["match_id"],
            "opponent" : opponent,
            "room_name": event["room_name"],
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

    async def start_tournament_match(self, match_id):
        try:
            # match      = await sync_to_async(Match.objects.select_related('player1__user', 'player2__user').get)(id=match_id)
            match = await sync_to_async(Match.objects.select_related('player1__user', 'player2__user').filter(id=match_id, status__in=['pending', 'started']).first)()

            print(match.room_name, match_id)
            
            await self.channel_layer.group_send(
                match.room_name,
                {
                    "type"      : "match_found_broadcast",
                    'is_user'   : True,
                    'match_id'  : match.id,
                    'room_name' : match.room_name
                }
            )

        except ObjectDoesNotExist:
            print("error: Match not found for the given match ID")
            await self.send_json({'error': 'Match not found for the given match ID'})

        except Exception as e:
            print("----  in Exception : ", str(e))
            await self.send_json({'error': f'An error occurred: {str(e)}'})

    
    async def match_found_broadcast(self, event):
        print("here match_found_broadcast ------------------------------------")

        match_id = event["match_id"]
        match    = await sync_to_async(Match.objects.select_related('player1__user', 'player2__user').get)(id=match_id)

        # Check if the current user is part of the match
        if self.user_id == match.player1.user.id or self.user_id == match.player2.user.id:
            await self.send_json({
                'action'    : "redirect_match",
                'is_user'   : event["is_user"],
                'match_id'  : event["match_id"],
                'room_name' : event["room_name"]
            })
        else:
            print(f"User {self.user_id} is not part of match {match_id}, skipping message.")

    async def pair_online_tournament_players(self):

        if not self.tournament_id:
            await self.send_json({
                'success': False,
                'error'  : 'Tournament ID is required'
            })
            return

        try:
            tournament = await self.get_online_tournament(self.tournament_id)

            print("tournament status : ", tournament.status, "id", self.tournament_id)

            if tournament.status == 'started' or tournament.status == 'finished':
                print("tournament is started")

                matches_list    = await self.first_round_matches(self.tournament_id)
                
                tournament = await self.get_tournament(self.tournament_id)
                matches    = await self.get_all_tournament_matches(self.tournament_id)
                
                await self.update_tournament_hierarchy(tournament, matches)
                matches    = await self.get_all_tournament_matches(self.tournament_id)

                match_index = 0
                match_id    = None
                winners     = []
                print("len (matches ): ", len(matches))
                while match_index < len(matches):
                    match = matches[match_index]
                    print("index : ", match_index)
                    if match.status == "completed":
                        winner            = await self.determine_online_winner(match)
                        print("-----------------------------")
                        winner_tournament = await self.get_playerTournament(winner, self.tournament_id)
                        if winner:
                            winners.append(PlayerTournamentSerializer(winner_tournament, fields={'nickname', 'avatar'}).data,)

                    match_index += 1

                await self.send_json({
                    'success': True,
                    'matches': matches_list,
                    'winners': winners,
                    'tournament_status': tournament.status
                })
                return

            player_entries = await self.get_online_tournament_players(self.tournament_id)
            players        = await self.get_players(player_entries)

            players_with_mmv = []
            for player in players:
                mmv = await self.calculate_mmv(player)
                players_with_mmv.append((player, mmv))

            sorted_players = sorted(players_with_mmv, key=lambda x: x[1])

            self.notification_group_name   = await self.add_players_to_group(sorted_players)

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

            await self.broadcast_group_notification(notif_serializer.instance)

            matches = []
            for i in range(0, len(sorted_players), 2):
                player1 = sorted_players[i][0]
                player2 = sorted_players[i + 1][0]

                self.group_name = f"{tournament.name}_{self.generate_room_name(player1.id, player2.id)}"
                
                print("-----------> ", self.group_name)
                
                match     = await self.create_online_match(tournament.id, player1, player2, self.group_name)

                await self.channel_layer.group_add(self.group_name, self.channel_name)
                
                if match:
                    player1_tournament = await self.get_playerTournament(player1, self.tournament_id)
                    player2_tournament = await self.get_playerTournament(player2, self.tournament_id)

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
        
            await self.update_online_tournament_status(self.tournament_id, 'started')

        except CustomAPIException as e:
            await self.send_json({
                'success': False,
                'error'  : e.message,
                'code'   : e.code
            })
        except Exception as e:
            print(f"Unexpected error during matchmaking: {str(e)}")
            raise CustomAPIException(f"An unexpected error occurred during matchmaking: {str(e)}")

    @sync_to_async
    def determine_online_winner(self, match):
        print(match.player1_score ,"___", match.player2_score)
        if match.player1_score > match.player2_score:
            return match.player1
        else:
            return match.player2
        
    # @sync_to_async
    # def get_online_player_tournament(self, tournament, player):
    #     try:
    #         print("in get_player_tournament ===> ", tournament, nickname)
    #         return PlayerTournament.objects.get(tournament=tournament, nickname=nickname)
    #     except PlayerTournament.DoesNotExist:
    #         return None

    @database_sync_to_async
    def get_online_tournament(self, tournament_id):
        try:
            tournament = Tournament.objects.get(id=tournament_id)

            return tournament
        except Tournament.DoesNotExist:
            raise CustomAPIException(f"Tournament with ID {tournament_id} does not exist.", code=404)
        
    @database_sync_to_async
    def create_online_match(self, tournament_id, player1, player2, room_name):
            print("----------- ::::: ", player1.id, player2.id)
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
            print("===? ", PlayerTournament.objects.get(player=player, tournament_id=tournament_id))
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
    def get_first_round_matches(self, tournament_id):
        """ Fetch match data synchronously (no `await`) """
        try:
            tournament = Tournament.objects.get(id=tournament_id)
            matches    = Match.objects.select_related('player1', 'player2').filter(tournament=tournament)

            match_data = []
            for match in matches:
                player1_tournament = PlayerTournament.objects.get(player=match.player1, tournament=tournament, status="accepted")
                player2_tournament = PlayerTournament.objects.get(player=match.player2, tournament=tournament, status="accepted")

                match_data.append({
                    'player1_id': match.player1.id,
                    'player1'   : player1_tournament.nickname,
                    'player2_id': match.player2.id,
                    'player2'   : player2_tournament.nickname,
                    'avatar1'   : player1_tournament.avatar.url if player1_tournament.avatar else None,
                    'avatar2'   : player2_tournament.avatar.url if player2_tournament.avatar else None,
                    'status'    : match.status,
                    'match_id'  : match.id,
                    'room_name' : match.room_name  # Needed for group_add
                })
            return match_data
        except Tournament.DoesNotExist:
            return []

    async def first_round_matches(self, tournament_id):
        """ Calls `get_first_round_matches` then properly awaits `group_add()` """
        matches = await self.get_first_round_matches(tournament_id)
        for match in matches:
            await self.channel_layer.group_add(match['room_name'], self.channel_name)  # `await` works here
        return matches

        
    async def add_players_to_group(self, players):
        room_name = f"tournament_{self.tournament_id}"
        for player in players:
            await self.channel_layer.group_add(
                room_name,
                self.channel_name
            )
        return room_name

    async def broadcast_group_notification(self, notification):
        channel_layer = get_channel_layer()

        notification_group = f'tournament_'

        await channel_layer.group_send(
            notification_group,
            {
                'type'        : 'send_notification',
                'notification': {
                    'id'      : notification.id,
                    'message' : notification.message,
                    'type'    : notification.type,
                    'read_at' : notification.read_at,
                }
            }
        )

    async def send_json(self, data):
        """Helper function to send JSON messages"""
        await self.send(text_data=json.dumps(data))

# ----------------------------LOCAL--------------------------------------------------------------------

    async def pair_local_tournament_players(self):
        if not self.tournament_id:
            await self.send_json(({
                'success': False,
                'error'  : 'Tournament ID is required'
            }))
            return

        try:
            tournament   = await self.get_tournament(self.tournament_id)
            participants = await self.get_all_player_tournament(self.tournament_id)

            if tournament.status == 'matchmaking' or tournament.status == 'finished':
                print("*************** in matchmaking")

                matches      = await self.get_all_tournament_matches(self.tournament_id)
                matches_list = []
                winners      = []
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

                print("update_tournament_hierarchy")

                await self.update_tournament_hierarchy(tournament, matches)

                matches     = await self.get_all_tournament_matches(self.tournament_id)
                match_index = 0
                match_id    = None
                winners     = []
                while match_index < len(matches):
                    match = matches[match_index]

                    if match.status == "completed":
                        winner            = await self.determine_winner(match)
                        winner_tournament = await self.get_player_tournament(tournament, winner)
                        if winner:
                            winners.append(PlayerTournamentSerializer(winner_tournament, fields={'nickname', 'avatar'}).data,)

                    if match_id is None and (match.status == 'pending' or match.status == 'started'):
                        match_id = match.id

                    match_index += 1

                await self.send_json(({
                    'success'           : True,
                    'matches'           : matches_list,
                    'rounds'            : match_id,
                    'winners'           : winners,
                    'tournament_status' : tournament.status
                }))
                return

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

                match = await self.create_local_match(tournament, room_name, player1.nickname, player2.nickname)
                matches.append({
                    'player1'  : player1.nickname,
                    'player2'  : player2.nickname,
                    'avatar1'  : player1.avatar.url if player1.avatar else None,
                    'avatar2'  : player2.avatar.url if player2.avatar else None,
                    'status'   : match['status'],
                    'match_id' : match['id']
                })

            await self.send_json(({
                'success' : True,
                'matches' : matches,
                'rounds'  : matches[0]['match_id'],
            }))

            await self.update_local_tournament_status(self.tournament_id, 'matchmaking')

        except Tournament.DoesNotExist:
            await self.send_json(({
                'success': False,
                'error'  : 'Tournament not found'
            }))
        except Exception as e:
            raise CustomAPIException("An error occurred during matchmaking: " + str(e))

    @sync_to_async
    def get_player_tournament(self, tournament, nickname):
        try:
            print("in get_player_tournament ===> ", tournament, nickname)
            return PlayerTournament.objects.get(tournament=tournament, nickname=nickname)
        except PlayerTournament.DoesNotExist:
            return None

    @sync_to_async
    def determine_winner(self, match):
        print(match.player1_score , match.player2_score)
        if match.player1_score > match.player2_score:
            return match.player1_nickname
        else:
            return match.player2_nickname

    async def update_tournament_hierarchy(self, tournament, matches):
        print("update_tournament_hierarchy")
        try:
            winners = []
            for match in matches:
                if match.status == "completed":
                    if tournament.mode == "local":
                        winner = await self.determine_winner(match)
                    else:
                        print("hna")
                        winner = await self.determine_online_winner(match)
                    if winner:
                        winners.append(winner)
            
            if len(winners) == 2:
                if tournament.mode == "local":
                    room_name = await self.generate_unique_room_code()
                    await self.create_local_match(tournament, room_name, winners[0], winners[1])
                else:
                    print("hnaaaa --- >> ", winners[0].id, winners[1].id)
                    self.group_name = f"{tournament.name}_{self.generate_room_name(winners[0].id, winners[1].id)}"

                    await self.create_online_match(tournament.id, winners[0], winners[1], self.group_name)
                    
        except Exception as e:
            print(f"An error occurred while updating tournament hierarchy: {e}")


    @database_sync_to_async
    def generate_unique_room_code(self):
        while True:
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=3))
            if not Match.objects.filter(room_name=code, status="pending").exists():
                return code

    @database_sync_to_async
    def update_local_tournament_status(self, tournament_id, status): #also 
        try:
            tournament          = Tournament.objects.get(id=tournament_id)
            tournament.status   = status

            tournament.save()
        except Tournament.DoesNotExist:
            raise CustomAPIException(f"Tournament with ID {tournament_id} does not exist.", code=404)

    @sync_to_async
    def create_local_match(self, tournament, room_name, player1_nickname, player2_nickname):
        try:
            match_data = {
                "tournament"       : tournament.id,
                "status"           : 'pending',
                "room_name"        : room_name,
                "player1_nickname" : player1_nickname,
                "player2_nickname" : player2_nickname
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
    def get_all_player_tournament(self, tournament_id):
        try:
            participants = PlayerTournament.objects.filter(tournament_id=tournament_id, status="accepted")
            return list(participants)
        except PlayerTournament.DoesNotExist:
            return []

    @sync_to_async
    def get_all_tournament_matches(self, tournament_id):
        try:
            match = Match.objects.filter(tournament_id=tournament_id)
            return list(match)
        except Match.DoesNotExist:
            return []
        
    
    @database_sync_to_async #get tour +(can i use it in local and online)
    def get_tournament(self, tournament_id):
        try:
            tournament = Tournament.objects.get(id=tournament_id)
            return tournament
        except Tournament.DoesNotExist:
            raise CustomAPIException(f"Tournament with ID {tournament_id} does not exist.", code=404)
