
from django.urls import path
from . import consumers

# WebSocket URL patterns
websocket_urlpatterns = [
    path("ws/some_path/", consumers.MyConsumer.as_asgi()),  # The consumer must be called with `.as_asgi()`
]
