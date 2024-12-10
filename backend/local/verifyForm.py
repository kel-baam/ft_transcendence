from .models import Tournament

def validate_form(tournament_name, players, user):
    """Validate the form data"""

    # print("tournament name: ", tournament_name)
    # print("player : ", players)
    # print("user : ", user)
    
    if not tournament_name or tournament_name.strip() == "":
        return "Tournament name is required and cannot be just spaces."
    
    if is_tournament_name_taken(tournament_name, user):
        return "Tournament name already exists for this user."
    
    if not tournament_name or len(tournament_name) < 3:
        return "Tournament name must be at least 3 characters long."

    if len(players) != 4:
        return "Exactly 4 players are required."
    else:
        player_names = []
        for idx, player in enumerate(players):
                if not player['name'] or player['name'].strip() == "":
                    return f"Player {idx + 1}: Name is required and cannot be just spaces."
                else:
                    player_names.append(player['name'])

                if not player['image']:
                    return f"Player {idx + 1}: Image is required."

        duplicates = {name for name in player_names if player_names.count(name) > 1}
        if duplicates:
            for idx, player in enumerate(players):
                if player['name'] in duplicates:
                    return f"Player {idx + 1}: Duplicate player names are not allowed."

    return "Form is valid!"

def is_tournament_name_taken(tournament_name, user):
    """Check if the tournament name already exists for the given user"""
    return Tournament.objects.filter(creator=user, name=tournament_name).exists()