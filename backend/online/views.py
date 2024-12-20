from rest_framework                 import status
from rest_framework.decorators      import api_view
from rest_framework.response        import Response
from django.middleware.csrf         import get_token
from django.views.decorators.csrf   import csrf_exempt
from django.shortcuts               import get_object_or_404
from rest_framework.views           import APIView
from .models                        import User, Player, Tournament, PlayerTournament
from .serializers                   import TournamentSerializer , PlayerTournamentSerializer
from .verifyForm                    import validate_form, player_form_validation
from django.core.exceptions         import ValidationError
from rest_framework                 import serializers


import json

@api_view(['GET'])
def csrf_token_view(request):
    """Returns the CSRF token"""
    return Response({'csrftoken': get_token(request)}, status=200)

class TournamentAPIView(APIView):
    def post(self, request):

        creator     = User.objects.get(id=11)
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
            creator_data        = {
                'tournament': tournament.id,
                'player'    : creator.id,
                'status'    : 'accepted',
                'role'      : 'creator',
                'nickname'  : request.data.get('nickname'),
                'avatar'    : request.FILES.get('creator_Avatar'),
            }
            participants_data.append(creator_data)

            invited_players     = request.data.get('invited-players', [])
            selected_players    = json.loads(invited_players) if isinstance(invited_players, str) else invited_players

            print("invited players : ", selected_players)
            
            for player in selected_players:
                player_instance     = Player.objects.get(id=player.get('id'))
                player_data         = {
                    'tournament'    : tournament.id,
                    'player'        : player_instance.id,
                    'status'        : 'pending',
                    'role'          : 'participant',
                }
                participants_data.append(player_data)

            serializer = PlayerTournamentSerializer(data=participants_data, many=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()

            if tournament.type == 'private':
                existing_participants = PlayerTournament.objects.filter(tournament=tournament, role='participant')
                if existing_participants.count()  != 3:
                    raise serializers.ValidationError('A private tournament have 3 participants excluding the creator.')
            
            return Response(
                    {"message": "Tournament created successfully"},
                    status=status.HTTP_201_CREATED
                )

        except ValidationError:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            if tournament:
                tournament.delete()
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request):
        try:
            tournament_id   = request.data.get('tournamentId')
            tournament      = get_object_or_404(Tournament, id = tournament_id)

            if tournament.creator_id == 11:
                tournament.delete()
                return Response({'message': 'Tournament deleted successfully'}, status=200)
            else:
                PlayerTournament.objects.filter(Player__user__id = 11, tournament=tournament).delete()
                return Response({'message': 'You have left the tournament'}, status=status.HTTP_200_OK)
        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk) :
        tournament_id       = request.data.get("tournament_id")
        avatar              = request.FILES.get("player_avatar")
        nickname            = request.data.get("nickname")

        print(tournament_id, " ", avatar, " ", nickname)

        validation_error = player_form_validation(avatar, nickname)
        if validation_error:
            return Response({"error": validation_error}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "PLayer joined successfully"}, status=status.HTTP_201_CREATED)


# i don't have friends yet so i will get all the users of the website i will update it soon

@csrf_exempt
@api_view(['GET'])
def friends_list(request):
    """get friends list"""
    search_query = request.GET.get('search', '')
    players_list_length = int(request.GET.get('playersLength', 0)) 

    if players_list_length >= 3:
        return Response({ "error": "You can only have up to 3 players. Remove a player to add another." },
            status=status.HTTP_400_BAD_REQUEST)
    
    if search_query:
        friends = User.objects.filter(username__icontains=search_query).exclude(id=11)[:5]
    else:
        friends = []

    friends_data = [{'id': friend.id, 'username': friend.username} for friend in friends]
    
    return Response(friends_data, status=status.HTTP_200_OK)





        # selected_players    = json.loads(invited_players) if isinstance(invited_players, str) else invited_players