import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../package/index.js'
// import { Match } from './match.js'
// import { header } from '../../../components/header.js'
// import { sidebarLeft } from '../../../components/sidebar-left.js'
// import { NotFound } from './404.js'
import { header } from '../components/header.js'
import { sidebarLeft } from '../components/sidebar-left.js'
// socket=null



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

const KEY_UP2 = 38;   // Up Arrow for Player 2 (Paddle 2)
const KEY_DOWN2 = 40;

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
            if (socket) {
                console.log('WebSocket connection closed');
                socket.close();
            }
        },
        
        initWebSocket()
        {
            const canvas = document.getElementById("tableGame");

            const ctx = canvas.getContext("2d");
            canvas.width="1350" 
            canvas.height="650"
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
                        'ws://10.14.2.3:3000/ws/game/'
                    );
            
                    window.addEventListener('keydown', function(e) {
            
                        e.preventDefault();
                            keyPressed[e.keyCode] = true;

                        if (keyPressed[KEY_UP] && player == 'player1') {
                            socket.send(JSON.stringify({ move: 'up' ,player :player}));
                        }
                        if (keyPressed[KEY_DOWN] && player == 'player1') {
                            socket.send(JSON.stringify({ move: 'down',player: player}));
                        }

                        if (keyPressed[KEY_UP2] && player == 'player2') {

                            socket.send(JSON.stringify({ move: 'up' ,player :player}));
                        }
                        if (keyPressed[KEY_DOWN2] && player == 'player2') {
                            socket.send(JSON.stringify({ move: 'down',player: player}));
                        }
                    })
                    
                    window.addEventListener('keyup', function(e) {
                        keyPressed[e.keyCode] = false; 
                    });

                    socket.onopen = function(e) {
                        console.log("WebSocket is open now.");
                    };
            
                    socket.onmessage = function(e) {


                        const data = JSON.parse(e.data);

                        if(data.paddle1Y || data.paddle2Y)
                        {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            if(data.player || player)

                            leftPaddle(data.paddle1Y,data.paddleWidth,data.paddleHeight)
                            rightPaddle(data.paddle2Y,data.paddleWidth,data.paddleHeight)
                            if(data.player)
                                player = data.player
                        }
                       
                        
                    }.bind(this);
                    
                    socket.onclose = function(e) {
                        console.log("WebSocket is closed now.",e);
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