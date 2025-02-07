from rest_framework import serializers 
from .models import User, PrivateMessage

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'  # Inclure tous les champs

class PrivateMessageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = PrivateMessage
        fields = '__all__'

class ChatListItemSerializer(serializers.HyperlinkedModelSerializer):
    # im gonna choose an user as the authonticated user (user_id 5)
    sender = UserSerializer()
    receiver = UserSerializer()
    roomName = serializers.SerializerMethodField()
    
    class Meta:
        model = PrivateMessage
        fields = ['sender', 'receiver', 'roomName', 'content', 'read', 'timestamp']

    def get_roomName(self, obj):
        return f"{obj.roomName}"


        
