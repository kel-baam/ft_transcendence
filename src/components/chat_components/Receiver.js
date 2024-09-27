import createElement from "../../framework/createElement.js";
import render from "../../framework/render.js";

class Receiver
{
    constructor()
    {
        this.render()
    }

    render()
    {
        const vdom = 
            createElement( 'div', { className: 'receiver'},
            createElement( 'div', { className: 'msg'},
                createElement( 'div', { className: 'msg-content'}, 'Hi, fine and u ??' ),
                createElement( 'div', { className: 'msg-time'}, '04.25' ),
            ),
            createElement( 'img', { className: 'receiver-avatar', alt: 'not Found', src:'../../../assets/images/niboukha-intra.png'}, ),
        );

        return (vdom);
    }
}

export default Receiver;