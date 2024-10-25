from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Match
import json

@csrf_exempt
def players_by_match_id(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            match_id = data.get("match_id", [])

            if not match_id:
                return JsonResponse({"error": "No match IDs provided."}, status=400)

            matches = Match.objects.filter(id__in=match_id).select_related("player1", "player2")
            print(matches)
            player_data = [
                {
                    "match_id": match.id,
                    "player1": {"id": match.player1.id, "name": match.player1.name},
                    "player2": {"id": match.player2.id, "name": match.player2.name},
                }
                for match in matches
            ]

            return JsonResponse({"players": player_data}, status=200)
        
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

    return JsonResponse({"error": "Invalid method"}, status=405)
