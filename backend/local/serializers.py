from rest_framework import serializers
from .models        import User, Tournament, Player

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model   = Player
        fields  = ['nickname', 'avatar', 'score']

    def create(self, validated_data):
        return Player.objects.create(**validated_data)

class TournamentSerializer(serializers.ModelSerializer):
    players     = PlayerSerializer(many=True)
    creator     = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model   = Tournament
        fields  = ['creator', 'name', 'players']

    def create(self, validated_data):
        players_data    = validated_data.pop('players')
        creator         = validated_data.pop('creator')

        print(f"Players data: {players_data}")

        creator_instance    = User.objects.get(id=11)
        tournament          = Tournament.objects.create(creator=creator_instance, **validated_data)

        for player_data in players_data:
            Player.objects.create(
                tournament  = tournament,
                nickname    = player_data.get('nickname', 'NoNickname'),
                avatar      = player_data.get('avatar', None),
                score       = player_data.get('score', 0),
            )
        return tournament
