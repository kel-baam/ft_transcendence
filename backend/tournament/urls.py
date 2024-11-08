from django.urls import path
from .views import csrf_token_view
from .local_tournament import local_tournament

urlpatterns = [
    path('api/csrf-token/', csrf_token_view, name='csrf-token'),
    path('api/local-tournament/', local_tournament, name='local_tournament'),
]

