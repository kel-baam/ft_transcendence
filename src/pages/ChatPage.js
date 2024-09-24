import createElement from "../framework/createElement.js";
import render from "../framework/render.js";
import createDOMElement from "../framework/createDOMElement.js";
import { diff , patch} from "../framework/diff.js";

import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";

import ChatList from "../components/chat_components/ChatList.js"
import MessageList from "../components/chat_components/MessageList.js"
import AboutFriend from "../components/chat_components/AboutFriend.js"

class Chat {

    constructor(props)
    {
        this.props = props;
        this.render();
    }

    render()
    {
        const virtuelDOM =
            createElement('div', {id:'global'}, 
                createElement(Header, {}), 
                createElement('div', { className: 'content' },
                    createElement(Sidebar, {}), 
                        createElement('div', {className:'global-content'}, 
                            createElement('div', { className: 'chat-content' },
                                createElement(ChatList, {},),
                                createElement('div', { className: 'hidden' }), 
                                createElement(MessageList, {}),
                                createElement(AboutFriend, {}),
                            ))));

        const container = document.body;
        const patches = diff(container.__vdom, virtuelDOM , container);
        patch(document.body, patches);
        container.__vdom = virtuelDOM ;
    }
}

export default Chat;