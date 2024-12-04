from django.urls import path
from .views import csrf_token_view
from .local_tournament import local_tournament
from .online_tournament import online_tournament
from .leave_or_delete_tournament import leave_or_delete_tournament
from .player_form import player_form
from .fetch_users import fetch_users

urlpatterns = [
    path('api/csrf-token/', csrf_token_view, name='csrf-token'),
    path('api/local-tournament/', local_tournament, name='local_tournament'),

    path('api/online-tournament/', online_tournament, name='online_tournament'),
    path('api/fetch_users/', fetch_users, name='fetch_users'),
    path('api/player_form/', player_form, name='player_form'),
    path('api/tournaments/leave/', leave_or_delete_tournament, name='leave_or_delete_tournament'),
]

