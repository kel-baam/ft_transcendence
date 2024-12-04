def validate_local_form(tournament_name, players):
    """Validate the form data."""
    errors = {}

    if not tournament_name or len(tournament_name) < 3:
        errors['tournament_name'] = "Tournament name must be at least 3 characters long."

    if len(players) != 4:
        errors['players'] = "Exactly 4 players are required."
    else:
        player_names = []
        for idx, player in enumerate(players):
            if not player['name']:
                errors[f'players[{idx}][name]'] = "Player name is required."
            else:
                player_names.append(player['name'])

            if not player['image']:
                errors[f'players[{idx}][image]'] = "Player image is required."

        duplicates = {name for name in player_names if player_names.count(name) > 1}
        if duplicates:
            for idx, player in enumerate(players):
                if player['name'] in duplicates:
                    errors[f'players[{idx}][name]'] = "Duplicate player names are not allowed."

    return errors
