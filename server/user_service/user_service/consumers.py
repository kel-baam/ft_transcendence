import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import User
from django.conf import settings
import jwt
from asgiref.sync   import async_to_sync
from .serializers import *


class Notification(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id    = None
        self.group_name = None
        for header_name, header_value in self.scope["headers"]:
            if header_name == b'cookie':
                cookies_str = header_value.decode("utf-8")
                cookies = {}
                for cookie in cookies_str.split("; "):
                    key, value = cookie.split("=", 1)
                    cookies[key] = value

                try:
                    access_token = cookies.get("access_token")
                    if not access_token:
                        raise ValueError("Access token not provided")
                    
                    payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
                    self.access_token = access_token
                    user = await sync_to_async(User.objects.filter(email=payload["email"]).first)()

                    if user:
                        
                        self.scope['user_id'] = user
                        self.user_id = user.id
                        self.scope['email'] = payload["email"]
                        
                        await self.accept()
                        
                        self.group_name = f'user_{self.user_id}'
                        self.notification_group_name = f'tournament_'

                        await self.channel_layer.group_add(
                            self.notification_group_name,
                            self.channel_name
                        )

                        await self.channel_layer.group_add(
                            self.group_name,
                            self.channel_name
                        )


                    else:
                        await self.send(text_data=json.dumps({"error": "User doesn't exist"}))

                except Exception as e:
                    await self.send(text_data=json.dumps({"error": "Token expired or invalid"}))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.notification_group_name, self.channel_name)
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        pass

    async def send_notification(self, event):
        """
        Handle sending notification data to WebSocket.
        This method will be called when a message is sent to the group.
        """
        notification_data = event['notification']
        
        await self.send(text_data=json.dumps({
            'notification': notification_data
        }))





class OnlineFriends(AsyncWebsocketConsumer):
    async def connect(self):        
        self.user = None
        for header_name, header_value in self.scope["headers"]:
            if header_name == b'cookie':
                cookies_str = header_value.decode("utf-8")
                cookies = {key: value for key, value in (cookie.split("=", 1) for cookie in cookies_str.split("; ") if "=" in cookie)}

                try:
                    payload = jwt.decode(cookies.get("access_token").encode("utf-8"), settings.SECRET_KEY, algorithms=["HS256"])
                    self.user = await sync_to_async(User.objects.filter(email=payload["email"]).first)()
                    
                    if self.user:
                        self.group_name = f"friend_{self.user.id}"  
                        await self.accept()
                        await self.channel_layer.group_add(self.group_name, self.channel_name) 
                        await self.channel_layer.group_add("online_users", self.channel_name)
                        friends = await self.get_friends(self.user)
                        await self.send(text_data=json.dumps(friends))
                except Exception as e:
                    await self.close()

    @sync_to_async
    def get_friends(self, user):
        """Retrieve accepted friends"""
        friends = User.objects.filter(
            models.Q(sent_request__status='accepted', sent_request__reciever=user) |
            models.Q(received_request__status='accepted', received_request__sender=user)
        ).distinct()
        return UserSerializer(friends, many=True, fields=['id','username', 'picture', 'status']).data

    async def disconnect(self, close_code):
        """Remove the user from the WebSocket group on disconnect"""
        if self.user:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            await self.close()

            

    async def friend_status_update(self, event):
        """Handles incoming status update messages"""
        await self.send(text_data=json.dumps(
            event["friends"],  
        ))
 
