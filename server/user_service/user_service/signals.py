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
        async_to_sync (channel_layer.group_send)(
            "online_users",
            {
            "type": "friend_status_update", 
            "friend": UserSerializer(instance, fields=['id', 'picture', 'status']).data
            }
        )

@receiver(post_save, sender=Request)
def notify_users_on_accept(sender, instance, created, **kwargs):
    if created:
        pass
    elif instance.status == 'accepted':
        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f"friend_{instance.sender.id}",  
            {
                "type": "friend_status_update",
                "friend": UserSerializer(instance.reciever, fields=['id', 'picture', 'status']).data
            }
        )

        async_to_sync(channel_layer.group_send)(
            f"friend_{instance.reciever.id}",  
            {
                "type": "friend_status_update",
                "friend": UserSerializer(instance.sender, fields=['id', 'picture', 'status']).data
            }
        )
