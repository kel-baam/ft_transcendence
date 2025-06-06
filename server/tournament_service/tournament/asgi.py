import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

# Ensure settings are loaded first
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tournament.settings")

# Set up Django
django.setup()

# Delay import to avoid circular imports

from online         import routing as online_routing 
# from matchmaking    import routing as matchmaking_routing

def get_application():

    return ProtocolTypeRouter({
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(
            URLRouter(
                online_routing.websocket_urlpatterns
            )
        ),
    })

# Assign the application to a variable
application = get_application()
