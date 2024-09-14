import createDOMElement from "../framework/createDOMElement.js";
import render from "../framework/Renderer.js";
import VirtualDOM from "../framework/VirtualDOM.js";

class Achievement extends HTMLElement
{
    constructor()
    {
        super()
        this.attachShadow({ mode: 'open' });
        this.items = [];
        this.root = document.getElementsByClassName('other-cards')[0]
        this.connectedCallBack()
    }

    connectedCallBack()
    {
        this.render()
        // const container = document.getElementsByClassName('other-cards')[0]
        // container.appendChild(this.root)
        // this.addEventListeners()
    }

    createBadgeItem() {
        return VirtualDOM.createElement('div', { className: 'badge-item' },
            VirtualDOM.createElement('img', { 
                src: '../../assets/images/lock.png', 
                alt: 'lock icon' 
            })
        );
    }
    
    render()
    {
        render(VirtualDOM.createElement('div', { className: 'achievements-container' },
            VirtualDOM.createElement('div', { className: 'achievements-title-elt' },
                VirtualDOM.createElement('h1', {}, 'Achievements')
            ),
            VirtualDOM.createElement('div', { className: 'badges-container' },
                this.createBadgeItem(),
                this.createBadgeItem()
            ),
            VirtualDOM.createElement('div', { className: 'badges-container' },
                this.createBadgeItem(),
                this.createBadgeItem()
            )
        ),this.root)
    }

    addEventListeners()
    {

    }
    
}
window.customElements.define('achievements-element', Achievement)
export default Achievement