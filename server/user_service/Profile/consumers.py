# import json
# from channels.generic.websocket import AsyncWebsocketConsumer
# from .models import *
# from django.shortcuts import render, get_object_or_404
# from asgiref.sync import sync_to_async
# # import asyncio
# # from concurrent.futures import ThreadPoolExecutor

# class RequestUpdateConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         print("------------------------------> here connected")
#         # print("---------__> hello the client is connected , "+ self.scope)
#         # self.req_status = self.scope['url_route']['kwargs']['status']
#         # self.req_id = self.scope['url_route']['kwargs']['id']
#         # print(">>>>>>>>>>>>>>>>>>> self.req_status " + self.req_status + "   self.req_id" + self.req_id)
#         await self.accept()

#     # async def disconnect(self, close_code):
#         # await self.channel_layer.group_discard(
#         #     self.room_group_name,
#         #     self.channel_name
#         # )
#     async def disconnect(self, close_code):
#         pass

#     # async def delete_request(request_id):
#     # # Use sync_to_async to perform the delete operation
#     #     await sync_to_async(Request.objects.filter)(id=request_id).delete()
    
#     async def receive(self, text_data):
#         # await self.receive(text_data=message["text"])
#         # self.req_id = self.scope['url_route']['kwargs']['status']
#         # self.req_id = self.scope['url_route']['kwargs']['id']
#         text_data_json = json.loads(text_data)
#         print("---------> data recieved : ", text_data_json)
#         message = text_data_json['message']
#         # targetRequest =  
#         print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> id : ", text_data_json['id'])
#         # id = 
#         request = await sync_to_async(lambda: Request.objects.get(id=text_data_json['id']))()      
#         # request = await sync_to_async(Request.objects.get)(id=text_data_json['id'])
#         # print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> request : ", request)
#         # await sync_to_async(request.delete)()        
#         # sender = await get_sender(request)
#         # reciever = await get_reciever(request)
#         # print(">>>>>>>>>>>>>>>>>>>>> target req : ", result)
#         # result.delete()
#         # print("-----------------------> recieved data ", message)
#         # Send message to room group
#         # await self.channel_layer.group_send(
#         #     self.room_group_name,
#         #     {
#         #         'type': 'chat_message',
#         #         'message': message
#         #     }
#         # )