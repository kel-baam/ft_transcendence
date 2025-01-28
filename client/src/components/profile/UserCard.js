import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'
import { customFetch } from '../../package/fetch.js'

export const UserCard = defineComponent({
    state(){
        return {
            isLoading : true,
            data : {
                
            },

        }
    },

    render(){
        const {data, isLoading} = this.state
        // const {username , image, firstName, lastName, score, level, achievement} = data
        if (isLoading) {
            return h('div', { class: 'loading' }, ['Loading user stats...']);
        }
        return  h('div', { class: 'infos-user-container' },
            [h('div', {},
            [ h('img', { src: 'images/kel-baam.png' }),//picture from data
                h('i', { class: 'fa-solid fa-camera', style: {color: '#5293CB'}  })]
            ),
            h('div', {},
            [ h('div', {},
                    [h('span', {},
                    [ h('h1', {}, [`${data.first_name}` + ' '+ `${data.last_name}`])]
                    )]
                ),
                h('div', {},
                [ h('form', {action :'/'}, 
                        [h('input', { type: 'text', value: `${data.username}` })] )]
                
                ),
                h('div', {},
                    [h('div', {},
                        [h('span', {},[ `${data.level}` + '%']),
                        h('div', {},
                            [h('span', {}, ['level']),
                            h('progress', { max: '100', value: `${data.level}`, style: {width: '593px' }, id: 'progress-level' })]
                        )]
                    ),
                    h('div', {},
                        [
                            h('div', {},
                                [
                                    h('span', {}, ['Rank : ']),
                                    h('span', { style: {color: '#0B42AF'} }, [`${data.rank}`])
                                ]
                            ),
                            h('div', {},
                                [
                                    h('span', {}, ['Score : ']),
                                    h('span', { style: {color: '#0B42AF' }}, [`${data.score}`])
                                ]
                            ),
                            h('div', { style: {color: '#FBCA35',fontSize: '16px' }, class: 'achievement-item' },
                                [
                                    h('img', { src: 'images/ach.png' }),
                                    h('span', {}, ['Silver'])
                                ]
                            )
                        ]
                    )
                ]
                )]
            )]
        )
    },

   onMounted()
    {
        
        customFetch('http://localhost:3000/api/user')
        .then(result =>{

            if (!result.ok)
            {
                console.log("res isn't okey ," , " | ", this)
                
                this.appContext.router.navigateTo('/login')
            }

            return result.json()
        })
        .then(res =>{
            // console.log(">>>>>>>>>>>>>>> res : ", res,"|",res.status)
            // console.log("res is okey")
            this.updateState({
                    isLoading: false,  
                    data: res,   
                    error: null   
            });

        })
        .catch(error => {
            console.log(">>>>>>>>>>>> error : ", error)
        })
      
    }
})
