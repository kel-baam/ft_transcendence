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
import { showErrorNotification } from '../package/utils.js';


let socket = null;



const confettiParticles = []; 
const KEY_UP = 87;
const KEY_DOWN = 83;
let player='';
let ball;
const KEY_UP2 = 38;   // Up Arrow for Player 2 (Paddle 2)
const KEY_DOWN2 = 40;
let ctx;
let canvas;
const keyPressed ={};
let userId = 0;
export const Game = defineComponent(
    {
        state()
        {
            return {
                score:{player1Score:0,player2Score:0},
                player1Score: 0,
                player2Score:0,

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
        Ball()
        {
    
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
        vec2(x,y)
        {
            return {x: x , y: y};
        }, 
        createConfetti() {
            for (let i = 0; i < 200; i++) {
                const size = Math.random() * 10 + 5;  // Random size of confetti
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height / 2;
                const speedX = Math.random() * 4 - 2;  // Horizontal speed
                const speedY = Math.random() * 4 + 2;  // Vertical speed
                const color = this.getRandomColor();
                confettiParticles.push({ x, y, size, speedX, speedY, color });
            }
            this.animateConfetti();
        },

        getRandomColor() {
            const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A6", "#F0E130"];
            return colors[Math.floor(Math.random() * colors.length)];
        },
        animateConfetti(){
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas for the next frame

            for (let i = 0; i < confettiParticles.length; i++) {
                const p = confettiParticles[i];
                p.x += p.speedX;
                p.y += p.speedY;
                p.speedY += 0.1;

                ctx.beginPath();
                ctx.rect(p.x, p.y, p.size, p.size);
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.closePath();

                if (p.y > canvas.height) {
                    confettiParticles.splice(i, 1);
                    i--;
                }
            }
            if (confettiParticles.length > 0) {
                requestAnimationFrame(this.animateConfetti.bind(this));
            }

        },
        announce_winner(message){
            const winMessageContainer = document.createElement('div');

            winMessageContainer.classList.add('winner-card');

            const winText = document.createElement('h1');
            winText.textContent = message;
            winMessageContainer.appendChild(winText);

            // Append the message container to the game area (canvas)
            document.getElementById('tableGame').parentElement.appendChild(winMessageContainer);

            // Trigger the confetti (if you have this functionality)
            if(message == 'You Win!')
                this.createConfetti();
            else
                ctx.clearRect(0, 0, canvas.width, canvas.height);


            setTimeout(function () {
            // Apply the transition effect for scaling and fading
            winMessageContainer.style.transition = 'transform 2s ease, opacity 2s ease'; // Slow scale and fade
            winMessageContainer.style.transform = 'scale(0)'; // Shrinks the container
            winMessageContainer.style.opacity = '0'; // Fades the message

            setTimeout(function() {
                winMessageContainer.style.display = 'none'; // Hide the element from the DOM
            }, 1000);
            }, 3000);
        },
        initWebSocket()
        {
            const leftPaddle =(y,paddleWidth,paddleHeight)=>{

                ctx.fillStyle = "#CF4551";
                ctx.fillRect(0, y, paddleWidth, paddleHeight); 
            }

            const rightPaddle =(y,paddleWidth,paddleHeight)=>{
                ctx.fillStyle = "#1667E0";

                ctx.fillRect(canvas.width - paddleWidth, y, paddleWidth, paddleHeight);

            }
            const draw_game = (data)=>{
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                 
                    ctx.strokeStyle = '#FFEEBF'; 
                    ctx.lineWidth = 2;
                    ctx.setLineDash([15, 15]); 

                    ctx.beginPath();
                    ctx.moveTo(canvas.width / 2, 0);
                    ctx.lineTo(canvas.width / 2, canvas.height);
                    ctx.stroke();

                    ctx.setLineDash([]);

                    ball.draw(ctx,this.vec2(data.ballX,data.ballY),data.radius)
                    leftPaddle(data.paddle1Y,data.paddleWidth,data.paddleHeight)
                    rightPaddle(data.paddle2Y,data.paddleWidth,data.paddleHeight)
            }

            if (!socket || socket.readyState !== WebSocket.OPEN) {

                    socket = new WebSocket(
                        'ws://localhost:3000/ws/game/'
                    );

                    canvas = document.getElementById("tableGame");
                    ctx = canvas.getContext("2d");

                    ctx.strokeStyle = '#FFEEBF';
                    ctx.lineWidth = 2;

                    canvas.width="1350" 
                    canvas.height="650"
                    ctx.setLineDash([15, 15]);

                    ctx.beginPath();
                    ctx.moveTo(canvas.width / 2, 0);
                    ctx.lineTo(canvas.width / 2, canvas.height);
                    ctx.setLineDash([]);
                   
                    socket.onopen = function(e) {
                        console.log("WebSocket is open now.");
                    };
            
                    socket.onmessage = function(e) {
                        
                        const data = JSON.parse(e.data);

                        if(data.action && data.action == 'game_over')
                        {
                            // console.log("game oveeer",data)
                            // console.log(data)
                            if(player == data.Winner)
                                this.announce_winner('You Win!')
                            else
                                this.announce_winner('You Lose!')

                            socket.close()
                        }

                        if(data.action && data.action == 'opponent_disconnected')
                        {
                            showErrorNotification(data.message)
                            // console.log("ata",data,data.state)
                            this.announce_winner(data.state)
                            socket.close()
                            
                        }
                        if(data.action && data.action == "init_game")
                        {
                            ball =  this.Ball()
                            draw_game(data)
                            player = data.player
                            userId = data.userId   
                            this.updateState({player1Score:data.player1Score})
                            this.updateState({player2Score:data.player2Score})                         
                        }

                        // if(data.action && (data.action == "move_leftPaddle" || data.action == "move_rightPaddle"))
                        //     socket.send(JSON.stringify({ update: 'update_data', data: data}));


                        if(data.action && (data.action == "game_state"))
                        {
                            draw_game(data)
                            socket.send(JSON.stringify({ update: 'update_data', data: data}));
                        }

                        if(data.player1Score && data.player1Score != this.state.player1Score)
                            this.updateState({player1Score:data.player1Score})

                        if(data.player2Score && data.player2Score != this.state.player2Score)
                            this.updateState({player2Score:data.player2Score})                         
                    }.bind(this);
                

                    window.addEventListener('keydown', function(e) {
            
                        if(e.keyCode == KEY_UP || e.keyCode  == KEY_DOWN)    
                        {
                            e.preventDefault();
                            keyPressed[e.keyCode] = true;
                            if (keyPressed[KEY_UP]) {
                                socket.send(JSON.stringify({ move: 'up' ,player :player}));
                                keyPressed[e.keyCode] = true;
    
                            }
                            if (keyPressed[KEY_DOWN]) {
                                socket.send(JSON.stringify({ move: 'down',player: player}));
                            }
                        }                    
                    })
                    
                    window.addEventListener('keyup', function(e) {
                        if(e.keyCode == KEY_UP || e.keyCode  == KEY_DOWN)
                        {
                            e.preventDefault();
                            keyPressed[e.keyCode] = false; 

                        }
                    });
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
                            h('h4',{},[`${this.state.player1Score}`])
                           ])
                        ]),
                        h('img',{class:'vsPic',src:"./images/vs (2).png"}),

                        h('div',{class:'secondPlayer'},[
                            h('div',{class:'scoreCard'},[ h('h4',{},[`${this.state.player2Score}`])]),
                            h('div',{class:'info'},[
                                h('img',{src:'./images/niboukha.jpeg',class:'playerPicture'}),
                                h('h4',{class:'playerName'},['Niboukha']),
                            ]),
                         ])
                    ]),
                   
                    h('canvas',{id:'tableGame'},[
                    
                    ]),

                    h('div',{class:"winner-card" ,id:"winnerCard"},[
                        

                    ])

                ])

            ])
        }
    }
)