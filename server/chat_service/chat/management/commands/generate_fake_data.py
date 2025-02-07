from django.core.management.base import BaseCommand
from chat.models import User, PrivateMessage
from faker import Faker
import random

class Command(BaseCommand):
    help = 'Generate fake data for Users and Private Messages'
    def handle(self, *args, **kwargs):
        fake = Faker()

        # Create fake users
        users = []

        for _ in range(10):  # Adjust the range as needed
            user = User(
                username=fake.user_name()[:20],            # Truncate to 20 characters
                first_name=fake.first_name()[:15],         # Truncate to 15 characters
                last_name=fake.last_name()[:15],           # Truncate to 15 characters
                email=fake.email()[:20],                   # Truncate to 20 characters
                phone_number=fake.phone_number()[:15],     # Truncate to 15 characters
                gender=fake.random_element(elements=('Male', 'Female')),
                nationality=fake.country()[:15],           # Truncate to 15 characters
                status="active",
            )
            user.save()
            print(f"Created User: {user}")
            users.append(user)

        # supposed the first user created is the logged user
        logged_in_user = users[0].username

        # Create fake messages between users
        for _ in range(30):  # Adjust the range as needed
            sender = random.choice(users)
            receiver = random.choice(users)
            while receiver == sender:  # Ensure sender and receiver are different
                receiver = random.choice(users)

            if logged_in_user == sender.username:
                room_name = f"{logged_in_user}_{receiver.username}"
            elif logged_in_user == receiver.username:
                room_name = f"{logged_in_user}_{sender.username}"
            
            PrivateMessage.objects.create(
                sender=sender,
                receiver=receiver,
                roomName=room_name,
                content=fake.sentence(),
                timestamp=fake.date_time_this_year()
            )

        self.stdout.write(self.style.SUCCESS('Fake data created successfully!'))
