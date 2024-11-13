import createElement from "../../framework/createElement.js";
import render from "../../framework/render.js";

class TypingMsg
{
    constructor()
    {
        this.render();
    }

    render()
    {
        const vdom = 
            createElement( 'div', { className: 'typing', style: 'border-radius: 0px 0px 56px 56px;'},
                createElement( 'input', { className: 'input-msg', placeholder: 'Type a message', type: 'text', name: 'input-msg'}, ),
                createElement( 'div', { className: 'send-icon'},
                    createElement( 'i', { className: 'fa-duotone fa-solid fa-paper-plane icon'} ),
                )
        );

        return (vdom);
    }
}

export default TypingMsg;