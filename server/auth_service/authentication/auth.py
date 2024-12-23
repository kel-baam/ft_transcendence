
from django.contrib.auth.hashers import make_password, check_password
from django.http import JsonResponse
from django.shortcuts import redirect
from django.conf import settings
from decouple import config
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators   import api_view
from django.utils.decorators import method_decorator
from rest_framework import status
from django.core.exceptions import ValidationError
from rest_framework import serializers
from .models import User
from .decorators import refreshTokenRequired
from django.views.decorators.csrf import csrf_exempt
from .jwt import generateToken
from .oauthUtils import exchange_code_with_token,get_user_info
import requests
import logging
import jwt
from urllib.parse import urlencode, urlparse, parse_qs, urlunparse
import urllib.parse



logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def set_tokens_in_cookies(user,response):

        token = generateToken(user,1)
        accessTokenLifeTime =int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
        refreshTokenLifeTime = int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())
        response.set_cookie('access_token',token.get('access'),httponly=True, max_age=accessTokenLifeTime)
        response.set_cookie('refresh_token',token.get('refresh'), max_age=refreshTokenLifeTime)  
        return response

def google_login(request):
       return redirect(config('GOOGLE_FULL_URI')) 


def storeGoogleData(data):
#     logger.debug("gooogle=>",data)
    username = data.get('given_name')
    last_name = data.get('family_name')
    email = data.get('email')
#     pic  = data.get('image').get('link')

    user = User(username=username,last_name=last_name,email=email)
    user.save()
 

def callback_google(request):
        code = request.GET.get('code','none')
        domain = config('DOMAIN')
        if code :
                validateCode = exchange_code_with_token(code,config('GOOGLE_TOKEN_URL'),config('GOOGLE_CLIENT_ID'),config('GOOGLE_SECRET_KEY'),config('GOOGLE_REDIRECT_URI'))
                if validateCode["status_code"] == 200:
                        user_info = get_user_info(validateCode['accessToken'],config('GOOGLE_API'))
                        user = User.objects.filter(email=user_info.get("email")).first()
                        if not user:
                                storeGoogleData(user_info)
                        # if user.enabled_twoFactor:
                        #         response = redirect("http://localhost:3000/twoFactor")
                        else:
                                response = redirect("http://localhost:3000/home")
                        if(request.COOKIES.get("access_token","default") == "default") :                    
                                response = set_tokens_in_cookies(user,response)
                        return response
        return JsonResponse({'message': 'error'}, status = 404)

def intra_login(request):
        query_type =  request.GET.get('type')
        redirect_url = config('INTRA_FULL_URI')
        full_path = f"{redirect_url}&state={query_type}"

        return redirect(full_path)


def storeIntraData(intraData):
        logger.debug("+++++++++++++++++++++++++++++++++i mstorind data")
        if intraData.get('phone')=='hidden':
                phone_number=""
        else:
                phone_number =  intraData.get('phone')
        data = {
        'username' : intraData.get('first_name'),
        'last_name' :intraData.get('last_name'),
        'first_name' : intraData.get('first_name'),
        'email' :intraData.get('email'),
        'phone_number': phone_number,

}
        # response = requests.post('http://user-service:8001/api/user',data=data)
        # logger.debug("respo=>0",response.json())
        try:
                response = requests.post('http://user-service:8001/api/user', json=data)

                # Check the response status code
                if response.status_code == 200:
                        logger.debug("User added successfully: %s", response.json())
                elif response.status_code == 400:
                        logger.debug("Validation error: %s", response.json())
                else:
                        logger.debug("Unexpected error: %s", response.text)

                return response.json()  # Optionally return the response
        except requests.RequestException as e:
                logger.error("Request failed: %s", str(e))
                return {"error": "Request to user-service failed."}
        # pic  = intraData.get('image').get('link')
        # user=User(username=username,
        # last_name=last_name,email=email,phone_number=phone_number,first_name=first_name,password=password)
        # user.save()


def intra_callback(request):
      
        logger.debug("Headers:", request.GET.get('state', None))
        code = request.GET.get('code')
        state = request.GET.get('state', None)
        domain = config('DOMAIN')
        
        if code :
                validateCode = exchange_code_with_token(code,config('TOKEN_URL'),config('CLIENT_ID'),config('SECRET_KEY'),config('REDIRECT_URI'))
                if validateCode['status_code'] == 200:
                        user_info = get_user_info(validateCode['accessToken'],config('INTRA_API'))
                        logger.debug("Headers----:---------------------------------")

                        user = User.objects.filter(email=user_info.get("email")).first()
                        logger.debug(">>>>>>>>>>>>>>>>>> here user : ", user)
                        if state == 'login' and not user:
                                return redirect(f"{domain}/#/register")
                        if state =='register' and user:
                                return redirect(f"{domain}/#/login")
                        if not user:
                                storeIntraData(user_info)
                                response = redirect(f"{domain}/#/form")
                        # if user.enabled_twoFactor:
                        #         response = redirect(f"{domain}/twoFactor")
                        else:
                                response = redirect(f"{domain}/#/home")

                        # if(request.COOKIES.get("access_token","default") == "default")  :         
                        #         response = set_tokens_in_cookies(user,response)
                        return response
        return JsonResponse({'message': 'error'}, status = 404)






@csrf_exempt
@api_view(['POST'])                 
def login(request):

        # logger.debug("ucvlckbks")
        username = request.data.get('username')
        password = request.data.get('password')
        domain = config('DOMAIN')
        # data = {
        # }
        # response = requests.get("",data=data)
        # if(response.status_code == 200):
        #         data = response.json()
        #         if check_password(password,data.password):
        #         # set cookies jwt
                #   return Response({'message': 'loged successfully'})
        #         return redirect(f"{domain}/#/home")
        # return Response({'error': 'invalid username or password'},status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'invalid username or password'})



@csrf_exempt
@api_view(['POST'])                 
def  registerForm(request):
       
        # password = "123456789"
        first_name = request.POST.get('firstname')
        last_name = request.POST.get('lastname')
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        domain = config('DOMAIN')
        data = {
                'first_name':first_name,
                'last_name':last_name,
                'username': username,
                'email':email,
                'password':password
        }
        try:
                response = requests.post('http://user-service:8001/api/user', json=data)

                # Check the response status code
                if response.status_code == 200:
                        logger.debug("User added successfully: %s", response.json())
                        return Response(response.json(),status=200)
                elif response.status_code == 400:
                        logger.debug("Validation error: %s", response.json())
                        return Response(response.json(),status=400)

                else:
                        logger.debug("Unexpected error: %s", response.text)
                        # return Response(response.json(),status=200)
               
        except requests.RequestException as e:
                logger.error("Request failed: %s", str(e))
        # pic  = intraData.get('image').get('link')
        # response = requests.post("",data=data)
        # if(response.status_code == 200):
        #         data = response.json()
        #         if check_password(password,data.password):
        #         # set cookies jwt
                # return redirect(f"{domain}/#/home")

        return JsonResponse({'error': 'invalid info'}, status=404)

from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status


class LogoutView(APIView):
#     permission_classes = (IsAuthenticated,)
    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            token = RefreshToken(refresh_token)
            response = Response(status=status.HTTP_205_RESET_CONTENT)
            response.delete_cookie('refresh_token')
            response.delete_cookie('access_token')
            return response
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)