from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
import logging


logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def home(request):

    
    # logger.debug("hoooome==>",request.user)
    # logger.debug("mettttta=>",request.META.get('HTTP_X_AUTHENTICATED_USER'))
    response = JsonResponse({'message': 'Welcome to the Home Service!'},status = 200)
    return response
