import createElement from "../framework/createElement.js";

class header 
{
    constructor(props)
    {  
        this.props = props
        this.render()
    }
    
    render()
    {
        const virtualDom = createElement(
            'header', 
            { className: 'container' }, 
            createElement(
                'nav', 
                null,
                createElement(
                    'a', 
                    { href: 'home' }, 
                    createElement(
                        'img', 
                        { src: './images/logo.png', className: 'logo' }
                    )
                ),
                createElement(
                    'div', 
                    { className: 'search' }, 
                    createElement(
                        'a', 
                        { href: '#' },
                        createElement(
                            'i',
                            { className: 'fa-solid fa-magnifying-glass icon', 'aria-hidden': 'false' }
                        )
                    ),
                    createElement(
                        'input', 
                        { type: 'text', placeholder: 'Search...' }
                    )
                ),
                createElement(
                    'div', 
                    { className: 'left-side' }, 
                    createElement(
                        'a', 
                        { href: 'notification' }, 
                        createElement(
                            'i', 
                            { className: 'fa-regular fa-bell icon', 'aria-hidden': 'false' }
                        )
                    ),
                    createElement(
                        'a', 
                        { href: 'settings' }, 
                        createElement(
                            'i', 
                            { className: 'fa-solid fa-sliders icon', 'aria-hidden': 'false' }
                        )
                    ),
                    createElement(
                        'a', 
                        { href: 'login' }, 
                        createElement(
                            'i', 
                            { className: 'fa-solid fa-arrow-right-from-bracket icon', 'aria-hidden': 'false' }
                        )
                    )
                )
            )
        );
        
    
        return virtualDom;
    }
}

export default header;
