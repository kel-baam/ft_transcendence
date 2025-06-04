from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/tournament/online/", consumers.Tournaments.as_asgi()),
]
