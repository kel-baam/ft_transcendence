from rest_framework.decorators      import api_view
from rest_framework.response        import Response
from rest_framework                 import status
from .models                        import Tournament
from django.views.decorators.csrf   import csrf_exempt

@csrf_exempt
@api_view(['DELETE'])
def delete_tournament(request, id):
    try:
        tournament = Tournament.objects.get(id=id)
        tournament.delete()
        return Response({"message": "Tournament deleted successfully"})
    except Tournament.DoesNotExist:
        return Response({"error": "Tournament not found"}, status=400)
