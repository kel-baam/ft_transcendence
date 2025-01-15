from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from channels.db import database_sync_to_async
from django.core.validators     import MinLengthValidator


class User(AbstractBaseUser):
    username = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=50, unique=True)
    phone_number = models.CharField(max_length=255, blank=True, null=True)
    # picture = models.BinaryField()
    # picture = models.ImageField(upload_to='user_pics/', blank=True, null=True)
    gender = models.CharField(max_length=255, null=True)
    nationality = models.CharField(max_length=255, null=True)
    status = models.BooleanField(null=True)
    
    is_verify = models.BooleanField(default=False)
    verify_token =  models.CharField(max_length=255,null=True)
    enabled_twoFactor = models.BooleanField(default=False)
    refresh_token= models.CharField(max_length=255,null=True)
    secret =  models.CharField(max_length=255,null=True)
    tmp_secret =  models.CharField(max_length=255,null=True)


    def __str__(self):
        return self.username
    class Meta:
        db_table = 'User'


class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    score = models.FloatField(default=0)
    level = models.FloatField(default=0.0)
    rank = models.BigIntegerField(default=0)
    def __str__(self):
        return f'{self.user} ,{self.score}, {self.rank}'
    class Meta:
        db_table = 'Player'

class Tournament(models.Model):
    creator         = models.ForeignKey(User, on_delete = models.CASCADE,related_name='online_tournament_creator')
    name            = models.CharField(max_length = 50, unique = True, validators=[MinLengthValidator(3)], blank=True)
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
    class Meta:
        db_table = 'Tournament'

class PlayerTournament(models.Model):
    tournament      = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='participants')
    player          = models.ForeignKey(Player, on_delete=models.SET_NULL, null=True, blank=True, related_name='tournament_entries')
    
    role_choices    = [('creator', 'Creator'), ('participant', 'Participant')]
    role            = models.CharField(max_length=11, choices=role_choices, default='participant')

    status_choices  = [('pending', 'Pending'), ('invited', 'invited'), ('accepted', 'Accepted'), ('declined', 'Declined')]

    status          = models.CharField(max_length=10, choices=status_choices, default='pending')
    
    nickname        = models.CharField(max_length=50, null=True, blank=True)
    avatar          = models.ImageField(upload_to='player_images/', null=True, blank=True)
    
    invited_at      = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        player_id = self.player.id if self.player else "Unknown Player"
        return f"Invitation for {player_id} to {self.tournament.name} - Status: {self.status}" 
    
    class Meta:
        db_table    = 'PlayerTournament'


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
        return f"Notification from {self.sender} to {self.reciever} - Type: {self.type}"
    class Meta:
        db_table= 'Notification'

# class Tournament(models.Model):
#     creator         = models.ForeignKey(User, on_delete=models.CASCADE)
#     name            = models.CharField(max_length=100, validators=[MinLengthValidator(3)])
#     status_choices  = [('pending', 'Pending'), ('started', 'started'), ('finished', 'finished')]
#     status          = models.CharField(max_length=10, choices=status_choices, default='pending')
#     created_at      = models.DateTimeField(auto_now_add=True, null=True)
#     def get_creator_image(self):
#         try:
#             player = Player.objects.get(user_id=self.creator.id, tournament=self)
#             return player.image.url if player.image else 'default-image.jpg'
#         except Player.DoesNotExist:
#             return '../../frontend/assets/css/uknown.png'

#     def __str__(self):
#         return self.name
#     class Meta:
#         db_table = 'local_tournament'
#         app_label = 'local'

# class Player(models.Model):
#     tournament  = models.ForeignKey(Tournament, on_delete=models.CASCADE)
#     nickname    = models.CharField(max_length=50)
#     avatar      = models.ImageField(upload_to='player_images/')
#     score       = models.IntegerField(default=0)
    
#     def __str__(self):
#         return self.nickname
#     class Meta:
#         db_table = 'local_player'
#         app_label = 'local'


# class Match(models.Model):
#     player1         = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player1')
#     player2         = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player2')
#     tournament      = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches')
#     created_at      = models.DateTimeField(auto_now_add=True)
#     status_choices  = [
#         ('pending', 'Pending'),
#         ('completed', 'Completed'),
#         ('exited', 'exited')]
#     status          = models.CharField(max_length=10, choices=status_choices, default='pending')

#     def __str__(self):
#         return f"Match between {self.player1.nickname} and {self.player2.nickname} in {self.tournament.name}"
#     class Meta:
#         db_table = 'local_match'
#         app_label = 'local'


