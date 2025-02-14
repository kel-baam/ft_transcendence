

# game/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from django.conf import settings
# from django.db import models
from .models import User
import json
import jwt
from channels.layers import get_channel_layer
import re

# ball = {

#     x: 200,
#     y:200,
#     speedX:5,
#     speedY:5,
#     ballRadius:25 
# }

# paddle1 = {

#     y:,
#     speedX:5,
#     speedY:5,
#     ballRadius:25 
# }


# paddle2 = {

#     x: 200,
#     y:200,
#     speedX:5,
#     speedY:5,
#     ballRadius:25 
# }
paddle1Y = 300
paddle2Y  = 300
class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        self.user_id = None 
        self.game_running = False
        self.type = None
        # self.players = {}
        self.game_name = "game_1"  # Static game room
        self.paddleHeight = 125  # Height of paddles
        self.paddleWidth = 15    # Width of paddles
        self.paddleSpeed = 20    # Speed at which paddles move

        # Initial Y positions of paddles (both in the middle of the canvas)
        # self.paddle1Y = 300  # Starting position of left paddle
        # self.paddle2Y = 300
        # (1350 / 2)  - (self. paddleWidth / 2) 
        print("accpting=>")
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

                                await self.accept() 
                                self.game_name = "game_1"  # Extract the game room ID from the URL

                                self.channel_layer = get_channel_layer()
                                await self.channel_layer.group_add(
                                    self.game_name,  # Game room ID
                                    self.channel_name  # This instance's WebSocket connection
                                )
                                # if self.game_name not in self.players:
                                #     self.players[self.game_name] = []
                                if self.user_id == 1:
                                    self.player = "player1"
                                elif self.user_id == 34:
                                    self.player = "player2"
                                else:
                                    self.player = "spectator"

                                print("done",self.user_id,self.game_name,self.channel_layer)
                                
                                # print("player with id",user.id,"game /id",self.game_name,"in chaneel name",self.channel_name)
                                # self.players[self.game_name].append(self.channel_name)
                                # print(f"Player connected. Total players: {len(self.players[self.game_name])}")

                                await self.send_initial_state()

                                # await self.send(text_data=json.dumps({'action':'starting','test':'ok done','id':user.id}))
                            
                            else:
                                print("user not")
                                await self.send(text_data=json.dumps({"error": "user doesn't exist"}))
                        except Exception as e:
                                print("errrr nor",e)
                                await self.send(text_data=json.dumps({"error": "token expired"}))


    async def send_initial_state(self):
        # Send the initial paddle state (and other initial game state) to the frontend
        await self.send(text_data=json.dumps({
            'paddle1Y': paddle1Y,
            'paddle2Y': paddle2Y,
            'paddleHeight': self.paddleHeight,
            'paddleWidth': self.paddleWidth,
            'paddleSpeed': self.paddleSpeed,
            'player' : self.player,


        }))

    async def paddleCollison(self):
        global paddle1Y
        global paddle2Y

        if(paddle1Y <= 0):
            paddle1Y = 0
        if(paddle1Y + self.paddleHeight >= 650):
            paddle1Y = 650 - self.paddleHeight
        if(paddle2Y <= 0):
            paddle2Y = 0
        if(paddle2Y + self.paddleHeight>= 650):
            paddle2Y = 650 - self.paddleHeight

    async def disconnect(self, close_code):
        if self.game_name:
            await self.channel_layer.group_discard(
                    self.game_name,  # Game room ID
                    self.channel_name  # This instance's WebSocket connection
            )
        print(f"User {self.user_id} disconnected")
        
    async def paddle1(self,move):
        global paddle1Y

        if(move == 'up'):
            paddle1Y -= self.paddleSpeed
        if(move == 'down'):
            paddle1Y += self.paddleSpeed
        await self.paddleCollison()

        # print("data when we move paddle 1 y1",paddle1Y,"y2",paddle2Y)
        await self.channel_layer.group_send(
            self.game_name,
            {
                'type':'paddle_move',
                'paddle1Y' :paddle1Y,
                'paddle2Y': paddle2Y,
                'paddleHeight': self.paddleHeight,
                'paddleWidth': self.paddleWidth,
                # 'player' : self.player
            }
    )


    async def paddle2(self,move):
        global paddle2Y
        print("paddel move")
        if(move == 'up'):
            paddle2Y -= self.paddleSpeed
        if(move == 'down'):
            paddle2Y += self.paddleSpeed
        await self.paddleCollison()
        # print("data when we move paddle 1 y2",paddle2Y,"y2",paddle1Y)
        
        await self.channel_layer.group_send(
            self.game_name,
            {
                'type':'paddle_move',
                'paddle1Y' :paddle1Y,
                'paddle2Y': paddle2Y,
                'paddleHeight': self.paddleHeight,
                'paddleWidth': self.paddleWidth,
                # 'player' : self.player
            }
    )

    async def receive(self, text_data):

        data = json.loads(text_data)
        # await self.send(text_data=json.dumps({"message": "Message recived "}))
        print("soo what now ",data)
        if 'move' in data and 'player' in data and data['player'] == 'player1':
            await self.paddle1(data['move'])

        if 'move' in data and 'player' in data and data['player'] == 'player2':
            await self.paddle2(data['move'])


 
        

    async def paddle_move(self, event):

        await self.send(text_data=json.dumps({
            'paddle1Y': event.get('paddle1Y'),
            'paddle2Y': event.get('paddle2Y'),
            # 'player' : event.get('player'),
            'paddleHeight': self.paddleHeight,
            'paddleWidth': self.paddleWidth,
        }))
















