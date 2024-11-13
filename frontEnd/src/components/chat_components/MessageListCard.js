import createElement from "../../framework/createElement.js";
import MessageListHeaderCard from "../../components/chat_components/MessageListHeaderCard.js";

import Sender from "./Sender.js";
import Receiver from "./Receiver.js";
import TypingMsgCard from "./TypingMsgCard.js";


class MessageListCard
{
    constructor()
    {
        this.render();
    }

    render()
    {
        const msgList = 
            createElement('div', { className: 'message-list', style: 'border-radius : 56px 0px 0px 56px;'},
                createElement(MessageListHeaderCard, {}),
                createElement('div', { className: 'separator'}),
                createElement('div', { className: 'msg-list-content', },
                    createElement(Sender, {}),
                    createElement(Receiver, {})
                ),
                createElement(TypingMsgCard, {})
        );

        return (msgList);
    }
}

export default MessageListCard;