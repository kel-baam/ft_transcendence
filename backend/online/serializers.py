from rest_framework import serializers

from .models            import Player, PlayerTournament, Tournament, User
class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model   = Tournament
        fields  = '__all__'

    def validate_nickname(self, value):
        """ Custom validation for nickname """
        if not value:
            raise serializers.ValidationError('Custom Error: Nickname cannot be empty.')
        return value

    def validate_avatar(self, value):
        """ Custom validation for avatar """
        if not value:
            raise serializers.ValidationError('Custom Error: Avatar cannot be empty.')
        return value

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model   = Player
        fields  = '__all__'

class PlayerTournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model   = PlayerTournament
        fields  = '__all__'

