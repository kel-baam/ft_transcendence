import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'TryPython.settings')
django.setup()
from .decorators import token_required
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.exceptions import DenyConnection
import jwt
from django.conf import settings
from .models import User

class MyConsumer(AsyncWebsocketConsumer):
    @token_required
    async def connect(self):
        if not self.scope.get('username'):
            # id = self.scope['user_id']
            print("error in connection") 
            await self.close(code=4001)
            return
        await self.accept()

            
    async def disconnect(self, close_code):
        print("disconnect from server !!")
        self.close(code=4001)
        

    async def receive(self, text_data):
   
        data = json.loads(text_data)
        await self.send(text_data=json.dumps({"message": "Message recived "}))
