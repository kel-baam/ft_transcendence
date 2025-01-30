import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import User
from django.conf import settings
import jwt

# Notification container's WebSocket consumer
class Notification(AsyncWebsocketConsumer):
    async def connect(self):
        print("--------> WebSocket connection opened")

        self.user_id = None
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
                    
                    # Decode token and get user info
                    payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
                    self.access_token = access_token
                    user = await sync_to_async(User.objects.filter(email=payload["email"]).first)()

                    if user:
                        self.scope['user_id'] = user
                        self.user_id = user.id
                        self.scope['email'] = payload["email"]

                        self.group_name = f'user_{self.user_id}'
                        print("++++++++++++++++++++> ", self.group_name)
                        await self.channel_layer.group_add(self.group_name, self.channel_name)
                        await self.accept()
                    else:
                        await self.send(text_data=json.dumps({"error": "User doesn't exist"}))

                except Exception as e:
                    print(f"Error: {e}")
                    await self.send(text_data=json.dumps({"error": "Token expired or invalid"}))

    async def disconnect(self, close_code):
        if self.group_name:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        pass  # Handle any incoming data if needed

    async def send_notification(self, event):
        # Handle sending notification data to WebSocket
        print("send notif : ", event)
        await self.send(text_data=json.dumps({
            'notification': event['notification']
        }))
