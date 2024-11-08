from django.db import models
from django.contrib.auth.models import AbstractBaseUser

class User(AbstractBaseUser):
    username = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(max_length=254, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    picture = models.BinaryField(null=True, blank=True)
    gender = models.CharField(max_length=255, null=True)
    nationality = models.CharField(max_length=255, null=True)
    status = models.BooleanField(default=False)

    def __str__(self):
        return self.username
    
# class Tournament(models.Model):
#     name = models.CharField(max_length=100)
#     def __str__(self):
#         return self.name

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

# class Match(models.Model):
#     date = models.DateField()
#     player1_points = models.PositiveIntegerField()  
#     player2_points = models.PositiveIntegerField()    
#     player1 = models.ForeignKey(Player, on_delete=models.CASCADE,related_name='player1')             
#     player2 = models.ForeignKey(Player,on_delete=models.CASCADE,related_name='player2')
#     class Meta:
#         verbose_name = "Match"
#         verbose_name_plural = "Matches"         
#     def __str__(self):
#         return f"Match on {self.date} - Player {self.player_id1} vs Player {self.player_id2}"