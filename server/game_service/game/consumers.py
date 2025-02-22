

# game/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import random
import uuid
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from django.conf import settings
from .models import *
import jwt
from channels.layers import get_channel_layer
import re
from urllib.parse import parse_qs
from asgiref.sync                       import sync_to_async
from .serializers import *

paddels ={
   'paddle1Y': 650 / 2 - 125 / 2,
   'paddle1X': 0,
   'paddle2Y': 650 / 2 - 125 / 2,
   'paddleWidth': 15,
   'paddleHeight': 125,
   'paddleSpeed' : 90,
}

table ={
    'width': 1350,
    'height': 650,
}

ball ={
    'ballX': 200,
    'ballY': 200,
    'radius':18,
    'speedX' :10,
    'speedY':10,
    'maxScore':8,
}

class GameConsumer(AsyncWebsocketConsumer):
 
    # start_play = 0
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Instance-level variables (instead of class-level)
        self.paddle1Y = paddels['paddle1Y']
        self.paddle2Y = paddels['paddle2Y']
        self.paddle1X = paddels['paddle1X']
        self.paddleHeight = paddels['paddleHeight']
        self.paddleWidth = paddels['paddleWidth']
        self.paddleSpeed = paddels['paddleSpeed']

        self.ballX = ball['ballX']
        self.ballY = ball['ballY']
        self.speedXBall = ball['speedX']
        self.speedYBall = ball['speedY']
        self.tableWidth = table['width']
        self.tableHeight = table['height']
        self.maxScore = ball['maxScore']
        self.game_name = 'game_1'
        self.radius = ball['radius']
        self.player = None
        self.user_id = None
        self.connected = True
        self.player1Score = 0
        self.player2Score = 0
        self.winner = None
        self.start_game = True
        self.player1 =''
        self.player2 =''

    async def connect(self):
        for header_name, header_value in self.scope["headers"]:
                    if header_name == b'cookie':

                        cookies_str = header_value.decode("utf-8")
                        cookies     = {}
                        for cookie in cookies_str.split("; "):
                            key, value   = cookie.split("=", 1)  
                            cookies[key] = value          
                        try:
                            payload           = jwt.decode(cookies.get("access_token").encode("utf-8"), settings.SECRET_KEY, algorithms=["HS256"])
                            self.access_token = cookies.get("access_token")
                            user              = await sync_to_async(User.objects.filter(email=payload["email"]).first)()
                            if user:
                                self.scope['user_id'] = user
                                self.user_id          = user.id
                                self.scope['email']   = payload["email"]
                                query_string = self.scope['query_string'].decode()
                                query_params = parse_qs(query_string)
                                await self.accept()
                                type = query_params.get('type', [None])[0]
                                self.match_id = query_params.get('id', [None])[0]
                                # if  not match_id.isdigit():
                                #     print(">>>>>>>>>>>>>>>> here is digit ")

                                if (type != "local" and type !=  "online") or (type == "online"  and self.match_id == "undefined") or \
                                    ( self.match_id != "undefined"  and not self.match_id.isdigit()):
                                    # print("----------------------> not found")
                                    await self.send(text_data=json.dumps({"action": "match not found"}))
                                    return
                                
                                if self.match_id != "undefined":
                                    match_instance = await self.get_match(self.match_id)
                                    if match_instance is None:
                                        await self.send(text_data=json.dumps({"action": "match not found"}))
                                        return
                                    
                                    self.player1, self.player2 =  await self.get_user(match_instance)
                                    if self.user_id != self.player1.id and self.user_id != self.player2.id:
                                        await self.send(text_data=json.dumps({"action": "unauthorized"}))
                                        return

                                    self.game_name = match_instance.room_name
                                    self.channel_layer = get_channel_layer()
                                    await self.channel_layer.group_add(
                                        self.game_name,
                                        self.channel_name
                                    )
                                    # current_group_size = len(await self.channel_layer.group_channels(self.game_name))
                                    # print(">>>>>>>>>>>>>>>>>> room name : ", current_group_size)
                                    if self.player1.id ==  self.user_id:
                                        self.player = "player1"
                                    elif self.player2.id == self.user_id:
                                        self.player = "player2"
                                    else:
                                        self.player = "spectator"
                                else:
                                    unique_id = uuid.uuid4().hex[:6]  # Generates a 6-character unique ID
                                    self.game_name = f"game_room_{unique_id}"

                                    self.channel_layer = get_channel_layer()
                                    await self.channel_layer.group_add(
                                        self.game_name,
                                        self.channel_name
                                    )
                                    self.player = "player1"
                                    # self.player1 = await self.get_user()
                                await self.send_initial_state(type)
                                if not hasattr(self, "game_task"):
                                        print("Game loop running...")
                                        self.game_task = asyncio.create_task(self.game_loop())
                            else:
                                await self.send(text_data=json.dumps({"error": "user doesn't exist"}))
                        except jwt.ExpiredSignatureError:
                            await self.send(text_data=json.dumps({"error": "Token expired"}))
                        except jwt.DecodeError:
                            await self.send(text_data=json.dumps({"error": "Token decoding error"}))
                        except Exception as e:
                            await self.send(text_data=json.dumps({"error": f"Error: {str(e)}"}))

    async def disconnect(self, close_code):
       
        await self.channel_layer.group_discard(
            self.game_name,
            self.channel_name
        )
        self.connected = False

        print("discooonected ==> ",self.start_game)

        if(self.start_game):
            await self.channel_layer.group_send(
            self.game_name,
            {
                'state'  : 'You Win!',
                "type"   : "opponent_disconnected",
                "message": f"Your opponent {self.user_id} has disconnected.",
            })
        await self.close()

    async def opponent_disconnected(self, event):
      
        await self.send(text_data=json.dumps({
            "action" : "opponent_disconnected",
            "message":event.get('message'),
            "state":event.get('state'),
        }))

    async def receive(self, text_data):
        data     = json.loads(text_data)

        if 'update' in data:
            await self.update_data(data)
        if 'move' in data and 'player' in data and data['player'] == 'player1':
            await self.move_leftPaddle(data['move'])
        if 'move' in data and 'player' in data and data['player'] == 'player2':
            await self.move_rightPaddle(data['move'])


    @sync_to_async
    def get_user(self, match_instance):
        player1 = User.objects.get(id = match_instance.player1.user.id)
        player2 = User.objects.get(id = match_instance.player2.user.id)

        return player1, player2
    
    @sync_to_async
    def get_match(self, match_id):
        try:
            match_instance = Match.objects.filter(id=match_id).first()
            return match_instance
        except Match.DoesNotExist:
            return None

    async def send_initial_state(self,type):
        if type == 'online':
           await self.send(text_data=json.dumps({
                'action':'init_game',
                'paddle1Y': self.paddle1Y,
                'paddle2Y': self.paddle2Y,
                'paddleHeight': self.paddleHeight,
                'paddleWidth': self.paddleWidth,
                'paddleSpeed': self.paddleSpeed,
                'ballX': self.ballX,
                'ballY': self.ballY,
                'radius': self.radius,
                'player' : self.player,
                'player1Score':self.player1Score,
                'player2Score':self.player2Score,
                'userId':self.user_id,
                'player1' : UserSerializer(self.player1, fields={'id', 'username', 'picture'}).data,
                'player2' : UserSerializer(self.player2, fields={'id', 'username', 'picture'}).data,
            }))
        else:
            await self.send(text_data=json.dumps({
                'action':'init_game',
                'paddle1Y': self.paddle1Y,
                'paddle2Y': self.paddle2Y,
                'paddleHeight': self.paddleHeight,
                'paddleWidth': self.paddleWidth,
                'paddleSpeed': self.paddleSpeed,
                'ballX': self.ballX,
                'ballY': self.ballY,
                'radius': self.radius,
                'player' : self.player,
                'player1Score':self.player1Score,
                'player2Score':self.player2Score,
                'userId':self.user_id,
                'player1' : {},
                'player2' : {},
            }))

    
    async def check_winner(self):
        if(self.player1Score == self.maxScore or  self.player2Score == self.maxScore):
            self.connected = False
            self.start_game = False

            match = self.get_match(self.match_id)
            match_data = {
                'player1_score': self.player1Score,
                'player2_score': self.player2Score,
                'status'       : "completed"
            }
            serializer = MatchSerializer(match, data=match_data, partial=True)
            if serializer.is_valid():
                match = serializer.save()

            await self.channel_layer.group_send(
                self.game_name,
                {
                    'type': 'announce_winner',
                    'action':'game_over',
                    'player1Score':self.player1Score,
                    'player2Score':self.player2Score,
                    'Winner':self.player,
                })
        else:
            self.ballX = self.tableWidth / 2
            self.ballY = random.randint(100, self.tableHeight - 100)
            self.speedXBall *= -1
            self.speedYBall = random.choice([7, -7])
            await self.broadcast_game_state()


    
    async def announce_winner(self,event):

        await self.send(text_data=json.dumps({
            'action':event.get('action'),
            'Winner':event.get('Winner'),
            'player1Score':event.get('player1Score'),
            'player2Score':event.get('player2Score'),
        }))


    def ball_paddle_collison(self):

        if self.ballX - self.radius <= self.paddle1X + self.paddleWidth:  # Ball is near the left paddle
            if self.paddle1Y <= self.ballY <= self.paddle1Y + self.paddleHeight:  # Ball is within the paddle's vertical range
                self.speedXBall *= -1  # Reverse horizontal direction
                # Optionally adjust the ball’s position slightly to avoid 'skipping' through the paddle
                self.ballX = self.paddle1X + self.paddleWidth + self.radius

        if self.ballX + self.radius >= self.tableWidth - self.paddleWidth:  # Ball is near the right paddle
            if self.paddle2Y <= self.ballY <= self.paddle2Y + self.paddleHeight:  # Ball is within the paddle's vertical range
                self.speedXBall *= -1  # Reverse horizontal direction
                # Optionally adjust the ball’s position slightly to avoid 'skipping' through the paddle
                self.ballX = self.tableWidth - self.paddleWidth - self.radius
      

    async def update_ball(self):
        # print('update',self.player,"|",self.ballX,self.ballY)
        self.ballX += self.speedXBall
        self.ballY += self.speedYBall


        # Wall Collision (Top & Bottom)

        if(self.ballY - self.radius <=0 or self.ballY + self.radius >= self.tableHeight):
            self.speedYBall *=-1
            
        self.ball_paddle_collison()


        if(self.ballX >= self.tableWidth):
                self.player1Score +=1
                await self.check_winner()

        if(self.ballX <=0):
                self.player2Score +=1
                await self.check_winner()

        await self.broadcast_game_state()

    


    async def game_loop(self):
        # print("game loop=>",self.player,"|",self.connected)
        while self.connected:
            # if(self.player == "player1"):
            if(self.player == "player1"):
                await self.update_ball()
            await asyncio.sleep(0.02)


    async def paddleCollison(self):
        if(self.paddle1Y <= 0):
            self.paddle1Y = 0
        if(self.paddle1Y + self.paddleHeight >= self.tableHeight):
            self.paddle1Y = self.tableHeight - self.paddleHeight
        if(self.paddle2Y <= 0):
            self.paddle2Y = 0
        if(self.paddle2Y + self.paddleHeight>= self.tableHeight):
            self.paddle2Y = self.tableHeight - self.paddleHeight
        



    async def move_leftPaddle(self,move):
        if(move == 'up'):
            self.paddle1Y -= self.paddleSpeed
        if(move == 'down'):
            self.paddle1Y += self.paddleSpeed
        await self.paddleCollison()
        await self.broadcast_game_state()



    async def move_rightPaddle(self,move):
        if(move == 'up'):
            self.paddle2Y -= self.paddleSpeed
        if(move == 'down'):
            self.paddle2Y += self.paddleSpeed

        await self.paddleCollison()
        await self.broadcast_game_state()

        
        
    

    async def broadcast_game_state(self):
        await self.channel_layer.group_send(
            self.game_name,
            {
                'action':'game_state',
                'type' :'game_state',
                'paddle1Y' : self.paddle1Y,
                'paddle2Y': self.paddle2Y,
                'paddleHeight': self.paddleHeight,
                'paddleWidth': self.paddleWidth,
                'ballX': self.ballX,
                'ballY': self.ballY,
                'radius': self.radius,
                'player1Score':self.player1Score,
                'player2Score':self.player2Score,
            })

    async def update_data(self,data):
        
        self.paddle1Y = data['data']['paddle1Y']
        self.paddle2Y = data['data']['paddle2Y']
        self.ballX = data['data']['ballX']
        self.ballY = data['data']['ballY']
        if data['data']['player1Score'] > self.player1Score :
            self.player1Score = data['data']['player1Score']
        if data['data']['player2Score'] >  self.player2Score:
            self.player2Score = data['data']['player2Score']


    async def game_state(self, event):

        await self.send(text_data=json.dumps({
            'action':event.get('action'),
            'paddle1Y': event.get('paddle1Y'),
            'paddle2Y': event.get('paddle2Y'),
            'paddleHeight': self.paddleHeight,
            'paddleWidth': self.paddleWidth,
            'ballX': event.get('ballX'),
            'ballY':event.get('ballY'),
            'radius': event.get('radius'),
            'player1Score':event.get('player1Score'),
            'player2Score':event.get('player2Score'),
        }))
















