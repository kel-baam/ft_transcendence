import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'
import { customFetch } from '../../package/fetch.js'
// import { config } from '../../config.js'

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
        const {key} = this.props
        if (isLoading) 
            return h('div', { class: 'infos-user-container' });
        return  h('div', { class: 'infos-user-container' },
            [h('div', {},
            [ h('img', { src: `${window.env.DOMAIN}${data.picture}`, alt :"profile picture" , style : {'object-fit': 'cover'}}),

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
                        h('h2', {}, [`${data.first_name}` + ' '+ `${data.last_name}`])]
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
                                        customFetch(`${window.env.DOMAIN}/api/user/friendships`, {
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
                                        on : {
                                            click : ()=>
                                            {
                                                customFetch(`${window.env.DOMAIN}/api/user/friendships`, {
                                                    method : 'PUT',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                      },
                                                    body : JSON.stringify({
                                                        target: data.username,
                                                        status : 'blocked'
                                                    })
                                                }).then((res)=>
                                                {
                                                    if (res.status == 200)
                                                    {
                                                        console.log(">>>>>>>>>>>>> here blocked nisrin ")
                                                        this.updateState({
                                                            data : {
                                                                ...this.state.data,
                                                                relationship_status : 'blocked'
                                                            }
                                                    })

                                                    }
                                                })
                                            }
                                        }
                                        }): null
                        ] )]
                
                ),
                h('div', {},
                    [h('div', {},
                        [
                            // h('span', {},[ `${data.level}` + 'Xps']),
                            h('span', {},[ '8.88' + 'Xps']),

                        h('div', {},
                            [
                                h('span', {}, ['level']),
                                // h('progress', { max: '100', value: `${data.level}`, style: {width: '593px' }, id: 'progress-level' })]
                                h('progress', { max: '100', value: '8', style: {width: '593px' }, id: 'progress-level' })]
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
        const {key} = this.props
        const  endPoint  = !key ? `${window.env.DOMAIN}/api/user?fields=first_name,last_name,username,picture,score,rank`:
        `${window.env.DOMAIN}/api/user?username=${key}&
            fields=first_name,last_name,username,picture,score,rank`
       
        customFetch(endPoint)
        .then(result =>{
                switch(result.status)
                {
                    case 401:
                        this.appContext.router.navigateTo('/login')
                        break;
                    // case 404:
                    //     console.log(">>>>>>>----------- 404 >>>>>> here ")
                    //     h('h1', {}, ['404 not found'])
                    //     break;
                }
            return result.json()
        })
        .then(res =>{
            this.updateState({
                    isLoading: false,  
                    data: res,   
                    // error: null  
            });

        })
        // .catch(error => {
        //     console.log(">>>>>>>>>>>> error : ", error)
        // })
      
    },
    handleFileChange(event)
    {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('picture', file);
        console.log(">>>>>>>>>>>>>>-------------------------------> file : ", file)
        customFetch(`${window.env.DOMAIN}/api/user`, {
            method : 'PUT',
            body : formData
        }
       )
        .then(result =>{

            // if (!result.ok)
            // {
            //     // console.log("res isn't okey ," , " | ", this)
                
            //     this.appContext.router.navigateTo('/login')
            // }
            switch(result.status)
            {
                case 401:
                    this.appContext.router.navigateTo('/login')
                    break;
                // case 404:
                //     console.log(">>>>>>>----------- 404 >>>>>> here ")
                //     h('h1', {}, ['404 not found'])
                //     break;
            }
            return result.json()
        })
        .then(res =>{
            this.updateState({
                    isLoading: false,  
                    data: res,   
                    error: null   
            });

        })
        // .catch(error => {
        //     // console.log(">>>>>>>>>>>> error : ", error)
        // })

    }
})
