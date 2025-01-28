from django.contrib import admin
from .models import User,Player
# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'first_name', 'last_name', 'email', 'phone_number','password')


@admin.register(Player)
class UserAdmin(admin.ModelAdmin):
    list_display = ('user', 'score', 'Rank', 'level')

# @admin.register(django_migrations)
# class UserAdmin(admin.ModelAdmin):
#     list_display = ('id', 'app','name')