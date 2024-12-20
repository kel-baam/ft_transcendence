from django.db                  import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.conf                import settings
from django.core.exceptions     import ValidationError
from django.utils               import timezone
from django.core.exceptions     import ObjectDoesNotExist
from django.core.validators     import MinLengthValidator
from django.db.models           import UniqueConstraint



class User(AbstractUser):
    groups = models.ManyToManyField(
        Group,
        related_name='online_users',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='online_users',
        blank=True
    )

    def __str__(self):
        return self.username

    class Meta:
        app_label = 'online'

class Tournament(models.Model):
    creator      = models.ForeignKey(User, on_delete = models.CASCADE, null = True)
    name         = models.CharField(max_length = 50, unique = True, validators=[MinLengthValidator(3)], blank=False)
    type_choices = [
        ('public', 'Public'),
        ('private', 'Private')
    ]
    type         = models.CharField(max_length=50, null=True, choices=type_choices, default='private') # i remove this ", default='private'"
    created_at   = models.DateTimeField(auto_now_add=True)

    def get_creator_image(self):
        try:
            player = Player.objects.get(user_id=self.creator.id, tournament=self)
            return player.image.url if player.image else 'default-image.jpg'
        except Player.DoesNotExist:
            return '../../frontend/assets/css/uknown.png'
        
    # def clean(self):
    #     if not self.name:
    #         raise ValidationError({
    #             'name': 'Custom Error: Tournament name cannot be blank or empty.'
    #         })
    
    def __str__(self):
        return self.name

class Player(models.Model):
    user    = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='players')
    score   = models.IntegerField(blank=True, null=True)
    level   = models.IntegerField(blank=True, null=True)
    rank    = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.user.username

class PlayerTournament(models.Model):
    tournament      = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='participants')
    player          = models.ForeignKey(Player, on_delete=models.SET_NULL, null=True, blank=True, related_name='tournament_entries')
    
    status_choices  = [('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined')]
    status          = models.CharField(max_length=10, choices=status_choices, default='pending')
    
    role_choices    = [('creator', 'Creator'), ('participant', 'Participant')]
    role            = models.CharField(max_length=11, choices=role_choices, default='participant')
    
    nickname        = models.CharField(max_length=50, null=True, blank=False)
    avatar          = models.ImageField(upload_to='player_images/', null=True, blank=False)
    
    invited_at      = models.DateTimeField(auto_now_add=True)
    
    # def clean(self):
 
    #     """  Custom validation to ensure nickname and avatar are not empty. """

    #     if not self.nickname:
    #         raise ValidationError({'nickname': 'Custom Error: Nickname cannot be empty.'})
            
    #     if not self.avatar:
    #         raise ValidationError({'avatar': 'Custom Error: Avatar cannot be empty.'})
        
    #     if self.tournament.type == 'private':
    #         existing_participants = PlayerTournament.objects.filter(tournament=self.tournament, role='participant')

    #     if existing_participants.count() != 3:
    #         raise ValidationError({'tournament': 'Custom Error: A private tournament can have exactly 3 participants in total.'})
            
    class Meta:
        constraints = [
            UniqueConstraint(fields=['tournament', 'player'], name='unique_tournament_player')
        ]

    def __str__(self):
        return f"Invitation for {self.player.id} to {self.tournament.name} - Status: {self.status}"


class Match(models.Model):
    player1         = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player1')
    player2         = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player2')
    tournament      = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches')
    created_at      = models.DateTimeField(auto_now_add=True)
    status_choices  = [('pending', 'Pending'), ('completed', 'Completed')]
    status          = models.CharField(max_length=10, choices=status_choices, default='pending')
    score           = models.IntegerField(blank=True, null=True)

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


    
# class Notification(models.Model):
#     user        = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='notifications')
#     message     = models.TextField()
#     created_at  = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Notification for {self.user.username}"