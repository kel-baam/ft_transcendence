import createElement from "../framework/createElement.js";
import { handleRouting } from "../framework/routing.js";


class PlayerVsPlayer {
    constructor(props) {
        this.props = props;
        this.render();
    }

    handleButtonClick = () => {
        const link = event.target.closest('a');
        
        if (link) {
            event.preventDefault();
            const path = link.getAttribute('href');
            handleRouting(path);
            window.history.pushState(null, '', path);
        }
    }
    
    render() {
        const virtualDom = createElement('div', { className: 'player-vs-player' },
            createElement('div', { className: 'player-vs-player' }),
            createElement('div', { className: 'player-vs-player' }, 
                createElement('h1', null, 'Lets Play'),
                createElement('div', { className: 'players' }, 
                    createElement('div', { className: 'play-girl' }, 
                        createElement('img', { src: './images/bnt-removebg-preview.png', className: 'girlplay' })
                    ),
                    createElement('div', { className: 'play-girl' }, 
                        createElement('img', { src: './images/vs (2).png', className: 'vs2' })
                    ),
                    createElement('div', { className: 'play-girl' }, 
                        createElement('img', { src: './images/playervs-removebg-preview.png', className: 'boy' })
                    )
                )
            ),
            createElement('a', { href: 'login' }, 
                createElement('button', { type: 'button', className: 'btn', onclick:this.handleButtonClick }, 'PLAY'))
        );

        return virtualDom;
    }
}

export default PlayerVsPlayer;
