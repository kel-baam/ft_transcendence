from django.db.models import Q
from .models import Tournament, User, PlayerTournament
from asgiref.sync import sync_to_async
from .serializers import TournamentSerializer

@sync_to_async
def joined_tournaments(user_id):
    user = User.objects.get(id=user_id)
    
    created_tournaments = Tournament.objects.filter(creator=11)
    joined_tournaments = Tournament.objects.filter(
        participants__user=11, participants__status='accepted'
    )

    all_tournaments = created_tournaments.union(joined_tournaments)

    serialized_tournaments = TournamentSerializer(all_tournaments, many=True)

    print("------------joined--------------")
    print(serialized_tournaments)
    return serialized_tournaments.data

@sync_to_async
def available_tournaments(user_id):
    user = User.objects.get(id=user_id)

    available_tournaments = Tournament.objects.filter(
        type='public'
    ).exclude(
        Q(creator=11) | Q(participants__user=11, participants__status='accepted')
    ).distinct()

    serialized_tournaments = TournamentSerializer(available_tournaments, many=True)

    print("--------------available------------")
    print(available_tournaments)
    return serialized_tournaments.data
