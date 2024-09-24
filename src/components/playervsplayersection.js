import createElement from "../framework/createElement.js";
import render from "../framework/render.js";

class PlayerVsPlayer {
    constructor(props) {
        this.props = props;
        this.render();
    }

    render() {
        // Create the virtual DOM structure
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
            createElement('a', { href: 'playerVSplayer' }, 
                createElement('button', { type: 'button', className: 'btn' }, 'PLAY'))
        );

        return virtualDom;
    }
}

export default PlayerVsPlayer;
