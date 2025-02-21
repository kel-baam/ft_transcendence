from rest_framework                 import status
from rest_framework.response        import Response
from django.http                    import Http404
from rest_framework.views           import APIView
from django.core.exceptions         import ValidationError
from django.http                    import Http404
from rest_framework.exceptions      import ValidationError
from django.db                      import transaction
from rest_framework                 import serializers

from .models                        import User, Tournament, PlayerTournament
from .serializers                   import TournamentSerializer , PlayerTournamentSerializer
from .verifyForm                    import validate_form

import json

class TournamentAPIView(APIView):
    def post(self, request):
        tournament = None
        try:
            username   = request.META.get('HTTP_X_AUTHENTICATED_USER')
            creator    = User.objects.get(username=username)
            tournament = None

            tournament_data = {
                'creator'   : creator.id,
                'name'      : request.data.get("tournament_name"),
                'type'      : "public",
            }

            print("tournament : ", tournament_data)

            serializer = TournamentSerializer( data = tournament_data)
            if serializer.is_valid(raise_exception = True):
                tournament = serializer.save()

            print("here")

            players = []

            for key in request.data:
                if key.startswith('players'):
                    parts = key.split('[')
                    index = int(parts[1].split(']')[0])
                    field = parts[2].split(']')[0]

                    while len(players) <= index:
                        players.append({'nickname': '', 'avatar': None})

                    players[index][field] = request.data[key]

            for player_data in players:
                nickname = player_data.get('nickname', '')
                avatar   = request.FILES.get(f'player{players.index(player_data) + 1}_image', None)

                player_tournament, created = PlayerTournament.objects.get_or_create(
                    tournament_id=tournament.id,
                    defaults={
                        'nickname': nickname,
                        'avatar'  : avatar,
                        'status'  : 'accepted',
                    }
                )
            
                print("-------> ", player_tournament)

                serializer = PlayerTournamentSerializer(data = player_tournament)
                if serializer.is_valid(raise_exception = True):
                    serializer = serializer.save()
            return Response(
                {"message": "Tournament and players created successfully"},
                status=status.HTTP_201_CREATED,
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

        #     validation_result   = validate_form(
        #         tournament_name = request.data.get('name'),
        #         players         = players,
        #         user            = user
        #     )
        #     if validation_result != "Form is valid!":
        #         return Response({
        #             'errors'    : validation_result
        #         },  status      = status.HTTP_400_BAD_REQUEST)

     
        #     data = {
        #         'creator'   : user.id,
        #         'name'      : request.data.get('name'),
        #     }
        #     print("here")

        #     serializer = TournamentSerializer(data=data)
        #     if not serializer.is_valid():
        #         raise ValidationError(
        #             {"tournament_errors": serializer.errors}
        #         )
            
        #     tournament = serializer.save()

        #     participants_data = [
        #         {
        #             'tournament': tournament.id,
        #             'nickname'  : player['nickname'],
        #             'avatar'    : player['avatar'],
        #             'score'     : 0,
        #         }
        #         for player in players
        #     ]

        #     serializer = PlayerSerializer(data=participants_data, many=True)
        #     serializer.is_valid(raise_exception=True)
        #     serializer.save()

        #     return Response(
        #         {"message": "Tournament and players created successfully"},
        #         status=status.HTTP_201_CREATED,
        #     )

        # except ValidationError as e:
        #     if tournament:
        #         tournament.delete()
        #     return Response(
        #         {"errors": serializer.errors},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )
        # except Exception as e:
        #     if tournament:
        #         tournament.delete()
        #     return Response(
        #         {"errors": str(e)},
        #         status=status.HTTP_400_BAD_REQUEST,
        #     )



    def get(self, request):

        try:
            username=request.META.get('HTTP_X_AUTHENTICATED_USER')
            user = User.objects.get(username=username)

            tournaments = Tournament.objects.filter(creator=user)
            tournaments_data = [{'id': tournament.id, 'name': tournament.name} for tournament in tournaments]
            return Response({
                'status'        : 'success',
                'tournaments'   : tournaments_data
            }, status=status.HTTP_200_OK)
        
        except Tournament.DoesNotExist:
            raise Http404("Tournaments not found")
        
    def delete(self, request):
        try:
            tournament_id   = request.data.get('tournamentId')
            tournament      = Tournament.objects.get(id=tournament_id)
            
            tournament.delete()
            return Response({
                "message": "Tournament deleted successfully"},
                status=204)
        except Tournament.DoesNotExist:
            return Response({"error": "Tournament not found"}, status=400)
