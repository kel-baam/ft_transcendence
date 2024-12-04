from .models import User, Tournament, Player, Match, PlayerTournament
from faker import Faker
from django.utils import timezone
import random

fake = Faker()

def generate_fake_data():
    # Number of fake entities to create
    num_users = 10
    num_tournaments = 5
    max_players_per_tournament = 4  # Maximum players per tournament (including the creator)
    num_matches_per_tournament = 5

    # Create fake users
    users = [
        User.objects.create_user(
            username=fake.unique.user_name(),
        )
        for _ in range(num_users)
    ]

    for _ in range(num_tournaments):
        user = random.choice(users)

        # Create tournament
        tournament = Tournament.objects.create(
            name=fake.company(),
            creator=user,
            type=fake.random_element(['local', 'public', 'private']),
            created_at=timezone.now(),
        )

        # Determine if fewer players should be accepted (up to max of 4)
        num_players_in_tournament = random.randint(1, max_players_per_tournament)

        # Creator is automatically added as a player in the Player and PlayerTournament table
        is_local_status = tournament.type != 'public'  # If the tournament is not public, it's local

        # Add the creator as a player in Player and PlayerTournament table
        creator_player = Player.objects.create(
            nickname=user.username,  # Assuming user username is used as nickname
            user=user,
            image="media/player_images/unknown.png",
            is_local=is_local_status,
            tournament=tournament,
        )

        # Add the creator to PlayerTournament with status 'accepted' (they are automatically accepted)
        PlayerTournament.objects.create(
            user=creator_player.user,
            tournament=tournament,
            status='accepted',  # Creator is automatically accepted in all tournaments
            invited_at=timezone.now()
        )

        # Determine how many additional players can be added (based on random number)
        remaining_players_count = num_players_in_tournament - 1  # Subtract 1 for the creator

        # Select the remaining players (up to the remaining limit, and ensuring we don't exceed total)
        available_players = [user for user in users if user != creator_player.user]
        selected_players = random.sample(available_players, min(remaining_players_count, len(available_players)))

        # Add selected players to Player and PlayerTournament
        players = []
        for player in selected_players:
            player_instance = Player.objects.create(
                nickname=player.username,
                user=player,
                image="media/player_images/unknown.png",  # Fake image path
                is_local=is_local_status,
                tournament=tournament
            )
            players.append(player_instance)

            # Add players to PlayerTournament with appropriate status
            if tournament.type == 'private':
                # For private tournaments, set the status to 'pending', 'accepted', or 'declined'
                status = random.choice(['pending', 'accepted', 'declined'])
                PlayerTournament.objects.create(
                    user=player_instance.user,
                    tournament=tournament,
                    status=status,
                    invited_at=fake.date_this_year()
                )
            else:
                # For public tournaments, status is always 'accepted'
                PlayerTournament.objects.create(
                    user=player_instance.user,
                    tournament=tournament,
                    status='accepted',
                    invited_at=None
                )

        # Create matches for the tournament
        # Select pairs of players for matches (including creator and selected players)
        all_players = [creator_player] + players  # Combine creator and selected players
        for _ in range(num_matches_per_tournament):
            if len(all_players) > 1:
                player1, player2 = random.sample(all_players, 2)  # Select two distinct players
                Match.objects.create(
                    player1=player1,
                    player2=player2,
                    tournament=tournament,
                    created_at=timezone.now(),
                    status='pending',
                    score=None  # Optionally add fake scores if needed
                )
