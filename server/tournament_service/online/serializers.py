from rest_framework             import serializers
from django.core.exceptions     import ValidationError

from .models            import Player, PlayerTournament, Tournament, Notification

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model   = Player
        fields  = '__all__'

class PlayerTournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model   = PlayerTournament
        fields  = '__all__'

    def validate(self, data):
        """Override the default validation to handle custom checks"""

        status   = data.get('status')
        nickname = data.get('nickname')

        print("acccccccccccccccccccccccccccccccccccccc")
        if status == 'accepted' and not nickname:
            raise ValidationError({'nickname': 'Nickname cannot be empty.'})
        return data


class TournamentSerializer(serializers.ModelSerializer):
    participants = PlayerTournamentSerializer(many=True, required=False)
    class Meta:
        model   = Tournament
        fields  = '__all__'


    def validate(self, data):
        """Override the default validation to handle custom checks"""
        print(">>>>>> ", data)

        name = data.get('name')
        if not name:
            raise ValidationError({'name': 'Tournament name cannot be empty.'})
        type = data.get('type')
        if not type:
            raise ValidationError({'type': 'You must select a type.'})

        return data

class NotificationSerializers(serializers.ModelSerializer):
    class Meta:
        model   = Notification
        fields  = '__all__'