import createElement from "../framework/createElement.js";
import createDOMElement from "../framework/createDOMElement.js";
import { handleRouting } from "../framework/routing.js";

class Header
{
    constructor(props)
    {  
        this.props = props;
        this.render();
    }
    
    handleButtonClick = () => {
        const link = event.target.closest('a');
        
        if (link) {
            event.preventDefault();
            const path = link.getAttribute('href');
            console.log("---> " ,path);
            handleRouting(path);
            window.history.pushState(null, '', path);
        }
    }
    

    render()
    {
        const virtualDom = createElement(
            'header', { className: 'container' }, 
            createElement('nav', {},
                createElement('a',{ href: '/home' }, 
                    createElement('img', { src: './images/logo.png', className: 'logo', onclick:this.handleButtonClick  })
                ),createElement('div', { className: 'search' }, 
                    createElement('a', { href: '#' },
                        createElement('i',{ className: 'fa-solid fa-magnifying-glass icon', 'aria-hidden': 'false' })),
                    createElement('input', { type: 'text', placeholder: 'Search...'} )),
                createElement('div', { className: 'left-side' }, 
                    createElement('a', { href: '/notification' }, 
                        createElement('i', { className: 'fa-regular fa-bell icon', 'aria-hidden': 'false', onclick:this.handleButtonClick })),
                    createElement('a', { href: '/settings' }, 
                        createElement('i', { className: 'fa-solid fa-sliders icon', 'aria-hidden': 'false', onclick:this.handleButtonClick})),
                    createElement('a', { href: '/login' }, 
                        createElement('i', { className: 'fa-solid fa-arrow-right-from-bracket icon', 'aria-hidden': 'false', onclick:this.handleButtonClick })
                    )
                )
            )
        );
        return virtualDom;
    }
}

export default Header
