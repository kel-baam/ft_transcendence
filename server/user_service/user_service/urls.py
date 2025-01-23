from django.urls import path
# from . import views
# from .consumers import *
from .views import *
from django.conf import settings
from django.conf.urls.static import static

# print(">>>>>>>>>>>>>>>>>> here ")
urlpatterns = [
    # path('api/user', UserInfoView.as_view()),
    # path('api/user/stats', UserStatsView.as_view()),
    # path('api/user/matches/', MatchHistoryView.as_view()),
    # path('api/user/friendships', FriendshipView.as_view())
    path('api/user/', UserInfoView.as_view()),
    path('api/user/stats/', UserStatsView.as_view()),
    path('api/user/matches/', MatchHistoryView.as_view()),
    path('api/user/friendships/', FriendshipView.as_view())

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# websocket_urlpatterns =[
#     path('requests/', RequestUpdateConsumer.as_asgi()),
# ]

# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


