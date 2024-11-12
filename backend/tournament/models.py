from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone

# class Tournament(models.Model):
#     name = models.CharField(max_length=100)
#     def __str__(self):
#         return self.name
#     class Meta:
#         app_label = 'tournament'

# class Player(models.Model):
#     name = models.CharField(max_length=100)
#     image = models.ImageField(upload_to='player_images/', blank=True, null=True)
#     tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='players')

#     def __str__(self):
#         return self.name
    
# class Match(models.Model):
#     player1 = models.ForeignKey(Player, related_name='matches_as_player1', on_delete=models.CASCADE)
#     player2 = models.ForeignKey(Player, related_name='matches_as_player2', on_delete=models.CASCADE)
#     tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f'Match between {self.player1.name} and {self.player2.name} in {self.tournament.name}'


class User(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        related_name='tournament_users',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='tournament_users',
        blank=True
    )

    def __str__(self):
        return self.username

    class Meta:
        app_label = 'tournament'

class Player(models.Model):
    nickname = models.CharField(max_length=50, default="NoNickname")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='players')
    image = models.ImageField(upload_to='player_images/', blank=True, null=True)
    # is_guest = models.BooleanField(default=False) i think that i don't need this guest
    # cuz if it's local i don't need to know who you're and if you're in an online tour 
    # in the checkment i need to know who you're(it's effect to the validation of the form )
    is_local = models.BooleanField(default=True)

    def __str__(self):
        return self.nickname

class Tournament(models.Model):
    name = models.CharField(max_length=100)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    type_choices = [
        ('local', 'Local'),
        ('public', 'Public'),
        ('private', 'Private')
    ]
    
    type = models.CharField(max_length=50, blank=True, null=True, choices=type_choices)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def clean(self):
        valid_types = {'local', 'public', 'private'}
        if self.type and self.type not in valid_types:
            raise ValidationError(f"Invalid tournament type: {self.type}. Valid types are: {', '.join(valid_types)}.")
    
    def __str__(self):
        return self.name

class PlayerTournament(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='tournament_entries')
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='participants')
    status_choices = [('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined')]
    status = models.CharField(max_length=10, choices=status_choices, default='pending')
    # role_choices = [('creator', 'Creator'), ('participant', 'Participant')]
    # role = models.CharField(max_length=11, choices=role_choices, default='participant')
    invited_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Invitation for {self.user.username} to {self.tournament.name} - Status: {self.status}"
    
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='notifications')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}"


class Match(models.Model):
    player1 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player1')
    player2 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player2')
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches')
    created_at = models.DateTimeField(auto_now_add=True)
    status_choices = [('pending', 'Pending'), ('completed', 'Completed')]
    status = models.CharField(max_length=10, choices=status_choices, default='pending')
    score = models.CharField(max_length=50, blank=True, null=True)  # e.g., "3-2", if relevant to track

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

