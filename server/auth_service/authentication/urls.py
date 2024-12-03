from django.urls import path
from . import views
from . import tokens
from . import auth
from . import consumers


from .views import ItemListCreateView,verify_code,activate_two_Factor,validate_qrcode,tmpData,desactive2FA
from .tokens import generate_new_token
from .auth import intra_callback,callback_google,intra_login,token_require
from .oauthUtils import csrf_token_view

urlpatterns = [
    path('authentication/intra/',auth.intra_login,name='intraOauth'),
    path('authentication/intra/callback/',auth.intra_callback,name='intraCallback'),
    path("authentication/google/",auth.google_login,name='googleOauth'),
    path("authentication/google/callback/",auth.callback_google,name='googleCallback'),
    path("authentication/twoFactor/verify/",views.verify_code,name='verifyCode'),
    path("authentication/twoFactor/activate/",views.activate_two_Factor,name='active2FA'),
    path("authentication/twoFactor/desactivate/",views.desactive2FA,name='active2FA'),
    path("authentication/twoFactor/validateQrCode/",views.validate_qrcode,name='validateQrCode'),
    path('authentication/validateAccess/',auth.token_require),
    path("ws/some_path/", consumers.MyConsumer.as_asgi()),
    path('get-csrf-token/',csrf_token_view, name='csrf_token'),
    # this is just for testing so it is tmp

    path("api/data/",ItemListCreateView.as_view()),
    path("api/test/",views.tmpData),

    
    path("api/refresh/token/",tokens.generate_new_token),
]