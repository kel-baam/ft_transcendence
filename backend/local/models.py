from django.db                  import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.conf                import settings
from django.core.exceptions     import ValidationError
from django.utils               import timezone
from django.core.exceptions     import ObjectDoesNotExist

class User(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        related_name='local_users',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='local_users',
        blank=True
    )

    def __str__(self):
        return self.username

    class Meta:
        app_label = 'local'


class Tournament(models.Model):
    creator      = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    name         = models.CharField(max_length=100)
    created_at   = models.DateTimeField(auto_now_add=True, null=True)

    def get_creator_image(self):
        try:
            player = Player.objects.get(user_id=self.creator.id, tournament=self)
            return player.image.url if player.image else 'default-image.jpg'
        except Player.DoesNotExist:
            return '../../frontend/assets/css/uknown.png'

    def __str__(self):
        return self.name

class Player(models.Model):
    tournament  = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='participants')
    nickname    = models.CharField(max_length=50, default="NoNickname")
    avatar      = models.ImageField(upload_to='player_images/', blank=True, null=True)
    score       = models.IntegerField(blank=True, null=True, default=0)
    rank        = models.IntegerField(blank=True, null=True, default=0)
    
    def __str__(self):
        return self.nickname

class Match(models.Model):
    player1         = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player1')
    player2         = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player2')
    tournament      = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches')
    created_at      = models.DateTimeField(auto_now_add=True)
    status_choices  = [('pending', 'Pending'), ('completed', 'Completed')]
    status          = models.CharField(max_length=10, choices=status_choices, default='pending')
    score           = models.CharField(max_length=50, blank=True, null=True)  # e.g., "3-2", if relevant to track

    def __str__(self):
        return f"Match between {self.player1.nickname} and {self.player2.nickname} in {self.tournament.name}"
