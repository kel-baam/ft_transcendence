import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models                    import Player, User
import asyncio

class Matchmaking(AsyncWebsocketConsumer):
    waiting_player = None 

    async def connect(self):
        print("--------> opened")
        self.user_id = 11

        await self.accept()
        print("connected")

    async def disconnect(self, close_code):
        print("Disconnected")
        if Matchmaking.waiting_player and Matchmaking.waiting_player['user_id'] == self.user_id:
            Matchmaking.waiting_player = None

    async def receive(self, text_data):
        print("---------> receive")

        data    = json.loads(text_data)
        action  = data.get('action')

        #fake
        # Matchmaking.waiting_player = {
        #         'user_id'   : 5,
        #         'websocket' : self
        #     }

        print("action--------> ", action)

        if action == 'find_opponent':
            await self.pair_players()

    async def pair_players(self):
        if Matchmaking.waiting_player is None or Matchmaking.waiting_player['user_id'] == self.user_id:
            
            Matchmaking.waiting_player = {
                'user_id'   : self.user_id,
                'websocket' : self
            }

            print(f"Player {self.user_id} is waiting for an opponent.")

            try:
                await asyncio.wait_for(self.wait_for_opponent(), timeout=30)
            except asyncio.TimeoutError:
                await self.notify_timeout()

        else:
            matched_player              = Matchmaking.waiting_player
            Matchmaking.waiting_player  = None

            print(f"Match found: {self.user_id} vs {matched_player['user_id']}")

            player_1_username = await self.get_user(matched_player['user_id'])
            player_2_username = await self.get_user(self.user_id)

            print(player_1_username, player_2_username)
            room_name   = f"match_{self.user_id}_{matched_player['user_id']}"

            await self.channel_layer.group_add(room_name, self.channel_name)
            await self.channel_layer.group_add(room_name, matched_player['websocket'].channel_name)

            await self.channel_layer.group_send(
                room_name,
                {
                    "type"          : "notify_match",
                    "action"        : "match_found",
                    "opponent_id_1": {
                        "id"        : matched_player['user_id'],
                        "username"  : player_1_username,
                    },
                    "opponent_id_2": {
                        "id"        : self.user_id,
                        "username"  : player_2_username,
                    },
                    "room_name"     : room_name,
                },
            )

    async def wait_for_opponent(self):
        """Simulate waiting for an opponent."""
        while Matchmaking.waiting_player:
            await asyncio.sleep(1)

    async def notify_timeout(self):
        """Notify the user if no opponent is found within the timeout period."""
        await self.send(text_data=json.dumps({
            "action": "match_not_found",
            "message": "No opponent found within the time limit. Please try again later."
        }))

    @sync_to_async
    def get_user(self, user_id):
        user = User.objects.get(id=user_id)
        return user.username

    async def notify_match(self, event):

        action          = event["action"]
        opponent_id_1   = event["opponent_id_1"]
        opponent_id_2   = event["opponent_id_2"]
        room_name       = event["room_name"]

        await self.send(text_data=json.dumps({
            "action"        : action,
            "opponent_id_1": {
                "id": opponent_id_1["id"],
                "username": opponent_id_1["username"],
            },
            "opponent_id_2": {
                "id": opponent_id_2["id"],
                "username": opponent_id_2["username"],
            },
            "room_name"     : room_name,
        }))
