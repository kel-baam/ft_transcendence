from faker import Faker
from django.contrib.auth.models import Group, Permission
from online.models import Tournament, Player, PlayerTournament
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
    for _ in range(10):
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
        creator = random.choice([niboukha] + users)

        tournament = Tournament.objects.create(
            creator=creator,
            name=fake.bs(),
            type=random.choice(['public', 'private']),
            created_at=fake.date_this_decade(),
        )
        tournaments.append(tournament)

        players_in_tournament = [creator]
        available_users = [niboukha] + users

        for _ in range(3):
            player_user = random.choice([user for user in available_users if user not in players_in_tournament])

            players_in_tournament.append(player_user)
            available_users.remove(player_user)

            player = Player.objects.create(
                user=player_user,
                score=random.randint(0, 100),
                level=random.randint(1, 10),
                rank=random.randint(1, 100),
            )

            PlayerTournament.objects.create(
                tournament=tournament,
                player=player,
                status='accepted',
                role='participant',
                nickname=fake.user_name(),
                avatar=None,
                invited_at=timezone.now(),
            )

        player = Player.objects.create(
            user=creator,
            score=random.randint(0, 100),
            level=random.randint(1, 10),
            rank=random.randint(1, 100),
        )

        PlayerTournament.objects.create(
            tournament=tournament,
            player=player,
            status='accepted',
            role='creator',
            nickname=fake.user_name(),
            avatar=None,
            invited_at=timezone.now(),
        )

    group = Group.objects.create(name='players')

    content_type = ContentType.objects.get_for_model(Tournament)

    permission = Permission.objects.create(
        codename='can_participate',
        name='Can participate in tournaments',
        content_type=content_type  # Ensure permission is related to Tournament model
    )

    group.permissions.add(permission)
    niboukha.groups.add(group)
    niboukha.user_permissions.add(permission)
