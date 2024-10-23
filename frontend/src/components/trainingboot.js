import createElement from "../framework/createElement.js";
import { handleRouting } from "../framework/routing.js";

class TrainingBoot {
    constructor(props) {
        this.props = props;
        this.clickCounter = 0;
        this.render();
    }
    

    handleButtonClick = (event) =>
    {
        // let clickCounter = 0; 
        const link = event.target.closest('a');
        
        if (link)
        {
            event.preventDefault();
            const path = link.getAttribute('href');
            console.log(path);
            
            // Open WebSocket connection on button click
            const socket = new WebSocket('ws://localhost:8000/ws/matchmaking/');
            
            socket.onopen = () => {
                console.log('WebSocket connection established on button click');
                
                // Send a message to join the matchmaking queue
                socket.send(JSON.stringify({ action: 'join_queue' }));
            };
            
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
            
                if (data.action === 'show_chat') {
                    // Here you can render your chat component
                    const path = data.url;
                    console.log("----------->?", path);
                    handleRouting(path); // Call a function to render the chat component
                }
                console.log('Message from server:', data.message);
                // You can handle the match start message here, like redirecting to the match room
            };

            handleRouting(path);
            window.history.pushState(null, '', path);
        }
    };
    
    
    render() {
        const virtualDom = createElement('div', { className: 'training-boot' },
            createElement('h1', null, 'Training'),
            createElement('img', { src: './images/paddles-removebg-preview.png' }),
            createElement('a', { href: '/waitPlayerJoin' }, 
                createElement('button', { type: 'button', className: 'btn', onclick:this.handleButtonClick }, 'PLAY')
            )
        );
        return virtualDom;
    }
}

export default TrainingBoot;
