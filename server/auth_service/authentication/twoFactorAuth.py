from django.http import JsonResponse
from django.conf import settings
from decouple import config
from django.views.decorators.csrf import csrf_exempt
from .jwt import generateToken
import pyotp
import qrcode
from io import BytesIO
import base64
# from .decorators import accessTokenRequired
from datetime import timedelta



def generate_otp():       
        return pyotp.TOTP(pyotp.random_base32(), interval=30)

# @accessTokenRequired    
def activate_two_Factor(request):
        user = request.user
        totp_secret = generate_otp()
        user.tmp_secret = totp_secret.secret
        user.save()
        totp =  pyotp.TOTP(user.tmp_secret,interval=30)
        uri = totp.provisioning_uri(name=user.email, issuer_name='ping pong')
        qr = qrcode.make(uri)
        buffer = BytesIO()
        qr.save(buffer, format='PNG')
        buffer.seek(0)
        qr_code = buffer.getvalue()
        qr_code_base64 = base64.b64encode(qr_code).decode('utf-8')
        return JsonResponse({'qrImage':qr_code_base64})

# @accessTokenRequired    
def validate_qrcode(request):
        if(request.method == 'POST'):
                code = request.POST.get('code', 'none')
                user = request.user
                totp = pyotp.TOTP(user.tmp_secret, interval=30)
                if(totp.verify(code)):
                        user.secret = user.tmp_secret
                        user.enabled_twoFactor = True
                        print("2fa=>",user.enabled_twoFactor)
                        user.save()
                        return JsonResponse({'message':'the code valid'},status=200)
        return JsonResponse({'status_code':'401','message':'the code invalid'},status=401)

# @accessTokenRequired
def desactive2FA(request):
        print("heeeo")
        user = request.user
        print(user)
        user.enabled_twoFactor = False
        user.save()
        return  JsonResponse({'active2FA':user.enabled_twoFactor},status=200)

# @accessTokenRequired
def verify_code(request):
        if(request.method =='POST'):
                code = request.POST.get('code', 'none')
                user = request.user
                totp = pyotp.TOTP(user.secret, interval=30)
                if(totp.verify(code)):
                        newAccessToken = generateToken(request.user,2)
                        print("ver=>",newAccessToken.get("access"),newAccessToken.get("refresh"))
                        response = JsonResponse({'message':'the code valid'},status=200)
                        accessTokenLifeTime =int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
                        refreshTokenLifeTime = int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())
                        response.set_cookie('access_token',newAccessToken.get("access"), httponly=True, max_age=accessTokenLifeTime)
                        response.set_cookie('refresh_token',newAccessToken.get("refresh"), httponly=True, max_age=refreshTokenLifeTime)

                        return response
        return JsonResponse({'status_code':'401','message':'the code invalid'},status=401)


# @accessTokenRequired
def tmpData(request):
        return JsonResponse({'active2FA':request.user.enabled_twoFactor},status=200)


