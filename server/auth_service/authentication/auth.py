from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.hashers import make_password, check_password
from django.http import JsonResponse
from django.shortcuts import redirect
from django.conf import settings
# from decouple import os.getenv
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
import os







from jwt import decode , ExpiredSignatureError, InvalidTokenError

# logging.basicos.getenv(level=logging.DEBUG)
# logger = logging.getLogger(__name__)


def set_tokens_in_cookies_with_OAuth(request,email,response):
        try:
                # domain = os.getenv('DOMAIN')
                domain = os.getenv('DOMAIN')

                user = User.objects.filter(email=email).first()
                resp = requests.put('http://user-service:8001/api/user', json={
                   "status": True
                },
                headers={
                       "X-Authenticated-User":user.username
                }
                )
                print(">>>>>>>>>>>>>>>>>>> response form souad is ", resp)
                # user.status = True
                # user.save(update_fields=['status'])#to change
                payload = decode(request.COOKIES.get("access_token"), settings.SIMPLE_JWT['SIGNING_KEY'], algorithms=["HS256"])
                if(user.enabled_twoFactor and payload['login_level'] == 1):
                        response = redirect(f"{domain}/#/2FA")

                if(email != payload.get("email") or user.username != payload.get("username")):
                        token = generateToken(user,1)
                        accessTokenLifeTime =int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
                        refreshTokenLifeTime = int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())
                        response.set_cookie('access_token',token.get('access'),httponly=True, max_age=accessTokenLifeTime)
                        response.set_cookie('refresh_token',token.get('refresh'), max_age=refreshTokenLifeTime)
                
                return response
        except (ExpiredSignatureError, InvalidTokenError):
                try:
                        payload = decode(request.COOKIES.get("refresh_token"), settings.SIMPLE_JWT['SIGNING_KEY'], algorithms=["HS256"])
                        if(email!= payload.get("email") or user.username != payload.get("username")):
                                raise InvalidTokenError("Custom error message")
                        if(user.enabled_twoFactor and payload['login_level'] == 1):
                                response = redirect(f"{domain}/#/2FA")
                        newAccessToken = generateAccessToken(user,payload["login_level"])
                        accessTokenLifeTime =int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
                        response.set_cookie('access_token',newAccessToken,httponly=True, max_age=accessTokenLifeTime)
                        return response
                except (ExpiredSignatureError, InvalidTokenError) as e:

                        if hasattr(user, 'enabled_twoFactor') and user.enabled_twoFactor:
                                response = redirect(f"{domain}/#/2FA")
                        token = generateToken(user,1)
                        accessTokenLifeTime =int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
                        refreshTokenLifeTime = int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())
                        response.set_cookie('access_token',token.get('access'),httponly=True, max_age=accessTokenLifeTime)
                        response.set_cookie('refresh_token',token.get('refresh'), max_age=refreshTokenLifeTime)
                        return response

# TO CHANGE

def set_tokens_in_login(request,email,response):
        try:
                user = User.objects.filter(email=email).first()
                resp = requests.put('http://user-service:8001/api/user', json={
                   "status": True
                }, headers={
                       "X-Authenticated-User":user.username
                })
                print(">>>>>>>>>>>>>>>>>>> response form souad is ", resp)
                # user.status = True
                # user.save()
                payload = decode(request.COOKIES.get("access_token"), settings.SIMPLE_JWT['SIGNING_KEY'], algorithms=["HS256"])


                if(user.enabled_twoFactor and payload['login_level'] == 1):
                        response = JsonResponse({'message': "2fa active"}, status=200)

                if(email != payload.get("email") or user.username != payload.get("username")):
                        token = generateToken(user,1)
                        accessTokenLifeTime =int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
                        refreshTokenLifeTime = int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())
                        response.set_cookie('access_token',token.get('access'),httponly=True, max_age=accessTokenLifeTime)
                        response.set_cookie('refresh_token',token.get('refresh'), max_age=refreshTokenLifeTime)
                return response
        except (ExpiredSignatureError, InvalidTokenError):
                try:
                        payload = decode(request.COOKIES.get("refresh_token"), settings.SIMPLE_JWT['SIGNING_KEY'], algorithms=["HS256"])
                        if(email!= payload.get("email")  or user.username != payload.get("username")):
                                raise InvalidTokenError("Custom error message")
                        if(user.enabled_twoFactor and payload['login_level'] == 1):
                                response = JsonResponse({'message': "2fa active"}, status=200)
                        newAccessToken = generateAccessToken(user,payload["login_level"])
                        accessTokenLifeTime =int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
                        response.set_cookie('access_token',newAccessToken,httponly=True, max_age=accessTokenLifeTime)
                        return response
                except (ExpiredSignatureError, InvalidTokenError) as e:
                        if(user.enabled_twoFactor):
                                response = JsonResponse({'message': "2fa active"}, status=200)
                        token = generateToken(user,1)
                        accessTokenLifeTime =int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
                        refreshTokenLifeTime = int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())
                        response.set_cookie('access_token',token.get('access'),httponly=True, max_age=accessTokenLifeTime)
                        response.set_cookie('refresh_token',token.get('refresh'), max_age=refreshTokenLifeTime)
                        return response
        
        
