from django.shortcuts import render
from django.http import HttpResponse
from .models import User
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token

def index(request):
    data = [
        User(username='niboukha', first_name='nisrin', last_name='boukhari'),
        User(username='shicham', first_name='souad', last_name='hicham'),
        User(username='kel-baam', first_name='kaoutar', last_name='elbm'),
        User(username='karima', first_name='karima', last_name='jarmoumi'),
    ]
    User.objects.bulk_create(data)
    return HttpResponse("Hello")

# from django.http import JsonResponse

def csrf_token_view(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})
