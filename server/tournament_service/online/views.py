from rest_framework                 import status
from rest_framework.decorators      import api_view
from rest_framework.response        import Response
from django.shortcuts               import get_object_or_404
from rest_framework.views           import APIView
from .models                        import Player, Tournament, PlayerTournament, Notification
from local.models import User
from .serializers                   import TournamentSerializer , PlayerTournamentSerializer, NotificationSerializers
from django.core.exceptions         import ValidationError
from rest_framework                 import serializers
from rest_framework.exceptions      import APIException
from django.http                    import Http404
import json
from channels.layers                import get_channel_layer
from asgiref.sync                   import async_to_sync
from django.utils                   import timezone 
from django.contrib.contenttypes.models import ContentType


class TournamentAPIView(APIView):
    def post(self, request):

        username    = request.META.get('HTTP_X_AUTHENTICATED_USER')
        creator     = User.objects.get(username=username)
        tournament  = None

        try:
            tournament_data = {
                'creator'   : creator.id,
                'name'      : request.data.get("name"),
                'type'      : request.data.get("visibility"),
            }

            serializer = TournamentSerializer( data = tournament_data )
            if serializer.is_valid(raise_exception = True):
                tournament = serializer.save()

            participants_data   = []
            notification_data   = []
            creator_player      = Player.objects.get(user_id=creator.id)
            creator_data        = {
                'tournament': tournament.id,
                'player'    : creator_player.id,
                'status'    : 'accepted',
                'role'      : 'creator',
                'nickname'  : request.data.get('nickname'),
                'avatar'    : request.FILES.get('creator_Avatar'),
            }
            participants_data.append(creator_data)

            invited_players     = request.data.get('invited-players', [])
            selected_players    = json.loads(invited_players) if isinstance(invited_players, str) else invited_players

            print("invited players : ", selected_players)
            if invited_players:
                for player in selected_players:
                    print("fgfdgfdgd")
                    player_instance     = Player.objects.get(user_id=player['id'])
                    player_data         = {
                        'tournament'    : tournament.id,
                        'player'        : player_instance.id,
                        'status'        : 'invited',
                        'role'          : 'participant',
                    }
                    participants_data.append(player_data)
                    content_type = ContentType.objects.get_for_model(tournament)
                    notif_data = {
                        'sender': creator.id,
                        'receiver': player['id'],
                        'type': 'tournament',
                        'content_type': content_type.id,
                        'object_id': tournament.id,
                        'message': f'{creator.username} invited you to join a tournament name is {tournament.name}.',
                    }
                    notification_data.append(notif_data)
                    
            print("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++", participants_data)

            if invited_players:
                serializer = PlayerTournamentSerializer(data=participants_data, many=True)
            else:
                serializer = PlayerTournamentSerializer(data=participants_data)
                
            if serializer.is_valid(raise_exception=True):
                serializer.save()
            if tournament.type == 'private':
                existing_participants = PlayerTournament.objects.filter(tournament=tournament, role='participant')
                if existing_participants.count() != 3:
                    tournament.delete()
                    return Response({'error': 'A private tournament have 3 participants excluding the creator.'}, status=status.HTTP_400_BAD_REQUEST)
          
            print("+++++++++++++--------------------------+++++++++++++++")
    
            if notification_data :
                serializer = NotificationSerializers(data=notification_data, many=True)

                print("------> ", serializer)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()

                for notif in serializer.instance:
                    self.broadcast_notification(notif)

            return Response(
                    {"message": "Tournament created successfully"},
                    status=status.HTTP_201_CREATED
                )

        except serializers.ValidationError:
            if tournament:
                tournament.delete()

            print("++++++++++++++++++++++++++++++++++++", serializer.errors)
            
            if isinstance(serializer.errors, list):
                errors = {key: value[0] if isinstance(value, list) and value else value
                        for error in serializer.errors for key, value in error.items()}
            elif isinstance(serializer.errors, dict):
                errors = {key: value[0] if isinstance(value, list) and value else value
                        for key, value in serializer.errors.items()}
            else:
                errors = str(serializer.errors)
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            
            print("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", e)

            if tournament:
                tournament.delete()
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        
# -----------------------------------notif---------------------------------------------------------------

    def broadcast_notification(self, notification):
        channel_layer = get_channel_layer()
        print(">>>>>>>>>>>>>> : ", notification)
        group_name    = f'user_{notification.receiver.id}'

        print("------------- ", f'user_{notification.receiver.id}')
        
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type'          : 'send_notification',
                'notification'  : {
                    'id'        : notification.id,
                    'message'   : notification.message,
                    'type'      : notification.type,
                    'created_at': notification.time.isoformat(),
                    'read_at'   : notification.read_at,
                }
            }
        )
            
