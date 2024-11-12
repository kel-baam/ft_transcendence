def validate_tournament_creation(tournament_name, creator_avatar, creator_nickname, invited_users, tournament_type, tournament_creator):
    if not tournament_name or not tournament_name.strip():
        return "Tournament name cannot be empty."
    if creator_avatar is None:
        return "Player avatar cannot be empty."
    if not creator_nickname or not creator_nickname.strip():
        return "Player nickname cannot be empty."
    if tournament_creator is None:
        return "tournament_creator name cannot be empty."
    creator_names = set()
    for invited_user in invited_users:
        if not invited_user or not invited_user.strip():
            return "Player names cannot be empty."
        if invited_user in creator_names:
            return f"Player name '{invited_user}' is duplicated. Each player must have a unique name."
        creator_names.add(invited_user)

    if tournament_type == 'private' and len(invited_users) < 3:
        return "Invited users should be three in a private tournament"
    
    return None
