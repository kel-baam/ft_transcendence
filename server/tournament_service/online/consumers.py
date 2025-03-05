import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Tournament, PlayerTournament, Player
from local.models import User
from django.db.models import Q, Count, F
from .serializers import TournamentSerializer
from django.conf import settings
import jwt

class Tournaments(AsyncWebsocketConsumer):
    async def connect(self):

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

                        self.scope['user_id'] = user
                        self.user_id          = user.id
                        self.scope['email']   = payload["email"]
                        
                        self.group_name = "all_tournaments_group"
                        await self.channel_layer.group_add(
                            self.group_name,
                            self.channel_name
                        )

                        await self.accept() 
                        await self.send_updated_tournaments()
                    else:
                        await self.send(text_data=json.dumps({"error": "user doesn't exist"}))
                except Exception as e:
                        await self.send(text_data=json.dumps({"error": "token expired"}))
 
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data    = json.loads(text_data)
        action  = data.get('action')

        if action in ['get_joined_tournaments', 'get_available_tournaments']:
            await self.send_updated_tournaments()

        if action == 'update' :
            await self.send_updated_tournaments()

    async def send_updated_tournaments(self):

        joined_tournaments_data     = await self.joined_tournaments()
        available_tournaments_data  = await self.available_tournaments()

        await self.send(text_data=json.dumps({
            'joined_tournaments'    : joined_tournaments_data,
            'available_tournaments' : available_tournaments_data,
        }))

    async def send_updated_tournaments_from_signal(self, event):
        """This method is triggered from the signal."""

        await self.send_updated_tournaments()

    @sync_to_async
    def joined_tournaments(self):

        created_tournaments = Tournament.objects.filter(
            creator = self.user_id,
            mode    = 'online'
        )
        joined_tournaments  = Tournament.objects.filter(
            participants__player__user_id = self.user_id,
            participants__status          = 'accepted',
            mode                          = 'online'
        )

        all_tournaments         = created_tournaments.union(joined_tournaments)
        serialized_tournaments  = TournamentSerializer(all_tournaments, many=True)

        return serialized_tournaments.data

    @sync_to_async
    def available_tournaments(self):
        available_tournaments = Tournament.objects.filter(
            type='public',
            mode='online'
        ).exclude(
            Q(creator=self.user_id) | Q(participants__player__user=self.user_id)
        ).annotate(
            num_accepted_participants=Count(
                'participants',
                filter=Q(participants__status='accepted')
            ),
            num_invited_participants=Count(
                'participants',
                filter=Q(participants__status='invited')
            ),
            num_participants=Count('participants')
        ).filter(
            num_participants__lt=4
        ).distinct()
        serialized_tournaments = TournamentSerializer(available_tournaments, many=True)
        
        return serialized_tournaments.data