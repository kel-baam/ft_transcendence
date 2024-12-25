import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync               import sync_to_async
from collections                import deque

from .models                    import Player

class Matchmaking(AsyncWebsocketConsumer):
    matchmaking_queue = deque()

    async def connect(self):
        print("--------> opened")
        self.user_id    = 11

        await self.accept()
        print("connected")
        await self.populate_matchmaking_queue()

    async def disconnect(self, close_code):
        print("Disconnected")
        
        #confused about this step

        if self.user_id in [player['user_id'] for player in self.matchmaking_queue]:
            self.matchmaking_queue = deque([player for player in self.matchmaking_queue if player['user_id'] != self.user_id])

    async def receive(self, text_data):
        print("---------> receive")

        data    = json.loads(text_data)
        action  = data.get('action')
        
        print("action--------> ", action)
        if action == 'find_opponent':
            self.matchmaking_queue.append({'user_id': self.user_id, 'websocket': self})
            print("--------->: ", self.matchmaking_queue)
            await self.find_match()

    async def find_match(self):
        matched_player      = None
        best_match_score    = float('inf')

        # print("enterrrrrrrrrrrrrrrr")
        for player_data in self.matchmaking_queue:
            # print("==> ", player_data['user_id'], self.user_id)
            if player_data['user_id'] != self.user_id:

                player  = await self.get_player(player_data['user_id'])
                score   = await self.calculate_match_score(self.user_id, player)

                if score < best_match_score:
                    best_match_score    = score
                    matched_player      = player_data

        if matched_player :
            print("---> best matching : ", matched_player['user_id'], self.user_id )
            room_name = f"match_{self.user_id}_{matched_player['user_id']}"

            await self.create_room(room_name)

            await self.send_to_player(self, 'match_found', matched_player['user_id'], room_name)
            await self.send_to_player(matched_player['websocket'], 'match_found', self.user_id, room_name)

    async def create_room(self, room_name):
        await self.channel_layer.group_add(
            room_name,
            self.channel_name
        )
        # print(f"Room created: {room_name}")

    async def calculate_match_score(self, user_id, player):
        player1     = await self.get_player(user_id)

        level_diff  = abs(player1.level - player.level)
        rank_diff   = abs(player1.rank - player.rank)

        score = level_diff * 0.3 + rank_diff * 0.7

        # print("---------> score : ", score)

        return score

    @sync_to_async
    def get_player(self, player_id):
        return Player.objects.get(id=player_id)

    async def send_to_player(self, websocket, action, opponent_id, room_name):
        await websocket.send(text_data=json.dumps({
            'action'        : action,
            'opponent_id'   : opponent_id,
            'room_name'     : room_name,
        }))


    async def populate_matchmaking_queue(self):
        # Simulate fake WebSocket connections and player data for testing
        fake_players = [
            {'user_id': 1, 'websocket': self},  # Fake player 1
            {'user_id': 2, 'websocket': self},  # Fake player 2
            {'user_id': 3, 'websocket': self},  # Fake player 3
            {'user_id': 4, 'websocket': self},  # Fake player 4
        ]

        # Add fake players to the matchmaking queue
        for player in fake_players:
            self.matchmaking_queue.append(player)
        
        print(f"Matchmaking queue populated with {len(fake_players)} fake players")
