from django.db                          import models
from django.contrib.auth.models         import AbstractBaseUser
from django.core.validators             import RegexValidator, MinLengthValidator
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.utils                       import timezone 

# from channels.db                        import database_sync_to_async
# from asgiref.sync                       import async_to_sync

class User(AbstractBaseUser):
    
    username       = models.CharField(max_length=50, unique=True, validators=[MinLengthValidator(3),
                RegexValidator(r'^[a-zA-Z0-9!@#$%^&*()_+=\-\[\]{};:\'",.<>?/|\\`~ \t\n\r]*$',
        'Only alphabetic, numeric, special characters, and whitespace are allowed.')])
    first_name     = models.CharField(max_length=50, validators=[MinLengthValidator(3), 
                RegexValidator(r'^[a-zA-Z_\-\r ]*$',
    'Only alphabetic characters, underscores, hyphens, carriage returns, and spaces are allowed.')]
)
    last_name      = models.CharField(max_length=50, validators=[MinLengthValidator(3),
                RegexValidator(r'^[a-zA-Z_\-\r ]*$',
    'Only alphabetic characters, underscores, hyphens, carriage returns, and spaces are allowed.'
)                                           ])
    email          = models.EmailField(max_length=50, unique=True)
    phone_number   = models.CharField(
        max_length =15,
        validators =[
            RegexValidator(
                regex  =r'^\+?1?\d{9,15}$',
                message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )
        ],
        blank=True
    )
    picture           = models.ImageField(upload_to='users_pics/', default= 'users_pics/default.png', null=True, blank=True)
    gender            = models.CharField(max_length=255, blank=True)
    nationality       = models.CharField(max_length=255, blank=True) 
    status            = models.BooleanField(default=False)
    enabled_twoFactor = models.BooleanField(default=False)
    is_verify         = models.BooleanField(default=False)
    age               = models.CharField(max_length=255, blank=True,  validators=[
            RegexValidator(
                
                regex  =r'^\d+$', 
                message="Age must be a valid positive number."
            )
        ])
    verify_token  = models.CharField(max_length=255,null=True)
    refresh_token = models.CharField(max_length=255,null=True)
    secret        = models.CharField(max_length=255,null=True)
    tmp_secret    = models.CharField(max_length=255,null=True)

    def __str__(self):
        return self.username
    class Meta:
        db_table = 'User'

class Player(models.Model):
    user  = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    score = models.FloatField(default=0)
    level = models.FloatField(default=0.0)
    rank  = models.BigIntegerField(default=0)
    
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
    type            = models.CharField(max_length=50, choices=type_choices, default='private')
    
    mode_choices    = [
        ('online', 'Online'),
        ('local', 'Local')
    ]
    mode            = models.CharField(max_length=10, choices=mode_choices, default='online')
    
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
    tournament    = models.ForeignKey(Tournament, on_delete=models.SET_NULL, null=True, blank=True, related_name='matches')
    player1       = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player1', null=True, blank=True)
    player2       = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player2', null=True, blank=True)
    room_name     = models.CharField(max_length=50, null=True)
    player1_score = models.PositiveIntegerField(default=0)
    player2_score = models.PositiveIntegerField(default=0)

    status_choices = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('exited', 'Exited')
    ]
    status = models.CharField(max_length=10, choices=status_choices, default='pending')

    def __str__(self):
        tournament_info = f"Tournament: {self.tournament.name}" if self.tournament else "No Tournament"
        return f"Match: ({tournament_info})"
    
    class Meta:
        db_table = 'Match'

class Request(models.Model):
    STATUS_CHOICES = [
        ('accepted', 'Accepted'),
        ('blocked', 'Blocked'),
        ('pending', 'Pending')
    ]
    sender   =  models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_request')
    reciever = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_request')
    status   = models.CharField(max_length=255, choices=STATUS_CHOICES)

    def __str__(self):
        return f'sender : {self.sender} , reciever : {self.reciever} ,Status: {self.status}'
        
    class Meta:
        db_table= 'Request'


class Badge(models.Model):
    name = models.CharField(max_length=255)
    icon = models.URLField() 
    class Meta:
        db_table = 'Badge'
    def __str__(self):
        return self.name

class UserBadge(models.Model):
    user        = models.ForeignKey(User, on_delete=models.CASCADE)
    badge       = models.ForeignKey(Badge, on_delete=models.CASCADE)
    unlock      = models.BooleanField(default=False)
    unlocked_at = models.DateTimeField(auto_now_add=True) 
    class Meta:
        unique_together = ('user', 'badge')
        db_table        = 'UserBadge'

    def __str__(self):
        return f"{self.user.username} - {self.badge.name}"


class Notification(models.Model):
    NOTIF_CHOICES = [
        ('tournament', 'Tournament'),
        ('enter_tournament', 'enter_tournament'),
        ('information', 'information'),
        ('request', 'Request'),
        ('invitation', 'Invitation'),
        ('accepted', 'Accepted'),
    ]
    sender         = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications')
    receiver       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_notifications', null=True, blank=True)
    type           = models.CharField(max_length=100, choices=NOTIF_CHOICES)
    message        = models.TextField(null=True)
    time           = models.DateTimeField(auto_now_add=True)
    read_at        = models.DateTimeField(null=True, blank=True)

    content_type   = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True)
    object_id      = models.PositiveIntegerField(null=True)
    content_object = GenericForeignKey('content_type', 'object_id')

    def mark_as_read(self):
        self.read_at = timezone.now()
        self.save()

    def __str__(self):
        return f"Notification from {self.sender} to {self.receiver} - Type: {self.type}"

    class Meta:
        db_table = 'Online_Notification'
