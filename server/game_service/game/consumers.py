

# game/consumers.py
import json
import asyncio
import random
import uuid
import re
import jwt

from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf                import settings
from channels.layers            import get_channel_layer
from urllib.parse               import parse_qs
from asgiref.sync               import sync_to_async

from .models                    import *
from .serializers               import *


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
    'ballX':675,
    'ballY': 325,
    'radius':18,
    'speedX' :8,
    'speedY':8,
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

                        redirect_to   = "/tournament/online"
                        self.type          = query_params.get('type', [None])[0]
                        self.match_id = query_params.get('id', [None])[0]

                        if (self.type != "local" and self.type !=  "online") or (self.type == "online"  and self.match_id == "undefined") or \
                            ( self.match_id != "undefined"  and not self.match_id.isdigit()):
                            await self.send(text_data=json.dumps({"action": "match not found"}))
                            return
                        
                        if self.match_id != "undefined":
                            match_instance = await self.get_match(self.match_id)

                            if match_instance is None:
                                await self.send(text_data=json.dumps({"action": "match not found"}))
                                return
                            
                            if match_instance.tournament == None:
                                redirect_to = "/pvp"

                            print("-----> >><<<", match_instance.status)
                            if match_instance.status == "exited":
                                await self.send(text_data=json.dumps({
                                    "action"     : "match_exited",
                                    "redirect_to": redirect_to,
                                    "message"    : "You're exited this match."
                                }))
                                return

                            print("kheraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")

                            self.player1, self.player2 =  await self.get_user(match_instance)
                            if self.user_id != self.player1.id and self.user_id != self.player2.id:
                                await self.send(text_data=json.dumps({"action": "unauthorized"}))
                                return

                            print("-----+++++++++++++++++++++++++++++++++++++++-------------")

                            self.game_name = match_instance.room_name
                            self.channel_layer = get_channel_layer()
                            await self.channel_layer.group_add(
                                self.game_name,
                                self.channel_name
                            )

                            print("-------------------------------------------------")

                            if self.player1.id ==  self.user_id:
                                self.player = "player1"
                            elif self.player2.id == self.user_id:
                                self.player = "player2"
                            else:
                                self.player = "spectator"
                        else:
                            print("here")
                            unique_id = uuid.uuid4().hex[:6]
                            self.game_name = f"game_room_{unique_id}"

                            self.channel_layer = get_channel_layer()
                            await self.channel_layer.group_add(
                                self.game_name,
                                self.channel_name
                            )
                            self.player = "player1"
                            # self.player1 = await self.get_user()
                            print(self.type)
                        await self.send_initial_state(self.type)

                        if not hasattr(self, "game_task"):
                                if self.type != "local":
                                    match_data = { 'status': "started" }
                                    match = await self.get_match(self.match_id)
                                    match = await self.update_match(match, match_data)

                                print("-----> ", match_instance.status)
                                self.game_task = asyncio.create_task(self.game_loop())
                    else:
                        await self.send(text_data=json.dumps({"error": "user doesn't exist"}))
                except jwt.ExpiredSignatureError:
                    await self.send(text_data=json.dumps({"error": "Token expired"}))
                except jwt.DecodeError:
                    await self.send(text_data=json.dumps({"error": "Token decoding error"}))
                except Exception as e:
                    await self.send(text_data=json.dumps({"error": f"Error: {str(e)}"}))

    #i have two cases in disconnect the first is the match status is pending and the other is completed

    async def disconnect(self, close_code):
            print("--------------- in disconnect ---------------")

            redirect_to = "/tournament/online"

            await self.channel_layer.group_discard(
                self.game_name,
                self.channel_name
            )
            self.connected = False
            
            print("-----> ", self.type)

            if self.type != "local":
                if self.player ==  'player1':
                    self.player1Score = 8
                elif self.player ==  'player2':
                    self.player2Score = 8
                
                match = await self.get_match(self.match_id)
                if match.status !=  "completed":        
                    await self.handel_match_result('exited')

                match = await self.get_match(self.match_id)
            
            user  = await self.get_username(self.user_id)
            
            if self.type == 'local' or match.tournament == None:
                redirect_to = "/pvp"

            if(self.start_game):
                await self.channel_layer.group_send(
                self.game_name,
                {
                    'state'       : 'You Won!',
                    "type"        : "opponent_disconnected",
                    'redirect_to' : redirect_to,
                    "message"     : f"Your opponent {user.username} has disconnected.",
                })
            await self.close()


    async def opponent_disconnected(self, event):
        await self.send(text_data=json.dumps({
            "action"      : "opponent_disconnected",
            "message"     : event.get('message'),
            "state"       : event.get('state'),
            'redirect_to' : event.get('redirect_to'),
        }))

    @sync_to_async
    def get_username(self, user_id):
        return User.objects.get(id=user_id)

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

    async def send_initial_state(self, type):
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
            redirect_to     = "/tournament/online"
            self.connected  = False
            self.start_game = False

            await self.handel_match_result('completed')

            match = await self.get_match(self.match_id)
            if match.tournament == None:
                redirect_to = "/pvp"
            if (self.player1Score > self.player2Score):
                winner = 'player1'
            else:
                winner = 'player2'
            await self.channel_layer.group_send(
                self.game_name,
                {
                    'type'        : 'announce_winner',
                    'action'      : 'game_over',
                    'redirect_to' : redirect_to,
                    'player1Score': self.player1Score,
                    'player2Score': self.player2Score,
                    'Winner'      : winner,
                })
        else:
            self.ballX       = self.tableWidth / 2
            self.ballY       = random.randint(100, self.tableHeight - 100)
            self.speedXBall *= -1
            self.speedYBall  = random.choice([7, -7])
            
    async def announce_winner(self,event):
        await self.send(text_data=json.dumps({
            'action'      : event.get('action'),
            'Winner'      : event.get('Winner'),
            'player1Score': event.get('player1Score'),
            'player2Score': event.get('player2Score'),
            'redirect_to' : event.get('redirect_to'),
        }))

    async def handel_match_result(self, status):
        match_data = {
            'player1_score': self.player1Score,
            'player2_score': self.player2Score,
            'status'       : status
        }
        match = await self.get_match(self.match_id)
        match = await self.update_match(match, match_data)
        if match.get('player1_score') > match.get('player2_score'):
            winner = match.get('player1')
            loser  = match.get('player2')
        else:
            winner = match.get('player2')
            loser  = match.get('player1')
 
        await self.update_player_scores(winner, loser, match.get('player1_score'), match.get('player2_score'))

    @sync_to_async
    def update_match(self, match, match_data):
        serializer = MatchSerializer(match, data=match_data, partial=True)
        if serializer.is_valid():
            match = serializer.save()
            return MatchSerializer(match).data
        else:
            raise ValidationError(serializer.errors)

    @sync_to_async
    def update_player_scores(self, winner, loser, winner_score, loser_score):
        try:
            winner_player = Player.objects.get(id=winner)
            loser_player  = Player.objects.get(id=loser)

            winner_player.update_score(score=winner_score)
            loser_player.update_score(score=loser_score)

            winner_player.update_level()
            loser_player.update_level()

            Player.update_all_ranks()
        except Exception as e:
            print(f"An error occurred while updating player scores: {e}")
            raise

    def ball_paddle_collison(self):

        if self.ballX - self.radius <= self.paddle1X + self.paddleWidth:
            if self.paddle1Y <= self.ballY <= self.paddle1Y + self.paddleHeight:
                self.speedXBall *= -1
                self.ballX = self.paddle1X + self.paddleWidth + self.radius

        if self.ballX + self.radius >= self.tableWidth - self.paddleWidth:
            if self.paddle2Y <= self.ballY <= self.paddle2Y + self.paddleHeight:
                self.speedXBall *= -1
                self.ballX = self.tableWidth - self.paddleWidth - self.radius
    

    async def update_ball(self):
        self.ballX += self.speedXBall
        self.ballY += self.speedYBall

        if(self.ballY - self.radius <=0 or self.ballY + self.radius >= self.tableHeight):
            self.speedYBall *=-1
            
        self.ball_paddle_collison()

        if(self.ballX >= self.tableWidth):
                self.player1Score +=1
                await self.check_winner()
                return

        if(self.ballX <= 0):
                self.player2Score +=1
                await self.check_winner()
                return

    async def game_loop(self):
        while self.connected:
            await self.update_ball()
            # await self.paddleCollison()
            await self.broadcast_game_state()
            await asyncio.sleep(0.016)


    async def paddleCollison(self):
        if(self.paddle1Y <= 0):
            self.paddle1Y = 0
        elif(self.paddle1Y + self.paddleHeight >= self.tableHeight):
            self.paddle1Y = self.tableHeight - self.paddleHeight
        elif(self.paddle2Y <= 0):
            self.paddle2Y = 0
        elif(self.paddle2Y + self.paddleHeight>= self.tableHeight):
            self.paddle2Y = self.tableHeight - self.paddleHeight
        
    async def move_leftPaddle(self,move):
        if(move == 'up'):
            self.paddle1Y -= self.paddleSpeed
        elif(move == 'down'):
            self.paddle1Y += self.paddleSpeed

        await self.paddleCollison()
        await self.broadcast_game_state()

    async def move_rightPaddle(self,move):
        if(move == 'up'):
            self.paddle2Y -= self.paddleSpeed
        elif(move == 'down'):
            self.paddle2Y += self.paddleSpeed

        await self.paddleCollison()
        await self.broadcast_game_state()

    async def update_data(self,data):

        self.paddle1Y = data['data']['paddle1Y']
        self.paddle2Y = data['data']['paddle2Y']
        self.ballX = data['data']['ballX']
        self.ballY = data['data']['ballY']
        self.speedXBall =  data['data']['speedXBall']
        self.speedYBall = data['data']['speedYBall']

        if data['data']['player1Score'] > self.player1Score :
            self.player1Score = data['data']['player1Score']

        if data['data']['player2Score'] >  self.player2Score:
            self.player2Score = data['data']['player2Score']

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
                'speedXBall':self.speedXBall,
                'speedYBall':self.speedYBall,
                'player1Score':self.player1Score,
                'player2Score':self.player2Score,
            })

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
            'speedXBall':event.get('speedXBall'),
            'speedYBall':event.get('speedYBall'),
            'player1Score':event.get('player1Score'),
            'player2Score':event.get('player2Score'),
        }))
