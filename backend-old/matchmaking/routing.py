from django.urls import path
from . import matchmaking

websocket_urlpatterns = [
    path('ws/matchmaking/', matchmaking.MatchmakingConsumer.as_asgi()),
]
