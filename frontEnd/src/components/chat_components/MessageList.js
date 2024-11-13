import createElement from "../../framework/createElement.js";
import render from "../../framework/render.js";

import MessageListHeader from "./MessageListHeader.js";
import Sender from "./Sender.js";
import Receiver from "./Receiver.js";
import TypingMsg from "./TypingMsg.js";


class MessageList
{
    constructor()
    {
        this.render();
    }

    render()
    {
        const msgList = 
            createElement('div', { className: 'message-list'},
                createElement(MessageListHeader,{}),
                createElement('div', { className: 'separator'}),
                createElement('div', { className: 'msg-list-content'},
                    createElement(Sender, {}),
                    createElement(Receiver, {})
                ),
                createElement(TypingMsg, {})
        ); 

        return (msgList);
    }
}

export default MessageList;