from .models import Tournament
import json

def validate_form(tournament_name, creator_avatar, creator_nickname, tournament_type, selected_players):

    if creator_avatar is None:
        return "Player avatar cannot be empty."

    if not tournament_name or not tournament_name.strip():
        return "Tournament name cannot be empty."

    if is_tournament_name_taken(tournament_name):
        return "Tournament name already exists."

    if len(tournament_name) < 3:
        return "Tournament name must be at least 3 characters long."

    if not creator_nickname or not creator_nickname.strip():
        return "Player nickname cannot be empty."

    if tournament_type == 'private':
        if len(selected_players) < 3:
            return "Invited users should be three in a private tournament."

    player_ids = [player.get('id') for player in selected_players]

    if len(player_ids) != len(set(player_ids)):
        return "Duplicate players are not allowed in the tournament."

    return None

def is_tournament_name_taken(tournament_name):
    """Check if the tournament name already exists for the given user"""
    return Tournament.objects.filter(name=tournament_name).exists()

def player_form_validation(avatar, nickname):
    if avatar is None:
        return "avatar is required"
    if not nickname or not nickname.strip():
        return "nickname is required"
    return None

