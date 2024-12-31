from faker import Faker
from django.contrib.auth.models import Group, Permission
from online.models import User, Tournament, Player, PlayerTournament
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
import random

fake = Faker()
def generate_fake_data():
    # Create 'niboukha' user
    niboukha = User.objects.create_user(
        id=11,
        username="niboukha",
        password="password",  # Default password
        email=fake.email(),
    )

    # Create 9 other users
    users = []
    for _ in range(9):
        user = User.objects.create_user(
            username=fake.user_name(),
            password="password",  # Default password
            email=fake.email(),
        )
        users.append(user)

    # Create 5 tournaments
    tournaments = []
    for _ in range(5):
        # Ensure the creator is only one user
        creator = random.choice([niboukha] + users)  # Randomly assign creator (only one)

        # Create the tournament
        tournament = Tournament.objects.create(
            creator=creator,
            name=fake.bs(),
            type=random.choice(['public', 'private']),
            created_at=fake.date_this_decade(),
        )
        tournaments.append(tournament)

        # Add players to the tournament (other than the creator)
        players_in_tournament = [creator]  # Include creator as a player
        available_users = [niboukha] + users  # List of all users

        for _ in range(4):  # Add 4 additional players (so total of 5 players)
            # Select a random user from the available users who is not yet in the tournament
            player_user = random.choice([user for user in available_users if user not in players_in_tournament])

            players_in_tournament.append(player_user)  # Add player to the list
            available_users.remove(player_user)  # Remove the selected user from the pool

            # Create player entry
            player = Player.objects.create(
                user=player_user,
                score=random.randint(0, 100),
                level=random.randint(1, 10),
                rank=random.randint(1, 100),
            )

            # Create player tournament relationship
            PlayerTournament.objects.create(
                tournament=tournament,
                player=player,
                status=random.choice(['pending', 'accepted', 'declined']),
                role='participant',  # Since creator is already assigned to role='creator'
                nickname=fake.user_name(),
                avatar=None,  # Assuming no avatar
                invited_at=timezone.now(),
            )

        # Create a player entry for the creator
        player = Player.objects.create(
            user=creator,
            score=random.randint(0, 100),
            level=random.randint(1, 10),
            rank=random.randint(1, 100),
        )

        # Create player tournament relationship for the creator
        PlayerTournament.objects.create(
            tournament=tournament,
            player=player,
            status=random.choice(['pending', 'accepted', 'declined']),
            role='creator',  # Creator's role
            nickname=fake.user_name(),
            avatar=None,  # Assuming no avatar
            invited_at=timezone.now(),
        )


        # Create a player entry for the creator
        # player = Player.objects.create(
        #     user=creator,
        #     score=random.randint(0, 100),
        #     level=random.randint(1, 10),
        #     rank=random.randint(1, 100),
        # )
        
        # # Create player tournament relationship for the creator
        # PlayerTournament.objects.create(
        #     tournament=tournament,
        #     player=player,
        #     status=random.choice(['pending', 'accepted', 'declined']),
        #     role='creator',  # Creator's role
        #     nickname=fake.user_name(),
        #     avatar=None,  # Assuming no avatar
        #     invited_at=timezone.now(),
        # )

    # Create a group
    group = Group.objects.create(name='players')

    # Create content type for the Tournament model (optional, if relevant)
    content_type = ContentType.objects.get_for_model(Tournament)

    # Create permission and link it to the content type (if relevant to Tournament)
    permission = Permission.objects.create(
        codename='can_participate',
        name='Can participate in tournaments',
        content_type=content_type  # Ensure permission is related to Tournament model
    )

    # Assign permission to group
    group.permissions.add(permission)

    # Add 'niboukha' to the group and give them the permission
    niboukha.groups.add(group)
    niboukha.user_permissions.add(permission)
