from rest_framework import serializers
from .models        import Tournament, Player
from django.core.exceptions     import ValidationError

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model   = Player
        fields  = '__all__'

    def validate_nickname(self, value):
            """ Custom validation for name """
            if not value:
                raise ValidationError('player name cannot be empty.')
            return value

class TournamentSerializer(serializers.ModelSerializer):
    players     = PlayerSerializer(many=True, read_only=True)
    class Meta:
        model   = Tournament
        fields  = '__all__'

    def validate_name(self, value):
        """ Custom validation for name """
        if not value:
            raise ValidationError('Tournament name cannot be empty.')
        return value