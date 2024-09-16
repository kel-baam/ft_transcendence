import createElement from "../framework/createElement.js";
import render from "../framework/render.js";
import createDOMElement from "../framework/createDOMElement.js";
class trainingboot extends HTMLElement
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
        render(createElement('div', { className: 'training-boot' },
            createElement('h1', null, 'Training'),
            createElement('img', { src: './images/paddles-removebg-preview.png' }),
            createElement('a', { href: 'playerVSplayer' }, 
            createElement('button', { type: 'button', className: 'btn' }, 'PLAY'))
        ), document.getElementsByClassName('home-down')[0])
    }
}

window.customElements.define('trainingboot-component', trainingboot);

export default trainingboot;
