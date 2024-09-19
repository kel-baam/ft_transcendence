import createElement from "../framework/createElement.js";
import createDOMElement from "../framework/createDOMElement.js";

import render from "../framework/render.js";

import "./trainingboot.js"
import "./tournamentsection.js"
import "./playervsplayersection.js"

class homedown extends HTMLElement
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
        const virtualDom = createElement('div', { className: 'home-down' });

        const domElement = createDOMElement(virtualDom);

        document.getElementsByClassName('home-content')[0].appendChild(domElement);
        
        document.createElement('trainingboot-component');
        document.createElement('tournamentsection-component');
        document.createElement('playervsplayer-component');
    }
}

window.customElements.define('homedown-component', homedown);

export default homedown;
