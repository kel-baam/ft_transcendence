from django.http                    import JsonResponse
from django.middleware.csrf         import get_token
from django.views.decorators.csrf   import ensure_csrf_cookie
from django.views.decorators.csrf   import csrf_exempt

from .verifyForm                    import validate_form
from .models                        import User, Tournament, Player

import random

@ensure_csrf_cookie
def csrf_token_view(request):
    return JsonResponse({'csrftoken': get_token(request)})

@csrf_exempt

def createTournament(request):
    if request.method == 'POST':
        tournament_name = request.POST.get('tournament_name')
        players         = []
        for i in range(4):
            player_name  = request.POST.get(f'players[{i}][name]')
            player_image = request.FILES.get(f'players[{i}][image]')
            players.append({'name': player_name, 'image': player_image})
        
        validation_errors = validate_form(tournament_name, players)
        
        if validation_errors != "Form is valid!":
            return JsonResponse({'status': 'error', 'errors': validation_errors}, status=400)

        user = User.objects.get(id=11)

        tournament  = Tournament.objects.create(
            creator = user,
            name    = tournament_name,
        )

        players_data = [
            Player(
                tournament=tournament,
                nickname=player['name'],
                avatar=player['image'],
            )
            for player in players
        ]
        players = Player.objects.bulk_create(players_data)
        
        return JsonResponse({
            'status' : 'success',
            "message": "Tournament created successfully!"})
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'})


