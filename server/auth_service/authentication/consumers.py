import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'auth.settings')
django.setup()
# from .decorators import token_required
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.exceptions import DenyConnection
import jwt
from django.conf import settings
from .models import User

import logging
import jwt
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password, check_password


logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


from asgiref.sync import sync_to_async


class MyConsumer(AsyncWebsocketConsumer):
    # @token_required
    async def connect(self):
            await self.accept()
            for header_name, header_value in self.scope["headers"]:
             if header_name == b'cookie':
                cookies_str = header_value.decode("utf-8")
                cookies = {}
                for cookie in cookies_str.split("; "):
                    key, value = cookie.split("=", 1)  
                    cookies[key] = value          
                try:
                    logger.debug("accccc=>",cookies.get("access_token").encode("utf-8"))
                    payload = jwt.decode(cookies.get("access_token").encode("utf-8"), settings.SECRET_KEY, algorithms=["HS256"])
                    self.access_token = cookies.get("access_token")
                    user = await sync_to_async(User.objects.filter(email=payload["email"]).first)()
                    if user:
                        logger.debug("done")
                        self.scope['user_id']  = user
                        self.scope['email']  = payload["email"]
                        # add what ever you want
                    else:
                        logger.debug("user nor")
                        await self.send(text_data=json.dumps({"error": "user doesn't exist"}))
                except Exception as e:
                        logger.debug("errrr nor",e)
                        await self.send(text_data=json.dumps({"error": "token expired"}))

    async def disconnect(self, close_code):
        logger.debug("disconnect from server !!")
        self.close(code=4001)

    async def receive(self, text_data):
   
        data = json.loads(text_data)
        await self.send(text_data=json.dumps({"message": "Message recived "}))
# from channels.generic.websocket import AsyncWebsocketConsumer
# import json

# class MyConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         # Accept the connection
#         await self.accept()
#         print("WebSocket connection accepted")

#     async def disconnect(self, close_code):
#         # Handle disconnection
#         print("WebSocket disconnected")

#     async def receive(self, text_data):
#         # Handle messages received from the client
#         data = json.loads(text_data)
#         print("Message received from client:", data)
#         await self.send(text_data=json.dumps({"message": "Hello from server"}))
