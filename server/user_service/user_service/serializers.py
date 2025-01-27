from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import os
import requests
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from django.core.files.base import ContentFile
# import logging




# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger(__name__)

class PlayerSerializer(serializers.ModelSerializer):
    class Meta():
        model = Player
        fields = ['score', 'level', 'Rank']

class UserSerializer(serializers.ModelSerializer):
    score = serializers.FloatField(source='player.score', read_only = False,required=False)
    rank = serializers.IntegerField(source='player.Rank', read_only = False,required=False)
    level = serializers.FloatField(source='player.level', read_only = False,required=False)

    Current_password = serializers.CharField(write_only=True, required=False)
    New_password = serializers.CharField(write_only=True, required=False)
    Confirm_password = serializers.CharField(write_only=True, required=False)
    player = PlayerSerializer()

    picture = serializers.ImageField(max_length=None, required=False, allow_null=True)

    relationship_status = serializers.SerializerMethodField(required=False)


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
        # print(">>>>>>>>>>>>>>>>>>>>> picture in validate stage : ", attrs.get('picture'))
        # if 'picture' in attrs:
        #     picture = attrs.get('picture')

        # # Ensure file is open
        #     if picture.closed:
        #         raise ValidationError({"picture": "The file is closed, cannot read."})
        if self.instance is not None:
            print(">>>>>>>>>>>>>>>>>>>>>> here in validate data ")
            print(">>>>>>>>>>>> attrs : ", attrs )
            old_password = attrs.get('Current_password')
            new_password = attrs.get('New_password')
            confirm_password = attrs.get('Confirm_password')
            print(">>>>>>>>>>>>> old_password : ", old_password)
            print("----------------> new_password : ", new_password)
            print("*******************> confirm_password : ", confirm_password)
            if old_password is not None or new_password is not None or confirm_password is not None:
                print('>>>>>>>>>>>>>> here old_password exist :  ', old_password)
                if not old_password:
                    raise serializers.ValidationError({"Current_password" : "This field  is required"})
                if not new_password:
                    raise serializers.ValidationError({"New_password" : "This field is required"})
                if not confirm_password:
                    raise serializers.ValidationError({"Confirm_password" : "This field is required"})
                if not check_password(old_password, self.instance.password):
                    raise serializers.ValidationError({"Current_password": "Incorrect old password."})
                if new_password != confirm_password:
                    raise serializers.ValidationError({"Confirm_password": "New password and confirmation do not match."})
                attrs['password'] = new_password
                attrs.pop('Current_password')
                attrs.pop('New_password')
                attrs.pop('Confirm_password')
        
        if 'password' in attrs:
            password = attrs.get('password')
            try:
                validate_password(password)
                attrs['password']=make_password(attrs['password'])
            except ValidationError as e:
                raise serializers.ValidationError({"New_password": e.messages[0]})
        # else:
        #     password = None
        # if 'first_name'in attrs and len(attrs.get('first_name')) < 2 :
        #     raise serializers.ValidationError({"first_name": "First name must be longer than 2 characters."})
        # if 'last_name' in attrs and len(attrs.get('last_name')) < 2:
        #     raise serializers.ValidationError({"last_name": "Last name must be longer than 2 characters."})
        # if 'username' in attrs and len(attrs.get('username')) < 2:
        #     raise serializers.ValidationError({"username": "username must be longer than 2 characters."})
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
        print(">>>>>>>>>>>>>> here in create fucntion ")
        player_data = validated_data.pop('player', {})
        user = User(**validated_data)
        # user.set_unusable_password()
        user.save()
        if player_data:
            Player.objects.create(user=user,**player_data)
        return user
    

    def get_relationship_status(self, obj):
        """
        This method computes the relationship status between the logged-in user
        and the user being serialized (obj).
        """
        # Get the logged-in user from the request context
        if self.context:
            logged_in_user = self.context['logged_in_user']
            if (logged_in_user == obj):
                return "self"
        # Check if there is a request between the logged-in user and the target user (obj)
            relationship = Request.objects.filter(
                sender=logged_in_user,
                reciever=obj
            ).first()  # Get the first matching relationship (if any)

            if not relationship:
                # If no relationship exists, check the reverse relationship (reciever -> sender)
                relationship = Request.objects.filter(
                    sender=obj,
                    reciever=logged_in_user
                ).first()

            if not relationship:
                return "no_request"  # No request exists between the users

        # Return the relationship status (accepted, blocked, or pending)
            return relationship.status
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