# -----------------------------------put---------------------------------------------------------------


    def put(self, request):
        try:
            username = request.META.get('HTTP_X_AUTHENTICATED_USER')
            user     = User.objects.get(username=username)
            player   = Player.objects.get(user=user)

            tournament_id = request.data.get("tournament_id")
            avatar        = request.FILES.get("player_avatar", None)
            nickname      = request.data.get("nickname", None)
            status_value  = request.data.get("status")

            try:
                tournament = Tournament.objects.get(id=tournament_id)
            except Tournament.DoesNotExist:
                return Response(
                    {"error": "Tournament doesn't exist."},
                    status=status.HTTP_404_NOT_FOUND
                )

            player_tournament, created = PlayerTournament.objects.get_or_create(
                tournament_id = tournament_id,
                player        = player,
                defaults      = {
                    'nickname': nickname,
                    'avatar'  : avatar,
                    'status'  : status_value,
                }
            )

            if not created:
                if player_tournament.status == 'declined':
                    return Response(
                        {"error": "You have already declined the invitation."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                elif player_tournament.status == 'accepted':
                    return Response(
                        {"error": "You have already accepte the invitation."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                player_tournament.nickname = nickname
                player_tournament.avatar   = avatar
                player_tournament.status   = status_value
                player_tournament.save()

            serializer = PlayerTournamentSerializer(player_tournament)

            creator_id   = tournament.creator.id
            content_type = ContentType.objects.get_for_model(tournament)
            message      = ''

            if status_value == 'declined':
                message = f'{user.username} declined your invitation for the tournament: {tournament.name}.'
            elif status_value == 'accepted':
                message = f'{user.username} joined your tournament: {tournament.name}.'

            notif_data = {
                'sender'      : user.id,
                'receiver'    : creator_id,
                'type'        : 'information',
                'content_type': content_type.id,
                'object_id'   : tournament.id,
                'message'     : message,
            }

            notif_serializer = NotificationSerializers(data=notif_data)
            if notif_serializer.is_valid(raise_exception=True):
                notif_serializer.save()
                self.broadcast_notification(notif_serializer.instance)

            return Response(
                {"message": "Tournament updated successfully."},
                status=status.HTTP_200_OK
            )

        except serializers.ValidationError:
            print("put ++++++++++++++++++++++++++++++++++++", serializer.errors)

            if isinstance(serializer.errors, list):
                errors = {
                    key: value[0] if isinstance(value, list) and value else value
                    for error in serializer.errors for key, value in error.items()
                }
            elif isinstance(serializer.errors, dict):
                errors = {
                    key: value[0] if isinstance(value, list) and value else value
                    for key, value in serializer.errors.items()
                }
            else:
                errors = str(serializer.errors)
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# -----------------------------------delete---------------------------------------------------------------

    def delete(self, request):
        try:
            username        = request.META.get('HTTP_X_AUTHENTICATED_USER')
            user            = User.objects.get(username=username)
    
            tournament_id   = request.query_params.get('tournamentId', None)
            tournament      = get_object_or_404(Tournament, id = tournament_id)

            if tournament.creator_id == user.id:
                # print("===> on Delete : ", ContentType.objects.get_for_model(Tournament))
                # Notification.objects.filter(content_type=ContentType.objects.get_for_model(Tournament), object_id=tournament.id).delete()
                tournament.delete()
                return Response({'message': 'Tournament deleted successfully'}, status=201)
            else:
                PlayerTournament.objects.filter(player__user__id = user.id, tournament=tournament).delete()
                return Response({'message': 'You have left the tournament'}, status=status.HTTP_200_OK)
        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=status.HTTP_400_BAD_REQUEST)


# i don't have friends yet so i will get all the users of the website i will update it soon

# -----------------------------------GET---------------------------------------------------------------

class CustomAPIException(APIException):
    status_code     = status.HTTP_400_BAD_REQUEST
    default_detail  = "A server error occurred."
    default_code    = "error"

    def __init__(self, detail=None, code=None):
        if detail is not None:
            self.detail = {"error": detail}
        else:
            self.detail = {"error": self.default_detail}
        if code is not None:
            self.status_code = code


@api_view(['GET'])
def friends_list(request):
    """get friends list"""
    search_query        = request.GET.get('search', '')
    players_list_length = int(request.GET.get('playersLength', 0)) 
    
    username            = request.META.get('HTTP_X_AUTHENTICATED_USER')
    user                = User.objects.get(username=username)

    if players_list_length >= 3:
        return Response({ "error": "You can only have up to 3 players. Remove a player to add another." },
            status=status.HTTP_400_BAD_REQUEST)
    if search_query:
        friends = User.objects.filter(username__icontains=search_query).exclude(id=user.id)[:5]
    else:
        friends = []

    friends_data = [{'id': friend.id, 'username': friend.username} for friend in friends]
    
    return Response(friends_data, status=status.HTTP_200_OK)


@api_view(['GET'])
def isTournamentReady(request, tournament_id):
    """check if tournament ready to start"""
    try:
        # print(tournament_id)
        if not tournament_id:
            raise CustomAPIException("Tournament ID is required")
        username        = request.META.get('HTTP_X_AUTHENTICATED_USER')
        user            = User.objects.get(username=username)
        tournament      = get_tournament(tournament_id, user)
        total_players   = check_participants(tournament)

        # print(total_players," ", tournament, user , "-------------------------------")

        return Response(
            {
                "success": True,
                "message": f"Tournament is valid with {total_players} participants (including the creator).",
            },
            status=status.HTTP_200_OK,
        )

    except CustomAPIException as custom_error:
        return Response(custom_error.detail, status=custom_error.status_code)
    except Exception as e:
        return Response(
            {"error": "An unexpected error occurred: " + str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

def get_tournament(tournament_id, user):
    try:
        return get_object_or_404(Tournament, id=tournament_id, creator=user)
    except Http404:
        raise CustomAPIException("you can't start the tournament, you are not the creator")

def check_participants(tournament):
    accepted_players = PlayerTournament.objects.filter(
        tournament  = tournament,
        status      = "accepted"
    ).count()

    total_players   = accepted_players
    # print( " ====> ", total_players, " - " , accepted_players)
    needed_players  = 4 - total_players

    if total_players != 4:
        raise CustomAPIException(
            f"Not enough participants. {needed_players} more participants are needed."
        )
    return total_players
