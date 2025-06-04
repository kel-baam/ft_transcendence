from rest_framework import serializers
from .models import *
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db.models import  Q
from validate_email_address import validate_email



class PlayerSerializer(serializers.ModelSerializer):
    class Meta():
        model = Player
        fields = ['score', 'rank', 'level', 'grade']

class UserSerializer(serializers.ModelSerializer):
    score = serializers.FloatField(source='player.score', read_only = False,required=False)
    rank = serializers.IntegerField(source='player.rank', read_only = False,required=False)
    level = serializers.FloatField(source='player.level', read_only = False,required=False)
    grade = serializers.CharField(source='player.grade', required=False)
    Current_password = serializers.CharField(write_only=True, required=False)
    New_password = serializers.CharField(write_only=True, required=False)
    Confirm_password = serializers.CharField(write_only=True, required=False)

    player = PlayerSerializer()

    picture = serializers.ImageField(max_length=None, required=False, allow_null=True)

    relationship_status = serializers.SerializerMethodField(required=False)

    password = serializers.CharField(
        write_only=True, 
        required=False,
    )
    
    registration_type = serializers.ChoiceField(required=False, choices=['api', 'form'])

    request_id = serializers.IntegerField(read_only=True, required=False)
    status = serializers.BooleanField(required=False)
    
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
        if attrs.get('registration_type') == 'form' and not attrs.get('password'):
            raise serializers.ValidationError({"password" : "Password is required !!!"})
        if self.instance is not None:
            old_password = attrs.get('Current_password')
            new_password = attrs.get('New_password')
            confirm_password = attrs.get('Confirm_password')
    
            if old_password is not None or new_password is not None or confirm_password is not None:
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
        if 'registration_type' in attrs:
            attrs.pop('registration_type')

        return attrs

    
    def create(self, validated_data):
        player_data = validated_data.pop('player', {})
        user = User(**validated_data)
        user.save()
        if player_data:
            player = Player.objects.create(user=user,**player_data)
            player.save()

        return user
    

    def get_relationship_status(self, obj):
        """
        This method computes the relationship status between the logged-in user
        and the user being serialized (obj).
        """
        if self.context:
            logged_in_user = self.context['logged_in_user']
            if (logged_in_user == obj):
                return "self"
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
                Q(sender=logged_in_user, reciever=obj)).first() is not None and \
                Request.objects.filter(
                Q(sender=logged_in_user, reciever=obj)).first().status == "blocked":
                return "blocked"
            elif Request.objects.filter(
                Q(sender=obj, reciever=logged_in_user)).first() is not None and \
                Request.objects.filter(
                Q(sender=obj, reciever=logged_in_user)).first().status == "blocked":
                return ""
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
    created_at = serializers.DateField()
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
    
    class Meta():
        model = Match
        fields = '__all__'


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
        