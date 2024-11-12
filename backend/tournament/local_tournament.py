import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Tournament, Player, Match, User
from .serializers import MatchSerializer
import random
from django.shortcuts import get_object_or_404

@csrf_exempt
def local_tournament(request):
    if request.method == 'POST':
        tournament_name = request.POST.get('tournament_name')
        if not tournament_name or not tournament_name.strip():
            return JsonResponse({"error": "Tournament name cannot be empty."}, status=400)

        players = []
        player_names = set()
        for i in range(4):
            player_name = request.POST.get(f'players[{i}][name]')
            player_image = request.FILES.get(f'players[{i}][image]')
            print(player_name)
            if not player_name or not player_name.strip():
                return JsonResponse({"error": "Player names cannot be empty."}, status=400)
            if player_name in player_names:
                return JsonResponse({"error": f"Player name '{player_name}' is duplicated. Each player must have a unique name."}, status=400)
            if player_image is None:
                return JsonResponse({"error": f"No image file uploaded for player {player_name}."}, status=400)
            player_names.add(player_name)
            players.append((player_name, player_image))


        user = User.objects.create(username='niboukha')

        tournament = Tournament.objects.create(
            name=tournament_name,
            creator=get_object_or_404(User, username='niboukha'),
            type='local')
    
        player_instances = []
        for player_name, player_image in players:
            player = Player.objects.create(
                nickname=player_name,
                user=get_object_or_404(User, username='niboukha'),
                image=player_image,
                is_guest=True,
                is_local=True,)
            player_instances.append(player)

        tournament_id, matches = create_matches(player_instances, tournament)

        serialized_Matches = MatchSerializer(matches, many=True).data
        return JsonResponse({
            "message": "Tournament created successfully!",
            "tournament_id": tournament_id,
            "matches": serialized_Matches,
        })

    return JsonResponse({"error": "Invalid method"}, status=405)

def create_matches(players, tournament):
    random.shuffle(players)
    matches = []
    for i in range(0, len(players), 2):
        if i + 1 < len(players):
            match = Match.objects.create(
                player1=players[i],
                player2=players[i + 1],
                tournament=tournament)
            matches.append(match)
    return tournament.id, matches

