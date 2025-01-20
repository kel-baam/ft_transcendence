from django.http import JsonResponse,HttpResponse,HttpResponseRedirect
from rest_framework.decorators import api_view, permission_classes,authentication_classes

from rest_framework import generics
from .twoFactorAuth import verify_code,activate_two_Factor,validate_qrcode,tmpData,desactive2FA
from .models import User
from rest_framework.permissions import AllowAny
# from rest_framework.permissions import IsAuthenticated

# tokens.py

