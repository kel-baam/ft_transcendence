from faker import Faker
from .models import User, Player
import random

fake = Faker()

def generate_fake_data(num_users=10, num_players=11):
    """
    Generate fake Users and Players for testing, including a specific user with ID 11 and username 'niboukha'.
    :param num_users: Number of additional User entries to create (excluding niboukha).
    :param num_players: Number of Player entries to create.
    """
    # Create the specific user with ID 11 and username 'niboukha'
    niboukha = User.objects.create_user(
        id=11,
        username="niboukha",
        password="password",  # Default password for this user
        email=fake.email(),
        first_name="niboukha",
        last_name="niboukha",
        phone_number=fake.phone_number(),
        gender='Female',
        nationality=fake.country(),
        status='readyToPlay',
        enabled_twoFactor=False,
    )
    print("User 'niboukha' created successfully with ID 11.")

    # Create additional fake users
    users = [niboukha]
    for _ in range(num_users):
        user = User.objects.create_user(
            username=fake.user_name(),
            password="password",  # Default password for all users
            email=fake.email(),
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            phone_number=fake.phone_number(),
            gender=random.choice(['Male', 'Female']),
            nationality=fake.country(),
            status='readyToPlay',
            enabled_twoFactor=random.choice([True, False]),
        )
        users.append(user)

    print(f"{num_users} additional fake users created successfully.")

    # Create fake players
    for user in users:
        player = Player.objects.create(
            user=user,
            score=random.randint(0, 100),
            level=random.randint(1, 10),
            rank=random.randint(1, 100),
        )

    print(f"{num_players} fake players created successfully.")

# Run the function
# generate_fake_data()
