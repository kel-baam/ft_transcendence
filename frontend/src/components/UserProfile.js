import createElement from "../framework/createElement.js";

class UserProfile{
    constructor(props)
    {
        // console.log("---------------------------------------------> props : ", Object.keys(props) )
        this.props = props;
        // console.log("---------------------> this.props.user",this.props)

    }

   
    render()
    {
        const user = this.props.user
        // console.log(">>>>>>>>>>>>>>>>>>>>> here in render  : ", this.props.props.user)
        return(
            createElement('div', { className: 'infos-user-container' },
                createElement('div', {},
                    createElement('img', { src: '../../assets/images/kel-baam.png' }),
                    createElement('i', { className: 'fa-solid fa-camera', style: 'color: #5293CB;'  })
                ),
                createElement('div', {},
                    createElement('div', {},
                        createElement('span', {},
                            createElement('h1', {}, `${user.first_name}` + ' '+ `${user.last_name}`)
                        )
                    ),
                    createElement('div', {},
                        createElement('form', {action :'/'}, 
                            createElement('input', { type: 'text', value: `${user.username}` }) )
                       
                    ),
                    createElement('div', {},
                        createElement('div', {},
                            createElement('span', {}, `${this.props.level}` + '%'),
                            createElement('div', {},
                                createElement('span', {}, 'level'),
                                createElement('progress', { max: '100', value: '80', style: ' width: 593px;' , id: 'progress-level' })
                            )
                        ),
                        createElement('div', {},
                            createElement('div', {},
                                createElement('span', {}, 'Rank : '),
                                createElement('span', { style:  'color: #0B42AF;'  }, `${this.props.Rank}`)
                            ),
                            createElement('div', {},
                                createElement('span', {}, 'Score : '),
                                createElement('span', { style: ' color: #0B42AF;' }, `${this.props.score}`)
                            ),
                            createElement('div', { style:'color: #FBCA35; font-size: 16px;', className: 'achievement-item' },
                                createElement('img', { src: '../../assets/images/ach.png' }),
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
export default UserProfile