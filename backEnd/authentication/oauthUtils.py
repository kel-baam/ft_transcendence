from django.conf import settings
import requests


def exchange_code_with_token(code,token_url,client_id,client_secret,redirect_uri):

        data = {
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': redirect_uri,
                'client_id': client_id,
                'client_secret': client_secret,
        }
        print(data)
        response = requests.post(token_url,data=data)
        print(response)
        if(response.status_code == 200):
                token_data = response.json()
                access_token= token_data.get('access_token')
        else:
                access_token = "none"

        return {'status_code':response.status_code,'accessToken':access_token}

def get_user_info(token,api):
        access_token = token
        headers={
               'Authorization': f'Bearer {access_token}',
        }
        response = requests.get(api,headers=headers)
        if response.status_code == 200:
                data = response.json()
                return data
        return {'status_code':response.status_code}


# views.py
from django.http import JsonResponse
from django.middleware.csrf import get_token

def csrf_token_view(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrf_token': csrf_token})
