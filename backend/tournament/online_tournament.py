import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .validate_online_tournament import validate_tournament_creation
from .models import Tournament, Player, PlayerTournament, User
from django.shortcuts import get_object_or_404
from django.utils import timezone

@csrf_exempt
def online_tournament(request):
    if request.method == 'POST':
        tournament_name = request.POST.get('tournament_name')
        creator_avatar = request.FILES.get('creator_avatar')
        creator_nickname = request.POST.get('nickname')
        tournament_type = request.POST.get('visibility')
        tournament_creator = request.POST.get('user')
    
        invited_users = []
        for i in range(3):
            invited_user = request.POST.get(f'player[{i}][name]')
            if invited_user:
                invited_users.append(invited_user)

        # i missed to check if the invited players is already an users in our website 
        # in case of tournament is online

        validation_error = validate_tournament_creation(tournament_name, creator_avatar, creator_nickname, invited_users, tournament_type, tournament_creator)
        if validation_error:
            return JsonResponse({"error": validation_error}, status=400)
        
        users = []
        user1, created = User.objects.get_or_create(username=tournament_creator)
        users.append(user1)
        
        for i, invited_user_name in enumerate(invited_users, start=2): 
            user, created = User.objects.get_or_create(username=invited_user_name)
            users.append(user)

        tournament = Tournament.objects.create(
            name=tournament_name,
            creator=users[0],
            type={tournament_type},
            created_at=timezone.now(),
        )
        tournament_creation_time = tournament.created_at

        creator = Player.objects.create(
            nickname=creator_nickname,
            user=users[0],
            image=creator_avatar,
            # is_guest=False,
            is_local=False,
            tournament=tournament,
        )
        
        for i, user in enumerate(users[1:], start=1):
            print(user.username)
            tournament_invited_user = PlayerTournament.objects.create(
                user=user,
                tournament=tournament,
                status='pending',
                # role='participant', it's useless for now
                invited_at=tournament_creation_time,
            )
        
        # print("Tournament Details:")
        # print(tournament)
        # print("Creator Player Details:")
        # print(creator)
        # print("All Users:")
        # for user in users:
        #     print(user)
        # print("All PlayerTournament Entries:")
        # player_tournaments = PlayerTournament.objects.filter(tournament=tournament)
        # for entry in player_tournaments:
        #     print(entry)

    return JsonResponse({
        "message": "Tournament created successfully!",  
    })
