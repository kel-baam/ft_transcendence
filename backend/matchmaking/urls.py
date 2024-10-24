from django.urls import path
from .views import index, csrf_token_view
from .local_tournament import local_tournament, validate_input

urlpatterns = [
    # path('', index, name='index'),
    path('api/csrf-token/', csrf_token_view, name='csrf-token'),
    path('api/validate-input/', validate_input, name='validate_input'),
    path('api/local-tournament/', local_tournament, name='local_tournament'),
]
