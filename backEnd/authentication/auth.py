
from django.http import JsonResponse
from django.shortcuts import redirect
from django.conf import settings
from decouple import config
from .models import User
from django.views.decorators.csrf import csrf_exempt
from .tokens import generateToken
from .oauthUtils import exchange_code_with_token,get_user_info




def set_tokens_in_cookies(user,response):
        print("here")
        token = generateToken(user,1)

        accessTokenLifeTime =int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
        refreshTokenLifeTime = int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())
        print("stoore them")
        response.set_cookie('access_token',token.get('access'),httponly=True, max_age=accessTokenLifeTime)
        response.set_cookie('refresh_token',token.get('refresh'), max_age=refreshTokenLifeTime)     
        return response



def google_login(request):
       return redirect(config('GOOGLE_FULL_URI')) 


def storeGoogleData(data):
    response = redirect("https://legendary-bassoon-jpvw6597q7jcq7rp-80.app.github.dev/home")
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
                response = redirect("https://legendary-bassoon-jpvw6597q7jcq7rp-80.app.github.dev/twoFactor")
            else:
                response = redirect("https://legendary-bassoon-jpvw6597q7jcq7rp-80.app.github.dev/home")                     
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
        if intraData.get('phone')=='hidden':
                phone_number=""
        else:
                phone_number=  intraData.get('phone')
        user=User(username=username,
        last_name=last_name,email=email,phone_number=phone_number)
        user.save()

def intra_callback(request):
        print("callbacl")
        code = request.GET.get('code', 'none')
        print("code=>",code)
        domain = config('DOMAIN')

        # check validation of code 
        validateCode = exchange_code_with_token(code,config('TOKEN_URL'),config('CLIENT_ID'),config('SECRET_KEY'),config('REDIRECT_URI'))
        if validateCode['status_code'] == 200:
                user_info = get_user_info(validateCode['accessToken'],config('INTRA_API'))
                user = User.objects.filter(email=user_info.get("email")).first()
                if not user:
                        storeIntraData(user_info)
                if user.enabled_twoFactor:
                        print("redirect",user.enabled_twoFactor)
                        response = redirect(f"{domain}/twoFactor")
                else:
                        response = redirect(f"{domain}/home")
                if(request.COOKIES.get("access_token","default") == "default")   :              
                        response = set_tokens_in_cookies(user,response)
                return response
        return JsonResponse({'message': 'error'}, status = 404)
