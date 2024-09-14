import createDOMElement from "../framework/createDOMElement.js";
import VirtualDOM from "../framework/VirtualDOM.js";

class SideBar extends HTMLElement
{
    constructor()
    {
        super();
        // root = createDOMElement(VirtualDOM.createElement('div', {className:'container'}))
        this.attachShadow({ mode: 'open' });
        this.connectedCallback()
    }

    connectedCallback() {
        console.log("----> here connectedCallBack sideBar")
        this.shadowRoot.innerHTML = `<div class="container">
        <div class="side-bar">
            <a href="#/profile"><i class="fa-regular fa-circle-user icon" ></i></a>
            <a href="#"><i class="fa-regular fa-message icon"></i></a>
            <a href="#"><i class="fa-sharp fa-solid fa-house-chimney icon"></i></a>
            <a href="#"><i class="fa-solid fa-ranking-star icon"></i></a>
            <a href="#"><i class="fa-solid fa-network-wired fa-rotate-90 icon"></i></a>
            <a href=""><i class="fa-solid fa-trophy icon"></i></a>
        </div>
        <div id="content-id">
            
        </div>
        <div class="friends">
            <i class="fa-duotone fa-solid fa-spinner icon"></i>
        </div>
    </div> `;
        document.body.appendChild(this.shadowRoot)
        }
}
customElements.define('side-bar', SideBar);
export default SideBar;
