def validate_form(tournament_name, players):
    """Validate the form data."""
    
    if not tournament_name or len(tournament_name) < 3:
        return "Tournament name must be at least 3 characters long."

    if len(players) != 4:
        return "Exactly 4 players are required."
    else:
        player_names = []
        for idx, player in enumerate(players):
            if not player['name']:
                return f"Player {idx + 1}: Name is required."
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
