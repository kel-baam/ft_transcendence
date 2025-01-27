# services.py
from .models import ChatRoom

def create_chat_room(user1, user2):
    room = ChatRoom.objects.create(user1=user1, user2=user2)
    return room
