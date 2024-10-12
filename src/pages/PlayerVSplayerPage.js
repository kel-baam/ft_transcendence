import createElement from "../framework/createElement.js";
import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";
import { diff , patch} from "../framework/diff.js";
import { handleRouting } from "../framework/routing.js";


class PlayerVSplayerPage
{
    constructor(props) {
        this.props = props;
        this.render();
    }
    
    handleButtonClick = (event) => {
        const link = event.target.closest('a');
        
        if (link) {
            event.preventDefault();
            const path = link.getAttribute('href');
            
            const randomId = Math.floor(Math.random() * (24 - 21 + 1)) + 21;
            console.log("Generated Random ID: ", randomId);
    
            const socket = new WebSocket('ws://localhost:8000/ws/matchmaking/');
            
            socket.onopen = () => {
                console.log('WebSocket connection established on button click');
            
                socket.send(JSON.stringify({
                    action: 'join_queue',
                    player_id: randomId
                }));
            };
            
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
            
                if (data.action === 'join-game') {
                    const path = data.url;
                    handleRouting(path);
                }
                console.log('Message from server:', data.message);
            };
        
            handleRouting(path);
            window.history.pushState(null, '', path);
        }
    };
    
    render()
    {
        const newVdom = createElement('div', {id: 'global'}, createElement(Header, {}), 
                createElement('div', {className: 'content'}, 
                    createElement(Sidebar, {}), createElement('div', { className: 'game-content' },
                        createElement('div', { className: 'game-title' },
                            createElement('h1', {}, "Who's Your Opponent?")
                        ),
                        createElement('div', { className: 'content-body' },
                            createElement('div', { className: 'user-profile' },
                                createElement('img', { src: './images/niboukha 1 (1).png' }),
                                createElement('h3', {}, "niboukha")
                            ),
                            createElement('div', { className: 'vs' },
                                createElement('img', { src: './images/vs (2).png' })
                            ),
                            createElement('div', { className: 'choice' },
                                createElement('div', { className: 'surprise-countder' },
                                    createElement('a', { href: '/waitPlayerJoin' },
                                        createElement('button', { type: 'button', className: 'btn', onclick:this.handleButtonClick }, 'Surprise Contender')
                                    )
                                ),
                                createElement('div', { className: 'select-friend' },
                                    createElement('a', { href: '/waitPlayerJoin' },
                                        createElement('button', { type: 'button', className: 'btn' }, 'Select a Friend')
                                    )
                                )
                            )
                        )
                    ), createElement('div', {className: 'friends'})
                ));

        const container = document.body;

        const patches = diff(container.__vdom, newVdom, container);
        patch(document.body, patches);
        container.__vdom = newVdom;
    }                    
}

export default PlayerVSplayerPage;