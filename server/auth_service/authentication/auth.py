from django.contrib.auth.tokens import default_token_generator
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
from .jwt import generateToken,generateAccessToken
from .oauthUtils import exchange_code_with_token,get_user_info
from urllib.parse import urlencode, urlparse, parse_qs, urlunparse
import urllib.parse
from django.core.cache import cache
import uuid
from django.core.mail import send_mail,EmailMessage
import smtplib
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core import signing
from rest_framework_simplejwt.tokens import RefreshToken
import requests
import logging
from .serializers import  UserSerializer 
import json
import random

from jwt import decode , ExpiredSignatureError, InvalidTokenError

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def set_tokens_in_cookies(request,email,response):
        try:
                domain = config('DOMAIN')
                user = User.objects.filter(email=email).first()
                payload = decode(request.COOKIES.get("access_token"), settings.SIMPLE_JWT['SIGNING_KEY'], algorithms=["HS256"])
                if(user.enabled_twoFactor and payload['login_level'] == 1):
                        response = redirect(f"{domain}/#/2FA")  
                if(email != payload.get("email")):
                        token = generateToken(user,1)
                        accessTokenLifeTime =int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
                        refreshTokenLifeTime = int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())
                        response.set_cookie('access_token',token.get('access'),httponly=True, max_age=accessTokenLifeTime)
                        response.set_cookie('refresh_token',token.get('refresh'), max_age=refreshTokenLifeTime)
                return response
        except (ExpiredSignatureError, InvalidTokenError):
                try:
                        payload = decode(request.COOKIES.get("refresh_token"), settings.SIMPLE_JWT['SIGNING_KEY'], algorithms=["HS256"])
                        if(email!= payload.get("email")):
                                raise InvalidTokenError("Custom error message")
                        if(user.enabled_twoFactor and payload['login_level'] == 1):
                                response = redirect(f"{domain}/#/2FA")
                        newAccessToken = generateAccessToken(user,payload["login_level"])
                        accessTokenLifeTime =int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
                        response.set_cookie('access_token',newAccessToken,httponly=True, max_age=accessTokenLifeTime)
                        return response
                except (ExpiredSignatureError, InvalidTokenError) as e:
                        if(user.enabled_twoFactor):
                                response = redirect(f"{domain}/#/2FA")
                        token = generateToken(user,1)
                        accessTokenLifeTime =int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
                        refreshTokenLifeTime = int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())
                        response.set_cookie('access_token',token.get('access'),httponly=True, max_age=accessTokenLifeTime)
                        response.set_cookie('refresh_token',token.get('refresh'), max_age=refreshTokenLifeTime)
                        return response
        
# ----------------------------------------------------------------------------------------google login and register-----------------------------------
def google_login(request):
        query_type =  request.GET.get('type')
        redirect_url = config('GOOGLE_FULL_URI')
        full_path = f"{redirect_url}&state={query_type}"
        return redirect(full_path) 


def storeGoogleData(data):
        try:
                domain = config('DOMAIN')

                login = data.get('given_name')
                user = User.objects.filter(username=login).first()
                while(user) :
                        login = f"{data.get('given_name')}{random.randint(0, 9000)}"
                        user = User.objects.filter(username=login).first()
                data = {
                        'username' : login,
                        'last_name' : data.get('family_name'),
                        'first_name' : data.get('given_name'),
                        'email' :       data.get('email'),
                        'phone_number': '',
                        'password': '4475588@kdjndxxxxjfjjdfnbhf',
                        'player' : {
                                'Rank' : '0',
                                'level':'0',
                                'score':'0',
                        },
                }
                response = requests.post('http://user-service:8001/api/user', json=data)
                if response.status_code == 200:
                        return redirect(f"{domain}/#/home") 
                else:
                        return redirect(f"{domain}/#/login") 
        except requests.RequestException as e:
                return redirect(f"{domain}/#/login") 


def handle_google_state(state, user, user_info):

    domain = config('DOMAIN')
    if state == 'login':
        if not user:
            return redirect(f"{domain}/#/register")
    elif state == 'register':
        if user:
            return redirect(f"{domain}/#/login")
    if not user:
        return storeGoogleData(user_info)
    return redirect(f"{domain}/#/home")


