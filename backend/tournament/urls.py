from django.urls import path
from .views import csrf_token_view
from .local import local

urlpatterns = [
    path('api/csrf-token/', csrf_token_view, name='csrf-token'),

    # path('api/local-tournament/', local_tournament, name='local_tournament'),

    # path('api/online-tournament/', online_tournament, name='online_tournament'),
    # path('api/fetch_users/', fetch_users, name='fetch_users'),
    # path('api/player_form/', player_form, name='player_form'),
    # path('api/tournaments/leave/', leave_or_delete_tournament, name='leave_or_delete_tournament'),


    path('api/local/', local, name = 'local'),
    path('api/online/'),
]

