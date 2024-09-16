import createElement from "../framework/createElement.js";
import render from "../framework/render.js";

class homepage extends HTMLElement
{
    constructor()
    {  
        super();
        this.attachShadow({ mode: 'open' });
        this.connectedCallback();
    }
    
    connectedCallback()
    {
       this.render()
    }
    
    render()
    {
        // const virtualDom = 
    
        const container = document.getElementsByTagName('homepage')[0];
        render(virtualDom, container);
    }
}

window.customElements.define('homepage-component', homepage);

export default homepage;