def callback_google(request):
        code = request.GET.get('code','none')
        state = request.GET.get('state', None)
        domain = config('DOMAIN')

        if code :
                validateCode = exchange_code_with_token(code,config('GOOGLE_TOKEN_URL'),config('GOOGLE_CLIENT_ID'),config('GOOGLE_SECRET_KEY'),config('GOOGLE_REDIRECT_URI'))
                if validateCode["status_code"] == 200:
                        user_info = get_user_info(validateCode['accessToken'],config('GOOGLE_API'))
                        user = User.objects.filter(email=user_info.get("email")).first()
                        response = handle_google_state(state,user,user_info)
                        if((state == 'login' and user) or (state == 'register' and not user)) :                    
                                response = set_tokens_in_cookies(user_info.get("email"),response)
                        return response
        return JsonResponse({'message': 'error'}, status = 404)

#---------------------------------------------------------------------------- login with intra-------------------------------------------
def intra_login(request):
        query_type =  request.GET.get('type')
        redirect_url = config('INTRA_FULL_URI')
        full_path = f"{redirect_url}&state={query_type}"

        return redirect(full_path)


def storeIntraData(intraData):
        try:
                domain = config('DOMAIN')
                if intraData.get('phone')=='hidden':
                        phone_number=""
                else:
                        phone_number =  intraData.get('phone')
                login = intraData.get('login')
                user = User.objects.filter(username=login).first()
                while(user) :
                        login = f"{intraData.get('login')}{random.randint(0, 9000)}"
                        user = User.objects.filter(username=login).first()
                 
                data = {
                       
                        'username' : login,
                        'last_name' :intraData.get('last_name'),
                        'first_name' : intraData.get('first_name'),
                        'email' :intraData.get('email'),
                        'phone_number': phone_number,
                        'password': '4475588@kdjndjfjjdfnbhf',
                        'player' : {
                                'Rank' : '0',
                                'level':'0',
                                'score':'0',
                        },
                        # 'picture':intraData.get('image').get('link')
                }
                response = requests.post('http://user-service:8001/api/user', json=data)
                if response.status_code == 200:
                        return redirect(f"{domain}/#/home?type=register") 
                else:
                        return redirect(f"{domain}/#/login") 
        except requests.RequestException as e:
                return redirect(f"{domain}/#/login") 



def handle_state(state, user, user_info):
    domain = config('DOMAIN')
    if state == 'login':
        if not user:
            return redirect(f"{domain}/#/register")    
    elif state == 'register':
        if user:
            return redirect(f"{domain}/#/login")
    if not user:
        return storeIntraData(user_info)
    return redirect(f"{domain}/#/home")


def intra_callback(request):
        code = request.GET.get('code')
        state = request.GET.get('state', None)
        domain = config('DOMAIN')

        if code :
                validateCode = exchange_code_with_token(code,config('TOKEN_URL'),config('CLIENT_ID'),config('SECRET_KEY'),config('REDIRECT_URI'))
                if validateCode['status_code'] == 200:
                        user_info = get_user_info(validateCode['accessToken'],config('INTRA_API'))
                        # TODO i should here check user_info status code later
                        user = User.objects.filter(email=user_info.get("email")).first()
                        response = handle_state(state,user,user_info)
                        #  TODO maybe before setting coookie i should check access id is exist if note set it if yes decode it if i snot valid set new one
                        
                        if((state == 'login' and user) or (state == 'register' and not user))  :         
                                response = set_tokens_in_cookies(request,user_info.get("email"),response)
                        return response
        return JsonResponse({'message': 'error'}, status = 404)


# -----------------------------------------------------------login form ------------------------------------------------------
# i guess this done for now
@csrf_exempt
@api_view(['POST'])                 
def login(request):
        username = request.data.get('username')
        password = request.data.get('password')
        domain = config('DOMAIN')
        user = User.objects.filter(username=username).first()
        if not user:
                return Response({'username':'invalid username','password':'invalid password'}, status=status.HTTP_400_BAD_REQUEST)
        if not check_password(password,user.password):
                return Response({'password':'invalid password'}, status=status.HTTP_400_BAD_REQUEST)
        response = Response({'message': 'user successfully loged'},status=status.HTTP_200_OK)      
        if(((state == 'login' and user) or (state == 'register' and not user)))  :         
                        response = set_tokens_in_cookies(user.email,response)
        return response
       