# ----------------------------------------------------------------------------------------google login and register-----------------------------------
def google_login(request):
        query_type =  request.GET.get('type')
        redirect_url = os.getenv('GOOGLE_FULL_URI')
        full_path = f"{redirect_url}&state={query_type}"
        return redirect(full_path) 


def storeGoogleData(data):
        try:
                domain = os.getenv('DOMAIN')

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
                                'rank' : '0',
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

    domain = os.getenv('DOMAIN')
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
        domain = os.getenv('DOMAIN')

        if code :
                validateCode = exchange_code_with_token(code,os.getenv('GOOGLE_TOKEN_URL'),os.getenv('GOOGLE_CLIENT_ID'),os.getenv('GOOGLE_SECRET_KEY'),os.getenv('GOOGLE_REDIRECT_URI'))
                if validateCode["status_code"] == 200:
                        user_info = get_user_info(validateCode['accessToken'],os.getenv('GOOGLE_API'))
                        user = User.objects.filter(email=user_info.get("email")).first()
                        response = handle_google_state(state,user,user_info)
                        if((state == 'login' and user) or (state == 'register' and not user)) :                    
                                response = set_tokens_in_cookies_with_OAuth(request,user_info.get("email"),response)
                        return response
        return JsonResponse({'message': 'error'}, status = 404)

#---------------------------------------------------------------------------- login with intra-------------------------------------------
def intra_login(request):
        query_type =  request.GET.get('type')
        redirect_url = os.getenv('INTRA_FULL_URI')
        full_path = f"{redirect_url}&state={query_type}"

        return redirect(full_path)


def storeIntraData(intraData):
        try:
                domain = os.getenv('DOMAIN')
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
                        # 'password': '4475588@kdjndjfjjdfnbhf',
                        'registration_type': 'api',
                        'player' : {
                                'rank' : '0',
                                'level':'0',
                                'score':'0',
                        },
                        'picture':intraData.get('image').get('link')
                }
                response = requests.post('http://user-service:8001/api/user', json=data)
                if response.status_code == 200:
                        return redirect(f"{domain}/#/home?type=register") 
                else:
                        return redirect(f"{domain}/#/login") 
        except requests.RequestException as e:
                return redirect(f"{domain}/#/login") 



def handle_state(state, user, user_info):
    domain = os.getenv('DOMAIN')
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
        domain = os.getenv('DOMAIN')

        if code :
                validateCode = exchange_code_with_token(code,os.getenv('TOKEN_URL'),os.getenv('CLIENT_ID'),os.getenv('SECRET_KEY'),os.getenv('REDIRECT_URI'))
                if validateCode['status_code'] == 200:
                        user_info = get_user_info(validateCode['accessToken'],os.getenv('INTRA_API'))
                        # TODO i should here check user_info status code later
                        user = User.objects.filter(email=user_info.get("email")).first()
                        response = handle_state(state,user,user_info)
                        #  TODO maybe before setting coookie i should check access id is exist if note set it if yes decode it if i snot valid set new one
                        
                        if((state == 'login' and user) or (state == 'register' and not user))  :         
                                response = set_tokens_in_cookies_with_OAuth(request,user_info.get("email"),response)
                        return response
        return JsonResponse({'message': 'error'}, status = 404)


