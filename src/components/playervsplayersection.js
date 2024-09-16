import createElement from "../framework/createElement.js";
import render from "../framework/render.js";
import createDOMElement from "../framework/createDOMElement.js";

class playervsplayer extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({ mode: 'open'});
        this.connectedCallback();
    }

    connectedCallback()
    {
        this.render();
    }

    render()
    {
        render(createElement('div', { className: 'player-vs-player' },
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
                )),
            createElement('a', { href: 'playerVSplayer' }, 
                createElement('button', { type: 'button', className: 'btn' }, 'PLAY'))
        ), document.getElementsByClassName('home-down')[0]);
    }
}

window.customElements.define('playervsplayer-component', playervsplayer);

export default playervsplayer;
