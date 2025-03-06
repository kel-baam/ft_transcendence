import{defineComponent, h} from '../package/index.js'
import { showErrorNotification } from '../package/utils.js';
import { NotFound } from '../components/errorPages/404.js';
import { Unauthorized } from '../components/errorPages/401.js';

let socket = null;
const KEY_UP = 87;
const KEY_DOWN = 83;
const KEY_UP2 = 38;
const KEY_DOWN2 = 40;
const confettiParticles = [];
let keyDownHandler;
let keyUpHandler;
// const keyPressed ={};
let canvas;
let ctx;


export const Game = defineComponent(
    {
        state()
        {
            return {
                player:{},
                player1Score: 0,
                player2Score:0,
                player1 : {},
                player2 : {},
                error: null
            }
        },

        onMounted() {

            this.initWebSocket();
            this.EventListener();
        },
        keyDownHandler(e)
        {
            let keyPressed;
                const { id, type } = this.appContext.router.query;
                const state = this.state;
                
                if (e.keyCode === KEY_UP || e.keyCode === KEY_DOWN || e.keyCode === KEY_UP2 || e.keyCode === KEY_DOWN2) {
                    e.preventDefault();
                    keyPressed = e.keyCode;
                    
                    if (keyPressed === KEY_UP) {
                        socket.send(JSON.stringify({ move: 'up', player: state.player }));
                    }
                    else if (keyPressed === KEY_DOWN) {
                        socket.send(JSON.stringify({ move: 'down', player: state.player }));
                    }
        
                    if (type === "local") {
                        if (keyPressed === KEY_UP2) {
                            socket.send(JSON.stringify({ move: 'up', player: 'player2' }));
                        }
                        else if (keyPressed === KEY_DOWN2) {
                            socket.send(JSON.stringify({ move: 'down', player: 'player2' }));
                        }
                    } 
                }
        },
        keyUpHandler(e)
        {
            let keyPressed;
                if (e.keyCode === KEY_UP || e.keyCode === KEY_DOWN || e.keyCode === KEY_UP2 || e.keyCode === KEY_DOWN2) {
                    e.preventDefault();
                    keyPressed = '';
                }
        },
        EventListener() {
            keyDownHandler = this.keyDownHandler.bind(this);
            keyUpHandler = this.keyUpHandler.bind(this) ;
         
            window.addEventListener('keydown',keyDownHandler);
            window.addEventListener('keyup', keyUpHandler);
        },
        
        onUnmounted() {
            window.removeEventListener('keydown', keyDownHandler);
            window.removeEventListener('keyup', keyUpHandler);
        
            if (socket) {
                console.log('=======> WebSocket connection closed');
                socket.close();
            }
        },
        Ball()
        {
            return {
               draw : function(context,pos,radius)
                {
                    context.fillStyle = "white";
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
            ctx.clearRect(0, 0, canvas.width, canvas.height);

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
            const {id, type} = this.appContext.router.query
            let ball;
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
                    leftPaddle(data.paddle1Y,data.paddleWidth,data.paddleHeight)
                    rightPaddle(data.paddle2Y,data.paddleWidth,data.paddleHeight)
                    ball.draw(ctx,this.vec2(data.ballX,data.ballY),data.radius)
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
                        if(data.player)
                            this.updateState({player:data.player,player1Score:data.player1Score,player2Score:data.player2Score, 
                            player1: data.player1, player2:data.player2})
                        else
                            this.updateState({player1Score:data.player1Score,player2Score:data.player2Score, 
                            player1: data.player1, player2:data.player2})
                        draw_game(data);
                    }

                    
                    if(data.action && (data.action == "game_state") )
                    {
                        this.updateState({player1Score:data.player1Score,player2Score:data.player2Score})
                        draw_game(data);

                        socket.send(JSON.stringify({ update: 'update_data', data: data}));
                    }
                    if(data.action && data.action == 'opponent_disconnected')
                    {
                        console.log(" opponent_disconnected In GAAAAMEEEE", data)

                        showErrorNotification(data.message)
                        this.announce_winner(data.state)

                        if (socket) {
                            socket.close();
                        }

                        setTimeout(() => {
                            this.appContext.router.navigateTo(data.redirect_to);
                        }, 3000);
                    }

                    if (data.action && data.action === 'game_over')
                    {
                        this.updateState({
                            player1Score: data.player1Score,
                            player2Score: data.player2Score
                        })
                        let message = "You Won!" 

                        if(type == "local")
                        {
                            const name1 =  (this.state.player1.nickname).substring(0, 10)
                            const name2 =  (this.state.player2.nickname).substring(0, 10)
                            if(data.Winner =="player1")
                                message = name1 + " Won!"
                            else
                                message = name2 +" Won!"

                        }
                        if (this.state.player === data.Winner || type == "local")
                            this.announce_winner(message);
                        else
                            this.announce_winner('You Lose!');

                        if (socket) {
                            socket.close();
                        }

                        setTimeout(() => {
                            this.appContext.router.navigateTo(data.redirect_to);
                        }, 3000);
                    }
                    if (data.action && data.action === 'local_finished')
                    {
                        showErrorNotification("local finished")

                        this.appContext.router.navigateTo('/pvp');

                        if (socket) {
                            socket.close();
                        }
                    }

                    if (data.action && data.action === 'tournament finished')
                    {
                        showErrorNotification(data.message)
                        if (socket) {
                            socket.close();
                        }
                        this.appContext.router.navigateTo(data.redirect_to);
                    }

                    if (data.action && data.action === 'match not found')
                    {
                        this.updateState({error:"match not found"})

                        // this.appContext.router.navigateTo(data.redirect_to);

                        if (socket) {
                            socket.close();
                        }
                    }

                    if (data.action && data.action === 'unauthorized')
                    {
                        this.updateState({error: "unauthorized"})

                        if (socket) {
                            socket.close();
                        }
                    }

                    if (data.action && data.action === "match_exited")
                    {
                        console.log("match_exited >> ", data.redirect_to)
                        this.updateState({player1Score:data.player1Score,player2Score:data.player2Score, 
                            player1: data.player1, player2:data.player2})
                        this.announce_winner('You Lose!');

                        if (socket) {
                            socket.close();
                        }

                        setTimeout(() => {
                            this.appContext.router.navigateTo(data.redirect_to);
                        }, 3000);

                        showErrorNotification(data.message)
                    }
                    
                    if (data.action && data.action === "quit_match")
                    {
                        console.log("quit_match >> ", data)
                        // if(data.winner == this.state.player)
                        //     this.announce_winner('You Won!');
                        // else
                        //     this.announce_winner('You Lose!');
        
                        let message = "You Won!" 

                        if(type == "local")
                        {
                            const name1 =  (this.state.player1.nickname).substring(0, 10)
                            const name2 =  (this.state.player2.nickname).substring(0, 10)
                            if(data.Winner =="player1")
                                message = name1 + " Won!"
                            else
                                message = name2 +" Won!"

                        }
                        
                        console.log("===========>winner=>",message,this.state.player , data.winner)
                        if (this.state.player === data.winner || type == "local")
                            this.announce_winner(message);
                        else
                            this.announce_winner('You Lose!');
                        setTimeout(() => {
                            this.appContext.router.navigateTo(data.redirect_to);
                        }, 3000);

                    }

                    if (data.action && data.action === "match_ends")
                    {
                        if (socket) {
                            socket.close();
                        }
                        this.appContext.router.navigateTo(data.redirect_to);
                        showErrorNotification(data.message)
                    }

                }.bind(this);

                socket.onclose = function(e) {
                    console.log("WebSocket is closed now in onclose.");
                    if (socket) {
                        socket.close();
                    }
                };

                socket.onerror = function(e) {
                    console.log("WebSocket error",e);
                };
            }
        },

        async exit_game() {
            socket.send(JSON.stringify({ action: 'exit_game' }));
            // if (socket) {
            //     socket.close();
            // }

        },

        render()
        {
            const { player1, player2, error} = this.state

            if (error && error === "match not found")
            {
                return h(NotFound, {}, ["404 game not found !!!"])
            }
            if (error && error === "unauthorized")
            {
                return h(Unauthorized, {}, ["404 game not found !!!"])
            }
            return h('div',{id:'game'},[
                h('nav',{id:'header'},[
                    h('a', {
                        // on :{ click:()=>{ this.appContext.router.navigateTo('/home')} }
                    }, [
                        h('img', { src: './images/logo.png', class: 'logo' })
                    ]),
                    h('div',{ id:'exitIcon' },
                    [
                        h('i',{
                            class:'fa-solid fa-arrow-right-from-bracket', 'aria-hidden': 'false',
                            on: { click:() => 
                                {
                                    this.exit_game()
                                }
                            }
                        })
                    ])
                ]),
                h('div',{class:'gameSpace'},[
                    h('div',{class:'playerInfo'},[
                        h('div',{class:'firstPlayer'},[
                           h('div',{class:'info'},[
                           
                            h('img', {
                                src: this.state.player1.picture
                                ? `https://${window.env.IP}:3000/media${this.state.player1.picture}`
                                : this.state.player1.avatar
                                ? `https://${window.env.IP}:3000/media${this.state.player1.avatar}`
                                : './images/playervs-removebg-preview.png',
                                class:'playerPicture', style : {
                                    'object-fit': 'cover'
                                }}),
                               h('h4',{class:'playerName'},  [this.state.player1.nickname
                                ? this.state.player1.nickname
                                : this.state.player1.username
                                ? this.state.player1.username
                                : 'Host']) ]),
                           h('div',{class:'scoreCard'},[
                            h('h4',{},[`${this.state.player1Score}`])
                           ])
                        ]),
                        h('img',{class:'vsPic',src:"./images/vs.png"}),

                        h('div',{class:'secondPlayer'},[
                            h('div',{class:'scoreCard'},[ h('h4',{},[`${this.state.player2Score}`])]),
                            h('div',{class:'info'},  [
                                h('img',{ src: this.state.player2.picture
                                    ? `https://${window.env.IP}:3000/media${this.state.player2.picture}`
                                    : this.state.player2.avatar
                                    ? `https://${window.env.IP}:3000/media${this.state.player2.avatar}`
                                    : './images/playervs-removebg-preview.png',
                                    class:'playerPicture', style : {
                                    'object-fit': 'cover'
                                }}),
                                h('h4',{class:'playerName'},
                                    [this.state.player2.nickname
                                        ? this.state.player2.nickname
                                        : this.state.player2.username
                                        ? this.state.player2.username
                                        : 'Guest']) 
                            ]),
                         ])
                    ]),
                   
                    h('canvas',{id:'tableGame'},[]),
                    h('div',{class:"winner-card" ,id:"winnerCard"},[])
                ])

            ])
        }
    }
)