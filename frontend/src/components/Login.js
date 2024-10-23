import createElement from "../framework/createElement.js";
import render from "../framework/render.js";
import createDOMElement from "../framework/createDOMElement.js";

import { handleRouting } from "../framework/routing.js";


class Login
{
    constructor()
    {
        this.render();
        this.root = document.body;
    }

    handleButtonClick = () => {
        const link = event.target.closest('a');
        
        if (link) {
            event.preventDefault();
            const path = link.getAttribute('href');
            handleRouting(path);
            window.history.pushState(null, '', path);
        }
    }

    render()
    {
        const vdom = createElement(
            'div', { class: 'login-page-content' }, 
            createElement('div', { className: 'top' }, 
                createElement('img', { src: './images/logo.png', className: 'logo' }),
                createElement('a', { href: '/home' }, 
                    createElement('i', { className: 'fa-solid fa-house icon', onclick:this.handleButtonClick })
                )
            ),
            createElement('div', { className: 'down' }, 
                createElement('div', { className: 'player' }, 
                    createElement('img', { src: './images/avatarback-removebg-preview.png' })
                ),
                createElement('div', { className: 'info' }, 
                    createElement('div', { className: 'title' }, 
                        createElement('h1', {}, 'Step Into Your World')
                    ),
                    createElement('div', { className: 'login' }, 
                            createElement('button', { className: 'btn' }, 
                                createElement('img', { src: './images/google.png' }),
                                createElement('p', {className: 'google'}, 'Sign in with Google')
                                
                            ),                     
                        createElement('span', {}, 'Or'),
                            createElement('button', { className: 'btn' }, 
                                createElement('img', { src: './images/42_Logo.png' }), 
                                createElement('p', {className: 'intra'}, 'Sign in with Intra'))
                    )
                )
            )
        );
        
        return vdom;
    }
}

export default Login
