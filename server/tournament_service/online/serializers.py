from rest_framework             import serializers
from django.core.exceptions     import ValidationError

from .models            import Player, PlayerTournament, Tournament

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model   = Player
        fields  = '__all__'

class PlayerTournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model   = PlayerTournament
        fields  = '__all__'

    def validate_nickname(self, value):
        """ Custom validation for nickname """
        if not value:
            raise ValidationError('Nickname cannot be empty.')
        return value

    def validate_avatar(self, value):
        """ Custom validation for avatar """
        if not value:
            raise ValidationError('Avatar cannot be empty.')
        return value

class TournamentSerializer(serializers.ModelSerializer):
    participants = PlayerTournamentSerializer(many=True, required=False)
    class Meta:
        model   = Tournament
        fields  = '__all__'

    def validate_name(self, value):
        """ Custom validation for name """
        if not value:
            raise ValidationError('Tournament name cannot be empty.')
        return value

    def validate_type(self, value):
        """Custom validation for type"""
        print("validate_type----------------> ", value)
        if not value:
            raise serializers.ValidationError('You must select a type.')
        return value
