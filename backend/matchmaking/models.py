from django.db                  import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.conf                import settings
from django.core.exceptions     import ValidationError
from django.utils               import timezone
from django.core.exceptions     import ObjectDoesNotExist
from django.core.validators     import MinLengthValidator
from django.db.models           import UniqueConstraint

class User(AbstractUser):
    username = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=50, unique=True)
    phone_number = models.CharField(max_length=255, blank=True, null=True)
    picture = models.JSONField(null=True)
    gender = models.CharField(max_length=255, null=True)
    nationality = models.CharField(max_length=255, null=True)
    
    STATUS_CHOICES = [
        ('online', 'Online'),
        ('readyToPlay', 'ReadyToPlay'),
        ('offline', 'Offline')
    ]
    status = models.CharField(max_length=255, choices=STATUS_CHOICES)
    enabled_twoFactor = models.BooleanField(default=False)

    # Fix the reverse accessor conflict by modifying the related_name
    groups = models.ManyToManyField(
        Group,
        related_name='matchmaking_users',  # Unique reverse name for this model
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='matchmaking_users_permissions',  # Unique reverse name for this model
        blank=True
    )

    def __str__(self):
        return self.username

    class Meta:
        app_label = 'matchmaking'


class Player(models.Model):
    user    = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='players')
    score   = models.IntegerField(blank=True, null=True)
    level   = models.IntegerField(blank=True, null=True)
    rank    = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.user.username


class Match(models.Model):
    player1         = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player1')
    player2         = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player2')
    created_at      = models.DateTimeField(auto_now_add=True)
    status_choices  = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('exited', 'exited')]
    status          = models.CharField(max_length=10, choices=status_choices, default='pending')

    def __str__(self):
        return f"Match between {self.player1.nickname} and {self.player2.nickname}"



