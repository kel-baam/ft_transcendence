from channels.generic.websocket         import AsyncWebsocketConsumer
from asgiref.sync                       import sync_to_async
from channels.db                        import database_sync_to_async
from django.conf                        import settings
from django.db                          import models
from django.db.models                   import Q
from .models                            import Player, User, Match, Tournament, PlayerTournament
from .serializers                       import *
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

        self.notification_group_name = None
        self.user_id                 = None 
        self.matched_player          = None
        self.room_name               = None
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
                        
                        if self.tournament_id is None:        
                            await self.send_json({
                                'action': 'user_data',
                                'user'  : UserSerializer(user, fields=['id', 'username', 'picture']).data,
                            })
                        check_tournament = await self.check_tournament_exists()
                        print("check ", check_tournament)
                        if check_tournament == "Tournament not found":
                            await self.send(text_data=json.dumps({"action": "tournament_not_found"}))
                            return
                        elif check_tournament == "Not authorized":
                            await self.send(text_data=json.dumps({"action": "unauthorized"}))
                            return
                    else:
                        await self.send_json({"error": "user doesn't exist"})
                except Exception as e:
                        await self.send_json({"error": "token expired"})

    async def send_json(self, data):
        """Helper function to send JSON messages"""
        await self.send(text_data=json.dumps(data))

    @sync_to_async
    def check_tournament_exists(self):
        tournament = Tournament.objects.filter(id=self.tournament_id).first()
        
        if not tournament:
            return "Tournament not found"
        
        if tournament.creator_id != self.user_id:
            return "Not authorized"
        
        return "Tournament found and authorized"

    async def disconnect(self, close_code):
        print(f"Disconnected: {self.user_id}")
        try:
            if Matchmaking.waiting_player and Matchmaking.waiting_player['user_id'] == self.user_id:
                Matchmaking.waiting_player = None

            if self.notification_group_name:
                await self.channel_layer.group_discard(
                    self.notification_group_name,
                    self.channel_name
                )
                
            print("----> ", self.room_name)

            if self.room_name:
                await self.channel_layer.group_discard(
                    self.room_name,
                    self.channel_name
                )

            if self.matched_player:
                await self.channel_layer.group_discard(
                    self.room_name,
                    self.matched_player["websocket"].channel_name
                )

            await self.close()

        except Exception as e:
            print(f"An error occurred while handling disconnect: {e}")

    async def opponent_disconnected(self, event):
        message = event['message']
        
        await self.send(text_data=json.dumps({
            "action" : "opponent_disconnected",
            "message": message, 
        }))
        
    async def receive(self, text_data):
        print("---------> receive")

        data   = json.loads(text_data)
        action = data.get('action')

        if action == 'find_opponent':
            await self.pair_pvp_players()

        if action == 'local_tournament':
            await self.pair_local_tournament_players()

# ------------------------------------------PVP----------------------------

    async def pair_pvp_players(self):

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
            self.matched_player        = Matchmaking.waiting_player
            Matchmaking.waiting_player = None

            print(f"Match found: {self.user_id} vs {self.matched_player['user_id']}")

            opponent = await self.get_user(self.matched_player["user_id"])
            user     = await self.get_user(self.user_id)

            self.room_name = self.generate_room_name(self.user_id, self.matched_player["user_id"])
            match          = await self.create_match(self.user_id, self.matched_player["user_id"], self.room_name)

            await self.channel_layer.group_add(self.room_name, self.channel_name)
            await self.channel_layer.group_add(self.room_name, self.matched_player["websocket"].channel_name)

            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type"     : "broadcast_pvp",
                    "match_id" : match["id"],
                    "user_1"   : UserSerializer(user, fields=["id", "username", "picture"]).data,
                    "user_2"   : UserSerializer(opponent, fields=["id", "username", "picture"]).data,
                    "room_name": self.room_name,
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
    def get_opponent_user(self, existing_match):
        """Get the user object of the opponent player from the existing match."""

        opponent_player = existing_match.player1 if existing_match.player2.id == self.user_id else existing_match.player2
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
            print("here",  serializer.errors)
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

