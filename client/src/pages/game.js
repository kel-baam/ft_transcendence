import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../package/index.js'
import { showErrorNotification } from '../package/utils.js';


let socket = null;
const KEY_UP = 87;
const KEY_DOWN = 83;
const KEY_UP2 = 38;
const KEY_DOWN2 = 40;
const confettiParticles = []; 
const keyPressed ={};
let canvas;
let ctx;

let player='';
let ball;

export const Game = defineComponent(
    {
        state()
        {
            return {
                player1Score: 0,
                player2Score:0,
                player1 : {},
                player2 : {},
                error: null
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
                const size = Math.random() * 10 + 5;
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

            document.getElementById('tableGame').parentElement.appendChild(winMessageContainer);

            if(message == 'You Won!')
                this.createConfetti();
            else
                ctx.clearRect(0, 0, canvas.width, canvas.height);


            setTimeout(function () {
                winMessageContainer.style.transition = 'transform 2s ease, opacity 2s ease';
                winMessageContainer.style.transform = 'scale(0)';
                winMessageContainer.style.opacity = '0';

                setTimeout(function() {
                    winMessageContainer.style.display = 'none';
                }, 1000);
            }, 3000);
        },

        initWebSocket()
        {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>> this.appContext.router.query ", this.appContext.router.query)
            const {id, type} = this.appContext.router.query

            const leftPaddle = (y,paddleWidth,paddleHeight)=>{
                ctx.fillStyle = "#CF4551";
                ctx.fillRect(0, y, paddleWidth, paddleHeight); 
            }

            const rightPaddle =(y,paddleWidth,paddleHeight)=>{
                ctx.fillStyle = "#1667E0";
                ctx.fillRect(canvas.width - paddleWidth, y, paddleWidth, paddleHeight);
            }

            const draw_game = (data)=>{
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ball =  this.Ball()
                    ctx.strokeStyle = '#FFEEBF'; 
                    ctx.lineWidth = 2;
                    ctx.setLineDash([15, 15]); 

                    ctx.beginPath();
                    ctx.moveTo(canvas.width / 2, 0);
                    ctx.lineTo(canvas.width / 2, canvas.height);
                    ctx.stroke();

                    ctx.setLineDash([]);
                    // if(player == "palyer2")
                    ball.draw(ctx,this.vec2(data.ballX,data.ballY),data.radius)
                    leftPaddle(data.paddle1Y,data.paddleWidth,data.paddleHeight)
                    rightPaddle(data.paddle2Y,data.paddleWidth,data.paddleHeight)
            }

            if (!socket || socket.readyState !== WebSocket.OPEN) {

                    socket = new WebSocket(`wss://${window.env.IP}:3000/ws/game?id=${id}&type=${type}`);

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
                        console.log("WebSocket Game is open now.");
                    };

                    socket.onmessage = function(e) {
                        const data = JSON.parse(e.data);
                    
                        if(data.action && data.action == "init_game")
                        {
                            console.log("--->data", data)
                            draw_game(data)
                            if(data.player)
                                player = data.player
                            this.updateState({
                                player1Score: data.player1Score,
                                player2Score: data.player2Score,
                                player1     : data.player1,
                                player2     : data.player2
                            })
                        }
                                
                        if(data.action && (data.action == "game_state"))
                        {
                            this.updateState({player1Score:data.player1Score,player2Score:data.player2Score})
                            draw_game(data)
                            socket.send(JSON.stringify({
                                update: 'update_data',
                                data  : data
                            }));
                        }

                        if(data.action && data.action == 'opponent_disconnected')
                        {
                            console.log(" opponent_disconnected In GAAAAMEEEE")

                            showErrorNotification(data.message)
                            this.announce_winner(data.state)
                            socket.close();

                            setTimeout(() => {
                                this.appContext.router.navigateTo(data.redirect_to);
                            }, 7000);
                        }

                        if (data.action && data.action === 'match not found')
                        {
                            console.log(">>>>>>>>>>>>>>> here match not found in Game")

                            this.updateState({error:"match not found"})
                            socket.close()
                        }

                        if (data.action && data.action === 'unauthorized')
                        {
                            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>> here unauthorized in Game")

                            this.updateState({error: "unauthorized"})
                            socket.close()
                        }

                        if (data.action && data.action === 'game_over')
                        {
                            console.log("kher")
                            if (player === data.Winner)
                                { this.announce_winner('You Won!'); }
                            else
                                { this.announce_winner('You Lose!');  }

                            console.log("redirect to --> ", data.redirect_to);

                            socket.close();
                            setTimeout(() => {
                                this.appContext.router.navigateTo(data.redirect_to);
                            }, 7000);
                        }

                        if (data.action && data.action === "match_exited")
                        {
                            this.appContext.router.navigateTo(data.redirect_to);
                            showErrorNotification(data.message)
                            socket.close()
                        }
                        draw_game(data)
                            
                    }.bind(this);

                    window.addEventListener('keydown', function(e) {  
                        if(e.keyCode == KEY_UP || e.keyCode  == KEY_DOWN || e.keyCode == KEY_UP2 || e.keyCode  == KEY_DOWN2)
                        {
                            e.preventDefault();
                            keyPressed[e.keyCode] = true;

                            if (keyPressed[KEY_UP]) {
                                socket.send(JSON.stringify({ move: 'up' ,player :player}));
                            }

                            if (keyPressed[KEY_DOWN]) {
                                socket.send(JSON.stringify({ move: 'down',player: player}));
                            }

                            if(type == "local")
                            {
                                if (keyPressed[KEY_UP2]) {
                                    socket.send(JSON.stringify({ move: 'up' ,player :'player2'}));
                                }
                                if (keyPressed[KEY_DOWN2]) {
                                    socket.send(JSON.stringify({ move: 'down',player: 'player2'}));
                                }
                            } 
                        }                   
                    })
                    
                    window.addEventListener('keyup', function(e) {
                        if(e.keyCode == KEY_UP || e.keyCode  == KEY_DOWN || e.keyCode == KEY_UP2 || e.keyCode  == KEY_DOWN2)
                        {
                            e.preventDefault();
                            keyPressed[e.keyCode] = false; 

                        }
                    });

                    socket.onclose = (event) => {
                        console.log('WebSocket connection closed:', event);
                    }

                    socket.onerror = (event) => {
                        console.log('WebSocket error:', event);
                    };

            }
        },

        render()
        {
            const { player1, player2, error} = this.state

            if (error && error === "match not found")
            {
                return h('h1', {}, ["404 game not found !!!"])
            }
            if (error && error === "unauthorized")
            {
                return h('h1', {}, ["401 unauthorized !!!"])
            }
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
                           
                            JSON.stringify(player1) !== "{}" ? h('img',{src:`https://${window.env.IP}:3000/media${player1.picture}`,class:'playerPicture', style : {
                                    'object-fit': 'cover'
                                }}) : null,
                               h('h4',{class:'playerName'},[player1.username]) ]),
                           h('div',{class:'scoreCard'},[
                            h('h4',{},[`${this.state.player1Score}`])
                           ])
                        ]),
                        h('img',{class:'vsPic',src:"./images/vs.png"}),

                        h('div',{class:'secondPlayer'},[
                            h('div',{class:'scoreCard'},[ h('h4',{},[`${this.state.player2Score}`])]),
                            h('div',{class:'info'},  [
                               
                                JSON.stringify(player2) !== "{}"? h('img',{src:`https://${window.env.IP}:3000/media${player2.picture}`,class:'playerPicture', style : {
                                    'object-fit': 'cover'
                                }}) : null,
                               h('h4',{class:'playerName'},[player2.username]) ]),
                         ])
                    ]),
                   
                    h('canvas',{id:'tableGame'},[]),
                    h('div',{class:"winner-card" ,id:"winnerCard"},[])
                ])

            ])
        }
    }
)