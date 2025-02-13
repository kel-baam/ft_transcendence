import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import User
from django.conf import settings
import jwt
from asgiref.sync   import async_to_sync

# Notification container's WebSocket consumer
class Notification(AsyncWebsocketConsumer):
    async def connect(self):
        print("--------> WebSocket connection opened")

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



























# import json
# from channels.generic.websocket import AsyncWebsocketConsumer
# from .models import *
# from .serializers import *
# from urllib.parse import parse_qs
# from asgiref.sync import sync_to_async


# @sync_to_async
# def serialize_requests(requests, user_type):
#     # Perform serialization inside the function
#     return RequestSerializer(requests, many=True, fields=['id', 'user'], context={'user_type': user_type}).data

# class TestConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         await self.accept()
#         print(">>>>>>>>>>>>>>>>>> here the connection accepted from the ")
#         try:
           
#             query_string = self.scope["query_string"].decode()
#             query_params = parse_qs(query_string)
#             print(">>>>>>>>>>>>>>. query params value ", query_params)
#             username = query_params.get("username", [""])[0]
#             print(">>>>>>>>>>>>>>>> username is : ", username)
#             # print("************************************> status ", status_filter , " and user in Friendship : ", user)
#             user = await sync_to_async(User.objects.get)(username=username)  
#             print(">>>>>>>>>>>>>>>> user is got it : ", user)          
#             data = []
#             print(">>>>>>>>>>>> here before get the data ")
           
#             requests_user_as_sender = await sync_to_async(Request.objects.filter)(sender=user, status='accepted')
#             requests_user_as_reciever = await sync_to_async(Request.objects.filter)(reciever=user, status='accepted')

#             serializer_requests_user_as_reciever = await serialize_requests(requests_user_as_reciever, 'sender')
#             serializer_requests_user_as_sender = await serialize_requests(requests_user_as_sender, 'receiver')
#             # serializer_requests_user_as_reciever =[user for user in serializer_requests_user_as_reciever and user.status=True]
#             data = serializer_requests_user_as_reciever + serializer_requests_user_as_sender
#             await self.send(text_data=json.dumps(data))

#         except serializers.ValidationError:
#              await self.send(text_data=json.dumps({key: value[0] for key, value in serializers.ValidationError.errors.items()}))
#         except Exception as e:
#             await self.send(text_data= json.dumps(str(e)))

#     async def disconnect(self, close_code):
#         print("Disconnected")

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         message = data.get("message", "")

#         # Send response back to the client
#         await self.send(text_data=json.dumps({
#             "message": f"Server received: {message}"
#         }))

