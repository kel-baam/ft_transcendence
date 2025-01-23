import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'
import { customFetch } from '../../package/fetch.js'

export const UserCard = defineComponent({
    state(){
        return {
            isLoading : true,
            isOwn : true,
            data : {
                
            },

        }
    },

    render(){

        const {data, isLoading} = this.state
        if (isLoading) {
            return h('div', { class: 'infos-user-container' }, ["Loading user informations..."]);
        }
        return  h('div', { class: 'infos-user-container' },
            [h('div', {},
            [ h('img', { src: `http://localhost:8001${data.picture}`, alt :"profile picture" , style : {'object-fit': 'cover'}}),

                h('i', { class: 'fa-solid fa-camera', 
                        style: {
                            color: '#5293CB', fontSize : '20px',
                             position: 'absolute', 
                             bottom: '25%',
                             left: '75%'},
                        on :{
                            click :() => document.getElementById('file-input').click() 
                        }
                    }),
                h('input', {
                    type: 'file',
                    id: 'file-input',
                    style: { display: 'none' }, 
                    accept: 'image/*',  
                    on : {
                        change : (event)=> this.handleFileChange(event)
                    }
                  })
            ]
            ),
            h('div', {},
            [ h('div', {},
                    [h('span', {},
                    [ 
                        h('h1', {}, [`${data.first_name}` + ' '+ `${data.last_name}`])]
                    ),
                    // h('span', {}, ['here add user'])
                    ]
                ),
                h('div', {
                    style: { 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    width: '100%',
                    position : 'relative'

                  }
                },
                [ h('form', {action :'/'}, 
                        [
                            h('input', { type: 'text', value: `${data.username}`, 
                                style :{
                                marginRight: 'auto'
                                },
                                disabled : true
                             }),
                            `${data.relationship_status}` === 'no_request' ? h('i', {class : 'fas fa-user-plus',

                                style : {'font-size' : '20px', color : '#5293CB' ,
                                     position : 'absolute', left : '85%',
                                     },
                                     'data-text': 'Invite User',
                                on : {
                                    click : ()=>
                                    {
                                        customFetch('http://localhost:3000/api/user/friendships/', {
                                            method : 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                              },
                                            body : JSON.stringify({
                                                reciever : data.id,
                                                status : 'pending'
                                            })
                                        }).then((res)=>
                                        {
                                            if (res.status == 201)
                                                this.updateState({
                                                    data : {
                                                        ...this.state.data,
                                                        relationship_status : 'pending'
                                                    }
                                            })
                                        })
                                    }
                                }
                            }) : `${data.relationship_status}` === 'pending' ? 
                            h('i', {class : 'fas fa-user-clock',
                                style : {'font-size' : '20px', color : '#5293CB' , 
                                    position : 'absolute', left : '85%'},
                                'data-text': 'Pending Request'}) : 
                                `${data.relationship_status}` === 'accepted' ?  h('i', {class : 'fas fa-user-times',
                                    style : {'font-size' : '20px', color : '#5293CB' , 
                                        position : 'absolute', left : '85%'},
                                        'data-text': 'Block User',
                                        }): null
                        ] )]
                
                ),
                h('div', {},
                    [h('div', {},
                        [h('span', {},[ `${data.level}` + 'Xps']),
                        h('div', {},
                            [
                                h('span', {}, ['level']),
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
        var  endPoint  = 'http://localhost:3000/api/user/'
        if(JSON.stringify(this.appContext.router.params) !== '{}')
        {
            console.log('>>>>>>>>>>>>>>>>>>>>>>>> here enpoint changed ')
            this.state.isOwn  = false
            endPoint = `http://localhost:3000/api/user?username=${this.appContext.router.params.username}`
        }
        customFetch(endPoint)
        .then(result =>{

            if (!result.ok)
            {
                // console.log("res isn't okey ," , " | ", this)
                
                this.appContext.router.navigateTo('/login')
            }

            return result.json()
        })
        .then(res =>{
            console.log("res is okey")
            console.log(">>>>>>>>>>>>>>>> here the data comes from backend : ", res)
            this.updateState({
                    isLoading: false,  
                    data: res,   
                    error: null   
            });

        })
        .catch(error => {
            // console.log(">>>>>>>>>>>> error : ", error)
        })
      
    },
    handleFileChange(event)
    {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('picture', file);
        console.log(">>>>>>>>>>>>>>-------------------------------> file : ", file)
        customFetch('http://localhost:3000/api/user/', {
            method : 'PUT',
            body : formData
        }
       )
        .then(result =>{

            if (!result.ok)
            {
                // console.log("res isn't okey ," , " | ", this)
                
                this.appContext.router.navigateTo('/login')
            }

            return result.json()
        })
        .then(res =>{
            console.log("res is okey")
            console.log(">>>>>>>>>>>>>>>> here the data comes from backend in change image : ", res)
            this.updateState({
                    isLoading: false,  
                    data: res,   
                    error: null   
            });
            console.log(">>>>>>>>>>>>>>>>>>> state here after change the image : ", this.state)

        })
        .catch(error => {
            // console.log(">>>>>>>>>>>> error : ", error)
        })

    }
})
