from django.urls import path
# from . import views
from .consumers import *
from .views import *

urlpatterns = [
    path('api/user/<str:username>', UserInfoView.as_view()),
    path('api/user/<str:username>/stats', UserStatsView.as_view()),
    path('api/user/<str:username>/matches/', MatchHistoryView.as_view()),
    path('api/user/<str:username>/friendships', FriendshipView.as_view())
    # path('api/user/<str:username>', UserInfoView.as_view()),
    # path('api/user/<str:username>/stats', UserStatsView.as_view()),
    # path('api/user/<str:username>/matches/', MatchHistoryView.as_view()),
    # path('api/user/<str:username>/friendships/', MatchHistoryView.as_view())

]

# websocket_urlpatterns =[
#     path('requests/', RequestUpdateConsumer.as_asgi()),
# ]

