
# from django.contrib.auth import get_user_model
from .models import User, Tournament, Player, Match, PlayerTournament
from faker import Faker
from django.utils import timezone
import random

fake = Faker()

def generate_fake_data():
    # Number of fake entities to create
    num_users = 10
    num_tournaments = 5
    num_players_per_tournament = 10
    num_matches_per_tournament = 5

    # Create fake users
    users = [
    User.objects.create_user(
        username=fake.unique.user_name(),
    )
        for _ in range(num_users)
    ]

    for _ in range(num_tournaments):
        users = User.objects.all()  # Query all users from the database
        if users.exists():
            user = random.choice(users)
        # Ensure that the chosen user is of type User
        if not isinstance(user, User):
            raise ValueError("The selected object is not a valid User instance.")
        
        players = [
            Player.objects.create(
                nickname=fake.unique.user_name(),
                user=random.choice(users),  # Link to a random user
                image="media/player_images/uknown.png",
                is_local=fake.boolean(),
            )
            for _ in range(num_players_per_tournament)
        ]
        
        tournament = Tournament.objects.create(
            name=fake.company(),
            creator=user,
            type=fake.random_element(['local', 'public', 'private']),
            created_at=timezone.now(),
        )

        # Create players for each tournament


        for player in players:
            status = random.choice(['pending', 'accepted', 'declined'])  # Random status
            PlayerTournament.objects.create(
                user=player.user,  # Link to the player (User)
                tournament=tournament,
                status=status,
                invited_at=fake.date_this_year()
            )

        # Create matches for the tournament
        for _ in range(num_matches_per_tournament):
            player1, player2 = random.sample(players, 2)  # Select two distinct players
            Match.objects.create(
                player1=player1,
                player2=player2,
                tournament=tournament,
                created_at=timezone.now(),
                status='pending',
                score=None  # Optionally add fake scores if needed
            )