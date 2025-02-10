

# game/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio

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

paddels ={
   'paddle1Y': 650 / 2 - 125 / 2,
   'paddle2Y': 650 / 2 - 125 / 2,
   'paddleWidth': 15,
   'paddleHeight': 125,
   'paddleSpeed' : 20,

}


ball ={
    'ballX': 200,
    'ballY': 200,
    'radius':18,
    'speedX' :7,
    'speedY':7,

}


class GameConsumer(AsyncWebsocketConsumer):
 

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Instance-level variables (instead of class-level)
        self.paddle1Y = paddels['paddle1Y']
        self.paddle2Y = paddels['paddle2Y']
        self.ballX = ball['ballX']
        self.ballY = ball['ballY']
        self.radius = ball['radius']
        self.paddleHeight = paddels['paddleHeight']
        self.paddleWidth = paddels['paddleWidth']
        self.paddleSpeed = paddels['paddleSpeed']
        self.game_name = "game_1"
        self.player = None
        self.user_id = None
        self.speedXBall = ball['speedX']
        self.speedYBall = ball['speedY']
        self.connected = True



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

                                self.game_name = "game_1"
                                # if await self.is_game_full(self.room_group_name):
                                # await self.close()  # Close the WebSocket if the game is full
                                # return
                                await self.accept()  

                                self.channel_layer = get_channel_layer()
                                print("iiiii conect",self.game_name, self.channel_name)
                                await self.channel_layer.group_add(
                                    self.game_name,
                                    self.channel_name
                                )
                                
                                # while True:
                                #     await self.game_loop()  # Update ball position
                                #     await asyncio.sleep(0.016)
                                if not hasattr(self, "game_task"):
                                        print("Game loop running...")
                                        self.game_task = asyncio.create_task(self.game_loop())
                                if self.user_id == 1:
                                    self.player = "player1"
                                elif self.user_id == 34:
                                    self.player = "player2"
                                else:
                                    self.player = "spectator"
                        
                                await self.send_initial_state()
                            
                            else:
                                print("user not")
                                await self.send(text_data=json.dumps({"error": "user doesn't exist"}))
                        except Exception as e:
                                print("errrr nor",e)
                                await self.send(text_data=json.dumps({"error": "token expired"}))

    async def disconnect(self, close_code):
       
        # print(self.game_name,self.channel_name)
        await self.channel_layer.group_discard(
                self.game_name,
                self.channel_name
        )
        self.connected = False

        await self.close()
        print(f"User {self.user_id} disconnected {self.channel_name}")


    async def send_initial_state(self):
      
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
        }))


    def update_ball(self):
        self.ballX += self.speedXBall
        self.ballY += self.speedYBall

        if(self.ballX + self.radius >= 1350):
                self.speedXBall *=-1
        if(self.ballX - self.radius <=0):
                self.speedXBall *=-1
        if(self.ballY - self.radius <=0):
            self.speedYBall *=-1

        if(self.ballY + self.radius >= 650):
            self.speedYBall *=-1


    async def game_loop(self):
        await asyncio.sleep(0.2)

        """Continuously updates the game state."""
        while self.connected:
            self.update_ball()
        
            await self.channel_layer.group_send(
            self.game_name,
            {
                'action':'move_ball',
                'type':'paddle_move',
                'paddle1Y' : self.paddle1Y,
                'paddle2Y': self.paddle2Y,
                'paddleHeight': self.paddleHeight,
                'paddleWidth': self.paddleWidth,
                'ballX': self.ballX,
                'ballY': self.ballY,
                'radius': self.radius,
            })
        
            # await asyncio.sleep(0.05)
            await asyncio.sleep(0.02)

    async def paddleCollison(self):


        if(self.paddle1Y <= 0):
            self.paddle1Y = 0
        if(self.paddle1Y + self.paddleHeight >= 650):
            self.paddle1Y = 650 - self.paddleHeight
        if(self.paddle2Y <= 0):
            self.paddle2Y = 0
        if(self.paddle2Y + self.paddleHeight>= 650):
            self.paddle2Y = 650 - self.paddleHeight
        
    async def move_leftPaddle(self,move):
        if(move == 'up'):
            self.paddle1Y -= self.paddleSpeed
        if(move == 'down'):
            self.paddle1Y += self.paddleSpeed
        await self.paddleCollison()

        await self.channel_layer.group_send(
            self.game_name,
            {
                'action':'move_leftPaddle',
                'type':'paddle_move',
                'paddle1Y' :self.paddle1Y,
                'paddle2Y': self.paddle2Y,
                'paddleHeight': self.paddleHeight,
                'paddleWidth': self.paddleWidth,
                'ballX': self.ballX,
                'ballY': self.ballY,
                'radius': self.radius,
            }
    )


    async def move_rightPaddle(self,move):
        # print("paddel move")
        if(move == 'up'):
            self.paddle2Y -= self.paddleSpeed
        if(move == 'down'):
            self.paddle2Y += self.paddleSpeed
        await self.paddleCollison()
        
        await self.channel_layer.group_send(
            self.game_name,
            {
                'action':'move_rightPaddle',
                'type' :'paddle_move',
                'paddle1Y' : self.paddle1Y,
                'paddle2Y': self.paddle2Y,
                'paddleHeight': self.paddleHeight,
                'paddleWidth': self.paddleWidth,
                'ballX': self.ballX,
                'ballY': self.ballY,
                'radius': self.radius,
            }
    )
    async def update_data(self,data):
        # print("fdata update",data)
        self.paddle1Y = data['data']['paddle1Y']
        self.paddle2Y = data['data']['paddle2Y']



    async def receive(self, text_data):

        data = json.loads(text_data)
        if 'update' in data:
            await self.update_data(data)
        if 'move' in data and 'player' in data and data['player'] == 'player1':
            await self.move_leftPaddle(data['move'])

        if 'move' in data and 'player' in data and data['player'] == 'player2':
            await self.move_rightPaddle(data['move'])


 
        

    async def paddle_move(self, event):

        await self.send(text_data=json.dumps({
            'action':event.get('action'),
            'paddle1Y': event.get('paddle1Y'),
            'paddle2Y': event.get('paddle2Y'),
            'paddleHeight': self.paddleHeight,
            'paddleWidth': self.paddleWidth,
            'ballX': event.get('ballX'),
            'ballY':event.get('ballY'),
            'radius': event.get('radius'),


        }))
















