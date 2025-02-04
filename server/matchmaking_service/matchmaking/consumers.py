from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from django.conf import settings
from django.db import models
from .models import Player, User, Match, Tournament, PlayerTournament
from .serializers import UserSerializer, MatchSerializer
from .exceptions                import CustomAPIException
import json
import asyncio
import jwt

class Matchmaking(AsyncWebsocketConsumer):
    waiting_player = None

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
                        print("done",user)

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
                        await self.send(text_data=json.dumps({
                            'action': 'user_data',
                            'user'  : UserSerializer(user).data,
                        }))
                    else:
                        await self.send(text_data=json.dumps({"error": "user doesn't exist"}))
                except Exception as e:
                        await self.send(text_data=json.dumps({"error": "token expired"}))

    async def disconnect(self, close_code):
        print(f"Disconnected: {self.user_id}")

        if Matchmaking.waiting_player and Matchmaking.waiting_player['user_id'] == self.user_id:
            Matchmaking.waiting_player = None

        existing_match = await self.get_existing_match(self.user_id)
        if existing_match:
            opponent_user = await self.get_opponent_user(existing_match, self.user_id)

            await self.mark_match_exited(existing_match)
            if opponent_user:
                await self.channel_layer.group_send(
                    f"{existing_match.room_name}",
                    {
                        "type"   : "opponent_disconnected",
                        "message": f"Your opponent {self.user_id} has disconnected.",
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

        data          = json.loads(text_data)
        action        = data.get('action')
        tournament_id = data.get('tournamentId')

        if action == 'find_opponent':
            await self.pair_pvp_players()
        if action == 'online_tournament':
            await self.pair_online_tournament_players(tournament_id)

    async def pair_pvp_players(self):
        existing_match = await self.get_existing_match(self.user_id)
        if existing_match:
            opponent_user = await self.get_opponent_user(existing_match, self.user_id)
            
            print(f"♻️ {self.user_id} is rejoining match with {opponent_user.username}")

            await self.send_json({
                "action"      : "match_found",
                "opponent"    : {
                    "id"      : opponent_user.id,
                    "username": opponent_user.username,
                },
                "room_name"   : existing_match.room_name,
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

            opponent_name = await self.get_user(matched_player["user_id"])
            user_name     = await self.get_user(self.user_id)

            room_name     = self.generate_room_name(self.user_id, matched_player["user_id"])

            await self.create_match(self.user_id, matched_player["user_id"], room_name)

            await self.channel_layer.group_add(room_name, self.channel_name)
            await self.channel_layer.group_add(room_name, matched_player["websocket"].channel_name)

            await self.send_json({
                "action"      : "match_found",
                "opponent"    : {
                    "id"      : matched_player["user_id"],
                    "username": opponent_name,
                },
                "room_name"   : room_name,
            })

            await matched_player["websocket"].send_json({
                "action"      : "match_found",
                "opponent"    : {
                    "id"      : self.user_id,
                    "username": user_name,
                },
                "room_name"   : room_name,
            })
    @database_sync_to_async
    def get_opponent_user(self, existing_match, user_id):
        """Get the user object of the opponent player from the existing match."""
        opponent_player = existing_match.player1 if existing_match.player2.id == user_id else existing_match.player2
        return opponent_player.user

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
        """Check if the user is already in an active match (pending status)."""
        try:
            player = Player.objects.get(user_id=user_id)
            if player:
                match = Match.objects.filter(
                    (models.Q(player1=player) | models.Q(player2=player)) & models.Q(status="pending")
                ).first()
                return match
            return None
        except Player.DoesNotExist:
            return None

    def generate_room_name(self, user1, user2):
        """Ensure room names are consistent regardless of player order"""
        return f"match_{min(user1, user2)}_{max(user1, user2)}"

    async def send_json(self, data):
        """Helper function to send JSON messages"""
        await self.send(text_data=json.dumps(data))

    async def wait_for_opponent(self):
        for _ in range(15):
            if Matchmaking.waiting_player is None:
                return
            await asyncio.sleep(1)

    async def notify_timeout(self):
        """Notify the user if no opponent is found within the timeout period."""
        await self.send(text_data=json.dumps({
            "action" : "match_not_found",
            "message": "No opponent found within the time limit. Please try again later."
        }))

    @sync_to_async
    def get_user(self, user_id):
        user = User.objects.get(id=user_id)
        return user.username

    async def notify_match(self, event):  # i forget why i need this ?

        action    = event["action"]
        opponent  = event["opponent"]
        room_name = event["room_name"]

        await self.send(text_data=json.dumps({
            "action"       : action,
            "opponent"     : {
                "id"       : opponent["id"],
                "username" : opponent["username"],
            },
            "room_name"    : room_name,
        }))


# ----------------------------LOCAL--------------------------------------------------------------------

    # async def pair_local_tournament_players(self, id):
    #     if not id:
    #         await self.send(text_data=json.dumps({
    #             'success'   : False,
    #             'error'     : 'Tournament ID is required'
    #         }))
    #         return

    #     try:
    #         tournament = await self.get_local_tournament(id)

    #         if tournament.status == 'matchmaking':
    #             matches = await self.get_matches_for_local_tournament(id)
    #             await self.send(text_data=json.dumps({
    #                 'success': True,
    #                 'matches': matches,
    #             }))
    #             return

    #         players = await self.get_local_players(id)

    #         if not players:
    #             await self.send(text_data=json.dumps({
    #                 'success': False,
    #                 'error'  : 'No players found in the tournament'
    #             }))
    #             return

    #         random.shuffle(players)
    #         room_1  = players[:len(players) // 2]
    #         room_2  = players[len(players) // 2:]
    #         matches = []

    #         for player1, player2 in zip(room_1, room_2):
    #             match = await self.create_local_match(tournament, player1, player2)
    #             if match:
    #                 matches.append({
    #                     'player1_id': match.player1.id,
    #                     'player1'   : match.player1.nickname,
    #                     'player2_id': match.player2.id,
    #                     'player2'   : match.player2.nickname,
    #                     'avatar1'   : match.player1.avatar.url if match.player1.avatar else None,
    #                     'avatar2'   : match.player2.avatar.url if match.player2.avatar else None,
    #                     'status'    : match.status,
    #                     'match_id'  : match.id
    #                 })

    #         await self.send(text_data=json.dumps({
    #             'success': True,
    #             'matches': matches
    #         }))
    #         await self.update_local_tournament_status(id, 'matchmaking')

    #     except LocalTournament.DoesNotExist:
    #         await self.send(text_data=json.dumps({
    #             'success': False,
    #             'error'  : 'Tournament not found'
    #         }))
    #     except Exception as e:
    #         raise CustomAPIException("An error occurred during matchmaking: " + str(e))

    # @database_sync_to_async
    # def get_local_players(self, tournament_id):
    #     try:
    #         tournament  = LocalTournament.objects.get(id=tournament_id)
    #         players     = list(tournament.participants.all())
    #         return players
    #     except LocalTournament.DoesNotExist:
    #         return []

    # @database_sync_to_async
    # def get_local_tournament(self, tournament_id):
    #     try:
    #         tournament = LocalTournament.objects.get(id=tournament_id)
    #         return tournament
    #     except LocalTournament.DoesNotExist:
    #         raise CustomAPIException(f"Tournament with ID {tournament_id} does not exist.", code=404)


    # @database_sync_to_async
    # def update_local_tournament_status(self, tournament_id, status):
    #     try:
    #         tournament          = LocalTournament.objects.get(id=tournament_id)
    #         tournament.status   = status

    #         tournament.save()
    #     except LocalTournament.DoesNotExist:
    #         raise CustomAPIException(f"Tournament with ID {tournament_id} does not exist.", code=404)


    # @database_sync_to_async
    # def create_local_match(self, tournament, player1, player2):
    #     try:
    #         match = LocalMatch(
    #             player1     = player1,
    #             player2     = player2,
    #             tournament  = tournament,
    #             status      = 'pending',
    #         )
    #         match.save()
    #         return match
    #     except Exception as e:
    #         print(f"Error creating match: {e}")
    #         return None

    # @database_sync_to_async
    # def get_matches_for_local_tournament(self, tournament_id):
    #     try:
    #         tournament  = LocalTournament.objects.get(id=tournament_id)
    #         matches     = LocalMatch.objects.select_related('player1', 'player2').filter(tournament=tournament)
    #         match_data  = [
    #             {
    #                 'player1_id': match.player1.id,
    #                 'player1'   : match.player1.nickname,
    #                 'player2_id': match.player2.id,
    #                 'player2'   : match.player2.nickname,
    #                 'avatar1'   : match.player1.avatar.url if match.player1.avatar else None,
    #                 'avatar2'   : match.player2.avatar.url if match.player2.avatar else None,
    #                 'status'    : match.status,
    #                 'match_id'  : match.id
    #             }
    #             for match in matches
    #         ]
    #         return match_data
    #     except LocalTournament.DoesNotExist:
    #         return []
        
# ----------------------------------online-------------------------------------------------
        
    async def pair_online_tournament_players(self, id):

        if not id:
            await self.send(text_data=json.dumps({
                'success': False,
                'error'  : 'Tournament ID is required'
            }))
            return

        try:
            print("-----> ", id)
            tournament = await self.get_online_tournament(id)
            print("tournament status : ", tournament.status)
            if tournament.status == 'matchmaking':
                matches = await self.get_matches_for_online_tournament(id)
                await self.send(text_data=json.dumps({
                    'success': True,
                    'matches': matches,
                }))
                return

            player_entries = await self.get_players_in_online_tournament(id)
            players        = await self.get_players_from_entries(player_entries)

            players_with_mmv = []
            for player in players:
                mmv = self.calculate_mmv(player)
                players_with_mmv.append((player, mmv))

            sorted_players = sorted(players_with_mmv, key=lambda x: x[1])

            matches = []
            for i in range(0, len(sorted_players), 2):
                player1 = sorted_players[i][0]
                player2 = sorted_players[i + 1][0] if i + 1 < len(sorted_players) else None

                match = await self.create_online_match(id, player1, player2)
                if match:
                    player1_tournament = await self.get_player_tournament(match.player1, id)
                    player2_tournament = await self.get_player_tournament(match.player2, id) if match.player2 else None
                    
                    matches.append({
                        'player1_id': match.player1.id,
                        'player1'   : player1_tournament.nickname,
                        'avatar1'   : player1_tournament.avatar.url if player1_tournament.avatar else None,
                        'player2_id': match.player2.id if match.player2 else None,
                        'player2'   : player2_tournament.nickname if player2_tournament else None,
                        'avatar2'   : player2_tournament.avatar.url if player2_tournament and player2_tournament.avatar else None,
                        'status'    : match.status,
                        'match_id'  : match.id
                    })

            await self.send(text_data=json.dumps({
                "success" : True,
                "matches" : matches,
            }))
            await self.update_online_tournament_status(id, 'matchmaking')

        except CustomAPIException as e:
            await self.send(text_data=json.dumps({
                'success': False,
                'error'  : e.message,
                'code'   : e.code
            }))
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
    def create_online_match(self, tournament_id, player1, player2):
        try:
            tournament     = Tournament.objects.get(id=tournament_id)
            match          = Match(
                player1    = player1,
                player2    = player2,
                tournament = tournament,
                status     = 'pending',
            )
            match.save()
            
            return match
        except Exception as e:
            print(f"Error creating match: {e}")
            return None

    @database_sync_to_async
    def get_player_tournament(self, player, tournament_id):
        try:
            return PlayerTournament.objects.get(player=player, tournament_id=tournament_id)
        except PlayerTournament.DoesNotExist:
            return None


    @database_sync_to_async
    def get_players_in_online_tournament(self, id):        
        """  Fetches players from the given tournament ID. """

        try:
            tournament      = Tournament.objects.get(id=id)
            player_entries  = PlayerTournament.objects.filter(tournament=tournament, status='accepted')
            
            print("->>>>>> players: ", player_entries)
            return player_entries
        except Tournament.DoesNotExist:
            raise CustomAPIException(f"Tournament with ID {id} does not exist.")
        except Exception as e:
            raise CustomAPIException(f"An error occurred while fetching player entries: {str(e)}")

    @sync_to_async
    def get_players_from_entries(self, player_entries):
        """ Extracts player objects from player entries. """

        try:
            if not player_entries:
                raise ValueError("No player entries found.")
            return [entry.player for entry in player_entries]
        except AttributeError:
            raise CustomAPIException("Invalid player entry structure.")
        except Exception as e:
            raise CustomAPIException(f"An error occurred while extracting players: {str(e)}")

    def calculate_mmv(self, player):
        """  Calculate the matchmaking value (MMV) for a player based on their level, score, and rank. """

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
    def get_matches_for_online_tournament(self, tournament_id):
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
        
