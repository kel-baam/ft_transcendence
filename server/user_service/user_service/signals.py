from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import *  
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json
from .serializers import *


@receiver(post_save, sender=User)
def notify_friends_on_status_change(sender, instance, created, **kwargs):
    """
    Signal to notify friends when a user's status changes.
    """
    if not created:
        channel_layer = get_channel_layer()
        friends = User.objects.filter(
            models.Q(sent_request__reciever=instance, sent_request__status="accepted") |
            models.Q(received_request__sender=instance, received_request__status="accepted")
        ).distinct()
        for friend in friends:
            async_to_sync(channel_layer.group_send)(
                f"user_{friend.id}",
                {
                    "type": "friend_status_update",
                    "friend": UserSerializer(instance, fields=['id', 'picture', 'status']).data
                },
            )
