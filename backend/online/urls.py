from django.urls        import path
from .views             import csrf_token_view, friends_list, TournamentAPIView, isTournamentReady

urlpatterns = [
    path('api/csrf-token/', csrf_token_view, name='csrf_token_view'),
    path('api/tournaments/friends-list', friends_list, name='friends-list'),
    path('api/tournaments/<int:tournament_id>/', isTournamentReady, name='isTournamentReady'),
    path('api/tournaments/', TournamentAPIView.as_view(), name='TournamentAPIView'),

    # path('api/tournaments/', create_tournament, name = 'create_tournament'),
    # path('api/tournaments/<int:id>/', delete_tournament, name = 'delete_tournament'),
    # path('api/tournaments/player_form/', player_form, name = 'player_form'),
    # path('api/tournaments/<int:id>/', TournamentView.as_view(), name = 'TournamentView'),


]

