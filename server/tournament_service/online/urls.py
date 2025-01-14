from django.urls        import path
from .views             import friends_list, TournamentAPIView, isTournamentReady

urlpatterns = [
    path('tournaments/friends-list', friends_list, name='friends-list'),
    path('tournaments/<int:tournament_id>/', isTournamentReady, name='isTournamentReady'),
    path('tournaments/', TournamentAPIView.as_view(), name='TournamentAPIView'),
]

