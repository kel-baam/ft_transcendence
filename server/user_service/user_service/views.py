from .models import *
from rest_framework.response import Response
from .serializers import *
# from .utils import *
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.conf import settings
# from django.core.files import File
from django.core.files.uploadedfile import InMemoryUploadedFile
from io import BytesIO
from django.db.models import OuterRef, Exists, Q, F
import os
import requests
from django.core.cache import cache


class UserInfoView(APIView):

    def get(self, request):
        try:
            fields ={}
            if request.query_params.get('fields', None):
                fields = set(request.query_params.get('fields', None).split(','))
            if request.query_params.get('username', None) :
                other_user = User.objects.get(username=request.query_params.get('username'))
                logged_in_user = User.objects.get(username=request.META.get('HTTP_X_AUTHENTICATED_USER'))
                Userserializer = UserSerializer(other_user, exclude = ['password'], context = {'logged_in_user' : logged_in_user}).data
            else :
                username = request.META.get('HTTP_X_AUTHENTICATED_USER')
                user = User.objects.get(username=username)
                Userserializer =UserSerializer(user, exclude = ['password'], context = {'logged_in_user' : user}, fields=fields).data
            return Response(Userserializer , status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response( str(e),  status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except serializers.ValidationError:
            return Response({key: value[0] for key, value in Userserializer.errors.items()}, status=status.HTTP_400_BAD_REQUEST)

        
    def put(self, request):
        try:
            username = request.META.get('HTTP_X_AUTHENTICATED_USER')
            print(">>>>>>>>>>>>>>>>>>>>> the username : ", username )
            user_instatnce = User.objects.get(username=username)
            user_instatnce.refresh_from_db()
            print("*****************************> request.data : ", request.data)
            data = request.data.copy()
            print(">>>>>>>>>>>>>>>>>> data coming : ", data)
            if 'picture' in request.FILES:
                data['picture'] = request.FILES.get('picture', None)
            
            userSerializer = UserSerializer(user_instatnce, data=data, partial=True)
            print("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
            if userSerializer.is_valid(raise_exception=True):
                userSerializer.save()
                # cache.clear()
                # updated_user.refresh_from_db()  # Force reload directly from DB
                update_user =  User.objects.get(username=username)
                print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> updated_user.status : ",  update_user.status,update_user.id)
                user_instatnce.refresh_from_db()
                # user_instatnce.status = data['status']
                return Response(userSerializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except serializers.ValidationError:
            return Response({key: value[0] for key, value in userSerializer.errors.items()}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("------------------------> here 500 internal server : ", str(e))
            return Response( str(e),  status=status.HTTP_500_INTERNAL_SERVER_ERROR) 

    def post(self, request):
        try:
            data = request.data.copy()
            if data.get('picture'):
                response = requests.get(data['picture'], stream=True)
                if response.status_code == 200:
                    folder_name = 'user_pics'
                    folder_path = os.path.join(settings.MEDIA_ROOT, folder_name)
                    if not os.path.exists(folder_path):
                        os.makedirs(folder_path, exist_ok=True) 
                    file_name = data['picture'].split('/')[-1]
                    # file_path = os.path.join(folder_path, file_name)
                    in_memory_file = InMemoryUploadedFile(
                    file=BytesIO(response.content), 
                    field_name='picture',
                    name=file_name,
                    content_type='image/jpeg',
                    size=len(response.content),
                    charset=None
                    )
                data['picture'] = in_memory_file
            Userserializer = UserSerializer(data=data)
            if Userserializer.is_valid(raise_exception=True):
                Userserializer.save()
                return Response({"message " : "the user added successfully"}, status=status.HTTP_200_OK)
        except serializers.ValidationError as e:
            
            return Response({key: value[0] for key, value in Userserializer.errors.items()}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # print(">>>>>>>>>>>>>>>>>>> here problem : ", str(e))
            return Response( str(e),  status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

        
        
class  UserStatsView(APIView):


    def get(self, request):
        try:
            if request.query_params.get('username', None) :
                user = User.objects.get(username=request.query_params.get('username'))
            else :
                username = request.META.get('HTTP_X_AUTHENTICATED_USER')
                user = User.objects.get(username=username)

            matches_as_player1 = Match.objects.filter(player1=Player.objects.get(user=user), status__in=['completed', 'exited'])
            player1_wins = matches_as_player1.filter(player1_score__gt=models.F('player2_score')).count()
            player1_losses = matches_as_player1.filter(player1_score__lt=models.F('player2_score')).count()

            matches_as_player2 = Match.objects.filter(player2=Player.objects.get(user=user), status__in=['completed', 'exited'])
            player2_wins = matches_as_player2.filter(player2_score__gt=models.F('player1_score')).count()
            player2_losses = matches_as_player2.filter(player2_score__lt=models.F('player1_score')).count()
            
            wins = player1_wins + player2_wins
            losses = player1_losses + player2_losses
            total_matches = matches_as_player1.count() + matches_as_player2.count()

            return Response({
                "total_matches": total_matches,
                "wins": wins,
                "losses": losses
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("--------------------------> here the internal server in stats ", str(e))
            return Response( str(e),  status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class MatchHistoryView(APIView):


    def get(self, request):
        try:
            if request.query_params.get('username', None) :
                user = User.objects.get(username=request.query_params.get('username'))
            else :
                username = request.META.get('HTTP_X_AUTHENTICATED_USER')
                user = User.objects.get(username=username)
            matches = Match.objects.filter(
                (models.Q(player1=Player.objects.get(user=user)) | models.Q(player2=Player.objects.get(user=user)) )
                 & (models.Q(status='completed') | models.Q(status='exited'))
            )
            print("-----------------------> matches : ", matches)
            matches = MatchSerializer(matches, many=True, fields={'player1', 'player2','player1_score',  'player2_score', 'created_at'}).data
            print("------------>>>>>>>>>>>>>>>>>>>>>>-----------> matches : ", matches)
            return Response(matches, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("--------------------------> here the internal server in game history  ", str(e))
            return Response( str(e),  status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except serializers.ValidationError:
            return Response({key: value[0] for key, value in matches.errors.items()}, status=status.HTTP_400_BAD_REQUEST)
        
    def post(self, request):
        try:
            serializer = MatchSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"message" : "the match was created"}, status=status.HTTP_201_CREATED)
        except Exception as e:

            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except serializers.ValidationError:
            return Response({key: value[0] for key, value in serializer.errors.items()}, status=status.HTTP_400_BAD_REQUEST)

            
    def put(self, request):
        try:
            if 'id' not in request.data:
                raise  KeyError({"message" : "The id  is missing."})
            match_instance = Match.objects.get(id = request.data['id'])
            serializer = MatchSerializer(match_instance, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response("hello the match was updated", status=status.HTTP_200_OK)
        except Match.DoesNotExist:
            return Response({"message" : "match not found"}, status= status.HTTP_404_NOT_FOUND)
        except serializers.ValidationError:
            return  Response({key: value[0] for key, value in serializer.errors.items()}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError as e:
            return Response(e.args[0], status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status= status.HTTP_500_INTERNAL_SERVER_ERROR)

            
    

class FriendshipView(APIView):
    #---------------get method---------------#
    def get(self, request):
     
        try:
            if request.query_params.get('username', None) :
                user = User.objects.get(username=request.query_params.get('username'))
            else :
                user = User.objects.get(username=request.META.get('HTTP_X_AUTHENTICATED_USER'))
            status_filter = request.query_params.get('status', None)
            data = []
            if status_filter == 'accepted':
                friends = User.objects.filter(
                    models.Q(sent_request__status='accepted', sent_request__reciever=user) |
                    models.Q(received_request__status='accepted', received_request__sender=user)
                ).annotate(request_id=models.Case(
                    models.When(sent_request__status='accepted', then=models.F("sent_request__id")),
                    models.When(received_request__status='accepted', then=models.F("received_request__id")),
                    default=None,
                    output_field=models.IntegerField()
                ))
                data = UserSerializer(friends, many=True, fields= ['id', 'picture', 'username', 'first_name', 'last_name', 'request_id']).data

            elif status_filter == 'recieved':
                pending = User.objects.filter(
                    models.Q(sent_request__status='pending', sent_request__reciever=user)
                ).annotate(request_id=models.F("sent_request__id"))
                data = UserSerializer(pending, many=True, fields= ['id', 'picture', 'username', 'first_name', 'last_name','request_id']).data

            elif status_filter == 'sent':
                sended = User.objects.filter(
                    models.Q(received_request__status='pending', received_request__sender=user)
                ).annotate(request_id=models.F("received_request__id"))
                data = UserSerializer(sended, many=True, fields= ['id', 'picture', 'username', 'first_name', 'last_name','request_id']).data

            elif status_filter == 'blocked':
                blocked = User.objects.filter(
                    models.Q(sent_request__status='blocked', sent_request__sender=user)
                ).annotate(request_id=models.F("sent_request__id"))
                data = UserSerializer(blocked, many=True, fields= ['id', 'picture', 'username', 'first_name', 'last_name']).data
            return Response(data, status=status.HTTP_200_OK)
        except serializers.ValidationError:
             return  Response({key: value[0] for key, value in serializers.ValidationError.errors.items()}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    #-----------------delete method----------------#

    def delete(self, request):
        try:
            request_instance = Request.objects.get(id=request.query_params.get('id', None))
            request_instance.delete()
            return Response({"message": "Request deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Request.DoesNotExist:
            return Response({"error": "Request not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    #-----------------put method----------------#

    def put(self, request):
        try:
            data = request.data
            user = User.objects.get(username=request.META.get('HTTP_X_AUTHENTICATED_USER'))
            if data['status'] == 'blocked':
                targetUser = User.objects.get(username=data['target'])
                request_instance = Request.objects.get(
                Q(sender=user, reciever=targetUser) | Q(sender=targetUser, reciever=user)
                )
                if request_instance.sender != user:
                    request_instance.sender, request_instance.reciever = request_instance.reciever, request_instance.sender
            else:
                request_instance = Request.objects.get(id=data['id'])
            print(">>>>>>>>>>>>>>>>>>>>>>>>>>>> the data coming : ", data)
            serializer = RequestSerializer(request_instance, data=data, partial=True,
             context={'user_type': 'both'}, fields=['id', 'sender', 'reciever', 'status'])
            if serializer.is_valid(raise_exception=True):
                serializer.save() 
                return Response({"message": "Request updated successfully"}, status=status.HTTP_200_OK)
        except Request.DoesNotExist:
            return Response({"error": "Request not found"}, status=status.HTTP_404_NOT_FOUND)
        except serializers.ValidationError:
            return  Response({key: value[0] for key, value in serializer.errors.items()}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(">>>>>>>>>>>>>>>>>>>>>>>>>>>> here the internal server happens : ", str(e))
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    #------------------ post method--------------#

    def post(self, request):
        try:
            data = request.data.copy()
            username = request.META.get('HTTP_X_AUTHENTICATED_USER')
            data['sender'] = User.objects.get(username=username).id
            if data['sender'] == data['reciever']:
                return Response({"message" : "loopback invitation "}, status=status.HTTP_400_BAD_REQUEST)
            serializer = RequestSerializer(data=data, context={'user_type': 'both'})
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"message" : "Request created successfully"}, status=status.HTTP_201_CREATED)
        except serializers.ValidationError:
            return  Response({key: value[0] for key, value in serializer.errors.items()}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class UserRankingView(APIView):
    def get(self, request):
        try:
            top = request.query_params.get('top', None)
            if top is not None and top.isdigit():
                limit = int(top)
                players = list(User.objects.select_related('player').order_by('player__rank')[:limit]
                            .annotate(rank=F('player__rank'), score =F('player__score'), level =F('player__level') ))
            else:
                players = list(User.objects.select_related('player').order_by('player__rank').
                            annotate(rank=F('player__rank'), score =F('player__score'), level =F('player__level') ))
                
            results = UserSerializer(players, many=True, fields={'username', 'picture', 'score', 'rank', 'level'}).data 

            return Response(results, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
class SearchUsersView(APIView):
    def get(self, request):
        try:
            query = request.query_params.get('q', None)
            users = User.objects.filter(username__istartswith=query)[:5]
            results = [
                UserSerializer(user, fields= {'id', 'username', 'picture'}).data
                for user in users
                ]
            return Response(results, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class UserBadgesView(APIView):
    def get(self, request):
        # print(">>>>>>>>>>>>>>>>>>>>...here user badges ")
        try:
            user = request.META.get('HTTP_X_AUTHENTICATED_USER')
            # print(">>>>>>>>>>>>>>>>>>>> here before search ")
            userBadges = UserBadge.objects.filter(user=User.objects.get(username=user), badge=OuterRef('pk'))
            # print(">>>>>>>>>>>>>>>>>>  userBadges : ", userBadges)
            # Annotate each badge with "unlocked" status
            badges = Badge.objects.annotate(
                unlocked=Exists(userBadges)
            ).values('id', 'name', 'icon', 'unlocked')
            # print(">>>>>>>>>>>>>>>>>>>>> here the badges : ", badges )
            UserBadges = [
                BadgeSerializer(badge).data
                for badge in badges 
            ]
            # print(">>>>>>>>>>>>>>>>>>>>> userBadges : ", UserBadges)
            # badgesSerializer = BadgeSerializer(badges)
            # print(">>>>>>>>>>>>>> here badges after serializer : ", badgesSerializer.data)
            return Response(UserBadges, status=status.HTTP_200_OK)
        except Exception as e:
                # print(">>>>>>>>>>>>>>>>>>>> e : ", str(e))
                return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def post(self, request):
        try:
            # user = request.META.get('HTTP_X_AUTHENTICATED_USER')
            # print(">>>>>>>>>>>>>>>>>>>> here in post locked badge ---------------")
            # print(">>>>>>>>>>>>>>>>>> the data came from the locked bage ",request.data )
            user_badges_serializer  = UserBadgeSerializer(data=request.data)
            if(user_badges_serializer.is_valid(raise_exception=True)):
                user_badges_serializer.save()
            return Response({"message":"the badge was locked"}, status=status.HTTP_201_CREATED)
        except serializers.ValidationError:
            return  Response({key: value[0] for key, value in user_badges_serializer.errors.items()}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class NotificationsView(APIView):
    def get(self, request):
        try:
            username = request.META.get('HTTP_X_AUTHENTICATED_USER')
            user     = User.objects.get(username=username)

            notif = NotificationSerializers(Notification.objects.filter(receiver=user), many=True)

            return Response(notif.data, status=status.HTTP_200_OK)
        
        except serializers.ValidationError:
             return  Response({key: value[0] for key, value in serializers.ValidationError.errors.items()}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


