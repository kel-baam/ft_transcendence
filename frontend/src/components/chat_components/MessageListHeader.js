import createElement from "../../framework/createElement.js";
import AboutFriend from "./AboutFriend.js";

class MessageListHeader
{
    constructor()
    {
        this.render();
    }

    handleClick=()=> {

        createElement(AboutFriend, {});
    }

    render()
    {
        const MessageListHeader =
            createElement('div', { className: 'header'},
                createElement('img', { className: 'contact-avatar', alt: 'not Found', src:'../../../images/niboukha-intra.png'}),
                createElement('div', { className: 'contact-name'}, 'Niboukha'),
                createElement('div', { className: 'play-button'},
                    createElement('a', { href: 'playerVSplayer'}),
                    createElement('button', { className: 'btn', type: 'button', id: 'hover-btn'}, 'play')
                ),
                createElement('div', { className: 'more-info'},
                    createElement('a', { className: 'fa-solid fa-ellipsis-vertical icon', onclick: this.handleClick})
                )
            )

        return (MessageListHeader);
    }
}

export default MessageListHeader;
