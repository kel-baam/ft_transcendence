from django.db                  import models
from django.contrib.auth.models import AbstractBaseUser
from django.db.models           import UniqueConstraint
from django.core.validators     import MinLengthValidator
from online.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
# class User(AbstractBaseUser):
#     username = models.CharField(max_length=50, unique=True)
#     first_name = models.CharField(max_length=50)
#     last_name = models.CharField(max_length=50)
#     email = models.EmailField(max_length=50, unique=True)
#     phone_number = models.CharField(max_length=255, blank=True, null=True)
#     # picture = models.BinaryField()
#     # picture = models.ImageField(upload_to='user_pics/', blank=True, null=True)
#     gender = models.CharField(max_length=255, null=True)
#     nationality = models.CharField(max_length=255, null=True)
#     status = models.BooleanField(null=True)
    
#     is_verify = models.BooleanField(default=False)
#     verify_token =  models.CharField(max_length=255,null=True)
#     enabled_twoFactor = models.BooleanField(default=False)
#     refresh_token= models.CharField(max_length=255,null=True)
#     secret =  models.CharField(max_length=255,null=True)
#     tmp_secret =  models.CharField(max_length=255,null=True)


#     def __str__(self):
#         return self.username
#     class Meta:
#         db_table = 'User'


class Tournament(models.Model):
    creator         = models.ForeignKey(User, on_delete=models.CASCADE)
    name            = models.CharField(max_length=100, validators=[MinLengthValidator(3)])
    status_choices  = [('pending', 'Pending'), ('started', 'started'), ('finished', 'finished')]
    status          = models.CharField(max_length=10, choices=status_choices, default='pending')
    created_at      = models.DateTimeField(auto_now_add=True, null=True)
    def get_creator_image(self):
        try:
            player = Player.objects.get(user_id=self.creator.id, tournament=self)
            return player.image.url if player.image else 'default-image.jpg'
        except Player.DoesNotExist:
            return '../../frontend/assets/css/uknown.png'

    def __str__(self):
        return self.name
    class Meta:
        db_table = 'local_tournament'

class Player(models.Model):
    tournament  = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='participants')
    nickname    = models.CharField(max_length=50)
    avatar      = models.ImageField(upload_to='player_images/')
    score       = models.IntegerField(default=0)
    
    def __str__(self):
        return self.nickname
    class Meta:
        db_table = 'local_player'

class Match(models.Model):
    player1         = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player1')
    player2         = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player2')
    tournament      = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches')
    created_at      = models.DateTimeField(auto_now_add=True)
    status_choices  = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('exited', 'exited')]
    status          = models.CharField(max_length=10, choices=status_choices, default='pending')

    def __str__(self):
        return f"Match between {self.player1.nickname} and {self.player2.nickname} in {self.tournament.name}"
    class Meta:
        db_table = 'local_match'

