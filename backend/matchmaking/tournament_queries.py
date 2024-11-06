from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Match
from .serializers import PlayerSerializer
import json

@csrf_exempt
def players_by_match_id(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        match_ids = data.get('match_id', [])
        print("===============================")
        print(match_ids)
        if not match_ids:
            return JsonResponse({"error": "No match IDs provided."}, status=400)

        matches = Match.objects.filter(id__in=match_ids).select_related("player1", "player2")
        print(matches)

        player_data = []
        for match in matches:
            player1_data = PlayerSerializer(match.player1).data
            player2_data = PlayerSerializer(match.player2).data
            
            player_data.append({
                "match_id": match.id,
                "player1": player1_data,
                "player2": player2_data,
            })
        return JsonResponse({"players": player_data}, status=200)
    return JsonResponse({"error": "Invalid method"}, status=405)
