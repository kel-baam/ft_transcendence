from django.http import JsonResponse
from functools import wraps
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
from .models import User
import logging
import jwt


logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)



def refreshTokenRequired(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
            refeshToken = request.COOKIES.get("refresh_token","default") 
            try:
                payload = jwt.decode(refeshToken, settings.SECRET_KEY, algorithms=["HS256"])
                user = User.objects.filter(email=payload["email"]).first()
                if user:
                    if check_password(refeshToken, user.refresh_token):
                         request.user = user
                    else:
                        return JsonResponse({'error': 'Invalid or missing token'}, status=401)
            except Exception as e:
                return JsonResponse({'error': 'Invalid or missing token'}, status=401)
            return view_func(request, *args, **kwargs)
    return _wrapped_view
