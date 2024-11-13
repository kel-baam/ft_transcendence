import createElement from "../framework/createElement.js";

class Friends 
{
    constructor(props)
    {
        this.props = props;
        this.render()
    }
    // createFriendItem(name, username, imageSrc) {
    //     return createElement('div', { className: 'friend-item' },
    //         createElement('div', { className: 'picture-item' },
    //             createElement('img', { 
    //                 src: imageSrc, 
    //                 alt: 'profile picture', 
    //                 className: 'picture-item' 
    //             })
    //         ),
    //         createElement('div', { className: 'data-user' },
    //             createElement('span', {}, name),
    //             createElement('span', { style: { color: '#A7A4A4' } }, username)
    //         ),
    //         createElement('div', { className: 'chat-icon' },
    //             createElement('a', { href: '#' },
    //                 createElement('img', { 
    //                     src: './images/tabler_message (1).png', 
    //                     alt: 'chat icon' 
    //                 })
    //             )
    //         )
    //     );
    // }
    render()
    {
        return( createElement('div', { className: 'friends-and-requetes-container' },
            createElement('div', { className: 'friends-and-req-buttons' },
            createElement('div',{},
                createElement('button', { className: 'friends-button', style: 'background-color:rgba(95, 114, 125, 0.08);' },
                    createElement('h1', null, 'Friends')
                )
            ),
            createElement('div',{},
                createElement('button', { className: 'request-button' },
                    createElement('h1', {}, 'Requests')
                )
            ),
            createElement('div',{},
                createElement('button', { className: 'pending-button' },
                    createElement('h1', {}, 'Pending')
                )
            )
        ),
        createElement('div', { className: 'friends-scope-item' },
            createElement('div', { className: 'friend-item' },
                createElement('div', { className: 'picture-item' },
                    createElement('img', { src: './images/kel-baam.png', alt: 'profile picture', className: 'picture-item' })
                ),
                createElement('div', { className: 'data-user' },
                    createElement('span', {}, 'kawtar el-baamrani'),
                    createElement('span', { style: 'color: #A7A4A4;' }, '@kel-baam')
                ),
                createElement('div', { className: 'chat-icon' },
                    createElement('a', { href: '#' },
                        createElement('img', { src: './images/tabler_message (1).png', alt: '' })
                    )
                )
            ),
            createElement('div', { className: 'friend-item' },
                createElement('div', { className: 'picture-item' },
                    createElement('img', { src: './images/niboukha.png', alt: 'profile picture', className: 'picture-item' })
                ),
                createElement('div', { className: 'data-user' },
                    createElement('span', {}, 'Nisrin boukhari'),
                    createElement('span', { style: 'color: #A7A4A4;' }, '@niboukha')
                ),
                createElement('div', { className: 'chat-icon' },
                    createElement('a', { href: '#' },
                        createElement('img', { src: './images/tabler_message (1).png', alt: '' })
                    )
                )
            ),
            createElement('div', { className: 'friend-item' },
                createElement('div', { className: 'picture-item' },
                    createElement('img', { src: './images/kjarmoum.png', alt: 'profile picture', className: 'picture-item' })
                ),
                createElement('div', { className: 'data-user' },
                    createElement('span', {}, 'karima jarmoum'),
                    createElement('span', { style: 'color: #A7A4A4;' }, '@kjarmoum')
                ),
                createElement('div', { className: 'chat-icon' },
                    createElement('a', { href: '#' },
                        createElement('img', { src: './images/tabler_message (1).png', alt: '' })
                    )
                )
            ),
            createElement('div', { className: 'friend-item' },
                createElement('div', { className: 'picture-item' },
                    createElement('img', { src: './images/kjarmoum.png', alt: 'profile picture', className: 'picture-item' })
                ),
                createElement('div', { className: 'data-user' },
                    createElement('span', {}, 'karima jarmoum'),
                    createElement('span', { style: 'color: #A7A4A4;' }, '@kjarmoum')
                ),
                createElement('div', { className: 'chat-icon' },
                    createElement('a', { href: '#' },
                        createElement('img', { src: './images/tabler_message (1).png', alt: '' })
                    )
                )
            )
        )
        ,
        createElement('div', { className: 'view-all-link-fr' },
            createElement('a', { href: '#' }, 'View all')
        )
        ))

    }
    addEventListeners()
    {

    }
}
export default Friends