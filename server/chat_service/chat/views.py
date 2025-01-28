from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .models import User, PrivateMessage 
from .serializers import UserSerializer, ChatListItemSerializer
from rest_framework import viewsets
from django.shortcuts import render
from django.db.models import Q,Max
from django.db.models import OuterRef, Subquery, Max, Q

class chatListItems(APIView):
    def get(self, request):
        user = "shicham" # should be the user logged dynamique
        print("the user logged: " + str(user))

        if user:
            user_logged = User.objects.get(username=user)

            all_messages_user = PrivateMessage.objects.filter(roomName__startswith=user)
            
            latest_timestamps_per_room = (
                all_messages_user
                .values('roomName')
                .annotate(latest_timestamp=Max('timestamp'))
            )

            latest_messages_conditions = Q()
            for item in latest_timestamps_per_room:
                latest_messages_conditions |= Q(roomName=item['roomName'], timestamp=item['latest_timestamp'])

            latest_messages = PrivateMessage.objects.select_related('sender').filter(latest_messages_conditions) .order_by('-timestamp')

            serializer = ChatListItemSerializer(latest_messages, many=True)
            return Response(serializer.data)

        return Response({"error": "No user specified"}, status=400)

#to get data of room (sender and receiver msg)
class ChatItemData(APIView):
    def get(self, request, room_name):        
        # user = 'walkerbarbara'
        print(f"roommm {room_name}") # the correct room
        actuel_room = PrivateMessage.objects.filter(roomName=room_name)
        if actuel_room.exists():
          if actuel_room.exists():
            serializer = ChatListItemSerializer(actuel_room, many=True)
            print(f"serializer {serializer.data}") 
            return Response(serializer.data)

        return Response({"error": "No user specified"}, status=400)
        

