from django.urls import path
# from . import views
from .consumers import *
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    
    path('api/user', UserInfoView.as_view()),
    path('api/user/stats', UserStatsView.as_view()),
    path('api/user/matches', MatchHistoryView.as_view()),
    path('api/user/friendships', FriendshipView.as_view()),
    path('api/user/search', SearchUsersView.as_view()),
    path('api/user/ranking', UserRankingView.as_view()),
    path('api/user/badges', UserBadgesView.as_view()),
    path('api/user/notifications/', NotificationsView.as_view())

    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

 
