from django.db                  import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.conf                import settings
from django.core.exceptions     import ValidationError
from django.utils               import timezone
from django.core.exceptions     import ObjectDoesNotExist
from django.core.validators     import MinLengthValidator
from django.db.models           import UniqueConstraint

class User(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        related_name='online_users',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='online_users',
        blank=True
    )

    def __str__(self):
        return self.username

    class Meta:
        app_label = 'online'

class Tournament(models.Model):
    creator         = models.ForeignKey(User, on_delete = models.CASCADE)
    name            = models.CharField(max_length = 50, unique = True, validators=[MinLengthValidator(3)], null=True, blank=True)
    type_choices    = [
        ('public', 'Public'),
        ('private', 'Private')
    ]
    type            = models.CharField(max_length=50, choices=type_choices, default='private') # i remove this ", default='private'"
    created_at      = models.DateTimeField(auto_now_add=True)
    STATUS_CHOICES  = [
            ('pending', 'Pending'),
            ('matchmaking', 'Matchmaking Done'),
            ('started', 'Started'),
            ('finished', 'Finished'),
        ]
    status          = models.CharField(max_length = 20, choices = STATUS_CHOICES, default = 'pending')

    def get_creator_image(self):
        try:
            player = Player.objects.get(user_id=self.creator.id, tournament=self)
            return player.image.url if player.image else 'default-image.jpg'
        except Player.DoesNotExist:
            return '../../frontend/assets/css/uknown.png'
        
    def __str__(self):
        return self.name

class Player(models.Model):
    user    = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='players')
    score   = models.IntegerField(blank=True, null=True)
    level   = models.IntegerField(blank=True, null=True)
    rank    = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.user.username

class PlayerTournament(models.Model):
    tournament      = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='participants')
    player          = models.ForeignKey(Player, on_delete=models.SET_NULL, null=True, blank=True, related_name='tournament_entries')
    
    role_choices    = [('creator', 'Creator'), ('participant', 'Participant')]
    role            = models.CharField(max_length=11, choices=role_choices, default='participant')

    status_choices  = [('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined')]
    status          = models.CharField(max_length=10, choices=status_choices, default='pending')
    
    nickname        = models.CharField(max_length=50, null=True, blank=True)
    avatar          = models.ImageField(upload_to='player_images/', null=True, blank=True)
    
    invited_at      = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        constraints = [
            UniqueConstraint(fields=['tournament', 'player'], name='unique_tournament_player')
        ]

    def __str__(self):
        return f"Invitation for {self.player.id} to {self.tournament.name} - Status: {self.status}"


class Match(models.Model):
    player1         = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player1')
    player2         = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player2')
    tournament      = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches')
    created_at      = models.DateTimeField(auto_now_add=True)
    status_choices  = [('pending', 'Pending'), ('completed', 'Completed'), ('exited', 'exited')]
    status          = models.CharField(max_length=10, choices=status_choices, default='pending')
    
    def __str__(self):
        # Accessing the related PlayerTournament to get the nickname of players
        player1_tournament = PlayerTournament.objects.get(player=self.player1, tournament=self.tournament)
        player2_tournament = PlayerTournament.objects.get(player=self.player2, tournament=self.tournament)
        
        return f"Match between {player1_tournament.nickname} and {player2_tournament.nickname} in {self.tournament.name}"
