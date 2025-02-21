from django.urls        import path
from .views             import friends_list, TournamentAPIView, check_tournament_existence

urlpatterns = [
    path('tournaments/friends-list', friends_list, name='friends-list'),
    path('tournaments/tournament-existence/<int:id>/', check_tournament_existence, name='tournament_existence'),
    # path('tournaments/<int:tournament_id>/', isTournamentReady, name='isTournamentReady'),
    path('tournaments/', TournamentAPIView.as_view(), name='TournamentAPIView'),
]

