import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Tournament, Player, Match
import random

@csrf_exempt

def local_tournament(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            tournament_name = data['tournament_name']
            players = data['players']
            
            if not tournament_name.strip():
                return JsonResponse({"error": "Tournament name cannot be empty."}, status=400)

            if not all(player.strip() for player in players):
                return JsonResponse({"error": "Player names cannot be empty."}, status=400)

            if len(players) != len(set(players)):
                return JsonResponse({"error": "Player names must be unique."}, status=400)

            tournament = Tournament.objects.create(name=tournament_name)
            player_instances = []
            for player_name in players:
                player = Player.objects.create(name=player_name, tournament=tournament)
                player_instances.append(player)
                print(f"Player '{player_name}' created with ID: {player.id}")

            create_matches(player_instances, tournament)

            return JsonResponse({"message": "Tournament created successfully!"})

        except KeyError as e:
            return JsonResponse({"error": f"Missing field: {str(e)}"}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

    return JsonResponse({"error": "Invalid method"}, status=405)


def create_matches(players, tournament):
    random.shuffle(players)
    for i in range(0, len(players), 2):
        if i + 1 < len(players):
            match = Match.objects.create(player1=players[i], player2=players[i + 1], tournament=tournament)
            print(f"Match created between Player {players[i].name} and Player {players[i + 1].name}")

# def validate_input(request):
#     value = request.GET.get('value', '').strip()
#     validation_type = request.GET.get('type', '').strip()

#     if not value:
#         return JsonResponse({'isValid': False, 'error': 'Input cannot be empty'})

#     if validation_type == 'tournament':
#         if Tournament.objects.filter(name=value).exists():
#             return JsonResponse({'isValid': False, 'error': 'Tournament name already exists'})
#         else:
#             return JsonResponse({'isValid': True})

#     elif validation_type == 'player':
#         if Player.objects.filter(name=value).exists():
#             return JsonResponse({'isValid': False, 'error': 'Player name already exists'})
#         else:
#             return JsonResponse({'isValid': True})

#     return JsonResponse({'isValid': False, 'error': 'Invalid validation type'})
