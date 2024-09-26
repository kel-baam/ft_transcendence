import createElement from "../../framework/createElement.js";
import render from "../../framework/render.js";

import sender from "./Sender.js";

class MessageListHeader
{
    constructor()
    {
        this.render();
    }

    handleClick() {
        var icon = document.querySelector('.fa-ellipsis-vertical');
        icon.style.display = "none";

        var chatContent = document.querySelector('.chat-content');
        chatContent.style.gridTemplateColumns = '25% 1% 53% 21%';
        chatContent.style.gap = '0em';

        var hidden = document.querySelector('.hidden');
        hidden.style.display = "initial";

        var msg_list = chatContent.querySelector('.message-list');
        msg_list.style.borderRadius = '56px 0px 0px 56px';
        
        var msg_list_header = msg_list.querySelector('.header');
        msg_list_header.style.gap = '15px';
        msg_list_header.style.grid = "grid";

        var msg_list_content = msg_list.querySelector('.msg-list-content');
        var sender = msg_list_content.querySelector('.sender');
        var typing_box = msg_list.querySelector('.typing');

        var settings_friend = chatContent.querySelector('.about-friend');

        settings_friend.style.borderRadius = '0px 56px 56px 0px'; 
        settings_friend.style.display = "grid";

        typing_box.style.borderRadius = '0px 0px 0px 56px';

        var i = 0;
        if (sender[i])
        {
            while (sender[i])
            {
                sender[i].style.gap = '1em';
                i++;
            }
        }
        else 
            sender.style.gap = '1em';
    }

    render()
    {
        const MessageListHeader =
            createElement('div', { className: 'header'},
                createElement('img', { className: 'contact-avatar', alt: 'not Found', src:'../../../assets/images/niboukha-intra.png'}),
                createElement('div', { className: 'contact-name'}, 'Niboukha'),
                createElement('div', { className: 'play-button'},
                    createElement('a', { href: 'playerVSplayer'}),
                    createElement('button', { className: 'btn', type: 'button', id: 'hover-btn'}, 'play')
                ),
                createElement('div', { className: 'more-info'},
                    createElement('a', { className: 'fa-solid fa-ellipsis-vertical icon', onclick: this.handleClick.bind(this)})
                )
            )

        return (MessageListHeader);
    }
}

export default MessageListHeader;
