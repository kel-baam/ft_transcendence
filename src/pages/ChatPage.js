import createElement from "../framework/createElement.js";
import { diff , patch} from "../framework/diff.js";

import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";

import ChatList from "../components/chat_components/ChatList.js";
import MessageList from "../components/chat_components/MessageList.js";

class Chat {

    constructor()
    {
        this.render();
    }

    render()
    {
        const virtuelDOM =
            createElement('div', {id:'global'}, 
                createElement(Header, {}), 
                createElement('div', { className: 'content' },
                    createElement(Sidebar, {}), 
                        createElement('div', { className:'global-content'}, 
                            createElement('div', { className: 'chat-content' , style: 'grid-template-columns:25% 74%;'},
                                createElement(ChatList, {}),
                                createElement(MessageList, {})
                            ))));

        const container = document.body;
        const patches = diff(container.__vdom, virtuelDOM , container);
        patch(document.body, patches);
        container.__vdom = virtuelDOM ;
    }
}

export default Chat; 