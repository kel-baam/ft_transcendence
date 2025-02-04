import asyncio
import json
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from django.db import models
from .models import Player, User, Match
from .serializers import MatchSerializer
from channels.layers import get_channel_layer

class PvpMatchmaking:
    waiting_player = None

    def __init__(self, channel_name, user_id, send_callback):
        self.channel_name = channel_name
        self.user_id = user_id
        self.send_callback = send_callback
        self.channel_layer = get_channel_layer() 

    async def pair_pvp_players(self):
        print("waiting player: ", PvpMatchmaking.waiting_player)
        existing_match = await self.get_existing_match()
        if existing_match:
            opponent_user = await self.get_opponent_user(existing_match, self.user_id)
            # Convert the dictionary to JSON string before sending
            await self.send_callback(json.dumps({
                "action": "match_found",
                "opponent": {"id": opponent_user.id, "username": opponent_user.username},
                "room_name": existing_match.room_name,
            }))
            return

        if PvpMatchmaking.waiting_player is None or PvpMatchmaking.waiting_player["user_id"] == self.user_id:
            PvpMatchmaking.waiting_player = {"user_id": self.user_id, "channel_name": self.channel_name}
            try:
                await asyncio.wait_for(self.wait_for_opponent(), timeout=15)
            except asyncio.TimeoutError:
                await self.notify_timeout()
        else:
            matched_player = PvpMatchmaking.waiting_player
            PvpMatchmaking.waiting_player = None
            room_name = self.generate_room_name(self.user_id, matched_player["user_id"])

            await self.create_match(self.user_id, matched_player["user_id"], room_name)

            await self.channel_layer.group_add(room_name, self.channel_name)
            await self.channel_layer.group_add(room_name, matched_player["channel_name"])

            await  self.send_callback(json.dumps({
                "action"      : "match_found",
                "opponent"    : {
                    "id"      : matched_player["user_id"],
                    "username": await self.get_user(matched_player["user_id"]),
                },
                "room_name"   : room_name,
            }))

            await self.channel_layer.send(
                matched_player["channel_name"],
                {
                    "type": "match_found",
                    "opponent": {
                        "id": self.user_id,
                        "username": await self.get_user(self.user_id),
                    },
                    "room_name": room_name,
                }
            )

    async def match_found(self, event):
        """ Handles match_found events and sends data to the WebSocket client. """
        await self.send(text_data=json.dumps({
            "action": "match_found",
            "opponent": event["opponent"],
            "room_name": event["room_name"],
        }))

    @database_sync_to_async
    def get_opponent_user(self, match, user_id):
        opponent = match.player1 if match.player2.user_id == user_id else match.player2
        return opponent.user if opponent else None

    @classmethod
    async def remove_waiting_player(cls, user_id):
        """Remove a player from waiting queue if they disconnect."""
        if cls.waiting_player and cls.waiting_player["user_id"] == user_id:
            cls.waiting_player = None

    async def wait_for_opponent(self):
        for _ in range(15):
            if PvpMatchmaking.waiting_player is None:
                return
            await asyncio.sleep(1)

    @database_sync_to_async
    def get_existing_match(self):
        try:
            player = Player.objects.get(user_id=self.user_id)
            return Match.objects.filter((models.Q(player1=player) | models.Q(player2=player)) & models.Q(status="pending")).first()
        except Player.DoesNotExist:
            return None

    @sync_to_async
    def create_match(self, player1_id, player2_id, room_name):
        player1, _ = Player.objects.get_or_create(user_id=player1_id)
        player2, _ = Player.objects.get_or_create(user_id=player2_id)
        match_data = {"player1": player1.id, "player2": player2.id, "status": "pending", "room_name": room_name}
        serializer = MatchSerializer(data=match_data)
        return serializer.save() if serializer.is_valid() else None

    async def notify_timeout(self):
        await self.send_callback(json.dumps({"action": "match_not_found", "message": "No opponent found."}))

    def generate_room_name(self, user1, user2):
        return f"match_{min(user1, user2)}_{max(user1, user2)}"

    @sync_to_async
    def get_user(self, user_id):
        return User.objects.get(id=user_id).username
