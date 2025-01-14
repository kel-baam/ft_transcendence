from django.apps import AppConfig
from django.db.models.signals import post_migrate
import logging

class MatchmakingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'matchmaking'
    def ready(self):
        post_migrate.connect(run_fake_data_generation, sender=self)

def run_fake_data_generation(sender, **kwargs):
    from django.conf import settings
    logger = logging.getLogger(__name__)
    if settings.DEBUG:  # Only run in development mode
        logger.info("Starting fake data generation...")
        from .fake_data import generate_fake_data
        try:
            generate_fake_data()
            logger.info("Fake data generation completed successfully.")
        except Exception as e:
            logger.error(f"Error during fake data generation: {e}")

