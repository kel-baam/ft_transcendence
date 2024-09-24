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
        var hidden = document.querySelector('.hidden');
        var chatContent = document.querySelector('.chat-content');
        var msg_list = chatContent.querySelector('.message-list');
        var msg_list_content = msg_list.querySelector('.content-msg-list');
        var msg_list_header = msg_list.querySelector('.header');
        // var sender = msg_list_content.querySelector('.sender');
        var typing_box = msg_list.querySelector('.typing'); 
        var settings_friend = chatContent.querySelector('.about-friend');

        icon.style.display = "none";
        hidden.style.display = "initial";
        msg_list.style.borderRadius = '56px 0px 0px 56px'; 
        msg_list_header.style.gap = '1em';
        
        settings_friend.style.borderRadius = '0px 56px 56px 0px'; 
        chatContent.style.gap = '0em';
        chatContent.style.gridTemplateColumns = '25% 1% 53% 21%';
        settings_friend.style.display = "grid";

        typing_box.style.borderRadius = '0px 0px 0px 56px';

        // var i = 0;
        // while (sender[i])
        // {
        //     sender[i].style.gap = '1em';
        //     i++;
        // }  

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
                    createElement('a', { className: 'fa-solid fa-ellipsis-vertical icon', onClick: this.handleClick.bind(this)})
                )
            )
        return (MessageListHeader);
    }
}

export default MessageListHeader;



// function toggleChatSettings(){        
//     var icon = document.querySelector('.fa-ellipsis-vertical');
//     if (icon)
//     {
//         var hidden = document.querySelector('.hidden');
//         var chatContent = document.querySelector('.chat-content');
//         var msg_list = chatContent.querySelector('.message-list');
//         var msg_list_content = msg_list.querySelector('.content-msg-list');
//         var msg_list_header = msg_list.querySelector('.header');
//         var sender = msg_list_content.querySelector('.sender');
//         var typing_box = msg_list.querySelector('.typing'); 
//         var settings_friend = chatContent.querySelector('.about-friend');
        
//         var toggleChatSettingsOn = function(){
            
//             icon.style.display = "none";
//             hidden.style.display = "initial";
//             msg_list.style.borderRadius = '56px 0px 0px 56px'; 
//             msg_list_header.style.gap = '1em';
            
//             settings_friend.style.borderRadius = '0px 56px 56px 0px'; 
//             chatContent.style.gap = '0em';
//             chatContent.style.gridTemplateColumns = '25% 1% 53% 21%';
//             settings_friend.style.display = "grid";
    
//             typing_box.style.borderRadius = '0px 0px 0px 56px';
    
//             var i = 0;
//             while (sender[i])
//             {
//                 sender[i].style.gap = '1em';
//                 i++;
//             }   
//         };
    
//         var cancel_icon = document.querySelector('.fa-xmark');
        
//         if (cancel_icon) 
//         {
//             var toggleChatSettingsOff = function(){
//                 hidden.style.display = "none";
//                 chatContent.style.gap = '1em';
//                 chatContent.style.gridTemplateColumns = '25% 74%';
                
//                 msg_list.style.borderRadius = ''; 
//                 msg_list_header.style.gap = '';

//                 icon.classList.replace('fa-arrow-right', 'fa-ellipsis-vertical');   
//                 icon.style.display = "initial";
                
//                 settings_friend.style.display = "none";
//                 settings_friend.style.borderRadius = '';
//                 typing_box.style.borderRadius = '';
        
//                 var i = 0;
//                 while (sender[i])
//                 {
//                     sender[i].style.gap = '';
//                     i++;
//                 } 
//             };
//             cancel_icon.addEventListener('click', toggleChatSettingsOff);
//         }
//         icon.addEventListener('click', toggleChatSettingsOn);
//     }
// }