def generate_verification_token(username):
    payload = {
        'username': username,
    }
    token = signing.dumps(payload)
    return token

@csrf_exempt
@api_view(['POST'])                 
def  registerForm(request):
        try:
                domain = config('DOMAIN')
                first_name = request.POST.get('firstname')
                last_name = request.POST.get('lastname')
                username = request.POST.get('username')
                email = request.POST.get('email')
                password = request.POST.get('password')
                token = generate_verification_token(username)
                data ={
                        'first_name':first_name,
                        'last_name':last_name,
                        'username': username,
                        'email': email,
                        'password': password,
                        'verify_token':token,
                        'player' : {
                               'score':'0',
                               'Rank' : '0',
                               'level' : '0'
                        }
                }
                response = requests.post('http://user-service:8001/api/user',json=data)
                # logger.debug('>>>>>>>>>>>>>> response from souad : %s', response)
                if(response.status_code == 200):
                        uid = urlsafe_base64_encode(username.encode())
                        verification_link = f'http://localhost:3000/auth/verify/{uid}/{token}/'
                        email_subject = 'Please verify your email address'
                        email_body = f'Hello {first_name},\n\nPlease click the link below to verify your email address:\n\n{verification_link}'
                        send_mail(
                        email_subject,
                        email_body,
                        settings.EMAIL_HOST_USER,
                        [email],
                        )
                        return Response(status=status.HTTP_200_OK)                
                return Response(response.json(),status=response.status_code)
        except Exception as e:
                return Response( str(e),  status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@csrf_exempt
@api_view(['POST'])                 
def logout(request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            token = RefreshToken(refresh_token)
            response = Response(status=status.HTTP_205_RESET_CONTENT)
            response.delete_cookie('refresh_token')
            response.delete_cookie('access_token')
            return response
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])                 
def verify_email(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.filter(username=uid).first()
        if(user):
                if(user.verify_token == token):
                        user.is_verify = True
                        user.verify_token = "None"
                        user.save()
                        response = redirect("http://localhost:3000/#/home")
                        return  set_tokens_in_cookies(request,user.email,response)
        return redirect("http://localhost:3000/#/login")
    except Exception as e:
                return redirect("http://localhost:3000/#/login")



@api_view(['POST'])                 
def password_reset_request(request):
        email = request.POST.get('email')
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({'email':"invalid email"},status=status.HTTP_400_BAD_REQUEST)
        
        # token = default_token_generator.make_token(user.username)
        token = generate_verification_token(user.username)
        uid = urlsafe_base64_encode(str(user.username).encode())
        user.verify_token =token
        user.save()
        verification_link = f'http://localhost:3000/#/password/reset?type=change&uid={uid}&token={token}'
        email_body = f'Hi {user.first_name},\nWe received a request to reset the password for your account. If you didn’t make this request, you can safely ignore this email.\nTo reset your password, please click the link below:\n\n{verification_link}'
        email_subject = 'Reset Your Password'
        send_mail(
                email_subject,
                email_body,
                settings.EMAIL_HOST_USER,
                [email],
        )
        return Response(status=status.HTTP_200_OK)


@csrf_exempt
@api_view(['POST'])     
def password_reset_confirm(request):
        try:
                data = json.loads(request.body)
                uid = urlsafe_base64_decode(data.get('uid')).decode()
                user = User.objects.filter(username=uid).first()
                token = data.get('token')
                newPassword = data.get('newPassword')
                confirmPassword = data.get('confirmPassword')
               
                if(user):
                        if  token == user.verify_token:
                                if newPassword == confirmPassword:
                                        user.password =  make_password(str(newPassword))
                                        user.verify_token = "None"
                                        # delete cookies for make person logout
                                        user.save()
                                        return Response({'password':"user added succssefylly"},status=200)
                        return Response({'email':"invalid email"},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response( str(e),  status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
   
