from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Tournament, Player, PlayerTournament, User
from django.shortcuts import get_object_or_404
from django.utils import timezone

@csrf_exempt
def player_form(request):
    if request.method == 'POST':

        user = User.objects.get(id=11)
        tournament = Tournament.objects.get(id=request.POST.get('tournament'))

        if (request.FILES.get('createAvatar') is None) or (not request.POST.get('playerNickname') or not request.POST.get('playerNickname').strip()):
            return JsonResponse({
                    "status": "error",
                    "message": "There was an issue with the data you submitted. Please check the form fields and try again.",
                }, status=400)
        
        player_data = Player.objects.create(
            nickname = request.POST.get('playerNickname'),
            user = user,
            image = request.FILES.get('createAvatar'),
            is_local = False,
            tournament = tournament,
        )
        
        print("playerData --------> : ", player_data)
    return JsonResponse({
        "status": "success",
        "message": "player created successfully!",  
    })
