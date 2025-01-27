#chat/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatItemData, chatListItems
router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('Overview/', chatListItems.as_view()), #to get data of chatlistitems 
    path("chat_<str:room_name>/", ChatItemData.as_view(), name="room_name"), #to get data of the room


] 


 