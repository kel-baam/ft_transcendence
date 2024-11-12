import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .user_joind_tournaments import get_user_joined_tournaments

class TournamentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("--------> opened")
        self.user_id = 1
        self.room_group_name = f"user_{self.user_id}_tournaments"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        tournament_data = await get_user_joined_tournaments(self.user_id)

        print("tournament data -> : ", tournament_data)
        await self.send(text_data=json.dumps({
            'joined_tournaments': tournament_data
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')

        if action == 'get_joined_tournaments':
            tournament_data = await get_user_joined_tournaments(self.user_id)

            await self.send(text_data=json.dumps({
                'joined_tournaments': tournament_data
            }))
