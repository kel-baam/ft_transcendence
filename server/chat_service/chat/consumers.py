# consumers.py
import json
from .models import User, PrivateMessage
from .serializers import UserSerializer

from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']  # Capture the room name
        self.room_group_name = self.room_name
        print("room name "+ self.room_name)
        print("group name "+ self.room_group_name)

        # Join the room group (you can use a group for broadcasting messages)
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)  # Convertir la chaîne JSON en dictionnaire
        content = data['content']
        room = data['room']
        # should make a check for sender and receiver
        sender = data['sender']
        receiver = data['receiver']

        print(f"Message reçu : {content} de {sender} à {receiver} dans la salle {room}")

        try:
            senderUser = User.objects.get(username=sender)
            receiverUser = User.objects.get(username=receiver)
        except User.DoesNotExist:
            # Gérer le cas où l'utilisateur n'existe pas
            self.send(text_data=json.dumps({"error": "User not found", "status_code" : "404"}))
            return

        PrivateMessage.objects.create(
            content=content,
            roomName=room,
            sender=senderUser,
            receiver=receiverUser
        )

        senderUser = UserSerializer(senderUser).data
        receiverUser = UserSerializer(receiverUser).data
        
        # Send the message back to the WebSocket
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type": "chat_message", "content": content, "room": room, "sender" : senderUser, "receiver" : receiverUser}
        )

    def chat_message(self, event):
        content = event["content"]
        room = event["room"]
        sender = event["sender"]
        receiver = event["receiver"]

        print("content : "+ content, sender, receiver)

        # Send message to WebSocket
        self.send(text_data=json.dumps({"content": content, "room": room, "sender" : sender, "receiver" : receiver, "status_code" : ""}))
