import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import User, Tournament
from asgiref.sync import sync_to_async

class CreatedTournaments(AsyncWebsocketConsumer):
    async def connect(self):
        user_id = 11
        try:
            self.user = await sync_to_async(self.get_user)(user_id)
        except User.DoesNotExist:
            await self.close()
            return

        if not self.user.is_authenticated:
            await self.close()
            return
        # print("------------------------------------------")
        await self.accept()

        # await self.send(text_data=json.dumps({
        #     'message': f'Hello, {self.user.username}! You are connected.'
        # }))

        tournaments = await self.get_user_tournaments(self.user)

        await self.send(text_data=json.dumps({
            'event': 'tournaments_list',
            'tournaments': tournaments
        }))
    
    def get_user(self, user_id):
        return User.objects.get(id=user_id)

    @sync_to_async
    def get_user_tournaments(self, user):
        tournaments_created = Tournament.objects.filter(creator=user)

        return [{'id': tournament.id, 'name': tournament.name} for tournament in tournaments_created]

    async def disconnect(self, close_code):
        pass


    # self.user = self.scope.get('user')
    # if not self.user.is_authenticated:
    #     await self.close()
    #     return