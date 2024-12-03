
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from .models import User 
from django.http import JsonResponse
from datetime import datetime
from django.conf import settings
from .decorators import refreshTokenRequired
import jwt
 
from django.conf import settings
from django.contrib.auth.hashers import make_password



def generateAccessToken(user,level):
        access = AccessToken.for_user(user)
        access['user_id'] = user.id
        access['username'] = user.username
        access['email'] = user.email
        access['login_level'] = level
        return access

def generateToken(user,level):
        refresh = RefreshToken.for_user(user)
        refresh['email'] = user.email
        refresh['login_level'] = level
        user.refresh_token = make_password(str(refresh))
        user.save()
        access = generateAccessToken(user,level)
        return ({"access":access,
                 "refresh":refresh})

@refreshTokenRequired
def generate_new_token(request):
    print("generate neew access token")
    payload = jwt.decode(request.COOKIES.get("refresh_token").encode("utf-8"), settings.SECRET_KEY, algorithms=["HS256"])
#     should find another solution
    if(request.user.enabled_twoFactor and payload['login_level'] == 1):
        return JsonResponse({'message':"valid access token"},status =401)
    accessToken = generateAccessToken(request.user,payload['login_level'])

    response = JsonResponse({'message':"valid access token"},status =200)
    accessTokenLifeTime =int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
    response.set_cookie("access_token",accessToken,httponly=True, max_age=accessTokenLifeTime)
    return response

