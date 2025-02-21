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
from django.db.models import OuterRef, Exists, Q
import os
import requests



class UserInfoView(APIView):

    def get(self, request):
        try:
            # print(">>>>>>>>>>>>>>>>>>> username of the searched user : ", request.query_params.get('username', None))
            fields ={}
            if request.query_params.get('fields', None):
                # print(">>>>>>>> here fields exist : ", request.query_params.get('fields', None))
                fields = set(request.query_params.get('fields', None).split(','))
                # print('>>>>>>>>>>>>> fields extracted ', fields)
            if request.query_params.get('username', None) :
                # print(">>>>>>>>>>>>>>>>>>>> im here ")
                other_user = User.objects.get(username=request.query_params.get('username'))
                logged_in_user = User.objects.get(username=request.META.get('HTTP_X_AUTHENTICATED_USER'))
                Userserializer = UserSerializer(other_user, exclude = ['password'], context = {'logged_in_user' : logged_in_user}).data
            else :
                # print(">>>>>>>>>>>>>>>>>> here else ")
                username = request.META.get('HTTP_X_AUTHENTICATED_USER')
                user = User.objects.get(username=username)
                Userserializer =UserSerializer(user, exclude = ['password'], context = {'logged_in_user' : user}, fields=fields).data
            # print('>>>>>>>>>>>>>>>>>>>> the data got it  : ', Userserializer)
            return Response(Userserializer , status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:

            print(">>>>>>>>>>>>>>>> here the problem : ", str(e))

            return Response( str(e),  status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except serializers.ValidationError:
            return Response({key: value[0] for key, value in Userserializer.errors.items()}, status=status.HTTP_400_BAD_REQUEST)

        

    def put(self, request):
        # print('<<<<<<<<<<<<< here in put method ')
        try:
            username = request.META.get('HTTP_X_AUTHENTICATED_USER')
            # print(">>>>>>>>>e>>>>>>>>>>>>>>>>>>>>>>>> username ", username)
            # print("Raw request body:", request.body)
            user_instatnce = User.objects.get(username=username)
            data = request.data.copy()
            # print(">>>>>>>>>>>> incoming data : ", data)
            if 'picture' in request.FILES:
                data['picture'] = request.FILES.get('picture', None)
            # print(">>>>>>>>>>>>>>>> data is here : ", data)
            userSerializer = UserSerializer(user_instatnce, data=data, partial=True)
            if userSerializer.is_valid(raise_exception=True):
                userSerializer.save()
                return Response(userSerializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except serializers.ValidationError:
            # print('>>>>>>>>>>>>>>>>>>> here the isssue : ', {key: value[0] for key, value in userSerializer.errors.items()})
            return Response({key: value[0] for key, value in userSerializer.errors.items()}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # print('>>>>>>>>>>>>>>>>>>>> here the issue internal server : ', e)
            return Response( str(e),  status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
   

    def post(self, request):
        try:
            data = request.data.copy()
            print(">>>>>>>>>>>>>>>>>>>>> data comes from kaoutar : ", data)
            if data.get('picture'):
                # print(">>>>>>>>>>>>>>>>>>>>> heeeeeeere ")
                response = requests.get(data['picture'], stream=True)
                if response.status_code == 200:
                    folder_name = 'user_pics'
                    folder_path = os.path.join(settings.MEDIA_ROOT, folder_name)
                    os.makedirs(folder_path, exist_ok=True)  
                    file_name = data['picture'].split('/')[-1]
                    file_path = os.path.join(folder_path, file_name)
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
            print(">>>>>>>>>>>>>>>>>>>>>>>> here the problem : ", str(e))
            return Response( str(e),  status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

        
        
class  UserStatsView(APIView):


    def get(self, request):
        print("----------------------------> here in user stats")
        # if request.query_params.get('username', None) :
        #     username = request.query_params.get('username', None)
        # else :
        #     username = request.META.get('HTTP_X_AUTHENTICATED_USER')
        try:
            if request.query_params.get('username', None) :
                user = User.objects.get(username=request.query_params.get('username'))
                # logged_in_user = User.objects.get(username=request.META.get('HTTP_X_AUTHENTICATED_USER'))
                # Userserializer = UserSerializer(other_user, exclude = ['password'], context = {'logged_in_user' : logged_in_user}).data
            else :
                # print(">>>>>>>>>>>>>>>>>> here else ")
                username = request.META.get('HTTP_X_AUTHENTICATED_USER')
                user = User.objects.get(username=username)
                # Userserializer =UserSerializer(user, exclude = ['password'], context = {'logged_in_user' : user}).data
            # user = User.objects.get(username=username)
            # print(">>>>>>>>>>>>>>>> user : ", user)
            matches_as_player1 = Match.objects.filter(player1=Player.objects.get(user=user))#add the status completed
            player1_wins = matches_as_player1.filter(player1_score__gt=models.F('player2_score')).count()
            player1_losses = matches_as_player1.filter(player1_score__lt=models.F('player2_score')).count()

            matches_as_player2 = Match.objects.filter(player2=Player.objects.get(user=user))
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
            print("---------------------------------------")
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:


            print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> here the eroor : ", str(e))
            return Response( str(e),  status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class MatchHistoryView(APIView):


    def get(self, request):
        # if request.query_params.get('username', None) :
        #     username = request.query_params.get('username', None)
        # else :
        #     username = request.META.get('HTTP_X_AUTHENTICATED_USER')
        # print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> here the user matches history ")
        try:
            if request.query_params.get('username', None) :
                user = User.objects.get(username=request.query_params.get('username'))
                # logged_in_user = User.objects.get(username=request.META.get('HTTP_X_AUTHENTICATED_USER'))
                # Userserializer = UserSerializer(other_user, exclude = ['password'], context = {'logged_in_user' : logged_in_user}).data
            else :
                # print(">>>>>>>>>>>>>>>>>> here else ")
                username = request.META.get('HTTP_X_AUTHENTICATED_USER')
                user = User.objects.get(username=username)
            # user = User.objects.get(username=username)
            # print(">>>>>>>>>>>>>>>>>>> user  here in matches history : ", user)
            matches = []
            matches_as_player1 = Match.objects.filter(player1=Player.objects.get(user=user))#with status completed
            matches_as_player2 = Match.objects.filter(player2=Player.objects.get(user=user))#with status completed
            matches = MatchSerializer(matches_as_player1, many=True).data +\
            MatchSerializer(matches_as_player2, many=True).data
            return Response(matches, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(">>>>>>>>>>>> the problem in matches ccc  histoty in here :   ", str(e))
            return Response( str(e),  status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        # except serializers.ValidationError:
        #     return Response({key: value[0] for key, value in matches.errors.items()}, status=status.HTTP_400_BAD_REQUEST)
        
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
            # print("<<<<<<<<<<<<<<<<< match_instance : ", match_instance)
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
        # if request.query_params.get('username', None) :
        #     username = request.query_params.get('username', None)
        # else :
        #     username = request.META.get('HTTP_X_AUTHENTICATED_USER')
        try:
            # print(">>>>>>>>>>>>>>>>>>>>-------------------------------------------> here in freindship")
            if request.query_params.get('username', None) :
                user = User.objects.get(username=request.query_params.get('username'))
                # logged_in_user = User.objects.get(username=request.META.get('HTTP_X_AUTHENTICATED_USER'))
                # Userserializer = UserSerializer(other_user, exclude = ['password'], context = {'logged_in_user' : logged_in_user}).data
            else :
                # print(">>>>>>>>>>>>>>>>>> here else ")
                user = User.objects.get(username=request.META.get('HTTP_X_AUTHENTICATED_USER'))
            status_filter = request.query_params.get('status', None)
            # print("************************************> status ", status_filter , " and user in Friendship : ", user)
            # user= User.objects.get(username=username)
            data = []
            if status_filter == 'accepted':
                requests_user_as_sender = Request.objects.filter(sender=user, status=status_filter)
                requests_user_as_reciever = Request.objects.filter(reciever=user, status=status_filter)

                serializer_requests_user_as_reciever = \
                RequestSerializer(requests_user_as_reciever, many=True, fields= ['id','user'], context={'user_type': 'sender'})

                serializer_requests_user_as_sender = \
                RequestSerializer(requests_user_as_sender, many=True, fields= ['id','user'], context={'user_type': 'receiver'})

                data = serializer_requests_user_as_reciever.data + serializer_requests_user_as_sender.data
                # print(">>>>>>>>>>>>>>>>>>>>>> here user ", user)
                # requests_user = Request.objects.filter(
                #     Q(sender=user) | Q(reciever=user),
                #     status=status_filter
                # ).values('id', 'sender', 'reciever','status')
                # print(">>>>>>>>>>>>>>>>>>>>    here all the requests accepted ", requests_user)
                # context = {
                #     'sender': 'reciever',
                #     'reciever': 'sender'
                # }

                # serializer = RequestSerializer(requests_user, many=True, context={'user_type': context.get('sender', 'reciever')})
                # data = serializer.data

            elif status_filter == 'recieved':
                requests_user_as_reciever = Request.objects.filter(reciever=user, status='pending')

                serializer_requests_user_as_reciever = \
                RequestSerializer(requests_user_as_reciever, many=True, fields= ['id','user'], context={'user_type': 'sender'})
                data = serializer_requests_user_as_reciever.data
                # print('>>>>>>>>>>>>>>>>>>>>>>>>> data for req : ', data)

            elif status_filter == 'sent':
                requests_user_as_sender = Request.objects.filter(sender=user, status='pending')

                serializer_requests_user_as_sender = \
                RequestSerializer(requests_user_as_sender, many=True, fields= ['id','user'], context={'user_type': 'receiver'})
                data = serializer_requests_user_as_sender.data

            elif status_filter == 'blocked':
                requests_user_as_sender = Request.objects.filter(sender=user, status=status_filter)
                # print(">>>>>>>>>>> requests_user_as_sender : ", requests_user_as_sender)
                serializer_requests_user_as_sender = \
                RequestSerializer(requests_user_as_sender, many=True, fields= ['id','user'], context={'user_type': 'receiver'})
                data = serializer_requests_user_as_sender.data

            return Response(data, status=status.HTTP_200_OK)
        except serializers.ValidationError:
             return  Response({key: value[0] for key, value in serializers.ValidationError.errors.items()}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # print(">>>>>>>>>>>>>>>>>>>>> here internal server error ", str(e))
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    #-----------------delete method----------------#

    def delete(self, request):
        # request_id = request.query_params.get('requestId', None)
        # print('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> here the user wanna cancel the request : ', request.data)
        try:
            # if request_instance.user != request.user:
            #     return Response({"error": "You do not have permission to delete this request"}, status=status.HTTP_403_FORBIDDEN)
            request_instance = Request.objects.get(id=request.query_params.get('id', None))
            # print(">>>>>>>>>>>>>> request_instance : ", request_instance)
            # serializer = RequestSerializer(request_instance, data= request.data, partial=True, context={'user_type' : 'both'})
            
            # if serializer.is_valid(raise_exception=True):
            #     serializer.save()
            # print(">>>>>>>>>>>>>> serializer ", serializer.data)
            request_instance.delete()
            return Response({"message": "Request deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Request.DoesNotExist:
            return Response({"error": "Request not found"}, status=status.HTTP_404_NOT_FOUND)
        # except serializers.ValidationError:
        #     return  Response({key: value[0] for key, value in serializer.errors.items()}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # print(">>>>>>>>>>> here internal server error")
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    #-----------------put method----------------#

    def put(self, request):
        try:
            # if request_instance.reciever != request.user:
            # print(">>>>>>>>>>>>>>>>>>>>>>>> here where the user wanna accept the invitation ")
            #     return Response({"error": "You are not authorized to accept this request"}, status=status.HTTP_403_FORBIDDEN)
            data = request.data
            # print(">>>>>>>>>>>>>>>>> data comming for updating request is here : ", data)
            user = User.objects.get(username=request.META.get('HTTP_X_AUTHENTICATED_USER'))
            if data['status'] == 'blocked':
                targetUser = User.objects.get(username=data['target'])
                # print(">>>>>>>>>>>>> before ")
                request_instance = Request.objects.get(
                Q(sender=user, reciever=targetUser) | Q(sender=targetUser, reciever=user)
                )
                # print(">>>>>>>>>>>>> after ")
                if request_instance.sender != user:
                    request_instance.sender, request_instance.reciever = request_instance.reciever, request_instance.sender
            else:
                request_instance = Request.objects.get(id=data['id'])
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
            # print("~~~~~~~~~~~~~~~~~~~~~~~~~~~~> internal server error ", str(e))
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    #------------------ post method--------------#

    def post(self, request):
        try:
            # print(">>>>>>>>>>>>>>>>>> i wanna post data here  :", request.data)
            data = request.data.copy()
            # data['sender'] = request.user.id  # Automatically set the sender to the authenticated user
            username = request.META.get('HTTP_X_AUTHENTICATED_USER')
            data['sender'] = User.objects.get(username=username).id
            if data['sender'] == data['reciever']:
                return Response({"message" : "loopback invitation "}, status=status.HTTP_400_BAD_REQUEST)
            # print(">>>>>>>>>>>>>>>>>> data : ", data)
            # print(">>>>>>>>>>>>>>>>>>>>>>>> sender : ", data['sender'])
            serializer = RequestSerializer(data=data, context={'user_type': 'both'})
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                # print("---------------------> data serializer : ", serializer.data)
                return Response({"message" : "Request created successfully"}, status=status.HTTP_201_CREATED)
        except serializers.ValidationError:
            return  Response({key: value[0] for key, value in serializer.errors.items()}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class UserRankingView(APIView):
    def get(self, request):
        top = request.query_params.get('top', None)
        if top is not None and top.isdigit():
            limit = int(top)
            players = list(Player.objects.order_by('rank')[:limit].values('username', 'rank'))
        else:
            players = list(Player.objects.order_by('rank').values('username', 'rank'))
        results = [
            UserSerializer(player, fields={'id', 'username'}).data
            for player in players
        ]

        return Response(results, status=status.HTTP_200_OK)

    
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
