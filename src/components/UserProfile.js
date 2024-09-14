import render from "../framework/Renderer.js";
import VirtualDOM from "../framework/VirtualDOM.js";
import createDOMElement from "../framework/createDOMElement.js";

class UserProfile extends HTMLElement{
    constructor()
    {
        super()
        console.log("-----> here in user profile compon const")
        this.attachShadow({ mode: 'open' });
        this.items = [];
        this.root = document.getElementsByClassName('infos')[0];
        this.connectedCallback()

    }

    connectedCallback()
    {
        console.log(".>>>>> here in call Back ")
        this.render()
        // const container = document.getElementsByClassName('infos')[0]
        // // console.log("-----> container info : ", this.root)
        // container.appendChild(this.root)
        // this.addEventListeners()
    }

    render()
    {
        render(
            VirtualDOM.createElement('div', { className: 'infos-user-container' },
                VirtualDOM.createElement('div', {},
                    VirtualDOM.createElement('img', { src: '../../assets/images/kel-baam.png' }),
                    VirtualDOM.createElement('i', { className: 'fa-solid fa-camera', style: 'color: #5293CB;'  })
                ),
                VirtualDOM.createElement('div', {},
                    VirtualDOM.createElement('div', {},
                        VirtualDOM.createElement('span', {},
                            VirtualDOM.createElement('h1', {}, 'Souad hicham')
                        )
                    ),
                    VirtualDOM.createElement('div', {},
                        VirtualDOM.createElement('form', {action :'/'}, 
                            VirtualDOM.createElement('input', { type: 'text', value: 'shicham' }) )
                       
                    ),
                    VirtualDOM.createElement('div', {},
                        VirtualDOM.createElement('div', {},
                            VirtualDOM.createElement('span', {}, '8.88%'),
                            VirtualDOM.createElement('div', {},
                                VirtualDOM.createElement('span', {}, 'level'),
                                VirtualDOM.createElement('progress', { max: '100', value: '80', style: ' width: 593px;' , id: 'progress-level' })
                            )
                        ),
                        VirtualDOM.createElement('div', {},
                            VirtualDOM.createElement('div', {},
                                VirtualDOM.createElement('span', {}, 'Rank :'),
                                VirtualDOM.createElement('span', { style:  'color: #0B42AF;'  }, '9')
                            ),
                            VirtualDOM.createElement('div', {},
                                VirtualDOM.createElement('span', {}, 'Score :'),
                                VirtualDOM.createElement('span', { style: ' color: #0B42AF;' }, '3.9')
                            ),
                            VirtualDOM.createElement('div', { style:'color: #FBCA35; font-size: 16px;', className: 'achievement-item' },
                                VirtualDOM.createElement('img', { src: '../../assets/images/ach.png' }),
                                VirtualDOM.createElement('span', {}, 'Silver')
                            )
                        )
                    )
                )
            ),
            this.root
        )
    }

    addEventListeners()
    {

    }
}
window.customElements.define('user-profile', UserProfile)
export default UserProfile