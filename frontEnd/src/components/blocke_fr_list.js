import render from "../framework/render.js";
import createElement from "../framework/createElement.js";

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