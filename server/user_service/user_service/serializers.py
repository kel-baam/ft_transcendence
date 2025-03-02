from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db.models import  Q
# from validate_email_address import validate_email

# # import os
# import requests
# from django.core.files import File
# from django.core.files.temp import NamedTemporaryFile
# from django.core.files.base import ContentFile
# import logging




# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger(__name__)

class PlayerSerializer(serializers.ModelSerializer):
    class Meta():
        model = Player
        fields = ['score', 'level', 'rank']

class UserSerializer(serializers.ModelSerializer):
    score = serializers.FloatField(source='player.score', read_only = False,required=False)
    rank = serializers.IntegerField(source='player.rank', read_only = False,required=False)
    level = serializers.FloatField(source='player.level', read_only = False,required=False)

    Current_password = serializers.CharField(write_only=True, required=False)
    New_password = serializers.CharField(write_only=True, required=False)
    Confirm_password = serializers.CharField(write_only=True, required=False)
    player = PlayerSerializer()

    picture = serializers.ImageField(max_length=None, required=False, allow_null=True)

    relationship_status = serializers.SerializerMethodField(required=False)

    password = serializers.CharField(
        write_only=True, 
        required=False, 
        # allow_null=True, 
        # allow_blank=True
    )
    
    registration_type = serializers.ChoiceField(required=False, choices=['api', 'form'])

    request_id = serializers.IntegerField(read_only=True, required=False,)

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
        if attrs.get('registration_type') == 'form' and not attrs.get('password'):
            raise serializers.ValidationError({"password" : "Password is required !!!"})
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
        
        # if 'email' in attrs and  not validate_email(attrs['email'], verify=True):
        #     raise ValidationError(f"The email '{attrs['email']}' is not valid or does not exist.")
        if 'registration_type' in attrs:
            attrs.pop('registration_type')

        return attrs

    def update(self, instance, validated_data):
        player_data = validated_data.pop('player', {})
        for field in validated_data:
            setattr(instance, field, validated_data[field])
        instance.save()
        player = getattr(instance, 'player', None)
        if player:
            player.score = player_data.get('score', player.score)
            player.rank = player_data.get('rank', player.rank)
            player.level = player_data.get('level', player.level)
            player.save()
        return instance
    
    def create(self, validated_data):
        print(">>>>>>>>>>>>>> here in create fucntion ")
        player_data = validated_data.pop('player', {})
        user = User(**validated_data)
        # user.set_unusable_password()
        user.save()
        print("----------------------> player_data : ", player_data)
        if player_data:
            player = Player.objects.create(user=user,**player_data)
            player.save()

        print(">>>>>>>>>>>>>>>> user was created ||| ")
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
            # relationship = Request.objects.filter(
            #     sender=logged_in_user,
            #     reciever=obj
            # ).first()  # Get the first matching relationship (if any)
            # print(">>>>>>>>>>>>>>>>>>>>> here the value : ", 
            #       Request.objects.filter(sender=logged_in_user, reciever=obj).get('status'))
            # req = Request.objects.filter(sender=logged_in_user, reciever=obj).first()
            # print("--------------> req ", req, "    |   ")
            if   Request.objects.filter(sender=logged_in_user, reciever=obj).first() is not None \
                and Request.objects.filter(sender=logged_in_user, reciever=obj).first().status == "pending":
                return "sent"
            elif Request.objects.filter(
                    sender=obj,
                    reciever=logged_in_user
                ).first() is not None and   Request.objects.filter(
                    sender=obj,
                    reciever=logged_in_user
                ).first().status == "pending":
                return "recieved"
            elif Request.objects.filter(
                Q(sender=logged_in_user, reciever=obj) | 
                Q(sender=obj, reciever=logged_in_user)).first() is not None and \
                Request.objects.filter(
                Q(sender=logged_in_user, reciever=obj) | 
                Q(sender=obj, reciever=logged_in_user)).first().status == "blocked":
                return "blocked"
            elif Request.objects.filter(
                Q(sender=logged_in_user, reciever=obj) | 
                Q(sender=obj, reciever=logged_in_user)).first() is not None and \
                Request.objects.filter(
                Q(sender=logged_in_user, reciever=obj) | 
                Q(sender=obj, reciever=logged_in_user)).first().status == "accepted":
                return "accepted"
            else:
                return "no_request"
        
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
 
    
#    class Match(models.Model):
#     tournament  = models.ForeignKey(Tournament, on_delete=models.SET_NULL, null=True, blank=True, related_name='matches')
#     player1     = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player1')
#     player2     = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player2')
#           room_name = models.CharField(max_length=50, null=True)
#     
    
#     status_choices = [
#         ('pending', 'Pending'),
#         ('completed', 'Completed'),
#         ('exited', 'Exited')
#     ]
#     status = models.CharField(max_length=10, choices=status_choices, default='pending')

#     def __str__(self):
#         tournament_info = f"Tournament: {self.tournament.name}" if self.tournament else "No Tournament"
#         return f"Match: {self.player1.user.username} vs {self.player2.user.username} ({tournament_info})"
    
#     class Meta:
#         db_table = 'Match'


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
            return UserSerializer(obj.sender,fields=['username', 'first_name', 'last_name', 'picture', 'status']).data
        elif user_type == "receiver":
            return UserSerializer(obj.reciever,fields=['username', 'first_name', 'last_name', 'picture', 'status']).data
        elif user_type == "both":
            return {
                "sender": UserSerializer(obj.sender,fields=['username', 'first_name', 'last_name', 'picture', 'status']).data,
                "receiver": UserSerializer(obj.reciever,fields=['username', 'first_name', 'last_name', 'picture', 'status']).data,
            }
        return None
    
    def validate(self, attrs):
        print(">>>>>>>>>>>>>>>>>> attrs : ", attrs)
        return super().validate(attrs)
    
    class Meta:
        model = Request
        fields = '__all__'


class BadgeSerializer(serializers.ModelSerializer):
    unlocked = serializers.BooleanField()
    class Meta:
        model = Badge
        fields = ['id', 'name', 'icon', 'unlocked']

class UserBadgeSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'


class NotificationSerializers(serializers.ModelSerializer):
    class Meta:
        model   = Notification
        fields  = '__all__'
        