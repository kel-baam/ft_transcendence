from .models import *
from rest_framework.response import Response
from .serializers import *
# from .utils import *
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import serializers
from django.core.exceptions import ValidationError

import logging




logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
class UserAuthenticationView(APIView):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            Userserializer =UserSerializer(user, 
            fields=['username', 'password']).data
            return Response(Userserializer, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response( str(e),  status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except serializers.ValidationError:
            return Response({key: value[0] for key, value in Userserializer.errors.items()}, status=status.HTTP_400_BAD_REQUEST)


class UserInfoView(APIView):

# /api/user ; /api/user?username='shicham'
    def get(self, request, username):
        # if request.query_params.get('username', None) :
        #     username = request.query_params.get('username', None)
        # else :
        #     username = request.user
        logger.debug(">>>>>>>>>>>>>> here in get user")
        try:
            user = User.objects.get(username=username)
            Userserializer =UserSerializer(user, 
            fields=['username', 'first_name', 'last_name', 'picture','status', 'score', 'rank', 'level']).data
            return Response(Userserializer, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response( str(e),  status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except serializers.ValidationError:
            return Response({key: value[0] for key, value in Userserializer.errors.items()}, status=status.HTTP_400_BAD_REQUEST)

        

    def put(self, request, username):
        print(">>>>>>>>>>> username ", username)
        # if request.query_params.get('username', None) :
        #     username = request.query_params.get('username', None)
        # else :
        #     username = request.user
        try:
            user_instatnce = User.objects.get(username=username)
            userSerializer = UserSerializer(user_instatnce, data = request.data, partial=True)
            if userSerializer.is_valid(raise_exception=True):
                userSerializer.save()
                return Response({"message" : "the user updated successfully"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except serializers.ValidationError:
            return Response({key: value[0] for key, value in userSerializer.errors.items()}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response( str(e),  status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
   

    def post(self, request):
        logger.debug('>>>>>>>>>>>>>>>> here in post user ')
        try:
            Userserializer = UserSerializer(data=request.data)
            if Userserializer.is_valid(raise_exception=True):
                # print(">>>>>>>>>>> user : ", Userserializer.data)
                Userserializer.save()
                return Response({"message " : "the user added successfully"}, status=status.HTTP_200_OK)
        except serializers.ValidationError:
            print(">>>>>>>>>>> here validation error ")
            return Response({key: value[0] for key, value in Userserializer.errors.items()}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(">>>>>>>>> here internal server")
            return Response( str(e),  status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
        
class  UserStatsView(APIView):


    def get(self, request, username):
        # if request.query_params.get('username', None) :
        #     username = request.query_params.get('username', None)
        # else :
        #     username = request.user
        try:
            user = User.objects.get(username=username)
            matches_as_player1 = Match.objects.filter(player1=Player.objects.get(user=user))#add the status completed
            player1_wins = matches_as_player1.filter(player1_points__gt=models.F('player2_points')).count()
            player1_losses = matches_as_player1.filter(player1_points__lt=models.F('player2_points')).count()

            matches_as_player2 = Match.objects.filter(player2=Player.objects.get(user=user))
            player2_wins = matches_as_player2.filter(player2_points__gt=models.F('player1_points')).count()
            player2_losses = matches_as_player2.filter(player2_points__lt=models.F('player1_points')).count()
            
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
            return Response( str(e),  status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class MatchHistoryView(APIView):


    def get(self, request, username):
        # if request.query_params.get('username', None) :
        #     username = request.query_params.get('username', None)
        # else :
        #     username = request.user
        try:
            user = User.objects.get(username=username)
            matches = []
            matches_as_player1 = Match.objects.filter(player1=Player.objects.get(user=user))#with status completed
            matches_as_player2 = Match.objects.filter(player2=Player.objects.get(user=user))
            matches = MatchSerializer(matches_as_player1, many=True).data +\
            MatchSerializer(matches_as_player2, many=True).data
            return Response(matches, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response( str(e),  status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        # except serializers.ValidationError:
        #     return Response({key: value[0] for key, value in matches.errors.items()}, status=status.HTTP_400_BAD_REQUEST)
        
    def post(self, request, username):
        try:
            serializer = MatchSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"message" : "the match was created"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except serializers.ValidationError:
            return Response({key: value[0] for key, value in serializer.errors.items()}, status=status.HTTP_400_BAD_REQUEST)

            
    def put(self, request, username):
        try:
            if 'id' not in request.data:
                raise  KeyError({"message" : "The id  is missing."})
            match_instance = Match.objects.get(id = request.data['id'])
            print("<<<<<<<<<<<<<<<<< match_instance : ", match_instance)
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
    def get(self, request, username):
        try:
            # if request.query_params.get('username', None) :
            #     username = request.query_params.get('username', None)
            # else :
            #     username = request.user
            # Get the 'status' parameter from the query string (default to 'friend' if not provided)
            status_filter = request.query_params.get('status', None)
            # print("****************> status ", status_filter)
            user= User.objects.get(username=username)
            data = []
            if status_filter == 'accepted':
                requests_user_as_sender = Request.objects.filter(sender=user, status=status_filter)
                requests_user_as_reciever = Request.objects.filter(reciever=user, status=status_filter)

                serializer_requests_user_as_reciever = \
                RequestSerializer(requests_user_as_reciever, many=True, fields= ['id','user'], context={'user_type': 'sender'})

                serializer_requests_user_as_sender = \
                RequestSerializer(requests_user_as_sender, many=True, fields= ['id','user'], context={'user_type': 'receiver'})

                data = serializer_requests_user_as_reciever.data + serializer_requests_user_as_sender.data

            elif status_filter == 'recieved':
                requests_user_as_reciever = Request.objects.filter(reciever=user, status='pending')

                serializer_requests_user_as_reciever = \
                RequestSerializer(requests_user_as_reciever, many=True, fields= ['id','user'], context={'user_type': 'sender'})

                data = serializer_requests_user_as_reciever.data

            elif status_filter == 'sent':
                requests_user_as_sender = Request.objects.filter(sender=user, status='pending')

                serializer_requests_user_as_sender = \
                RequestSerializer(requests_user_as_sender, many=True, fields= ['id','user'], context={'user_type': 'receiver'})
                data = serializer_requests_user_as_sender.data

            # elif status_filter == 'blocked':
            #     requests_user_as_sender = Request.objects.filter(sender=user, status=status_filter)
            #     print(">>>>>>>>>>> requests_user_as_sender : ", requests_user_as_sender)
            #     serializer_requests_user_as_sender = \
            #     RequestSerializer(requests_user_as_sender, many=True, fields= ['id','user'], context={'user_type': 'receiver'})
            #     data = serializer_requests_user_as_sender.data

            return Response(data, status=status.HTTP_200_OK)
        except serializers.ValidationError:
             return  Response({key: value[0] for key, value in serializers.ValidationError.errors.items()}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(">>>>>>>>>>>>>>>>>>>>> here ")
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    #-----------------delete method----------------#

    def delete(self, request, username):
        # request_id = request.query_params.get('requestId', None)
        try:
            # if request_instance.user != request.user:
            #     return Response({"error": "You do not have permission to delete this request"}, status=status.HTTP_403_FORBIDDEN)
            request_instance = Request.objects.get(id=request.data['id'])
            print(">>>>>>>>>>>>>> request_instance : ", request_instance)
            # serializer = RequestSerializer(request_instance, data= request.data, partial=True, context={'user_type' : 'both'})
            
            # if serializer.is_valid(raise_exception=True):
            #     serializer.save()
            #     print(">>>>>>>>>>>>>> serializer ", serializer.data)
            request_instance.delete()
            return Response({"message": "Request deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Request.DoesNotExist:
            return Response({"error": "Request not found"}, status=status.HTTP_404_NOT_FOUND)
        # except serializers.ValidationError:
        #     return  Response({key: value[0] for key, value in serializer.errors.items()}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(">>>>>>>>>>> here internal server error")
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    #-----------------put method----------------#

    def put(self, request, username):
        try:
            # if request_instance.reciever != request.user:
            #     return Response({"error": "You are not authorized to accept this request"}, status=status.HTTP_403_FORBIDDEN)
            request_instance = Request.objects.get(id=request.data['id'])
            serializer = RequestSerializer(request_instance, data=request.data, partial=True, context={'user_type': 'both'}, fields=['id', 'sender', 'reciever', 'status'])
            if serializer.is_valid(raise_exception=True):
                serializer.save() 
                return Response({"message": "Request updated successfully"}, status=status.HTTP_200_OK)
        except Request.DoesNotExist:
            return Response({"error": "Request not found"}, status=status.HTTP_404_NOT_FOUND)
        except serializers.ValidationError:
            return  Response({key: value[0] for key, value in serializer.errors.items()}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    #------------------ post method--------------#

    def post(self, request, username):
        data = request.data
        # data['sender'] = request.user.id  # Automatically set the sender to the authenticated user
        data['sender'] = User.objects.get(username=username).id
        if data['sender'] == data.reciever:
            return Response({"message" : "loopback invitation "}, status=status.HTTP_400_BAD_REQUEST)
        print(">>>>>>>>>>>>>>>>>> data : ", data)
        print(">>>>>>>>>>>>>>>>>>>>>>>> sender : ", data['sender'])
        serializer = RequestSerializer(data=data, context={'user_type': 'both'})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            print("---------------------> data serializer : ", serializer.data)
            return Response({"message" : "Request created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
