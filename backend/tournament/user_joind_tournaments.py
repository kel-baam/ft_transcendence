import json
from .models import Tournament, User, PlayerTournament
from asgiref.sync import sync_to_async

@sync_to_async
def get_user_joined_tournaments(user_id):
    user = User.objects.get(id=user_id)
    
    created_tournaments = Tournament.objects.filter(creator=user)
    joined_tournaments = Tournament.objects.filter(
        participants__user=user, participants__status='accepted'
    )

    all_tournaments = created_tournaments.union(joined_tournaments)

    tournament_data = [
        {
            "tournament_name": tournament.name,
            "tournament_id": tournament.id,
            "created_at": tournament.created_at.isoformat(),
            "creator": tournament.creator.username,
        }
        for tournament in all_tournaments
    ]

    return tournament_data
