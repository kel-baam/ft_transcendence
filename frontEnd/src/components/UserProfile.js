// import render from "../framework/render.js";
import createElement from "../framework/createElement.js";
// import createDOMElement from "../framework/createDOMElement.js";

class UserProfile{
    constructor(props)
    {
        // super()
        this.props = props
        // console.log("-----> here in user profile compon const")
        // this.attachShadow({ mode: 'open' });
        // this.items = [];
        // this.root = document.getElementsByClassName('infos')[0];
        this.render()

    }

   
    render()
    {
        return(
            createElement('div', { className: 'infos-user-container' },
                createElement('div', {},
                    createElement('img', { src: './images/kel-baam.png' }),
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
                                createElement('img', { src: './images/ach.png' }),
                                createElement('span', {}, 'Silver')
                            )
                        )
                    )
                )
            )
        )
    }

    addEventListeners()
    {

    }
}
// window.customElements.define('user-profile', UserProfile)
export default UserProfile