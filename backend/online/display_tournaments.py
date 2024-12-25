from django.db.models import Q, Count, F
from .models import Tournament, User, PlayerTournament, Player
from asgiref.sync import sync_to_async
from .serializers import TournamentSerializer

@sync_to_async
def joined_tournaments(user_id):
    try:
        user = User.objects.get(id=11)
    except User.DoesNotExist:
        return {"error": "User not found"}
    
    created_tournaments = Tournament.objects.filter(creator=user)

    joined_tournaments = Tournament.objects.filter(
        participants__player__user_id=user_id,
        participants__status='accepted'
    )

    all_tournaments         = created_tournaments.union(joined_tournaments)
    serialized_tournaments  = TournamentSerializer(all_tournaments, many=True)

    print("------------all_tournaments--------------")
    print(serialized_tournaments.data)

    return serialized_tournaments.data

@sync_to_async
def available_tournaments(user_id):
    user = User.objects.get(id=11)
    
    available_tournaments = Tournament.objects.filter(
        type='public'
    ).exclude(
        Q(creator = user) | Q(participants__player__user = user)
    ).annotate(
        num_participants=Count(
            'participants',
            filter = Q(participants__status='accepted')
        )
    ).filter(
        num_participants__lt = 4
    ).distinct()

    for tournament in available_tournaments:
        print(f"Tournament ID: {tournament.id}, Num Participants: {tournament.num_participants}")

    serialized_tournaments = TournamentSerializer(available_tournaments, many=True)

    print("--------------available------------")
    print(available_tournaments)
    
    return serialized_tournaments.data