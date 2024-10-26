import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import *

class RequestUpdateConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("------------------------------> here connected")
        # print("---------__> hello the client is connected , "+ self.scope)
        # self.req_status = self.scope['url_route']['kwargs']['status']
        # self.req_id = self.scope['url_route']['kwargs']['id']
        # print(">>>>>>>>>>>>>>>>>>> self.req_status " + self.req_status + "   self.req_id" + self.req_id)
        await self.accept()

    # async def disconnect(self, close_code):
        # await self.channel_layer.group_discard(
        #     self.room_group_name,
        #     self.channel_name
        # )
    async def disconnect(self, close_code):
        pass
    def receive(self, text_data):
        # self.req_id = self.scope['url_route']['kwargs']['status']
        # self.req_id = self.scope['url_route']['kwargs']['id']
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        print("-----------------------> recieved data ", message)
        # Send message to room group
        # await self.channel_layer.group_send(
        #     self.room_group_name,
        #     {
        #         'type': 'chat_message',
        #         'message': message
        #     }
        # )