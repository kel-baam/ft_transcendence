from django.http import JsonResponse
from functools import wraps
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
from .models import User
import jwt
from django.conf import settings
from asgiref.sync import sync_to_async
from channels.exceptions import DenyConnection

import json

def token_required(func):
    async def wrapper(self, *args, **kwargs):
        for header_name, header_value in self.scope["headers"]:
            if header_name == b'cookie':
                cookies_str = header_value.decode("utf-8")
                cookies = {}
                for cookie in cookies_str.split("; "):
                    key, value = cookie.split("=", 1)  
                    cookies[key] = value          
                try:
                    payload = jwt.decode(cookies.get("access_token").encode("utf-8"), settings.SECRET_KEY, algorithms=["HS256"])
                    self.access_token = cookies.get("access_token")
                    user = await sync_to_async(User.objects.filter(email=payload["email"]).first)()
                    if user:
                        self.user = user
                        self.scope['username']  = user
                        # self.scope['user_id']  = user

                        print("websoucke=>",self.user)
                        return await func(self, *args, **kwargs) 
                    else:
                        raise DenyConnection("user not exist")
                except Exception as e:
                        print("err")
                        self.access_token = "default"
                        return await func(self, *args, **kwargs) 
                        # await self.accept()
                        # await self.send(text_data=json.dumps({"error": "token expired"}))
                        # # raise DenyConnection("access token expired")

    return wrapper

def accessTokenRequired(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):            
            accessToken = request.COOKIES.get("access_token","default")
            try:
                # print(" decoration acc========> ",accessToken)
                payload = jwt.decode(accessToken, settings.SECRET_KEY, algorithms=["HS256"])
                user = User.objects.filter(email=payload["email"]).first()
                # print(user.enabled_twoFactor, payload["login_level"],user.email)
                if user and (not user.enabled_twoFactor or payload["login_level"] == 2 or request.path=="/authentication/twoFactor/verify/"
                             or request.path =="/authentication/twoFactor/activate/"):
                     request.user = user
                else:
                    return JsonResponse({'error': 'Invalid or missing token'}, status=401)
            except Exception as e:
                return JsonResponse({'error': 'Invalid or missing token'}, status=401)
            return view_func(request, *args, **kwargs)
    return _wrapped_view


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
