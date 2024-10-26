from django.shortcuts import render, get_object_or_404
from .models import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import *
from .utils import *

# Create your views here.
@api_view(['GET'])
def profileView(request, username):
   # print(">>>>>>>>>>>>>>>>>> request", request)
   items = [
   User(username='shicham', first_name='souad', last_name='hicham', 
               phone_number='06458987', email='kjarmoum@gmail.com', gender='female', 
               nationality='morrocaine', status =False),
   User(username='niboukha', first_name='nisrin', last_name='boukhari',
               phone_number='06458987',  email='kjarmoum@gmail.com', gender='female', 
               nationality='morrocaine', status =False),
   User(username='kel-baam', first_name='kaoutar', last_name='el-baamrani'
               ,phone_number='06458987', email='kjarmoum@gmail.com', gender='female', 
               nationality='morrocaine', status =False),
   User(username='kjarmoum', first_name='karima', last_name='jarmoumi', 
               phone_number='06458987', email='kjarmoum@gmail.com', gender='female', 
               nationality='morrocaine', status =False),

   ]
   # User.objects.bulk_create(items)
   # print("----> User.object.get(id='1'): ", get_object_or_404(User,id='1'))
   itemsPlayer = [
      Player(user = User.objects.get(id='1'), score='85', level='8', Rank='10'),
      Player(user = User.objects.get(id='2'), score='85', level='8', Rank='10'),
      Player(user = User.objects.get(id='3'), score='85', level='8', Rank='10'),
      Player(user = User.objects.get(id='4'), score='85', level='8', Rank='10'),
   ] 
   # Player.objects.bulk_create(itemsPlayer) 
   itemsMatch=[
      Match(date='2024-12-13', player1_points = '3', player2_points='4' ,  player1 = Player.objects.get(id='1'), 
            player2= Player.objects.get(id='2')),
      Match(date='2024-12-13', player1_points = '3', player2_points='4' ,  player1 = Player.objects.get(id='3'), 
            player2= Player.objects.get(id='4')),
      Match(date='2024-12-13', player1_points = '4', player2_points='4' ,  player1 = Player.objects.get(id='4'), 
            player2= Player.objects.get(id='2')),
       Match(date='2024-12-13', player1_points = '3', player2_points='4' ,  player1 = Player.objects.get(id='3'), 
            player2= Player.objects.get(id='1')),
   ]
   # Match.objects.bulk_create(itemsMatch)
   
   serializePlayer  = PlayerSerializer(Player.objects.get(user='1'), many=False)
 
   Request_items = [
      Request(sender=User.objects.get(id='2'), 
                     reciever=User.objects.get(id='1'), status='accepted'),
      Request(sender=User.objects.get(id='3'), 
                     reciever=User.objects.get(id='1'), status='accepted'),
      Request(sender=User.objects.get(id='3'), 
                     reciever=User.objects.get(id='1'), status='accepted'),
      Request(sender=User.objects.get(id='1'), 
               reciever=User.objects.get(id='3'), status='accepted'),
      
      Request(sender=User.objects.get(id='2'), 
                     reciever=User.objects.get(id='1'), status='received'),
      Request(sender=User.objects.get(id='3'), 
                     reciever=User.objects.get(id='1'), status='received'),
      Request(sender=User.objects.get(id='3'), 
                     reciever=User.objects.get(id='1'), status='received'),
      Request(sender=User.objects.get(id='1'), 
               reciever=User.objects.get(id='3'), status='received'),

      Request(sender=User.objects.get(id='2'), 
                     reciever=User.objects.get(id='1'), status='sent'),
      Request(sender=User.objects.get(id='3'), 
                     reciever=User.objects.get(id='1'), status='sent'),
      Request(sender=User.objects.get(id='3'), 
                     reciever=User.objects.get(id='1'), status='sent'),
      Request(sender=User.objects.get(id='1'), 
               reciever=User.objects.get(id='3'), status='sent'),

       Request(sender=User.objects.get(id='2'), 
                     reciever=User.objects.get(id='1'), status='blocked'),
      Request(sender=User.objects.get(id='3'), 
                     reciever=User.objects.get(id='1'), status='blocked'),
      Request(sender=User.objects.get(id='3'), 
                     reciever=User.objects.get(id='1'), status='blocked'),
      Request(sender=User.objects.get(id='1'), 
               reciever=User.objects.get(id='3'), status='blocked'),
   ]
   # User.objects.bulk_create(items)
   # Request.objects.bulk_create(Request_items)
   # user = get_object_or_404(User, username=username)
   # # print(">>>>>>>>>>>>>>>>>>> usr : ",user )
   wins , losses, total_matches , draws,matches_history = get_player_match_summary(Player.objects.get(id='1'))
   friends, requests, pending = get_requests_summary(user='1')
   JsonData = {
      'user': serializePlayer.data,
      'friends': friends,
      'pending' :pending,
      'requests' : requests,
      'matches_history' : matches_history,
      'total_matches' : total_matches,
      'wins' : wins,
      'losses' : losses,
      'draws': draws,
      
   }
   # print("------------------------------> JSONData : ", JsonData)
   return Response(JsonData)

# @api_view(['PUT'])
# def updateRequestStatus(request, id, status):
#    return Response("hello is updated")