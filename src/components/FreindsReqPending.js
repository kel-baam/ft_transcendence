import createDOMElement from "../framework/createDOMElement.js";
import render from "../framework/Renderer.js";
import VirtualDOM from "../framework/VirtualDOM.js";

class Friends extends HTMLElement
{
    constructor()
    {
        super()
        this.attachShadow({ mode: 'open' });
        this.items = [];
        this.root = document.getElementsByClassName('other-cards')[0]
        this.connectedCallBack()
    }

    connectedCallBack()
    {
        this.render()
        // const container = document.getElementsByClassName('other-cards')[0]
        // container.appendChild(this.root)
        // this.addEventListeners()
    }

    // createFriendItem(name, username, imageSrc) {
    //     return VirtualDOM.createElement('div', { className: 'friend-item' },
    //         VirtualDOM.createElement('div', { className: 'picture-item' },
    //             VirtualDOM.createElement('img', { 
    //                 src: imageSrc, 
    //                 alt: 'profile picture', 
    //                 className: 'picture-item' 
    //             })
    //         ),
    //         VirtualDOM.createElement('div', { className: 'data-user' },
    //             VirtualDOM.createElement('span', {}, name),
    //             VirtualDOM.createElement('span', { style: { color: '#A7A4A4' } }, username)
    //         ),
    //         VirtualDOM.createElement('div', { className: 'chat-icon' },
    //             VirtualDOM.createElement('a', { href: '#' },
    //                 VirtualDOM.createElement('img', { 
    //                     src: '../../assets/images/tabler_message (1).png', 
    //                     alt: 'chat icon' 
    //                 })
    //             )
    //         )
    //     );
    // }
    render()
    {
        render(  VirtualDOM.createElement('div', { className: 'friends-and-requetes-container' },
    VirtualDOM.createElement('div', { className: 'friends-and-req-buttons' },
        VirtualDOM.createElement('div',{},
            VirtualDOM.createElement('button', { className: 'friends-button', style: 'background-color:rgba(95, 114, 125, 0.08);' },
                VirtualDOM.createElement('h1', null, 'Friends')
            )
        ),
        VirtualDOM.createElement('div',{},
            VirtualDOM.createElement('button', { className: 'request-button' },
                VirtualDOM.createElement('h1', {}, 'Requests')
            )
        ),
        VirtualDOM.createElement('div',{},
            VirtualDOM.createElement('button', { className: 'pending-button' },
                VirtualDOM.createElement('h1', {}, 'Pending')
            )
        )
    ),
    VirtualDOM.createElement('div', { className: 'friends-scope-item' },
        VirtualDOM.createElement('div', { className: 'friend-item' },
            VirtualDOM.createElement('div', { className: 'picture-item' },
                VirtualDOM.createElement('img', { src: '../../assets/images/kel-baam.png', alt: 'profile picture', className: 'picture-item' })
            ),
            VirtualDOM.createElement('div', { className: 'data-user' },
                VirtualDOM.createElement('span', {}, 'kawtar el-baamrani'),
                VirtualDOM.createElement('span', { style: 'color: #A7A4A4;' }, '@kel-baam')
            ),
            VirtualDOM.createElement('div', { className: 'chat-icon' },
                VirtualDOM.createElement('a', { href: '#' },
                    VirtualDOM.createElement('img', { src: '../../assets/images/tabler_message (1).png', alt: '' })
                )
            )
        ),
        VirtualDOM.createElement('div', { className: 'friend-item' },
            VirtualDOM.createElement('div', { className: 'picture-item' },
                VirtualDOM.createElement('img', { src: '../../assets/images/niboukha.png', alt: 'profile picture', className: 'picture-item' })
            ),
            VirtualDOM.createElement('div', { className: 'data-user' },
                VirtualDOM.createElement('span', {}, 'Nisrin boukhari'),
                VirtualDOM.createElement('span', { style: 'color: #A7A4A4;' }, '@niboukha')
            ),
            VirtualDOM.createElement('div', { className: 'chat-icon' },
                VirtualDOM.createElement('a', { href: '#' },
                    VirtualDOM.createElement('img', { src: '../../assets/images/tabler_message (1).png', alt: '' })
                )
            )
        ),
        VirtualDOM.createElement('div', { className: 'friend-item' },
            VirtualDOM.createElement('div', { className: 'picture-item' },
                VirtualDOM.createElement('img', { src: '../../assets/images/kjarmoum.png', alt: 'profile picture', className: 'picture-item' })
            ),
            VirtualDOM.createElement('div', { className: 'data-user' },
                VirtualDOM.createElement('span', {}, 'karima jarmoum'),
                VirtualDOM.createElement('span', { style: 'color: #A7A4A4;' }, '@kjarmoum')
            ),
            VirtualDOM.createElement('div', { className: 'chat-icon' },
                VirtualDOM.createElement('a', { href: '#' },
                    VirtualDOM.createElement('img', { src: '../../assets/images/tabler_message (1).png', alt: '' })
                )
            )
        ),
        VirtualDOM.createElement('div', { className: 'friend-item' },
            VirtualDOM.createElement('div', { className: 'picture-item' },
                VirtualDOM.createElement('img', { src: '../../assets/images/kjarmoum.png', alt: 'profile picture', className: 'picture-item' })
            ),
            VirtualDOM.createElement('div', { className: 'data-user' },
                VirtualDOM.createElement('span', {}, 'karima jarmoum'),
                VirtualDOM.createElement('span', { style: 'color: #A7A4A4;' }, '@kjarmoum')
            ),
            VirtualDOM.createElement('div', { className: 'chat-icon' },
                VirtualDOM.createElement('a', { href: '#' },
                    VirtualDOM.createElement('img', { src: '../../assets/images/tabler_message (1).png', alt: '' })
                )
            )
        )
    )
    ,
    VirtualDOM.createElement('div', { className: 'view-all-link-fr' },
        VirtualDOM.createElement('a', { href: '#' }, 'View all')
    )
), this.root)

        // const  viewElement = createDOMElement(VirtualDOM.createElement('div', { className: 'view-all-link-fr' },
        //         VirtualDOM.createElement('a', { href: '#' }, 'View all')))
        // const cont = document.getElementsByClassName('friends-and-requetes-container')[0]
        // cont.appendChild(viewElement)

    }
    addEventListeners()
    {

    }
}
window.customElements.define('friends-element', Friends)
export default Friends