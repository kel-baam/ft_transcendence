# # """
# # ASGI config for auth project.

# # It exposes the ASGI callable as a module-level variable named ``application``.

# # For more information on this file, see
# # https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
# # """



import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from authentication.routing import websocket_urlpatterns

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "auth.settings")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})

