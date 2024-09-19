import createElement from "../framework/createElement.js";
import render from "../framework/render.js";
import createDOMElement from "../framework/createDOMElement.js";



class Login
{
    constructor()
    {
        this.render();
        this.root = document.body;
    }
    render()
    {
        const vdom = createElement(
            'div', { class: 'login-page-content' }, 
            createElement('div', { className: 'top' }, 
                createElement('img', { src: './images/logo.png', className: 'logo' }),
                createElement('a', { href: '#' }, 
                    createElement('i', { className: 'fa-solid fa-house icon' })
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

        // return (createElement("h1",{},"ssssssssssssssssssssssss"))
    }
}

export default Login