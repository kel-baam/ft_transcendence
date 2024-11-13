// import createElement from "../../framework/createElement.js";
// import render from "../../framework/render.js";

// class AboutFriend
// {
//     constructor() {
//         this.render();
//         this.handleClick = this.handleClick.bind(this); 
//     }

//     handleClick()
//     {
//         var hidden = document.querySelector('.hidden');
//         hidden.style.display = "none";

//         var chatContent = document.querySelector('.chat-content');
//         chatContent.style.gap = '1em';
//         chatContent.style.gridTemplateColumns = '25% 74%';
        
//         var msg_list = chatContent.querySelector('.message-list');
//         msg_list.style.borderRadius = '56px'; 

//         var msg_list_header = msg_list.querySelector('.header');
//         msg_list_header.style.gap = '0em';

//         var icon = document.querySelector('.fa-ellipsis-vertical');
//         icon.classList.replace('fa-arrow-right', 'fa-ellipsis-vertical');   
//         icon.style.display = "initial";
        
//         var settings_friend = chatContent.querySelector('.about-friend');
//         settings_friend.style.display = "none";
//         settings_friend.style.borderRadius = '56px';

//         var typing_box = msg_list.querySelector('.typing');
//         typing_box.style.borderRadius = '0px 0px 56px 56px';

//         var msg_list_content = msg_list.querySelector('.msg-list-content');
//         var sender = msg_list_content.querySelector('.sender');

//         var i = 0;
//         if (sender[i])
//         {
//             while (sender[i])
//             {
//                 sender[i].style.gap = '0em';
//                 i++;
//             }
//         }
//         else 
//             sender.style.gap = '0em';
//     }

//     render()
//     {
//         const vdom = 
//             createElement( 'div', { className: 'about-friend'},
//                 createElement( 'div', { className: 'header'},
//                     createElement( 'div', { className: 'title'}, 'Informations'),
//                     createElement( 'i', { className: 'fa-solid fa-xmark', onclick: () => this.handleClick()})
//                 ),
//                 createElement( 'div', { className: 'separator'}, ),
//                 createElement( 'div', { className: 'about-friend-content'},
//                     createElement( 'div', { className: 'friend-info'},
//                         createElement( 'img', { className: 'avatar', src: '../../../images/kel-baam.png', alt: 'not-Found'}),
//                         createElement( 'div', { className: 'name'}, 'kel-baam')
//                     ),
//                     createElement( 'div', { className: 'level'}),
//                     createElement( 'div', { className: 'options'},
//                         createElement( 'i', { className: 'fa-sharp fa-regular fa-address-card icon'},
//                             createElement( 'div', { className: 'view-profile'}, 'view profile'),
//                         ),
//                         createElement( 'i', { className: 'fa-solid fa-user-lock icon'},
//                             createElement( 'div', { className: 'block-profile'}, 'Block'),
//                         ),
//                     ),
//                     createElement( 'div', { className: 'play'},
//                         createElement( 'button', { type: 'button'}, 'PLay')
//                     ),
//                 )
//             )
//         return (vdom);
//     }
// }

// export default AboutFriend;
import createElement from "../../framework/createElement.js";
import Chat from "../../pages/ChatPage.js";

class AboutFriendCard {

    constructor()
    {
        this.render();
    }

    handleClick=()=>
    {
        createElement(Chat, {});
        
    }

    render()
    {
        const vdom =
            createElement( 'div', { className: 'about-friend', style: 'border-radius: 0px 56px 56px 0px; display: grid;'},
                createElement( 'div', { className: 'header'},
                    createElement( 'div', { className: 'title'}, 'Informations'),
                    createElement( 'i', { className: 'fa-solid fa-xmark', onclick:  this.handleClick})
                ),
                createElement( 'div', { className: 'separator'}, ),
                createElement( 'div', { className: 'about-friend-content'},
                    createElement( 'div', { className: 'friend-info'},
                        createElement( 'img', { className: 'avatar', src: '../../../images/kel-baam.png', alt: 'not-Found'}),
                        createElement( 'div', { className: 'name'}, 'kel-baam')
                    ),
                    createElement( 'div', { className: 'level'}),
                    createElement( 'div', { className: 'options'},
                        createElement( 'i', { className: 'fa-sharp fa-regular fa-address-card icon'},
                            createElement( 'div', { className: 'view-profile'}, 'view profile'),
                        ),
                        createElement( 'i', { className: 'fa-solid fa-user-lock icon'},
                            createElement( 'div', { className: 'block-profile'}, 'Block'),
                        ),
                    ),
                    createElement( 'div', { className: 'play'},
                        createElement( 'button', { type: 'button'}, 'PLay')
                    ),
                )
            )
        return (vdom);
    }
}

export default AboutFriendCard;
