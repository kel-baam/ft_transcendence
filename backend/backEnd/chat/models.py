from django.db import models
from django.contrib.auth.models import User

class User(models.Model):
    username = models.CharField(max_length=20)
    first_name = models.CharField(max_length=15)
    last_name = models.CharField(max_length=15)
    email = models.EmailField(max_length=20)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    picture = models.BinaryField()
    gender = models.CharField(max_length=15)
    nationality = models.CharField(max_length=15)
    status = models.CharField(max_length=20, null=True, blank=True)
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

    def __str__(self):
        return f"De {self.sender.username} à {self.receiver.username}: {self.content[:20]}"

   
