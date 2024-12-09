from django.db                  import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.conf                import settings
from django.core.exceptions     import ValidationError
from django.utils               import timezone
from django.core.exceptions     import ObjectDoesNotExist

class User(AbstractUser):
    username    = models.CharField(max_length=50)

    def __str__(self):
        return self.username

class Tournament(models.Model):
    creator      = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    name         = models.CharField(max_length=100)
    type_choices = [
        ('public', 'Public'),
        ('private', 'Private')
    ]
    type         = models.CharField(max_length=50, blank=True, null=True, choices=type_choices)
    created_at   = models.DateTimeField(auto_now_add=True)

    def get_creator_image(self):
        try:
            player = Player.objects.get(user_id=self.creator.id, tournament=self)
            return player.image.url if player.image else 'default-image.jpg'
        except Player.DoesNotExist:
            return '../../frontend/assets/css/uknown.png'

    def clean(self):
        valid_types = {'public', 'private'}
        if self.type and self.type not in valid_types:
            raise ValidationError(f"Invalid tournament type: {self.type}. Valid types are: {', '.join(valid_types)}.")

    def __str__(self):
        return self.name

class Player(models.Model):
    user    = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='players')
    score   = models.IntegerField(blank=True, null=True)
    level   = models.IntegerField(blank=True, null=True)
    rank    = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.nickname

class PlayerTournament(models.Model):
    tournament      = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='participants')
    player          = models.ForeignKey(Player, on_delete=models.SET_NULL, null=True, blank=True, related_name='tournament_entries')
    status_choices  = [('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined')]
    status          = models.CharField(max_length=10, choices=status_choices, default='pending')
    role_choices    = [('creator', 'Creator'), ('participant', 'Participant')]
    role            = models.CharField(max_length=11, choices=role_choices, default='participant')
    nickname        = models.CharField(max_length=50, default="NoNickname", blank=True, null=True)
    avatar          = models.ImageField(upload_to='player_images/', blank=True, null=True)
    invited_at      = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Invitation for {self.user.username} to {self.tournament.name} - Status: {self.status}"
    
class Notification(models.Model):
    user        = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='notifications')
    message     = models.TextField()
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}"

class Match(models.Model):
    player1         = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player1')
    player2         = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player2')
    tournament      = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches')
    created_at      = models.DateTimeField(auto_now_add=True)
    status_choices  = [('pending', 'Pending'), ('completed', 'Completed')]
    status          = models.CharField(max_length=10, choices=status_choices, default='pending')
    score           = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"Match between {self.player1.nickname} and {self.player2.nickname} in {self.tournament.name}"



# class Invitation(models.Model):
#     user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='invitations')
#     tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='invitations')
#     status_choices = [('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined')]
#     status = models.CharField(max_length=10, choices=status_choices, default='pending')
#     invited_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Invitation for {self.user.nickname} to {self.tournament.name}"

