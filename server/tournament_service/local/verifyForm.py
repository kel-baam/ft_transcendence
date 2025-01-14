from .models import Tournament

def validate_form(tournament_name, players, user):
    """Validate the form data"""

    if not tournament_name or tournament_name.strip() == "":
        return "Tournament name is required and cannot be just spaces."

    if is_tournament_name_taken(tournament_name, user):
        return "Tournament name already exists for this user."

    if len(tournament_name) < 3:
        return "Tournament name must be at least 3 characters long."

    if len(players) != 4:
        return "Exactly 4 players are required."

    player_names = set()
    for idx, player in enumerate(players):
        if not player.get('nickname') or player['nickname'].strip() == "":
            return f"Player {idx + 1}: Name is required and cannot be just spaces."

        if player['nickname'] in player_names:
            return f"Player {idx + 1}: Duplicate player nicknames are not allowed."
        player_names.add(player['nickname'])

        if not player.get('avatar'):
            return f"Player {idx + 1}: Avatar is required."

    return "Form is valid!"

def is_tournament_name_taken(tournament_name, user):
    """Check if the tournament name already exists for the given user"""
    return Tournament.objects.filter(creator=user, name=tournament_name).exists()
