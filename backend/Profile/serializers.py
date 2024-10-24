from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields =['username', 'first_name', 'last_name', 'picture','status']

    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)

    #     # Pop fields you want to exclude from the JSON response
    #     representation.pop('password', None)  # Remove password
    #     representation.pop('email', None)  # Remove email if needed
    #     # Add any additional fields you want to remove

    #     return representation

class PlayerSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta():
        model = Player
        fields = ['id', 'user','score', 'level', 'Rank' ]

class MatchSerializer(serializers.ModelSerializer):
    player1 = PlayerSerializer()
    player2 = PlayerSerializer()
    class Meta():
        model = Match
        fields = ['id', 'date', 'player1_points','player2_points','player1', 'player2']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['player1'].pop('score')
        representation['player1'].pop('level')
        representation['player1'].pop('Rank')
        representation['player1']['user'].pop('status')
        representation['player2'].pop('score')
        representation['player2'].pop('level')
        representation['player2'].pop('Rank')
        representation['player2']['user'].pop('status') 
        return representation

class RequestsSendedSerializer(serializers.ModelSerializer):
    reciever = UserSerializer()
    class Meta:
        model = Request
        fields= ['id','reciever']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = representation.pop('reciever') 
        return representation

class RequestsRecievedSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    class Meta:
        model = Request
        fields= ['id', 'sender']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['user'] = representation.pop('sender') 
        return representation

