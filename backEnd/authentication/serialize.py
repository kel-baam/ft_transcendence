from rest_framework import serializers

from .models import User

from .models import User

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__' 
