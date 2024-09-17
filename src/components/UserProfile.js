import render from "../framework/render.js";
import createElement from "../framework/createElement.js";
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
            createElement('div', { className: 'infos-user-container' },
                createElement('div', {},
                    createElement('img', { src: '../../assets/images/kel-baam.png' }),
                    createElement('i', { className: 'fa-solid fa-camera', style: 'color: #5293CB;'  })
                ),
                createElement('div', {},
                    createElement('div', {},
                        createElement('span', {},
                            createElement('h1', {}, 'Souad hicham')
                        )
                    ),
                    createElement('div', {},
                        createElement('form', {action :'/'}, 
                            createElement('input', { type: 'text', value: 'shicham' }) )
                       
                    ),
                    createElement('div', {},
                        createElement('div', {},
                            createElement('span', {}, '8.88%'),
                            createElement('div', {},
                                createElement('span', {}, 'level'),
                                createElement('progress', { max: '100', value: '80', style: ' width: 593px;' , id: 'progress-level' })
                            )
                        ),
                        createElement('div', {},
                            createElement('div', {},
                                createElement('span', {}, 'Rank :'),
                                createElement('span', { style:  'color: #0B42AF;'  }, '9')
                            ),
                            createElement('div', {},
                                createElement('span', {}, 'Score :'),
                                createElement('span', { style: ' color: #0B42AF;' }, '3.9')
                            ),
                            createElement('div', { style:'color: #FBCA35; font-size: 16px;', className: 'achievement-item' },
                                createElement('img', { src: '../../assets/images/ach.png' }),
                                createElement('span', {}, 'Silver')
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