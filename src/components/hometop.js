import createElement from "../framework/createElement.js";
import createDOMElement from "../framework/createDOMElement.js";
import "./leaderboard_profil.js";
import "./welcomingsection.js";

class hometop extends HTMLElement
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
        // console.log("hhomwtop");
        const virtualDom = createElement('div', { className: 'home-top' });

        const domElement = createDOMElement(virtualDom);
        
        document.getElementsByClassName('home-content')[0].appendChild(domElement);
        
        this.leaderBoardCreate();
        this.welcomingSectionCreate();
    }
    
    leaderBoardCreate()
    {
        const virtualDom = createElement('div', { className: 'leader-board' });
        const domElement = createDOMElement(virtualDom);
        
        document.getElementsByClassName('home-top')[0].appendChild(domElement);
        document.createElement('leaderboard-component');
    }
    
    welcomingSectionCreate()
    {
        const virtualDom = createElement('div', { className: 'welcoming-section' });
        const domElement = createDOMElement(virtualDom);
        
        document.getElementsByClassName('home-top')[0].appendChild(domElement);
        
        document.createElement('welcomingsection-component');
    }
}

window.customElements.define('hometop-component', hometop);

export default hometop;
