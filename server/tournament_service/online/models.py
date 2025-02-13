from django.db                  import models
from django.core.validators     import MinLengthValidator
from django.db.models           import UniqueConstraint
from django.contrib.auth.models import AbstractBaseUser
from django.utils import timezone 
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
# from django.contrib.auth.models import User
from asgiref.sync                   import async_to_sync



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


class Tournament(models.Model):
    creator         = models.ForeignKey(User, on_delete = models.CASCADE,related_name='online_tournament_creator')
    name            = models.CharField(max_length = 50, unique = True, validators=[MinLengthValidator(3)], blank=True)
    type_choices    = [
        ('public', 'Public'),
        ('private', 'Private')
    ]
    type            = models.CharField(max_length=50, choices=type_choices) # i remove this ", default='private'"
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

class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    score = models.FloatField(default=0)
    level = models.FloatField(default=0.0)
    rank = models.BigIntegerField(default=0)

    def get_user_info(self):
        return self.user.username, self.score, self.rank

    def __str__(self):
        return f'{self.user} ,{self.score}, {self.rank}'

    class Meta:
        db_table = 'Player'


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
    tournament  = models.ForeignKey(Tournament, on_delete=models.SET_NULL, null=True, blank=True, related_name='matches')
    player1     = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player1')
    player2     = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player2')
    room_name   = models.CharField(max_length=50)  # Store the match room name
    created_at  = models.DateTimeField(auto_now_add=True)
    
    status_choices = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('exited', 'Exited')
    ]
    status = models.CharField(max_length=10, choices=status_choices, default='pending')

    def __str__(self):
        tournament_info = f"Tournament: {self.tournament.name}" if self.tournament else "No Tournament"
        return f"Match: {self.player1.user.username} vs {self.player2.user.username} ({tournament_info})"
    
    class Meta:
        db_table = 'Match'

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
        ('enter_tournament', 'enter_tournament'),
        ('information', 'information'),
        ('request', 'Request'),
        ('invitation', 'Invitation'),
        ('accepted', 'Accepted'),
    ]
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_notifications')
    type = models.CharField(max_length=100, choices=NOTIF_CHOICES)
    message = models.TextField()  # A field for the actual notification message
    time = models.DateTimeField(auto_now_add=True)  # Store both date and time of notification creation
    read_at = models.DateTimeField(null=True, blank=True)  # Track when the notification was read

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id    = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    def mark_as_read(self):
        self.read_at = timezone.now()
        self.save()

    def __str__(self):
        return f"Notification from {self.sender} to {self.receiver} - Type: {self.type}"

    class Meta:
        db_table = 'Notification'