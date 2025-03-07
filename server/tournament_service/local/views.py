from rest_framework                 import status
from rest_framework.response        import Response
from django.http                    import Http404
from rest_framework.views           import APIView
from django.core.exceptions         import ValidationError
from django.http                    import Http404
from rest_framework.exceptions      import ValidationError
from django.db                      import transaction
from rest_framework                 import serializers

from online.models                  import *
from .serializers                   import *

import json

class TournamentAPIView(APIView):
    def post(self, request):
        tournament = None
        try:
            username   = request.META.get('HTTP_X_AUTHENTICATED_USER')
            creator    = User.objects.get(username=username)
            tournament = None

            tournament_data = {
                'creator' : creator.id,
                'name'    : request.data.get("tournament_name"),
                'type'    : "public",
                'mode'    : "local",
            }

            serializer = TournamentSerializer( data = tournament_data)
            if serializer.is_valid(raise_exception = True):
                tournament = serializer.save()

            players = []

            for key in request.data:
                if key.startswith('player'):
                    index = int(key[6]) - 1

                    while len(players) <= index:
                        players.append({'nickname': '', 'avatar': None})

                    if 'nickname' in key:
                        players[index]['nickname'] = request.data[key]
                    elif 'image' in key:
                        players[index]['avatar'] = request.FILES.get(f'player{index + 1}_image', None)

            for player_data in players:
                nickname = player_data.get('nickname', '')
                avatar   = request.FILES.get(f'player{players.index(player_data) + 1}_image', None)

                player_tournament_data = {
                    'nickname'  : nickname,
                    'avatar'    : avatar,
                    'status'    : 'accepted',
                    'tournament': tournament.id,
                }

                serializer = PlayerTournamentSerializer(data=player_tournament_data)
                if serializer.is_valid(raise_exception=True):
                    serializer = serializer.save()

            return Response(
                {"message": "Tournament and players created successfully"},
                status=status.HTTP_201_CREATED,
            )

        except serializers.ValidationError:
            if tournament:
                tournament.delete()
            
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

            if tournament:
                tournament.delete()
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            username = request.META.get('HTTP_X_AUTHENTICATED_USER')
            user     = User.objects.get(username=username)

            tournaments      = Tournament.objects.filter(creator=user, mode='local')
            tournaments_data = [{'id': tournament.id, 'name': tournament.name} for tournament in tournaments]

            return Response({
                'status'        : 'success',
                'tournaments'   : tournaments_data
            }, status=status.HTTP_200_OK)
        
        except Tournament.DoesNotExist:
            raise Http404("Tournaments not found")
        
    def delete(self, request):
        try:
            username        = request.META.get('HTTP_X_AUTHENTICATED_USER')
            user            = User.objects.get(username=username)

            tournament_id   = request.data.get('tournamentId')
            tournament      = Tournament.objects.get(id=tournament_id)
            
            if tournament.creator_id == user.id:
                tournament.delete()

            return Response({
                "message": "Tournament deleted successfully"},
                status=204)
        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=400)
