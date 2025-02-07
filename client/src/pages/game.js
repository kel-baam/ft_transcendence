import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../package/index.js'
// import { Match } from './match.js'
// import { header } from '../../../components/header.js'
// import { sidebarLeft } from '../../../components/sidebar-left.js'
// import { NotFound } from './404.js'
import { header } from '../components/header.js'
import { sidebarLeft } from '../components/sidebar-left.js'
export const Game = defineComponent(
    {
        state()
        {

        },
        gameUpdate()
        {

        },
        gameDraw()
        {

        },
        gameLoop()
        {
            const canvas = document.getElementById('tableGame');
            const ctx = canvas.getContext('2d');
            let ballX = 200;
            let ballY = 200;
            let ballSpeedX = 5;
            let ballSpeedY = 5;
            let ballRadius = 18;
            let paddleWidth = 15;
            let paddleHeight = 125;
            canvas.width="1350" 
            canvas.height="650"
            console.log("canvas height",canvas.height);
            console.log("canvas height",canvas.width);

            let paddle1Y = canvas.height / 2 - paddleHeight / 2;
            let paddle2Y = canvas.height / 2 - paddleHeight / 2;
            let paddle1Speed = 13;
            let paddle2Speed = 0;

            const KEY_UP = 119;
            const KEY_DOWN = 115;
            const keyPressed ={};

            window.addEventListener('keypress',function (e){

                e.preventDefault();
                keyPressed[e.keyCode] = true;
                console.log("Key clicked:", e.keyCode);
                
                // console.log(e.keyCode,keyPressed[e.keyCode]);
            })

         
            
            window.addEventListener('keyup',function(e){

                console.log("keeeey up",e.keyCode)
                if(e.keyCode == 87)
                    keyPressed[KEY_UP] =false
                if(e.keyCode == 83)
                    keyPressed[KEY_DOWN] =false

                // keyPressed[e.keyCode] = false;
            })


            const leftPaddle =()=>{

                ctx.fillStyle = "#CF4551";
                ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight); // Left paddle
            }

            const rightPaddle =()=>{

                ctx.fillStyle = "#1667E0";

                ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight); // Right paddle

            }
            const paddleUpdate=()=>
            {

                if(keyPressed[KEY_UP])
                {
                    paddle1Y -= paddle1Speed;
                }
                if(keyPressed[KEY_DOWN])
                {
                    paddle1Y +=paddle1Speed;

                }
            };
            
            const paddleCollison = ()=>
            {
                if(paddle1Y <= 0)
                    paddle1Y = 0;
                if(paddle1Y + paddleHeight>= canvas.height)
                    paddle1Y = canvas.height - paddleHeight;
                    
            };
            const ballCollision= (ball)=>
            {
                if(ball.pos.y + ball.raduis >= canvas.height || ball.pos.y - ball.raduis <= 0)
                {
                    ball.speed.y *=-1;
                }

                if(ball.pos.x + ball.raduis >= canvas.width || ball.pos.x - ball.raduis <= 0)
                {
                    ball.speed.x *=-1;
                }

            };
            const vec2 = (x,y)=>
            {
                return {x: x , y: y};
            };

            class ball{
                constructor(pos,speed,raduis)
                {
                    this.pos = pos;
                    this.speed = speed;
                    this.raduis = raduis;
                };

                update=() =>{
                    this.pos.x +=this.speed.x;
                    this.pos.y += this.speed.y;  
                };
                drawBall = () =>{
                    ctx.fillStyle = "white";
                    ctx.beginPath();
                    // ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
                    ctx.arc(this.pos.x, this.pos.y, this.raduis, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.closePath();
                };


            }

            const BALL = new ball(vec2(ballX,ballY),vec2(ballSpeedX,ballSpeedY),ballRadius)
            const gameDraw = () => {

                leftPaddle();
                rightPaddle();
                BALL.drawBall();
            };

            
            const gameUpdate = () =>
            {
                BALL.update();
                ballCollision(BALL);

                paddleUpdate();
                paddleCollison();
            };

            const loop = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
            
                gameDraw();
                gameUpdate();
                requestAnimationFrame(loop); // Keep calling game loop
            };
    
            loop();

        },
        onMounted()
        {
            this.gameLoop()

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
                            h('div',{class:'scoreCard'},[ h('h4',{},['10'])]),
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