import render from "../framework/Renderer.js";
import VirtualDOM from "../framework/VirtualDOM.js";

class BlockedFriendsList extends HTMLElement
{
    constructor()
    {
        super()
        this.attachShadow({ mode: 'open' });
        this.items = [];
        this.root = document.getElementById('content-id')
        this.connectedCallBack()
    }

    connectedCallBack()
    {
        this.render()
    }

    render()
    {
        // render(, this.root)
    }
    addEventListeners()
    {

    }
}
customElements.define('blocked-friends-list', BlockedFriendsList)
export default BlockedFriendsList