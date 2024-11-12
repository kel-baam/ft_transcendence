from django.apps import AppConfig
from django.db.models.signals import post_migrate

class TournamentAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tournament'

    def ready(self):
        # Connect the post_migrate signal to generate fake data
        post_migrate.connect(run_fake_data_generation, sender=self)

def run_fake_data_generation(sender, **kwargs):
    # Import here to ensure models are ready
    from .fake_data import generate_fake_data  
    generate_fake_data()
