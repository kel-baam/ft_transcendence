import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import random

from .verifyForm import validate_local_form

@csrf_exempt

def local(request):
    if request.method == 'POST':
        tournament_name = request.POST.get('tournament_name')
        players         = []
        for i in range(4):
            player_name  = request.POST.get(f'players[{i}][name]')
            player_image = request.FILES.get(f'players[{i}][image]')
            players.append({'name': player_name, 'image': player_image})
        
        validation_errors = validate_local_form(tournament_name, players)
        
        if validation_errors:
            return JsonResponse({'status': 'error', 'errors': validation_errors})
        
        create_tournament(tournament_name, players)
        return JsonResponse({'status': 'success'})
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'})

def create_tournament(tournament_name, players)
    pass
    

