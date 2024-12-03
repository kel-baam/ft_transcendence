
from django.http import JsonResponse
from django.shortcuts import redirect
from django.conf import settings
from decouple import config
from .models import User
from django.views.decorators.csrf import csrf_exempt
from .tokens import generateToken
from .oauthUtils import exchange_code_with_token,get_user_info
import requests
import logging


logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def set_tokens_in_cookies(user,response):
        token = generateToken(user,1)

        logging.debug("userrrtr=>",token)
        accessTokenLifeTime =int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
        refreshTokenLifeTime = int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())
        response.set_cookie('access_token',token.get('access'),httponly=True, max_age=accessTokenLifeTime)
        response.set_cookie('refresh_token',token.get('refresh'), max_age=refreshTokenLifeTime)  
        logging.debug("cookiess=>",response.cookies)   
        return response

def google_login(request):
       return redirect(config('GOOGLE_FULL_URI')) 


def storeGoogleData(data):
    response = redirect("http://localhost:3000/home")
    username = data.get('given_name')
    last_name = data.get('family_name')
    email = data.get('email')
    picture = data.get('picture')
    user = User(username=username,last_name=last_name,email=email)
    user.save()
    return response
 

def callback_google(request):
        code = request.GET.get('code','none')
        validateCode = exchange_code_with_token(code,config('GOOGLE_TOKEN_URL'),config('GOOGLE_CLIENT_ID'),config('GOOGLE_SECRET_KEY'),config('GOOGLE_REDIRECT_URI'))

        if validateCode["status_code"] == 200:
            user_info = get_user_info(validateCode['accessToken'],config('GOOGLE_API'))
            user = User.objects.filter(email=user_info.get("email")).first()
            if not user:
                storeGoogleData(user_info)
            if user.enabled_twoFactor:
                response = redirect("http://localhost:3000/twoFactor")
            else:
                response = redirect("http://localhost:3000/home")                     
            response = set_tokens_in_cookies(user,response)
            return response
        return JsonResponse({'message': 'error'}, status = 404)

def intra_login(request):
      return redirect(config('INTRA_FULL_URI'))

def storeIntraData(intraData):
        username = intraData.get('first_name')
        last_name=intraData.get('last_name')
        email= intraData.get('email')
        # picture = intraData.get('image').get('link')
        # print("IMAGE==>",picture)
        if intraData.get('phone')=='hidden':
                phone_number=""
        else:
                phone_number=  intraData.get('phone')
        user=User(username=username,
        last_name=last_name,email=email,phone_number=phone_number)
        user.save()
def intra_callback(request):
        code = request.GET.get('code', 'none')
        domain = config('DOMAIN')
        # logger.debug("This is a debug message",token)
        # check validation of code
        logger.debug("-------------------------------------------------------------------------------->")
        validateCode = exchange_code_with_token(code,config('TOKEN_URL'),config('CLIENT_ID'),config('SECRET_KEY'),config('REDIRECT_URI'))
        if validateCode['status_code'] == 200:
                user_info = get_user_info(validateCode['accessToken'],config('INTRA_API'))
                user = User.objects.filter(email=user_info.get("email")).first()

                if not user:
                        storeIntraData(user_info)
                if user.enabled_twoFactor:
                        response = redirect(f"{domain}/twoFactor")
                else:
                        logger.debug("loged",request.COOKIES.get('access_token','default'))
                        response = redirect(f"{domain}/#/2FA")

                if(request.COOKIES.get("access_token","default") == "default")  :         
                        response = set_tokens_in_cookies(user,response)
                return response
        return JsonResponse({'message': 'error'}, status = 404)



def token_require(request):
        # logger.debug("thiiiiis===>",request.COOKIES.get("access_token","default"))
        return JsonResponse({'valid': False, 'error': 'Invalid token'},status = 401)
