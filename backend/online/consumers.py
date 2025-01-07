import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import User, Tournament, PlayerTournament, Player
from django.db.models import Q, Count, F
from .serializers import TournamentSerializer

class Tournaments(AsyncWebsocketConsumer):
    async def connect(self):
        print("--------> WebSocket connection opened")

        self.user_id    = 11 

        self.group_name = "all_tournaments_group"
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept() 
        await self.send_updated_tournaments()

    async def disconnect(self, close_code):
        print("--------> WebSocket connection closed")
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data    = json.loads(text_data)
        action  = data.get('action')

        print(f"Received action: {action}")

        if action in ['get_joined_tournaments', 'get_available_tournaments']:
            await self.send_updated_tournaments()

        if action == 'update' :
            await self.send_updated_tournaments()

    async def send_updated_tournaments(self):
        joined_tournaments_data     = await self.joined_tournaments(self.user_id)
        available_tournaments_data  = await self.available_tournaments(self.user_id)

        # print("----> ", joined_tournaments_data)
        # print("jjjjjjjjjjjjjjjjj")
        await self.send(text_data=json.dumps({
            'joined_tournaments'    : joined_tournaments_data,
            'available_tournaments' : available_tournaments_data,
        }))

    async def send_updated_tournaments_from_signal(self, event):
        """This method is triggered from the signal."""
        # print("hna")
        await self.send_updated_tournaments()


    @sync_to_async
    def joined_tournaments(self, user_id):
        try:
            user = User.objects.get(id=11)
        except User.DoesNotExist:
            return {"error": "User not found"}
        
        created_tournaments = Tournament.objects.filter(creator=user)

        joined_tournaments = Tournament.objects.filter(
            participants__player__user_id=user_id,
            participants__status='accepted'
        )

        all_tournaments         = created_tournaments.union(joined_tournaments)
        serialized_tournaments  = TournamentSerializer(all_tournaments, many=True)


        return serialized_tournaments.data

    @sync_to_async
    def available_tournaments(self, user_id):
        user = User.objects.get(id=11)
        
        available_tournaments = Tournament.objects.filter(
            type='public'
        ).exclude(
            Q(creator = user) | Q(participants__player__user = user)
        ).annotate(
            num_participants=Count(
                'participants',
                filter = Q(participants__status='accepted')
            )
        ).filter(
            num_participants__lt = 4
        ).distinct()

        serialized_tournaments = TournamentSerializer(available_tournaments, many=True)
        
        return serialized_tournaments.data