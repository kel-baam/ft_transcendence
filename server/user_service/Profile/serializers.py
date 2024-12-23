from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

class PlayerSerializer(serializers.ModelSerializer):
    class Meta():
        model = Player
        fields = ['id', 'user','score', 'level', 'Rank']

class UserSerializer(serializers.ModelSerializer):
    score = serializers.FloatField(source='player.score', read_only = False,required=False)
    rank = serializers.IntegerField(source='player.Rank', read_only = False,required=False)
    level = serializers.FloatField(source='player.level', read_only = False,required=False)

    old_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)

    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        exclude = kwargs.pop('exclude', None)
        super().__init__(*args, **kwargs)
        if fields:
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)
        if exclude:
            for field_name in exclude:
                self.fields.pop(field_name, None)

    def validate(self, attrs):
        
        if self.instance is not None:
            old_password = attrs.get('old_password')
            new_password = attrs.get('new_password')
            confirm_password = attrs.get('confirm_password')
            if old_password or new_password or confirm_password:
                if not old_password:
                    raise serializers.ValidationError({"old_password" : "This field  is required"})
                if not new_password:
                    raise serializers.ValidationError({"new_password" : "This field is required"})
                if not confirm_password:
                    raise serializers.ValidationError({"confirm_password" : "This field is required"})
                if not check_password(old_password, self.instance.password):
                    raise serializers.ValidationError({"old_password": "Incorrect old password."})
                if new_password != confirm_password:
                    raise serializers.ValidationError({"confirm_password": "New password and confirmation do not match."})
                attrs['password'] = new_password
                attrs.pop('old_password')
                attrs.pop('new_password')
                attrs.pop('confirm_password')
        
        if 'password' in attrs:
            password = attrs.get('password')
            try:
                validate_password(password)
                attrs['password']=make_password(attrs['password'])
            except ValidationError as e:
                raise serializers.ValidationError({"password": e.messages[0]})
        if 'first_name'in attrs and len(attrs.get('first_name')) < 2 :
            raise serializers.ValidationError({"first_name": "First name must be longer than 2 characters."})
        if 'last_name' in attrs and len(attrs.get('last_name')) < 2:
            raise serializers.ValidationError({"last_name": "Last name must be longer than 2 characters."})
        if 'username' in attrs and len(attrs.get('username')) < 2:
            raise serializers.ValidationError({"username": "username must be longer than 2 characters."})
        return attrs

    def update(self, instance, validated_data):
        player_data = validated_data.pop('player', {})
        for field in validated_data:
            setattr(instance, field, validated_data[field])
        instance.save()
        player = getattr(instance, 'player', None)
        if player:
            player.score = player_data.get('score', player.score)
            player.Rank = player_data.get('Rank', player.Rank)
            player.level = player_data.get('level', player.level)
            player.save()
        return instance
    
    def create(self, validated_data):
        player_data = validated_data.pop('player', {})
        user = User(**validated_data)
        user.save()
        if player_data:
            Player.objects.create(user=user,**player_data)
        return user
    
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }


class MatchSerializer(serializers.ModelSerializer):
    player1 = UserSerializer(source='player1.user',read_only=True, fields=['id', 'username', 'picture'])
    player2 = UserSerializer(source='player2.user',read_only=True, fields=['id', 'username', 'picture'])
    
    player1_id = serializers.PrimaryKeyRelatedField(
        queryset=Player.objects.all(), source='player1', write_only=True
    )
    player2_id = serializers.PrimaryKeyRelatedField(
        queryset=Player.objects.all(), source='player2', write_only=True
    )

    # def validate(self, attrs):
    #     print(">>>>>>>>>> attrs : ", attrs)
    #     return attrs
    
    class Meta():
        model = Match
        fields = '__all__'
    # def create(self, validated_data):
    #     match = Match(**validated_data)
    #     match.save()
    #     return match
   

# class RequestsSendedSerializer(serializers.ModelSerializer):
#     user = UserSerializer(source='sender',fields=['username', 'first_name', 'last_name', 'picture'])
#     def __init__(self, *args, **kwargs):
#         fields = kwargs.pop('fields', None)
#         exclude = kwargs.pop('exclude', None)
#         super().__init__(*args, **kwargs)
#         if fields:
#             allowed = set(fields)
#             existing = set(self.fields.keys())
#             for field_name in existing - allowed:
#                 self.fields.pop(field_name)
#         if exclude:
#             for field_name in exclude:
#                 self.fields.pop(field_name, None)

#     class Meta:
#         model = Request
#         fields = '__all__'

# class RequestsRecievedSerializer(serializers.ModelSerializer):
#     user =  UserSerializer(source='sender',fields=['username', 'first_name', 'last_name', 'picture'])
#     def __init__(self, *args, **kwargs):
#         fields = kwargs.pop('fields', None)
#         exclude = kwargs.pop('exclude', None)
#         super().__init__(*args, **kwargs)
#         if fields:
#             allowed = set(fields)
#             existing = set(self.fields.keys())
#             for field_name in existing - allowed:
#                 self.fields.pop(field_name)
#         if exclude:
#             for field_name in exclude:
#                 self.fields.pop(field_name, None)

#     class Meta:
#         model = Request
#         fields = '__all__'

class RequestSerializer(serializers.ModelSerializer):

    user = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        fields = kwargs.pop('fields', None)
        exclude = kwargs.pop('exclude', None)
        super().__init__(*args, **kwargs)
        if fields:
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)
        if exclude:
            for field_name in exclude:
                self.fields.pop(field_name, None)
    def get_user(self, obj):
        user_type = self.context.get('user_type', None)
        if user_type == "sender":
            return UserSerializer(obj.sender,fields=['username', 'first_name', 'last_name', 'picture']).data
        elif user_type == "receiver":
            return UserSerializer(obj.reciever,fields=['username', 'first_name', 'last_name', 'picture']).data
        elif user_type == "both":
            return {
                "sender": UserSerializer(obj.sender,fields=['username', 'first_name', 'last_name', 'picture']).data,
                "receiver": UserSerializer(obj.reciever,fields=['username', 'first_name', 'last_name', 'picture']).data,
            }
        return None
    
    def validate(self, attrs):
        print(">>>>>>>>>>>>>>>>>> attrs : ", attrs)
        return super().validate(attrs)
    
    class Meta:
        model = Request
        fields = '__all__'
