from django.db import models
from django.contrib.auth.models import AbstractBaseUser

class Tournament(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name
    class Meta:
        app_label = 'tournament'

class Player(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='player_images/', blank=True, null=True)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='players')

    def __str__(self):
        return self.name
    
class Match(models.Model):
    player1 = models.ForeignKey(Player, related_name='matches_as_player1', on_delete=models.CASCADE)
    player2 = models.ForeignKey(Player, related_name='matches_as_player2', on_delete=models.CASCADE)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Match between {self.player1.name} and {self.player2.name} in {self.tournament.name}'
