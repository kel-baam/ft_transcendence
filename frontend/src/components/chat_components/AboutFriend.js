import createElement from "../../framework/createElement.js";
import { diff , patch} from "../../framework/diff.js";

import Header from "../../components/header.js";
import Sidebar from "../../components/sidebar.js";

import ChatList from "../../components/chat_components/ChatList.js";
import MessageListCard from "../../components/chat_components/MessageListCard.js";
import AboutFriendCard from "../../components/chat_components/AboutFriendCard.js";

class AboutFriend {

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
                        createElement('div', {className:'global-content'}, 
                            createElement('div', { className: 'chat-content',
                                                    style : 'grid-template-columns: 25% 1% 53% 21%; gap: 0em; display:grid;'
                                                },
                                createElement(ChatList, {}),
                                createElement('div', { className: 'hidden'}),
                                createElement(MessageListCard, {}),
                                createElement(AboutFriendCard, {})
                            ))));
                            
                            
        const container = document.body;
        const patches = diff(container.__vdom, virtuelDOM , container);
        patch(document.body, patches);
        container.__vdom = virtuelDOM ;
    }
}

export default AboutFriend;
