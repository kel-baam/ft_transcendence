import createDOMElement from "../framework/createDOMElement.js";
import render from "../framework/render.js";
import createElement from "../framework/createElement.js";

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
        return createElement('div', { className: 'badge-item' },
            createElement('img', { 
                src: '../../assets/images/lock.png', 
                alt: 'lock icon' 
            })
        );
    }
    
    render()
    {
        render(createElement('div', { className: 'achievements-container' },
            createElement('div', { className: 'achievements-title-elt' },
                createElement('h1', {}, 'Achievements')
            ),
            createElement('div', { className: 'badges-container' },
                this.createBadgeItem(),
                this.createBadgeItem()
            ),
            createElement('div', { className: 'badges-container' },
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