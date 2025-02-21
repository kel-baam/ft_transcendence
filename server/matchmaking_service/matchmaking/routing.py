from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/matchmaking/", consumers.Matchmaking.as_asgi()),
]
