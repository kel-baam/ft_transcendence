from django.http                    import JsonResponse
from django.views.decorators.csrf   import csrf_exempt
from django.shortcuts               import get_object_or_404
from django.utils                   import timezone

from ..tournament.models                        import Tournament, Player, PlayerTournament, User
from ..tournament.verifyForm                    import validate_online_form

def online(request):
    if request.method == 'POST':

        tournament_name     = request.POST.get('tournament_name')
        creator_avatar      = request.FILES.get('creator_avatar')
        creator_nickname    = request.POST.get('nickname')
        tournament_type     = request.POST.get('visibility')
        tournament_creator  = request.POST.get('user')
        selected_players    = request.POST.getlist('selectedPlayers[]')

        validation_error = validate_online_form(tournament_name, creator_avatar, creator_nickname, tournament_type, tournament_creator, selected_players)
        if validation_error:
            return JsonResponse({
                "status"        : "error",
                "message"       : "There was an issue with the data you submitted. Please check the form fields and try again.",
                "error_details" : validation_error
            }, status=400)
        
        user = User.objects.get(id=11)
        create_tournament(tournament_name, creator_avatar, creator_nickname, tournament_type, tournament_creator, selected_players)
        return JsonResponse({
            'status' : 'success',
            "message": "Tournament created successfully!"})
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'})

def create_tournament(tournament_name, creator_avatar, creator_nickname, tournament_type, tournament_creator, selected_players):

    users = []
    users.append(User.objects.get(id = tournament_creator))
    for selected_player in selected_players:
        user = User.objects.get(id = selected_player)
        users.append(user)

    tournament = Tournament.objects.create(
        creator     = users[0],
        name        = tournament_name,
        type        = {tournament_type},
        created_at  = timezone.now(),
    )
    tournament_creation_time = tournament.created_at

    creator = Player.objects.create(
        user        = users[0],
        nickname    = creator_nickname,
        image       = creator_avatar,
    )
    
    for i, user in enumerate(users[1:], start = 1):
        tournament_invited_user = PlayerTournament.objects.create(
            tournament  = tournament,
            user        = user,
            status      = 'pending',
            role        = 'participant',
            invited_at  = tournament_creation_time,
        )


# Fetch all players linked to a specific tournament
# local_players = Player.objects.filter(
#     is_local=True,
#     id__in=PlayerTournament.objects.filter(tournament=tournament).values_list('player_id', flat=True)
# )

# Get all players (including local) for a specific tournament
# participants = PlayerTournament.objects.filter(tournament=tournament)
# local_players = [pt.player for pt in participants if pt.user is None]  # Only local players have no user