# ----------------------------LOCAL--------------------------------------------------------------------

    async def pair_local_tournament_players(self):
        if not self.tournament_id:
            await self.send_json(({
                'success': False,
                'error'  : 'Tournament ID is required'
            }))
            return
        
        check_tournament = await self.check_tournament_exists()
        print("check ", check_tournament)
        if check_tournament == "Tournament not found":
            await self.send(text_data=json.dumps({"action": "tournament_not_found"}))
            return
        elif check_tournament == "Not authorized":
            await self.send(text_data=json.dumps({"action": "unauthorized"}))
            return

        try:
            tournament   = await self.get_tournament(self.tournament_id)
            participants = await self.get_all_player_tournament(self.tournament_id)

            if tournament.status == 'matchmaking' or tournament.status == 'finished':

                print("*************** in Local matchmaking")

                matches      = await self.get_all_tournament_matches(self.tournament_id)
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

                print("update_tournament_hierarchy")
                if tournament.status == 'matchmaking':
                    await self.update_tournament_hierarchy(tournament, matches)

                matches     = await self.get_all_tournament_matches(self.tournament_id)
                match_index = 0
                match_id    = None
                winners     = [None] * len(matches)

                print(">>>>> ,", len(matches))

                while match_index < len(matches):
                    match = matches[match_index]
                    print("match_index ---> ", match_index, match.id)
                    if match.status == "completed":
                        winner            = await self.determine_winner(match)
                        winner_tournament = await self.get_player_tournament(tournament, winner)
                        if winner:
                            print("----> winner ", winner)
                            winners[match_index] = PlayerTournamentSerializer(winner_tournament, fields={'nickname', 'avatar'}).data

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
        except PlayerTournament.DoesNotExist as e:
            print("----------------------------------->>> ", str(e))
            return None

    @sync_to_async
    def determine_winner(self, match):
        if match.player1_score > match.player2_score:
            return match.player1_nickname
        else:
            return match.player2_nickname

    async def update_tournament_hierarchy(self, tournament, matches):

        print("IN ----- > update_tournament_hierarchy")

        try:
            winners = [None] * len(matches)
            match_index = 0

            while match_index < len(matches):
                match = matches[match_index]
                print("match_index update_tournament_hierarchy ---> ", match_index)
                if match.status == "completed":
                    winner            = await self.determine_winner(match)
                    winner_tournament = await self.get_player_tournament(tournament, winner)
                    if winner:
                        print("----> winner ", winner)
                        winners[match_index] = PlayerTournamentSerializer(winner_tournament, fields={'nickname', 'avatar'}).data
                match_index += 1
            
            if winners[0] and winners[1]:
                room_name = await self.generate_unique_room_code()
                print("in matchmaking up toyur", winners[0]['nickname'], winners[1]['nickname'])
                await self.create_local_match(tournament, room_name, winners[0]['nickname'], winners[1]['nickname'])

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

    # @sync_to_async
    # def get_all_tournament_matches(self, tournament_id):
    #     try:
    #         match = Match.objects.filter(tournament_id=tournament_id)
    #         return list(match)
    #     except Match.DoesNotExist:
    #         return []
    
    @sync_to_async
    def get_all_tournament_matches(self, tournament_id):
        try:
            matches = Match.objects.filter(tournament_id=tournament_id).order_by('id')
            return list(matches)
        except Match.DoesNotExist:
            return []

    
    @database_sync_to_async
    def get_tournament(self, tournament_id):
        try:
            tournament = Tournament.objects.get(id=tournament_id)
            return tournament
        except Tournament.DoesNotExist:
            raise CustomAPIException(f"Tournament with ID {tournament_id} does not exist.", code=404)
