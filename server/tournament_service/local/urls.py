from django.urls        import path
from .views             import TournamentAPIView

urlpatterns = [
    path('tournaments/', TournamentAPIView.as_view(), name='TournamentAPIView'),
]

