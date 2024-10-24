from .models import *
from .serializers import *

def get_player_match_summary(player):
    matches = []
    matches_as_player1 = Match.objects.filter(player1=player)
    player1_wins = matches_as_player1.filter(player1_points__gt=models.F('player2_points')).count()
    player1_losses = matches_as_player1.filter(player1_points__lt=models.F('player2_points')).count()
    player1_draws = matches_as_player1.filter(player1_points__exact=models.F('player2_points')).count()

    matches_as_player2 = Match.objects.filter(player2=player)
    player2_wins = matches_as_player2.filter(player2_points__gt=models.F('player1_points')).count()
    player2_losses = matches_as_player2.filter(player2_points__lt=models.F('player1_points')).count()
    
    total_wins = player1_wins + player2_wins
    total_losses = player1_losses + player2_losses
    total_matches = matches_as_player1.count() + matches_as_player2.count()
    matches = MatchSerializer(matches_as_player1, many=True).data + MatchSerializer(matches_as_player2, many=True).data
    total_draws = player1_draws
    # print("-------> total_wins : ", total_wins)
    # print(">>>>>>.>>>> total_losses : ", total_losses)
    # print("------------------> matches : ", matches)
    return total_wins, total_losses, total_matches,total_draws, matches

def get_requests_summary(user):
    requests_user_as_sender = Request.objects.filter(sender=user)
    requests_user_as_reciever = Request.objects.filter(reciever=user)
    friends = RequestsSendedSerializer(requests_user_as_sender.filter(status='accepted'), many=True).data + \
        RequestsRecievedSerializer(requests_user_as_reciever.filter(status='accepted'), many=True).data
    requests =  RequestsRecievedSerializer(requests_user_as_reciever.filter(status='received'), many=True).data
    pending = RequestsSendedSerializer(requests_user_as_sender.filter(status='sent'), many=True).data
    # print("---------> friends : ", friends)
    # print("----------> requests : ", requests)
    # print("----> pending : ", pending )
    return friends, requests, pending