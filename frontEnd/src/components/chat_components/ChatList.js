import createElement from "../../framework/createElement.js";
import ChatListItems from "./ChatListItems.js";


class ChatList
{
    constructor()
    {
        this.render();
    }

    render()
    {
        const vdom =
            createElement('div', { className: 'chat-list-container'},  
                createElement('div', { className: 'chat-list-header'},
                    createElement('h1',{},'Chat'),
                    createElement('i', { className: 'fa-brands fa-rocketchat'})
                ),
                createElement('div',{ className: 'separator'}),
                createElement(ChatListItems,{}),
            );
        return (vdom);
    }
    
}

export default ChatList;