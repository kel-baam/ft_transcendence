from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import *  
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json
from .serializers import *


_previous_status = {}

@receiver(pre_save, sender=User)
def capture_previous_status(sender, instance, **kwargs):
    if instance.pk:
        old_status = User.objects.filter(pk=instance.pk).values_list('status', flat=True).first()
        _previous_status[instance.pk] = old_status


@receiver(post_save, sender=User)
def notify_friends_on_status_change(sender, instance, created, **kwargs):
    """
    Signal to notify friends when a user's status changes.
    """
    if not created:
        old_status = _previous_status.pop(instance.pk, None)
        if old_status != instance.status:
            channel_layer = get_channel_layer()
            friends = User.objects.filter(
                models.Q(sent_request__reciever=instance, sent_request__status="accepted") |
                models.Q(received_request__sender=instance, received_request__status="accepted")
            ).distinct()
            for friend in friends:
                friends_friend  = User.objects.filter(
                models.Q(sent_request__reciever=friend, sent_request__status="accepted") |
                models.Q(received_request__sender=friend, received_request__status="accepted"))
                async_to_sync(channel_layer.group_send)(
                    f"friend_{friend.id}", 
                    {
                        "type": "friend_status_update",
                        "friends": UserSerializer(friends_friend ,many=True,  fields=['id', 'picture', 'status']).data
                    }
            )

@receiver(post_save, sender=Request)
def notify_users_on_accept(sender, instance, created, **kwargs):
    if created:
        pass
    elif instance.status == 'accepted':
        channel_layer = get_channel_layer()

        friends_sender = User.objects.filter(
                models.Q(sent_request__reciever=instance.sender, sent_request__status="accepted") |
                models.Q(received_request__sender=instance.sender, received_request__status="accepted")
            ).distinct()
        async_to_sync(channel_layer.group_send)(
            f"friend_{instance.sender.id}",  
            {
                "type": "friend_status_update",
                "friends": UserSerializer(friends_sender,many=True, fields=['id', 'picture', 'status']).data
            }
        )
        friends_reciever = User.objects.filter(
                models.Q(sent_request__reciever=instance.reciever, sent_request__status="accepted") |
                models.Q(received_request__sender=instance.reciever, received_request__status="accepted")
            ).distinct()
        async_to_sync(channel_layer.group_send)(
            f"friend_{instance.reciever.id}",  
            {
                "type": "friend_status_update",
                "friends": UserSerializer(friends_reciever,many=True, fields=['id', 'picture', 'status']).data
            }
        )
    elif instance.status== 'blocked':
        channel_layer = get_channel_layer()
        friends_sender = User.objects.filter(
                models.Q(sent_request__reciever=instance.sender, sent_request__status="accepted") |
                models.Q(received_request__sender=instance.sender, received_request__status="accepted")
            ).distinct()
        async_to_sync(channel_layer.group_send)(
            f"friend_{instance.sender.id}",  
            {
                "type": "friend_status_update",
                "friends": UserSerializer(friends_sender,many=True, fields=['id', 'picture', 'status']).data
            }
        )
        friends_reciever = User.objects.filter(
                models.Q(sent_request__reciever=instance.reciever, sent_request__status="accepted") |
                models.Q(received_request__sender=instance.reciever, received_request__status="accepted")
            ).distinct()
        async_to_sync(channel_layer.group_send)(
            f"friend_{instance.reciever.id}",  
            {
                "type": "friend_status_update",
                "friends": UserSerializer(friends_reciever,many=True, fields=['id', 'picture', 'status']).data
            }
        )

