from django.urls import path
from . import views
from .consumers import *

urlpatterns = [
    path('users/<str:username>', view=views.profileView),
]

websocket_urlpatterns =[
    path('requests/', RequestUpdateConsumer.as_asgi()),
]

