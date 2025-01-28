# from django.db import models
# import pyotp
# from django.contrib.auth.hashers import make_password, check_password
# from django.contrib.auth.models import AbstractBaseUser
# from channels.db import database_sync_to_async

# Create your models here.


# class User(AbstractBaseUser):
#     username = models.CharField(max_length=50, unique=True)
#     first_name = models.CharField(max_length=50)
#     last_name = models.CharField(max_length=50)
#     email = models.EmailField(max_length=50, unique=True)
#     phone_number = models.CharField(max_length=255, blank=True, null=True)
#     # picture = models.BinaryField()
#     # picture = models.JSONField(null=True)
#     gender = models.CharField(max_length=255, null=True)
#     nationality = models.CharField(max_length=255, null=True) 
#     status = models.BooleanField(null=True)
#     enabled_twoFactor = models.BooleanField(default=False)
#     is_verify = models.BooleanField(default=False,null=True)
#     verify_token =  models.CharField(max_length=255,null=True)
#     # refresh_token= models.CharField(max_length=255,null=True) 
#     # picture = models.CharField(max_length=1000, blank=True, null=True)


    
#     def __str__(self):
#         return self.username
    # class Meta:
    #     db_table = 'User'

# class User(AbstractBaseUser):
#     username = models.CharField(max_length=50, unique=True)
#     first_name = models.CharField(max_length=50)
#     last_name = models.CharField(max_length=50)
#     email = models.EmailField(max_length=50, unique=True)
#     phone_number = models.CharField(max_length=255, blank=True, null=True)
#     # picture = models.BinaryField()
#     picture = models.JSONField(null=True)
#     gender = models.CharField(max_length=255, null=True)
#     nationality = models.CharField(max_length=255, null=True) 
#     status = models.BooleanField(null=True)
#     enabled_twoFactor = models.BooleanField(default=False)
#     is_verify = models.BooleanField(default=False,null=True)
#     verify_token =  models.CharField(max_length=255,null=True)
#     # refresh_token= models.CharField(max_length=255,null=True) 


#     def __str__(self):
#         return self.username
#     class Meta:
        # db_table = 'User'

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





from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from channels.db import database_sync_to_async
from django.core.validators import RegexValidator, MinLengthValidator


class User(AbstractBaseUser):
    
    username = models.CharField(max_length=50, unique=True, validators=[MinLengthValidator(3),
                RegexValidator(r'^[a-zA-Z0-9!@#$%^&*()_+=\-\[\]{};:\'",.<>?/|\\`~ \t\n\r]*$',
        'Only alphabetic, numeric, special characters, and whitespace are allowed.')])
    first_name = models.CharField(max_length=50, validators=[MinLengthValidator(3), 
                RegexValidator(r'^[a-zA-Z_\-\r ]*$',
    'Only alphabetic characters, underscores, hyphens, carriage returns, and spaces are allowed.')]
)
    last_name = models.CharField(max_length=50, validators=[MinLengthValidator(3),
                RegexValidator(r'^[a-zA-Z_\-\r ]*$',
    'Only alphabetic characters, underscores, hyphens, carriage returns, and spaces are allowed.'
)                                           ])
    email = models.EmailField(max_length=50, unique=True)
    phone_number = models.CharField(
        max_length=15,  # Enough to store international numbers
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',  # Regex for international phone numbers
                message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
            )
        ],
        blank=True
    )
    picture = models.ImageField(upload_to='users_pics/', default= 'users_pics/default.png', null=True, blank=True)
    gender = models.CharField(max_length=255, blank=True)
    nationality = models.CharField(max_length=255, blank=True) 
    status = models.BooleanField(null=True)
    enabled_twoFactor = models.BooleanField(default=False)
    is_verify = models.BooleanField(default=False)
    age = models.CharField(max_length=255, blank=True,  validators=[
            RegexValidator(
                
                regex=r'^\d+$', 
                message="Age must be a valid positive number."
            )
        ])
    verify_token =  models.CharField(max_length=255,null=True)


    class Meta:
        db_table = 'User'


    def __str__(self):
        return self.username
class PrivateMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField() 
    timestamp = models.DateTimeField(auto_now_add=True) 
    read = models.BooleanField(default=False)
    roomName = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ['timestamp']  # Trier les messages par date d'envoi
        db_table='PrivateMessage'


    def __str__(self):
        return f"De {self.sender.username} à {self.receiver.username}: {self.content[:20]}"

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
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed')
    ]
    player1 = models.ForeignKey(Player, on_delete=models.CASCADE,related_name='player1')            
    player2 = models.ForeignKey(Player,on_delete=models.CASCADE,related_name='player2')
    date = models.DateField()
    player1_points = models.PositiveIntegerField()  
    player2_points = models.PositiveIntegerField()
    status =  models.CharField(max_length=255, choices=STATUS_CHOICES)
    # class Meta:
    #     verbose_name = "Match"
    #     verbose_name_plural = "Matches"         
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