# -----------------------------------------------------------login form ------------------------------------------------------
# i guess this done for now
@csrf_exempt
@api_view(['POST'])                 
def login(request):

        username = request.data.get('username')
        password = request.data.get('password')
        # domain = os.getenv('DOMAIN')
        user = User.objects.filter(username=username).first()
        if not user:
                return Response({'username':'invalid username','password':'invalid password'}, status=status.HTTP_400_BAD_REQUEST)
        if not check_password(password,user.password):
                return Response({'password':'invalid password'}, status=status.HTTP_400_BAD_REQUEST)
        if (user.is_verify == False):
                return Response({'verification':'please verify your account first'}, status=status.HTTP_400_BAD_REQUEST)
        response = Response({'message': 'user successfully loged'},status=status.HTTP_200_OK)

        response = set_tokens_in_login(request,user.email,response)
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
                domain = os.getenv('DOMAIN')
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
                        'registration_type':'form',
                        'player' : {
                               'score':'0',
                               'rank' : '0',
                               'level' : '0'
                        }
                }
                response = requests.post('http://user-service:8001/api/user',json=data)
                if(response.status_code == 200):
                        uid = urlsafe_base64_encode(username.encode())
                        verification_link = f'{domain}/auth/verify/{uid}/{token}/'
                        email_subject = 'Please verify your email address'
                        email_body = f'Hello {first_name},\n\nPlease click the link below to verify your email address:\n\n{verification_link}'
                        send_mail(
                        email_subject,
                        email_body,
                        settings.EMAIL_HOST_USER,
                        [email],
                        )
                        return Response({"message":"email send successfully"},status=status.HTTP_200_OK)                
                return Response(response.json(),status=response.status_code)
        except Exception as e:
                return Response( str(e),  status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(['POST'])
def logout(request):
    try:
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            raise ValueError("Refresh token not provided")
        try:
            token = RefreshToken(refresh_token)
            payload = decode(refresh_token, settings.SIMPLE_JWT['SIGNING_KEY'], algorithms=["HS256"])
            user = User.objects.filter(email=payload.get("email")).first()
        except ExpiredSignatureError:
            print(">>>>>>>>>>> Refresh token expired")
            user = None  # Proceed without decoding token
        
        if user:
            resp = requests.put(
                'http://user-service:8001/api/user',
                json={"status": False},
                headers={"X-Authenticated-User": user.username}
            )

        response = Response(status=status.HTTP_205_RESET_CONTENT)
        response.delete_cookie('refresh_token')
        response.delete_cookie('access_token')
        return response

    except Exception as e:
        print(">>>>>>>>>>>>>>>>>>> Error: ", str(e))
        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)



# @csrf_exempt
# @api_view(['POST'])                 
# def logout(request):
#         try:
#             refresh_token = request.COOKIES.get('refresh_token')
#             token = RefreshToken(refresh_token)
#             payload = decode(refresh_token, settings.SIMPLE_JWT['SIGNING_KEY'], algorithms=["HS256"])
#             user = User.objects.filter(email=payload.get("email")).first()
#             resp = requests.put('http://user-service:8001/api/user',json= {
#                    "status": False
#                 }
#             ,
#             headers={
#                    "X-Authenticated-User":user.username
#             }
#             )
#             print(">>>>>>>>>>>>>>>>>>> response form souad is ", resp)
#         #     user.status = False
#         #     user.save(update_fields=['status'])
#             response = Response(status=status.HTTP_205_RESET_CONTENT)
#             response.delete_cookie('refresh_token')
#             response.delete_cookie('access_token')
#             return response
#         except Exception as e:
#             print(">>>>>>>>>>>>>>>>>>> dfjgfhghgfhjhgjffdskgjkfg ", str(e))
            
#             return Response(str(e),status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])                 
def verify_email(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        domain = os.getenv('DOMAIN')

        user = User.objects.filter(username=uid).first()
        if(user):
                if(user.verify_token == token):
                        user.is_verify = True
                        user.verify_token = "None"
                        user.save()

                        return redirect("/#/login")
        return redirect(f"{domain}/#/login")
    except Exception as e:
                return redirect(f"{domain}/#/login")



@api_view(['POST'])                 
def password_reset_request(request):
        domain = os.getenv('DOMAIN')

        email = request.POST.get('email')
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({'email':"invalid email"},status=status.HTTP_400_BAD_REQUEST)
        if user.is_verify == False:
            return Response({'email':"please verify email"},status=status.HTTP_400_BAD_REQUEST)
        token = generate_verification_token(user.username)
        uid = urlsafe_base64_encode(str(user.username).encode())
        user.verify_token = token
        user.save()
        verification_link = f'{domain}/#/password/reset?type=change&uid={uid}&token={token}'
        email_body = f'Hi {user.first_name},\nWe received a request to reset the password for your account. If you didn’t make this request, you can safely ignore this email.\nTo reset your password, please click the link below:\n\n{verification_link}'
        email_subject = 'Reset Your Password'
        print("email=====================>",email)
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

                if( not data.get('token')  or not data.get('token') ):
                        return Response({'password':"error in identify your credentials"},status=status.HTTP_400_BAD_REQUEST)
                uid = urlsafe_base64_decode(data.get('uid')).decode()
                user = User.objects.filter(username=uid).first()
                token = data.get('token')
                newPassword = data.get('newPassword')
                confirmPassword = data.get('confirmPassword')

                data ={
                        'new_password':newPassword,
                        'confirm_password':confirmPassword

                }
                if(user):
                        if  token == user.verify_token:
                                serialize = UserSerializer(user,data=data,partial=True)
                                if serialize.is_valid(raise_exception=True):
                                        serialize.save()
                                        user.verify_token = "None"
                                        user.save()
                                        return Response({'password':"password reset succssefylly"},status=200)
                        return Response({'password':"something wrong"},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
                return Response({key: value[0] for key, value in serialize.errors.items()}, status=status.HTTP_400_BAD_REQUEST)
                
   
