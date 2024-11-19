from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User
from django.shortcuts import get_object_or_404
from django.utils import timezone

def fetch_users(request):
    if request.method == 'GET':
        users = User.objects.all()

        players = [
            {"id": user.id, "username": user.username} for user in users
        ]
        return JsonResponse(players, safe=False)
    else:
        return JsonResponse({"error": "Invalid HTTP method"}, status=400)
