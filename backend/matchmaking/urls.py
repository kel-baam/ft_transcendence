from django.urls import path
from .views import index, csrf_token_view
from .local_tournament import local_tournament
from .tournament_queries import players_by_match_id

urlpatterns = [
    # path('', index, name='index'),
    path('api/csrf-token/', csrf_token_view, name='csrf-token'),
    path('api/local-tournament/', local_tournament, name='local_tournament'),
    path('api/players-by-match-id/', players_by_match_id, name='players_by_match_id'),
]
