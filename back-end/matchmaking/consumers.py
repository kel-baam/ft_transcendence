import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

queue = []

class MatchmakingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("in")
        self.room_group_name = 'matchmaking_queue'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        print("out")
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        from .models import User
        print("receive")
        global queue
        data = json.loads(text_data)
        action = data['action']
        player_id = data.get('player_id')

        if action == 'join_queue' and player_id:
            try:
                user = await database_sync_to_async(User.objects.get)(id=player_id)
                username = user.username

                queue.append({
                    'username': username,
                    'consumer': self
                })

                print(f'{username} joined the queue.')

                if len(queue) >= 2:
                    player1 = queue.pop(0)
                    player2 = queue.pop(0)

                    match_room = f"match_{player1['username']}_{player2['username']}"
                    print(f"Starting match: {match_room}")

                    await self.channel_layer.group_send(
                        player1['consumer'].room_group_name,
                        {
                            'type': 'start_match',
                            'match_room': match_room
                        })
                    
                    await self.channel_layer.group_send(
                        player2['consumer'].room_group_name,
                        {
                            'type': 'start_match',
                            'match_room': match_room
                        }
                    )

            except User.DoesNotExist:
                print(f"User with ID {player_id} does not exist.")
                await self.send(text_data=json.dumps({
                    'action': 'error',
                    'message': 'User not found.'
                }))

    async def start_match(self, event):
        match_room = event['match_room']
        await self.send(text_data=json.dumps({
            'action': 'join-game',
            'match_room': match_room,
            'url': f'/chat'
        }))
