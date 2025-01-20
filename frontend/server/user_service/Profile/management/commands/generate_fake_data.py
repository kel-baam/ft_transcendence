import random
from django.core.management.base import BaseCommand
from faker import Faker
from Profile.models import *
from django.utils import timezone
from datetime import datetime

class Command(BaseCommand):
    help = "Generate fake data for UserProfile"
    
    def handle(self, *args, **kwargs):
        fake = Faker()
        base_url = "https://picsum.photos/200/300"
        image_metadata = [
            {
                "url": f"{base_url}?random={random.randint(1, 1000)}",
                "description": f"Image {i + 1}",
                # "width": 200,
                # "height": 300,
            }
            for i in range(20)  # Generate 5 images for this record
        ]
        
        # Generate 100 fake user profiles
        # for _ in range(20):
        #     User.objects.create(
        #         username=fake.user_name(),
        #         first_name=fake.first_name_female(),
        #         last_name=fake.last_name_female(),
        #         email=fake.email(),
        #         gender=fake.passport_gender(),
        #         nationality=fake.country(),
        #         status=fake.boolean(),
        #         picture={
        #         "url": f"{base_url}?random={random.randint(1, 1000)}",
        #         # "description": f"Image {i + 1}",
        #         # "width": 200,
        #         # "height": 300,
        #         },
        #         password=fake.password(),
        #         last_login=fake.date(),
        #         phone_number = fake.phone_number()
        #     )
        # for _ in range(min(20, len(users))):
        #     print(">>>>>>>>>>>>>>> here ")
        #     user = random.choice(users)
        #     Player.objects.create(
        #         user=user,
        #         score=random.randint(0, 100),
        #         level=random.uniform(0.0, 10.0),
        #         Rank=random.randint(0,100)
        #     )
        #     users.remove(user)
        # users = list(User.objects.all())
        # players = list(Player.objects.all())
        # for _ in range(min(20, len(users))):
        #     print(">>>>>>>>>>>>>>>>> here ")
        #     sender = random.choice(users)
        #     reciever = random.choice(users)
        #     Request.objects.create(
        #         sender=sender,
        #         reciever=reciever,
        #         status=random.choice([choice[0] for choice in Request.STATUS_CHOICES])
        #     )
            # users.remove(sender)
            # users.remove(reciever)
        players = Player.objects.all()
        for _ in range(20):
            # print(">>>>>>>>>>>>>>>>> here ")
            Match.objects.create(
                date=fake.date(),
                # picture={
                # "url": f"{base_url}?random={random.randint(1, 1000)}",
                # # "description": f"Image {i + 1}",
                # # "width": 200,
                # # "height": 300,
                # },
                player1=random.choice(players),
                player2=random.choice(players),
                player1_points=random.randint(0, 100),
                player2_points=random.randint(0, 100)
            )
            # Achievement.objects.create(
            #     name=fake.fake.sentence(nb_words=3),

            # )

        self.stdout.write(self.style.SUCCESS("Successfully generated fake data!"))
