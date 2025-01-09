from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import PlayerTournament

@receiver([post_save, post_delete], sender = PlayerTournament)
def tournament_saved(sender, instance, created=None, **kwargs):
    
    channel_layer   = get_channel_layer()
    group_name      = "all_tournaments_group"

    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "send_updated_tournaments_from_signal",
        }
    )
