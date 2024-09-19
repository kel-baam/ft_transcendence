import createElement from "../framework/createElement.js";
import createDOMElement from "../framework/createDOMElement.js";
import  "../components/header.js";
import "../components/sidebar.js"
import "../components/homedown.js"
import "../components/hometop.js"
import render from "../framework/render.js";
import sidebar from "../components/sidebar.js";
 
class HomePage extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({mode: 'open'});
        this.connectedCallback();
    }

    connectedCallback()
    {
        this.render();
    }

    render()
    {
        this.createHeaderTag();
        this.createContentTag();
    }
    
    createHeaderTag()
    {
        document.createElement('header-component');
    }

    createContentTag()
    {
        const virtualDom = createElement('div', { className: 'content' });
        const domElement = createDOMElement(virtualDom);
        
        document.getElementById('global').appendChild(domElement);
        document.createElement('sidebar-component');

        this.createGlobalContent();
        this.createFriendContent();
    }
    
    createGlobalContent()
    {
        const virtualDom = createElement('div', { className: 'global-content' });
        const domElement = createDOMElement(virtualDom);
        document.getElementsByClassName('content')[0].appendChild(domElement);
        this.createHomeContent();
    }                        

    createHomeContent()
    {
        const virtualDom = createElement('div', { className: 'home-content' });
        const domElement = createDOMElement(virtualDom);
        document.getElementsByClassName('global-content')[0].appendChild(domElement);
        
        document.createElement('hometop-component');
        document.createElement('homedown-component');
    }
    
    createFriendContent()
    {
        const virtualDom = createElement('div', { className: 'friends-bar' });
        const domElement = createDOMElement(virtualDom);
        document.getElementsByClassName('content')[0].appendChild(domElement);
    }

}

window.customElements.define('homepage-component', HomePage);

export default HomePage
