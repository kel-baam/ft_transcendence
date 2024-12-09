
def validate_form(tournament_name, creator_avatar, creator_nickname, tournament_type, tournament_creator, selected_players):
    if not tournament_name or not tournament_name.strip():
        return "Tournament name cannot be empty."
    if creator_avatar is None:
        return "Player avatar cannot be empty."
    if not creator_nickname or not creator_nickname.strip():
        return "Player nickname cannot be empty."
    if tournament_creator is None:
        return "tournament_creator name cannot be empty."
    if tournament_type == 'private' and len(selected_players) < 3:
        return "Invited users should be three in a private tournament"
    
    return None
