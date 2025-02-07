import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import re_path  # Use re_path for regex-based dynamic URLs
from chat import consumers  # Replace with your actual app name

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatDjango.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([  #should be a dynamique path  
            re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),]) 
    ),
})
