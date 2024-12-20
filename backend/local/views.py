from rest_framework                 import serializers, status
from rest_framework.decorators      import api_view
from rest_framework.response        import Response
from django.middleware.csrf         import get_token
from django.http                    import Http404
from django.views.decorators.csrf   import csrf_exempt

from .models                        import User, Tournament, Player
from .serializers                   import TournamentSerializer
from .verifyForm                    import validate_form

@api_view(['GET'])
def csrf_token_view(request):
    """csrf_token_view was called"""
    return Response({'csrftoken': get_token(request)}, status=200)

@csrf_exempt
@api_view(['POST'])
def create_tournament(request):

    """Handle the creation of a new tournament"""

    players = []
    for key in request.data:
        if key.startswith('players'):
            parts = key.split('[')
            index = int(parts[1].split(']')[0])
            field = parts[2].split(']')[0]
            
            while len(players) <= index:
                players.append({'nickname': '', 'avatar': ''})
            
            players[index][field] = request.data[key]
    
    tournament_name = request.data.get('name')
    
    try:
        user = User.objects.get(id=11)
    except User.DoesNotExist:
        raise Http404("User not found")

    validation_result   = validate_form(
        tournament_name = tournament_name,
        players         = players,
        user            = user
    )
    if validation_result != "Form is valid!":
        return Response({
            'status'    : 'error',
            'errors'    : validation_result
        },  status      = status.HTTP_400_BAD_REQUEST)

    creator_data    = {
        'id'        : 11,
        'username'  : "niboukha"
    }

    data            = {
        'name'      : tournament_name,
        'players'   : players,
        'creator'   : creator_data['id']
    }

    serializer = TournamentSerializer(data=data)

    if serializer.is_valid():
        serializer.save(creator=user)
        return Response({
            'status'    : 'success',
            'message'   : 'Tournament created successfully!'
        },  status      = status.HTTP_201_CREATED)
    else:
        return Response({
            'status'    : 'error',
            'message'   : serializer.errors
        },  status      = status.HTTP_400_BAD_REQUEST)
