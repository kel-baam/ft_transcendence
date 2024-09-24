import createElement from "../../framework/createElement.js";
import render from "../../framework/render.js";

class AboutFriend
{
    constructor() {
        this.render();
    }
    render()
    {
        const vdom = 
            createElement( 'div', { className: 'about-friend'},
                createElement( 'div', { className: 'header'},
                    createElement( 'div', { className: 'title'}, 'Informations'),
                    createElement( 'i', { className: 'fa-solid fa-xmark'}),
                ),
                createElement( 'div', { className: 'separator'}, ),
                createElement( 'div', { className: 'content-friend'},
                    createElement( 'div', { className: 'friend-info'},
                        createElement( 'img', { className: 'avatar', src: '../../../assets/images/kel-baam-pic.png', alt: 'not-Found'}, ),
                        createElement( 'div', { className: 'name'}, 'kel-baam'),
                    ),
                    createElement( 'div', { className: 'level'}),
                    createElement( 'div', { className: 'options'}, 
                        createElement( 'i', { className: 'fa-sharp fa-regular fa-address-card icon'},
                            createElement( 'div', { className: 'view-profile'}, 'view profile'),
                        ),
                        createElement( 'i', { className: 'fa-solid fa-user-lock icon'},
                            createElement( 'div', { className: 'view-profile'}, 'Block'),
                        ),
                    ),
                    createElement( 'div', { className: 'play'},
                        createElement( 'button', { type: 'button'}, 'PLay')
                    ),
                )
            )
        return (vdom);
    }
}

export default AboutFriend;