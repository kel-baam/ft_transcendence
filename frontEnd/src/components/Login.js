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

    intraEvent=()=>
        {
    
                window.location.href = "https://legendary-bassoon-jpvw6597q7jcq7rp-8000.app.github.dev/authentication/intra/"
        }
        googleEvent=()=>
        {
        
                    window.location.href = "https://legendary-bassoon-jpvw6597q7jcq7rp-8000.app.github.dev/authentication/google/"
        }
        render()
        {
            const vdom = createElement(
                'div', { class: 'login-page-content' },
                createElement('div', { className: 'top' }, 
                    createElement('img', { src: './images/logo.png', className: 'logo' }),
                    createElement('a', { href: 'https://legendary-bassoon-jpvw6597q7jcq7rp-80.app.github.dev/laningPage' }, 
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
                                createElement('button', { className: 'btn' ,onclick:this.googleEvent}, 
                                    createElement('img', { src: './images/google.png' }),
                                    createElement('p', {className: 'google'}, 'Sign in with Google')  
                                ),                     
                            createElement('span', {}, 'Or'),
                            createElement('button', { className: 'btn', onclick:this.intraEvent}, 
                            createElement('img', { src: './images/42_Logo.png'}), 
                            createElement('p', {className: 'intra'}, 'Sign in with Intra'))
                        )
                    )
                )
            );
            return vdom;
        }
}

export default Login


// https://legendary-bassoon-jpvw6597q7jcq7rp-8000.app.github.dev

// https://legendary-bassoon-jpvw6597q7jcq7rp-80.app.github.dev/