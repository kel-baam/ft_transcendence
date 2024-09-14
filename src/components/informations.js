// import createDOMElement from "../framework/createDOMElement.js";
import render from "../framework/Renderer.js";
import VirtualDOM from "../framework/VirtualDOM.js";

class Informations extends HTMLElement
{
    constructor()
    {
        super()
        this.attachShadow({ mode: 'open' });
        this.items = [];
        this.root = document.getElementById('content-id')
        this.connectedCallBack()
    }

    connectedCallBack()
    {
        this.render()
    }

    render()
    {
        render(VirtualDOM.createElement(
            'div',
            { className: 'settings-content' },
            VirtualDOM.createElement(
                'div',
                { className: 'settings-container' },
                VirtualDOM.createElement(
                    'div',
                    { className: 'section-headings' },
                    VirtualDOM.createElement(
                        'button',
                        {},
                        VirtualDOM.createElement(
                            'img',
                            { src: '../../assets/images/informations_icon.png', alt:'informations icon'}
                        ),
                        VirtualDOM.createElement('h1', {}, 'Informations')
                    ),
                    VirtualDOM.createElement(
                        'button',
                        {},
                        VirtualDOM.createElement(
                            'img',
                            { src: '../../assets/images/blocked_fr_icon.png', alt: 'blocked friends icon' }
                        ),
                        VirtualDOM.createElement('h2', {}, 'Blocked friends')
                    )
                ),
                VirtualDOM.createElement(
                    'div',
                    {},
                    VirtualDOM.createElement(
                        'form',
                        { action: '#' },
                        VirtualDOM.createElement(
                            'div',
                            {},
                            VirtualDOM.createElement('img', { src: '../../assets/images/kel-baam.png', alt: 'profile picture', className: 'profile-pic' })
                        ),
                        VirtualDOM.createElement(
                            'div',
                            {},
                            VirtualDOM.createElement(
                                'div',
                                {},
                                VirtualDOM.createElement('label', { for: 'fname' }, 'First name:'),
                                VirtualDOM.createElement('input', { type: 'text', id: 'fname', name: 'fname', value: 'souad' }),
                                VirtualDOM.createElement('br'),
                                VirtualDOM.createElement('label', { for: 'Username' }, 'Username:'),
                                VirtualDOM.createElement('input', { type: 'text', id: 'user-name', name: 'user-name', value: 'shicham' }),
                                VirtualDOM.createElement('br'),
                                VirtualDOM.createElement('label', { for: 'pnumber' }, 'Phone number:'),
                                VirtualDOM.createElement('input', { type: 'text', id: 'pnumber', name: 'pnumber', value: '0614578894489' }),
                                VirtualDOM.createElement('br'),
                                VirtualDOM.createElement('label', { for: 'gender' }, 'Gender:'),
                                VirtualDOM.createElement('input', { type: 'text', id: 'gender', name: 'gender', value: 'Female' }),
                                VirtualDOM.createElement('br')
                            ),
                            VirtualDOM.createElement(
                                'div',
                                {},
                                VirtualDOM.createElement('label', { for: 'lname' }, 'Last name:'),
                                VirtualDOM.createElement('input', { type: 'text', id: 'lname', name: 'lname', value: 'hicham' }),
                                VirtualDOM.createElement('br'),
                                VirtualDOM.createElement('label', { for: 'age' }, 'Age:'),
                                VirtualDOM.createElement('input', { type: 'text', id: 'age', name: 'age', value: '36' }),
                                VirtualDOM.createElement('br'),
                                VirtualDOM.createElement('label', { for: 'nationality' }, 'Nationality:'),
                                VirtualDOM.createElement('input', { type: 'text', id: 'nationality', name: 'nationality', value: 'morocco' }),
                                VirtualDOM.createElement('br'),
                                VirtualDOM.createElement('label', { for: 'email' }, 'E-mail:'),
                                VirtualDOM.createElement('input', { type: 'text', id: 'email', name: 'email', value: 'shicham@gmail.com' }),
                                VirtualDOM.createElement('br')
                            )
                        ),
                        VirtualDOM.createElement(
                            'div',
                            {},
                            VirtualDOM.createElement('input', { type: 'submit', value: 'Submit' })
                        )
                    )
                )
            )
        ), this.root)
    }
    addEventListeners()
    {

    }
}
customElements.define('informations-element', Informations)
export default Informations