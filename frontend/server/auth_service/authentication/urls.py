from django.urls import path
from . import views
from . import auth
from . import consumers
from . import jwt


from .views import verify_code,activate_two_Factor,validate_qrcode,tmpData,desactive2FA
from .auth import intra_callback,callback_google,intra_login,login,registerForm,LogoutView
from .oauthUtils import csrf_token_view
from .jwt import token_required, generate_new_token

urlpatterns = [
    path('auth/intra/',auth.intra_login,name='intraOauth'),
    path('auth/intra/callback/',auth.intra_callback,name='intraCallback'),
    path("auth/google/",auth.google_login,name='googleOauth'),
    path("auth/google/callback/",auth.callback_google,name='googleCallback'),
    path('auth/login/',login),
    path('auth/register/',registerForm),
    path('auth/islogged/',jwt.token_required),
    path('auth/logout/',LogoutView.as_view()),
    path("api/refresh/token/",jwt.generate_new_token),


    
    # FORGET PASSWORD

    # 2FA
    path("auth/twoFactor/verify/",views.verify_code,name='verifyCode'),
    path("auth/twoFactor/activate/",views.activate_two_Factor,name='active2FA'),
    path("auth/twoFactor/desactivate/",views.desactive2FA,name='active2FA'),
    path("auth/twoFactor/validateQrCode/",views.validate_qrcode,name='validateQrCode'),

    path('get-csrf-token/',csrf_token_view, name='csrf_token'),

]


