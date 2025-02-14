from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/notification/", consumers.Notification.as_asgi()),
]


# websocket_urlpatterns = [
#     # path('requests/', RequestUpdateConsumer.as_asgi()),
#     path('ws/test', TestConsumer.as_asgi())

# ]

