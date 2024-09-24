import createElement from "../../framework/createElement.js";
import render from "../../framework/render.js";

class Sender
{
    constructor()
    {
        this.render()
    }
    
    render()
    {
        const vdom = 
            createElement('div', { className: 'sender'},
                createElement( 'img', { className: 'sender-avatar', alt: 'not Found', src:'../../../assets/images/kjarmoum-intra.png'}, ),
                createElement( 'div', { className: 'msg'},
                    createElement( 'div', { className: 'msg-content'}, 'Hi, fine & u? Hi, fine & u? Hi, fine & u? ' ),
                    createElement( 'div', { className: 'msg-time'}, '04.20' )
                )
        );
        return (vdom);
    }
}

export default Sender;