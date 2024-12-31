from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from channels.db import database_sync_to_async

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
    is_verify = models.BooleanField(default=False,null=True)
    verify_token =  models.CharField(max_length=255,null=True)
    # refresh_token= models.CharField(max_length=255,null=True) 


    def __str__(self):
        return self.username
    class Meta:
        db_table = 'User'

class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    score = models.FloatField(default=0)
    level = models.FloatField(default=0.0)
    Rank = models.BigIntegerField(default=0)
    def __str__(self):
        return f'{self.user} ,{self.score}, {self.Rank}'
    class Meta:
        db_table = 'Player'

class Request(models.Model):
    STATUS_CHOICES = [
        ('accepted', 'Accepted'),
        ('blocked', 'Blocked'),
        ('pending', 'Pending')
    ]
    sender =  models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_request')
    reciever = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_request')
    status = models.CharField(max_length=255, choices=STATUS_CHOICES)
    # @database_sync_to_async
    # def get_sender(self):
    #     return self.sender

    # @database_sync_to_async
    # def get_receiver(self):
        # return self.receiver
    def __str__(self):
        # sender = self.get_sender()
        # reciever = self.get_receiver()
        # print(">>>>>>>>>>>>>>>>>>> sender")
        return f'sender : {self.sender} , reciever : {self.reciever} ,Status: {self.status}'
        
    class Meta:
        db_table= 'Request'

class Match(models.Model):
    # STATUS_CHOICES = [
    #     ('active', 'Active'),
    #     ('completed', 'Completed')
    # ]
    player1 = models.ForeignKey(Player, on_delete=models.CASCADE,related_name='player1')            
    player2 = models.ForeignKey(Player,on_delete=models.CASCADE,related_name='player2')
    date = models.DateField()
    player1_points = models.PositiveIntegerField()  
    player2_points = models.PositiveIntegerField()
    # status =  models.CharField(max_length=255, choices=STATUS_CHOICES)
    class Meta:
        verbose_name = "Match"
        verbose_name_plural = "Matches"         
    def __str__(self):
        return f"Match on {self.date} - Player {self.player1} vs Player {self.player2}"
    class Meta:
        db_table= 'Match'

class Achievement(models.Model):
    name = models.CharField(max_length=255) 
    status = models.BooleanField(default=False)
    picture = models.JSONField()
    PlayerId = models.ForeignKey(Player,on_delete=models.CASCADE,related_name='badge_locked')
    class Meta:
        verbose_name = "badge"
        verbose_name_plural = "badges"
    def __str__(self):
        return self.name
    class Meta:
        db_table= 'Achievement'

class Notification(models.Model):
    NOTIF_CHOICES = [
        ('tournament', 'Tournament'),
        ('request', 'Request'),
        ('accepted', 'Accepted'),
    ]
    
    sender =  models.ForeignKey(User, on_delete=models.CASCADE, related_name='notif_from')
    reciever = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notif_to')
    type = models.CharField(max_length=10, choices=NOTIF_CHOICES)
    time = models.TimeField()
    def __str__(self):
        return self.name
    class Meta:
        db_table= 'Notification'