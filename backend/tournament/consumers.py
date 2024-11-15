import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .display_tournaments import joined_tournaments, available_tournaments
from .models import Tournament, PlayerTournament
from asgiref.sync import sync_to_async

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

        joined_tournaments_data = await joined_tournaments(self.user_id)
        available_tournaments_data = await available_tournaments(self.user_id)

        print("joined_tournaments-> : ", joined_tournaments_data)
        print("available_tournaments-> : ", available_tournaments_data)

        await self.send(text_data=json.dumps({
            'joined_tournaments': joined_tournaments_data,
            'available_tournaments': available_tournaments_data
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
        tournament_id = data.get("tournamentId")

        print("action -----> ", action)
        print("tournament_id -----> ", tournament_id)
        if action == 'get_joined_tournaments' or action == 'get_available_tournaments':
            joined_tournaments_data = await joined_tournaments(self.user_id)
            available_tournaments_data = await available_tournaments(self.user_id)

            print("joined_tournaments-> : ", joined_tournaments_data)
            print("available_tournaments-> : ", available_tournaments_data)
            await self.send(text_data=json.dumps({
                'joined_tournaments': joined_tournaments_data,
                'available_tournaments': available_tournaments_data
            }))

        if action == 'leave':
            tournament = await sync_to_async(Tournament.objects.get)(id=tournament_id)

            if tournament.creator_id == 11:
                await sync_to_async(tournament.delete)()
                await self.send(text_data=json.dumps({
                    "message": "Tournament deleted successfully"
                }))
            else:
                await sync_to_async(PlayerTournament.objects.filter)(user=11, tournament=tournament).delete()
                await self.send(text_data=json.dumps({
                    "message": "You have left the tournament"
                }))

        if action == 'join':
            tournament = await sync_to_async(Tournament.objects.get)(id=tournament_id)
            




        #     tournament_data = await joined_tournaments(self.user_id)

        #     await self.send(text_data=json.dumps({
        #         'joined_tournaments': tournament_data
        #     }))
            
        # elif action == 'get_available_tournaments':
        #     tournament_data = await available_tournaments(self.user_id)
        #     print("here------>", tournament_data)
        #     await self.send(text_data=json.dumps({
        #         'available_tournaments': tournament_data
        #     }))
