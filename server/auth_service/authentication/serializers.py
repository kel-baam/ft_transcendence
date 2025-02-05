
from rest_framework import serializers
from .models import User
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password, check_password

class UserSerializer(serializers.ModelSerializer):
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
        print("dhdghf=====================================>",attrs)

        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')
        print('new password==>',new_password)
        if  new_password or confirm_password:
            if not new_password:
                raise serializers.ValidationError({"new_password" : "This field is required"})
            if not confirm_password:
                raise serializers.ValidationError({"confirm_password" : "This field is required"})
            if new_password != confirm_password:
                raise serializers.ValidationError({"confirm_password": "New password and confirmation do not match."})
            attrs['password'] = new_password
            attrs.pop('new_password')
            attrs.pop('confirm_password')
    
        if 'password' in attrs:
            password = attrs.get('password')
            try:
                validate_password(password)
                attrs['password']=make_password(attrs['password'])
            except ValidationError as e:
                raise serializers.ValidationError({"password": e.messages[0]})
    class Meta:
        model = User
        fields = '__all__'
