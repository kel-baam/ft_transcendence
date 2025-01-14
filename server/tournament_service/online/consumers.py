import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Tournament, PlayerTournament, Player
from local.models import User
from django.db.models import Q, Count, F
from .serializers import TournamentSerializer
import jwt
from django.conf import settings

class Tournaments(AsyncWebsocketConsumer):
    async def connect(self):
        print("--------> WebSocket connection opened")

        self.group_name = "all_tournaments_group"
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept() 
        # -----
        self.user_id = None 
        for header_name, header_value in self.scope["headers"]:
            if header_name == b'cookie':
                cookies_str = header_value.decode("utf-8")
                cookies = {}
                for cookie in cookies_str.split("; "):
                    key, value = cookie.split("=", 1)  
                    cookies[key] = value          
                try:
                    print("accccc=>",cookies.get("access_token").encode("utf-8"))
                    payload = jwt.decode(cookies.get("access_token").encode("utf-8"), settings.SECRET_KEY, algorithms=["HS256"])
                    self.access_token = cookies.get("access_token")
                    user = await sync_to_async(User.objects.filter(email=payload["email"]).first)()
                    if user:
                        print("done",user.id)
                        self.scope['user_id']  = user
                        self.user_id    = user.id
                        self.scope['email']  = payload["email"]
                        # add what ever you want
                        await self.send_updated_tournaments()
                    else:
                        print("user nor")
                        await self.send(text_data=json.dumps({"error": "user doesn't exist"}))
                except Exception as e:
                        print("errrr nor",e)
                        await self.send(text_data=json.dumps({"error": "token expired"}))

 
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
        if not self.user_id:
            await self.send(text_data=json.dumps({
                "error": "User is not authenticated"
            }))
            return

        joined_tournaments_data     = await self.joined_tournaments(self.user_id)
        available_tournaments_data  = await self.available_tournaments(self.user_id)

        await self.send(text_data=json.dumps({
            'joined_tournaments'    : joined_tournaments_data,
            'available_tournaments' : available_tournaments_data,
        }))

    async def send_updated_tournaments_from_signal(self, event):
        """This method is triggered from the signal."""
        await self.send_updated_tournaments()


    @sync_to_async
    def joined_tournaments(self, user_id):
        if not user_id:
            return {"error": "User ID is not provided"}
        
        try:
            user = User.objects.get(id=user_id)
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
        if not user_id:
            return {"error": "User ID is not provided"}
    
        user = User.objects.get(id=user_id)
        
        available_tournaments = Tournament.objects.filter(
            type='public'
        ).exclude(
            Q(creator=user) | Q(participants__player__user=user)
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