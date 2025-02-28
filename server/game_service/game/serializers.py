from rest_framework             import serializers
from django.core.exceptions     import ValidationError

from .models            import Player, PlayerTournament, Tournament, Notification, User, Match


class UserSerializer(serializers.ModelSerializer):
    picture = serializers.ImageField(max_length=None, required=False, allow_null=True)
    class Meta:
        model   = User
        fields  = '__all__'
    
    def __init__(self, *args, **kwargs):
        fields  = kwargs.pop('fields', None)
        exclude = kwargs.pop('exclude', None)
        super().__init__(*args, **kwargs)
        if fields:
            allowed  = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)
        if exclude:
            for field_name in exclude:
                self.fields.pop(field_name, None)

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model   = Player
        fields  = '__all__'

class PlayerTournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model   = PlayerTournament
        fields  = '__all__'
        
    def __init__(self, *args, **kwargs):
        fields  = kwargs.pop('fields', None)
        exclude = kwargs.pop('exclude', None)
        super().__init__(*args, **kwargs)
        if fields:
            allowed  = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)
        if exclude:
            for field_name in exclude:
                self.fields.pop(field_name, None)

    def validate(self, data):
        """Override the default validation to handle custom checks"""

        print("<<<<<<<<<<<< ", data)
        status = data.get('status')

        nickname = data.get('nickname')
        if status == 'accepted' and not nickname:
            raise ValidationError({'nickname': 'Nickname cannot be empty.'})
        avatar = data.get('avatar')
        if status == 'accepted' and not avatar:
            raise ValidationError({'avatar': 'Avatar cannot be empty.'})
        
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

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'

    def validate_room_name(self, value):
        """Ensure the room_name is unique only for active matches (pending)."""
        print("Validating room_name:", value)  # Debug print to check if the method is reached
        if Match.objects.filter(room_name=value, status='pending').exists():
            print("Room name is already in use for an active match.")
            raise serializers.ValidationError("Room name is already in use for an active match.")
        return value
    