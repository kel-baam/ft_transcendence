# """
# ASGI config for project project.

# It exposes the ASGI callable as a module-level variable named ``application``.

# For more information on this file, see
# https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
# """

# import os
# from django.core.asgi import get_asgi_application
# from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
# import django



# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
# django.setup()

# from Profile import routing as notification_routing

# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),  # Handle traditional HTTP requests
#     "websocket": AuthMiddlewareStack(
#         URLRouter(
#             notification_routing.websocket_urlpatterns # Specify your WebSocket URL patterns
#         )
#     ),
# })


import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

# Ensure settings are loaded first
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")

# Set up Django
django.setup()

# Delay import to avoid circular imports

from Profile         import routing as Profile_routing 
# from matchmaking    import routing as matchmaking_routing

def get_application():

    return ProtocolTypeRouter({
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(
            URLRouter(
                Profile_routing.websocket_urlpatterns
            )
        ),
    })

# Assign the application to a variable
application = get_application()
