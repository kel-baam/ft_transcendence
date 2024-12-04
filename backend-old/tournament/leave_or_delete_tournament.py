from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import Tournament, PlayerTournament
from django.shortcuts import get_object_or_404
import json

@csrf_exempt
@require_POST
def leave_or_delete_tournament(request):
    try:
        data = json.loads(request.body)
        tournament_id = data.get('tournamentId')
        print("tournament_id  ------> : ", tournament_id )
        if not tournament_id:
            return JsonResponse({'error': 'Tournament ID is required'}, status=400)

        tournament = get_object_or_404(Tournament, id=tournament_id)
        # user = request.user
        print(tournament.creator)
        if tournament.creator_id == 11:
            print("enterrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
            tournament.delete()
            return JsonResponse({'message': 'Tournament deleted successfully'}, status=200)
        else:
            PlayerTournament.objects.filter(user=11, tournament=tournament).delete()
            return JsonResponse({'message': 'You have left the tournament'}, status=200)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
