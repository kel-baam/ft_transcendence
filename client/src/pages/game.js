import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../package/index.js'
// import { Match } from './match.js'
// import { header } from '../../../components/header.js'
// import { sidebarLeft } from '../../../components/sidebar-left.js'
// import { NotFound } from './404.js'
import { header } from '../components/header.js'
import { sidebarLeft } from '../components/sidebar-left.js'
// socket=null
// import asyncio



let socket = null;


let ballX = 200;
let ballY = 200;
let ballSpeedX = 5;
let ballSpeedY = 5;
let ballRadius = 18;

let paddleWidth = 15;
let paddleHeight = 125;
// let paddle1Y = canvas.height / 2 - paddleHeight / 2;
// let paddle2Y = canvas.height / 2 - paddleHeight / 2;
let paddle1Speed = 13;
let paddle2Speed = 0;

const KEY_UP = 87;
const KEY_DOWN = 83;
let player='';
let ball;
const KEY_UP2 = 38;   // Up Arrow for Player 2 (Paddle 2)
const KEY_DOWN2 = 40;
let ctx;
let canvas;
const keyPressed ={};
export const Game = defineComponent(
    {
        state()
        {
            return {
            }
            
        },
        
        onMounted()
        {
            this.initWebSocket();
        },
        onUnmounted() {
            console.log("test")
            if (socket) {
                console.log('WebSocket connection closed');
                socket.close();

            }
        },
        Ball()
        {
            // constructor(pos,velocity,radius)
            // {
                // const canvas = document.getElementById("tableGame");

                // const ctx = canvas.getContext("2d");

                // this.pos = pos;
                // this.velocity = velocity;
                // this.radius = radius;
                // context = ctx;
            // };
            return {

                update : function(){
                    // this.pos.x  += this.velocity.x;
                    // this.pos.y  += this.velocity.y;
    
                },
               draw : function(context,pos,radius)
                {
                    context.fillStyle = "white";
                    // context.strokeStyle = '#F39C12';
                    context.beginPath();
                    context.arc(pos.x,pos.y,radius,0,Math.PI *2)
                    context.fill();
                    context.stroke()
                }
            }
        },
        initWebSocket()
        {
          
            const vec2 = (x,y)=>
            {
                return {x: x , y: y};
            };

            
            const leftPaddle =(y,paddleWidth,paddleHeight)=>{

                ctx.fillStyle = "#CF4551";
                ctx.fillRect(0, y, paddleWidth, paddleHeight); 
            }

            const rightPaddle =(y,paddleWidth,paddleHeight)=>{
                ctx.fillStyle = "#1667E0";

                ctx.fillRect(canvas.width - paddleWidth, y, paddleWidth, paddleHeight); // Right paddle

            }
          
            if (!socket || socket.readyState !== WebSocket.OPEN) {

                    socket = new WebSocket(
                        'ws://localhost:3000/ws/game/'
                    );
                    canvas = document.getElementById("tableGame");
            
                    ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    canvas.width="1350" 
                    canvas.height="650"
                    window.addEventListener('keydown', function(e) {
            
                        e.preventDefault();
                        keyPressed[e.keyCode] = true;

                        if (keyPressed[KEY_UP]) {
                            socket.send(JSON.stringify({ move: 'up' ,player :player}));
                        }
                        if (keyPressed[KEY_DOWN]) {
                            socket.send(JSON.stringify({ move: 'down',player: player}));
                        }
                    })
                    
                    window.addEventListener('keyup', function(e) {
                        keyPressed[e.keyCode] = false; 
                    });

                    socket.onopen = function(e) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas on new connection

                        console.log("WebSocket is open now.");
                    };
            
                    socket.onmessage = function(e) {


                        const data = JSON.parse(e.data);
                        if(data.action == "init_game")
                        {

                            ctx.clearRect(0, 0, canvas.width, canvas.height);

                            ball =  this.Ball(vec2(200,200),vec2(5,5),ballRadius)
                            ball.draw(ctx,vec2(data.ballX,data.ballY),data.radius)
                            leftPaddle(data.paddle1Y,data.paddleWidth,data.paddleHeight)
                            rightPaddle(data.paddle2Y,data.paddleWidth,data.paddleHeight)
                            
                            player = data.player
                        }

                        if(data.action == "move_leftPaddle" || data.action == "move_rightPaddle")
                        {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            leftPaddle(data.paddle1Y,data.paddleWidth,data.paddleHeight)
                            rightPaddle(data.paddle2Y,data.paddleWidth,data.paddleHeight)
                            ball.draw(ctx,vec2(data.ballX,data.ballY),data.radius)
                            socket.send(JSON.stringify({ update: 'update_paddles_data', data: data}));


                        }
                        if(data.action == "move_ball")
                        {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            leftPaddle(data.paddle1Y,data.paddleWidth,data.paddleHeight)
                            rightPaddle(data.paddle2Y,data.paddleWidth,data.paddleHeight)
                            ball.draw(ctx,vec2(data.ballX,data.ballY),data.radius)


                        }
                        // console.log("yes",data,player)
                        
                    }.bind(this);
                    
                    socket.onclose = function(e) {
                        console.log("WebSocket is closed now.",e);
                    };
                    socket.onerror = function(e) {
                        console.log("WebSocket error",e);
                    };
            }
        },
        render()
        {
            return h('div',{id:'game'},[
                h('nav',{id:'header'},[
                    h('a', { href: '/home' }, [
                        h('img', { src: './images/logo.png', class: 'logo' })
                    ]),
                    h('div',{id:'exitIcon'},[
                        h('i',{class:'fa-solid fa-arrow-right-from-bracket', 'aria-hidden': 'false' })
                    ])
                ]),
                h('div',{class:'gameSpace'},[
                    h('div',{class:'playerInfo'},[
                        h('div',{class:'firstPlayer'},[
                           h('div',{class:'info'},[
                               h('img',{src:'./images/niboukha.jpeg',class:'playerPicture'}),
                               h('h4',{class:'playerName'},['Niboukha']),
                           ]),
                           h('div',{class:'scoreCard'},[
                            h('h4',{},['10'])
                           ])
                        ]),
                        h('img',{class:'vsPic',src:"./images/vs (2).png"}),

                        h('div',{class:'secondPlayer'},[
                            h('div',{class:'scoreCard'},[ h('h4',{},['100'])]),
                            h('div',{class:'info'},[
                                h('img',{src:'./images/niboukha.jpeg',class:'playerPicture'}),
                                h('h4',{class:'playerName'},['Niboukha']),
 
                            ]),
                         ])
                    ]),
                   
                        h('canvas',{id:'tableGame'},[
                            // h('div', { id: 'leftPaddle' }),

                            //         // Right paddle
                            // h('div', { id: 'rightPaddle' }),

                            //         // Goalplace for Player 1 (near left paddle)
                            // h('div', { id: 'goalplace1' }),

                            //         // Goalplace for Player 2 (near right paddle)
                            // h('div', { id: 'goalplace2' })
                    
                    ])
                ])

            ])
        }
    }
)