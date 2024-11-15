from rest_framework import serializers
from .models import Player, Match, Tournament

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'nickname', 'image', 'is_local']

class TournamentSerializer(serializers.ModelSerializer):
    creator_image = serializers.SerializerMethodField()

    class Meta:
        model = Tournament
        fields = ['id', 'name', 'creator', 'type', 'created_at', 'creator_image']

    def get_creator_image(self, obj):
        return obj.get_creator_image()

class MatchSerializer(serializers.ModelSerializer):
    player1 = PlayerSerializer()
    player2 = PlayerSerializer()

    class Meta:
        model = Match
        fields = ['id', 'player1', 'player2']
