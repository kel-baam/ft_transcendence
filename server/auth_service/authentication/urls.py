from django.urls import path
from . import views
from . import auth
from . import consumers
from . import jwt


from .views import verify_code,activate_two_Factor,validate_qrcode,desactive2FA
from .auth import intra_callback,password_reset_confirm,password_reset_request,callback_google,intra_login,login,verify_email,registerForm,logout
from .oauthUtils import csrf_token_view
from .jwt import token_required, generate_new_token

urlpatterns = [
    path('auth/login/',login,name='login'),
    path('auth/register/',registerForm,name='register'),
    
    path('auth/intra/',auth.intra_login,name='intraOauth'),
    path('auth/intra/callback/',auth.intra_callback,name='intraCallback'),
    path("auth/google/",auth.google_login,name='googleOauth'),
    path("auth/google/callback/",auth.callback_google,name='googleCallback'),
    path('auth/verify/<uidb64>/<token>/', auth.verify_email, name='verify_email'),


    path('auth/islogged/',jwt.token_required,name='isLogout'),
    path('auth/logout/',auth.logout,name='logout'),


    path("auth/refresh/token/",jwt.generate_new_token,name='refreshToken'),

    path('auth/password/reset/',auth.password_reset_request,name='password_reset_request'),
    path('auth/password/reset/confirm/',auth.password_reset_confirm,name='password_reset_confirm'),

    path("auth/twoFactor/verify/",views.verify_code),
    path("auth/twoFactor/activate/",views.activate_two_Factor,name='active2FA'),
    path("auth/twoFactor/desactivate/",views.desactive2FA,name='active2FA'),
    path("auth/twoFactor/validateQrCode/",views.validate_qrcode,name='validateQrCode'),
    path("auth/twoFactor/state/",views.twoFactoreState),

    path('get-csrf-token/',csrf_token_view, name='csrf_token'),

]


