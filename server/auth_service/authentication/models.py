from django.db import models
import pyotp
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import AbstractBaseUser
# from channels.db import database_sync_to_async

# Create your models here.
class User(AbstractBaseUser):
    username = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=50, unique=True)
    phone_number = models.CharField(max_length=255, blank=True, null=True)
    # picture = models.BinaryField()
    picture = models.JSONField(null=True)
    gender = models.CharField(max_length=255, null=True)
    nationality = models.CharField(max_length=255, null=True) 
    status = models.BooleanField(null=True)
    enabled_twoFactor = models.BooleanField(default=False)
    def __str__(self):
        return self.username
    class Meta:
        db_table = 'User'

# class User(models.Model):
#     password = models.CharField(max_length=128, null=True)  # For hashed passwords
#     # intraId = models.IntegerField(unique=True, blank=True, null=True)
#     username = models.CharField(max_length=150)
#     first_name = models.CharField(max_length=30)
#     last_name = models.CharField(max_length=30)
#     email = models.EmailField(max_length=254)
#     picture = models.BinaryField()
#     phone_number = models.CharField(max_length=15, blank=True, null=True)
#     gender = models.CharField(max_length=255,default='')
#     nationality = models.CharField(max_length=255,default='')
#     enabled_twoFactor = models.BooleanField(default=False)
#     refresh_token= models.CharField(max_length=255,null=True) 
#     secret =  models.CharField(max_length=255,null=True)
#     tmp_secret =  models.CharField(max_length=255,null=True)

#     class Meta:
#         db_table = 'User'

    # image_url = models.URLField(max_length=255, default="https://example.com/default-image.jpg")

    # def __str__(self):
    #     return self.username
    # def set_password(self, raw_password):
    #     self.password = make_password(raw_password)
    # def check_password(self, raw_password):
    #     return check_password(raw_password, self.password)
 
# class Player(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     score = models.FloatField()
#     level = models.FloatField()
#     Rank = models.BigIntegerField()
#     # badge
#     def __str__(self):
#         return f'{self.user} ,{self.score}, {self.Rank}'

# class Request(models.Model):
#     STATUS_CHOICES = [
#         ('sent', 'Sent'),
#         ('received', 'Received'),
#         ('accepted', 'Accepted'),
#         ('blocked', 'Blocked'),
#     ]
#     sender =  models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_request')
#     reciever = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_request')
#     status = models.CharField(max_length=10, choices=STATUS_CHOICES)
#     def __str__(self):
#         return f'sender : {self.sender} , reciever : {self.receiver} ,Status: {self.status}'

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

# class Achievement(models.Model):
#     name = models.CharField(max_length=255) 
#     status = models.BooleanField(default=False)
#     picture = models.BinaryField()
#     PlayerId = models.ForeignKey(Player,on_delete=models.CASCADE,related_name='badge_locked')
#     class Meta:
#         verbose_name = "badge"
#         verbose_name_plural = "badges"
#     def __str__(self):
#         return self.name

# class Notification(models.Model):
#     NOTIF_CHOICES = [
#         ('tournament', 'Tournament'),
#         ('request', 'Request'),
#         ('accepted', 'Accepted'),
#     ]
    
#     sender =  models.ForeignKey(User, on_delete=models.CASCADE, related_name='notif_from')
#     reciever = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notif_to')
#     type = models.CharField(max_length=10, choices=NOTIF_CHOICES)
#     time = models.TimeField()
#     def __str__(self):
#         return self.name