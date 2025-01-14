from .models import User, Tournament, Player, Match
from faker import Faker
from django.utils import timezone
import random

fake = Faker()

def generate_fake_data():
    # Ensure the user with ID 11 and name niboukha exists
    try:
        niboukha_user, created = User.objects.update_or_create(
            id=11,
            defaults={"username": "niboukha"}
        )
        if created:
            print("User 'niboukha' created.")
        else:
            print("User 'niboukha' already exists.")
    except Exception as e:
        print(f"Error ensuring user with ID 11 exists: {e}")
        return

    # Number of fake entities to create
    num_users = 10
    num_tournaments = 5
    max_players_per_tournament = 4  # Maximum players per tournament (including the creator)
    num_matches_per_tournament = 5

    # Create fake users excluding the predefined user with ID 11
    users = [
        niboukha_user
    ]
    for _ in range(num_users - 1):
        try:
            users.append(User.objects.create_user(
                username=fake.unique.user_name(),
            ))
        except Exception as e:
            print(f"Error creating user: {e}")

    for _ in range(num_tournaments):
        user = random.choice(users)

        # Create tournament
        try:
            tournament = Tournament.objects.create(
                name=fake.company(),
                creator=user,
                created_at=timezone.now(),
            )
        except Exception as e:
            print(f"Error creating tournament: {e}")
            continue

        # Determine the number of players in the tournament (up to max_players_per_tournament)
        num_players_in_tournament = random.randint(1, max_players_per_tournament)

        # Add the creator as a player
        try:
            creator_player = Player.objects.create(
                nickname=user.username,  # Use username as the nickname
                tournament=tournament,
            )
        except Exception as e:
            print(f"Error creating player for creator: {e}")
            continue

        # Select additional players for the tournament
        available_users = [u for u in users if u != user]
        selected_users = random.sample(available_users, min(len(available_users), num_players_in_tournament - 1))

        players = []
        for selected_user in selected_users:
            try:
                player = Player.objects.create(
                    nickname=selected_user.username,  # Use username as the nickname
                    tournament=tournament,
                )
                players.append(player)
            except Exception as e:
                print(f"Error creating additional player: {e}")

        # Create matches
        all_players = [creator_player] + players
        for _ in range(num_matches_per_tournament):
            if len(all_players) > 1:
                try:
                    player1, player2 = random.sample(all_players, 2)
                    Match.objects.create(
                        player1=player1,
                        player2=player2,
                        tournament=tournament,
                        created_at=timezone.now(),
                        status='pending',
                    )
                except Exception as e:
                    print(f"Error creating match: {e}")

# Call the function to generate data
# generate_fake_data()
