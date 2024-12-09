from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/local/", consumers.CreatedTournaments.as_asgi()),
]
