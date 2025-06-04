from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/notification/", consumers.Notification.as_asgi()),
    path("ws/friends-status/", consumers.OnlineFriends.as_asgi()),
]

