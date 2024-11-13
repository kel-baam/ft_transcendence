import createElement from "../framework/createElement.js";
import { diff , patch} from "../framework/diff.js";

import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";

import ChatList from "../components/chat_components/ChatList.js";
import MessageList from "../components/chat_components/MessageList.js";

class Chat {

    constructor()
    {
        this.test()
        this.render();
    }
    test()
    {
        // onmessagee and onerror and onclose are event handler
        const socket = new WebSocket(`wss://legendary-bassoon-jpvw6597q7jcq7rp-8000.app.github.dev/ws/some_path/`);
        
        socket.onopen = () => {
        console.log("WebSocket is connected. from the client and the handshare complete");
        socket.send(JSON.stringify({ message: "Hello WebSocket client!" }));
        };
        
        socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            console.log("on message client",data.error)
        // if(data.error == "token expired")
        // {
        //     const refreshAccessToken= await fetch('https://legendary-bassoon-jpvw6597q7jcq7rp-8000.app.github.dev/api/refresh/token/',{
        //         method:'GET',
        //         credentials: 'include',});
        //     console.log("thiiiiis the sulotion",refreshAccessToken)
        // }
        // else if (data.error)
        // {
        //     console.log("err client:", data.error);
        //     socket.onclose()
        // }
        };
        socket.onclose = (event) => {
            console.log("onclose client", event);
            console.log("dcode",event.code)
          };

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