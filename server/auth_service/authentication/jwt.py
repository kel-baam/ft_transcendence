from django.http import JsonResponse
from django.conf import settings
from decouple import config
from .models import User
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from datetime import datetime
from django.contrib.auth.hashers import make_password
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
from jwt import decode , ExpiredSignatureError, InvalidTokenError
from rest_framework.decorators   import api_view
import jwt

def generateAccessToken(user,level):
        access = AccessToken.for_user(user)
        access['user_id'] = user.id
        access['username'] = user.username
        access['email'] = user.email
        access['login_level'] = level
        return access

def generateToken(user,level):
        try:
                refresh = RefreshToken.for_user(user)
                refresh['email'] = user.email
                refresh['login_level'] = level

                access = generateAccessToken(user,level)
                return ({"access":access,
                        "refresh":refresh})
        except Exception as e:
                return JsonResponse({'message': 'Invalid token'},status = 400)

@api_view(['GET'])                 
def token_required(request):
        try:              
                access_token = request.COOKIES.get("access_token","default")
                payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
                user = (User.objects.filter(email=payload["email"]).first)()
                if user:

                        if (user.enabled_twoFactor  and payload.get('login_level') == 1 and request.query_params.get('2fa') == "false"):
                                return JsonResponse({'message': 'Invalid user'},status = 401)
                        response = JsonResponse({'message':'valid token'})
                        if (user.enabled_twoFactor  and payload.get('login_level') == 2 and request.query_params.get('2fa') == "true"):
                                response=JsonResponse({'message': 'valid','redirect':'home'},status = 200)
                        response['X-Authenticated-User'] = payload['username']
                        request.user = payload['username']
                        return response
                
                return JsonResponse({'message': 'Invalid user'},status = 401)
        except Exception as e:
                return JsonResponse({'message': 'token expired'},status = 401)



def generate_new_token(request):
    try:
        refreshToken = request.COOKIES.get("refresh_token")
        payload = jwt.decode(refreshToken, settings.SECRET_KEY, algorithms=["HS256"])

        
        user = User.objects.filter(email=payload["email"]).first()

        if (user.enabled_twoFactor and payload['login_level'] == 1):
                return JsonResponse({'message': '2fa required'},status = 401)
        accessToken = generateAccessToken(user,payload['login_level'])
        response = JsonResponse({'message':"valid access token"},status =200)
        accessTokenLifeTime =int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
        response.set_cookie("access_token",accessToken,httponly=True, max_age=accessTokenLifeTime)
        return response
    except Exception as e:
                return JsonResponse({'message': 'token expired'},status = 401)




