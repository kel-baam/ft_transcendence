import createElement from "../../framework/createElement.js";
import render from "../../framework/render.js";

let a = 5;
class ChatListItems
{
    constructor()
    {
        this.render();
    }

    render()
    {
        const ChatListItems =
            createElement('div', { className: 'chat-list-items'},
                createElement( 'div', { className: 'chat-item'},
                    createElement('img', { className: 'contact-avatar', alt:'not Found', src:'../../images/kel-baam.png' }),
                    createElement('div', { className: 'contact-box'},
                        createElement('div', { className: 'contact-box-header'},
                            createElement('div', { className: 'contact-name'}, 'Kel-baam'),
                            createElement('div',{ className: 'time-last-message'}, `${a}`)
                        ),
                        createElement('div',{ className: 'last-message'},'You can Accept.')
                    ),
            ))

        return (ChatListItems);
    }
}

export default ChatListItems;
