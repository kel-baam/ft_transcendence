import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'
import { customFetch } from '../../package/fetch.js'
// import { config } from '../../config.js'
const statusIcons = {
    sent: { icon: '<i class="fa fa-user-clock"></i>', action: "Cancel Request" },  // Request sent, waiting for acceptance
    received: { icon: '<i class="fa fa-user-check"></i>', action: "Accept / Decline" }, // Request received
    blocked: { icon: '<i class="fa fa-user-slash"></i>', action: "Unblock User" },  // User is blocked
    accepted: { icon: '<i class="fa fa-user-friends"></i>', action: "Remove Friend" }, // Already friends
    none: { icon: '<i class="fa fa-user-plus"></i>', action: "Send Request" }, // No relationship (send request)
};

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
        // console.log('>>>>>>>>>>>>>>>>>>>>>> data content : ', data )
        const {key} = this.props
        if (isLoading) 
            return h('div', { class: 'infos-user-container' });
        return  h('div', { class: 'infos-user-container' },
            [h('div', {},
            [ 
                h('img', { src: `https://${window.env.IP}:3000${data.picture}`, alt :"profile picture" , style : {'object-fit': 'cover'}}),

                ...(!key  ? [  
                    h('i', { 
                        class: 'fa-solid fa-camera', 
                        style: {
                            color: '#5293CB', 
                            fontSize: '20px',
                            position: 'absolute', 
                            bottom: '25%',
                            left: '75%'
                        },
                        on: {
                            click: () => document.getElementById('file-input').click() 
                        }
                    }),
                    h('input', {
                        type: 'file',
                        id: 'file-input',
                        style: { display: 'none' }, 
                        accept: 'image/*',  
                        on: {
                            change: (event) => this.handleFileChange(event)
                        }
                    })
                ] : [])
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
                                    click : ()=> this.sendRequest()
                                }
                            }) : `${data.relationship_status}` === 'sent' ? 
                            h('i', {class : 'fa fa-user-clock',
                                style : {'font-size' : '20px', color : '#5293CB' , 
                                    position : 'absolute', left : '85%'},
                                'data-text': 'Pending Request',
                                on : {
                                    // click :()=>{

                                    // }
                                } 
                                }) : 
                                `${data.relationship_status}` === 'accepted' ?  h('i', {class : 'fa fa-user-friends',
                                    style : {'font-size' : '20px', color : '#5293CB' , 
                                        position : 'absolute', left : '85%'},
                                        'data-text': 'Block User',
                                        on : {
                                            // click : ()=>this.changeRelationshipStatus('pending')
                                        }
                                        }): `${data.relationship_status}` === 'recieved' ?  h('i', {class : 'fa fa-user-check',
                                    style : {'font-size' : '20px', color : '#5293CB' , 
                                        position : 'absolute', left : '85%'},
                                        'data-text': 'Block User',
                                        on : {
                                            // click : ()=>this.changeRelationshipStatus('blocked')
                                        }
                                        }):`${data.relationship_status}` === 'blocked' ?  h('i', {class : "fa fa-user-slash",
                                        style : {'font-size' : '20px', color : '#5293CB' , 
                                        position : 'absolute', left : '85%'},
                                        'data-text': 'Block User',
                                        on : {
                                            // click : ()=>this.changeRelationshipStatus('blocked')
                                        }
                                        }):null
                        ] )]
                
                ),
                h('div', {},
                    [h('div', {},
                        [
                            // h('span', {},[ `${data.level}` + 'Xps']),
                            h('span', {},[ `${data.level}` + 'xps']),

                        h('div', {},
                            [
                                h('span', {'data-translate' : 'Level'}, ['Level']),
                                h('progress', { max: '5', value: `${data.level}`, style: {width: '593px' }, id: 'progress-level' })]
                        )]
                    ),
                    h('div', {},
                        [
                            h('div', {},
                                [
                                    h('span', {'data-translate' : 'Rank'}, ['Rank']),
                                    h('span', { style: {color: '#0B42AF'} }, [' ' + `${data.rank}`])
                                ]
                            ),
                            h('div', {},
                                [
                                    h('span', {'data-translate' : 'Score'}, ['Score']),
                                    h('span', { style: {color: '#0B42AF' }}, [' ' +`${data.score}`])
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
        const {key, on} = this.props
        const  endPoint  = !key ? `https://${window.env.IP}:3000/api/user?fields=first_name,last_name,username,picture,score,rank,level`:
        `https://${window.env.IP}:3000/api/user?username=${key}&
            fields=first_name,last_name,username,picture,score,rank`
       
        customFetch(endPoint)
        .then(result =>{
            // console.log("------------------------> res.status : ", result.status)
                 switch(result.status)
                {
                    case 401:
                        this.appContext.router.navigateTo('/login')
                        break;
                    case 404:
                        // console.log(">>>>>>>>>>>> user not found here ")
                        // if (response.status === 404) {
                            // on.NotFound(); 
                    //     console.log(">>>>>>>----------- 404 >>>>>> here ")
                        // this.emit("NotFound")
                        throw Error("404 User not found")
                        // return this.appContext.router.navigateTo("/404")
                        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> this.appContext.router.navigateTo) ", this.appContext.router.navigateTo("/404"))
                        // return this.appContext.router.navigateTo("/404")
                        // return h('div', {}, ["404 user not found "])
                    break;
                }
            return result.json()
        })
        .then(res =>{
            // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> res : ", res)
            // if (res.error)
            //     return this.appContext.router.navigateTo("/404")
            this.updateState({
                    isLoading: false,  
                    data: res,   
                    // error: null  
            });

        })
        .catch(error => {
            // console.log(">>>>>>>>>>>> error : ", error)
            this.appContext.router.navigateTo("/404")
        })
      
    },
    handleFileChange(event)
    {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('picture', file);
        // console.log(">>>>>>>>>>>>>>-------------------------------> file : ", file)
        customFetch(`https://${window.env.IP}:3000/api/user`, {
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

    },
    sendRequest()
    {
        const {data} = this.state
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>> data ")
        // console.log(">>>>>>>>>>>>>>>>>> here in sent function : ")
        customFetch(`https://${window.env.IP}:3000/api/user/friendships`, {
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
                            relationship_status : 'sent'
                        }
                    
            })
        })
    },
    changeRelationshipStatus(status)
    {
        customFetch(`https://${window.env.IP}:3000/api/user/friendships`, {
            method : 'PUT',
            headers: {
                'Content-Type': 'application/json',
              },
            body : JSON.stringify({
                target: data.username,
                status : status
            })
        }).then((res)=>
        {
            if (res.status == 200)
            {
                // console.log(">>>>>>>>>>>>> here blocked nisrin ")
                this.updateState({
                    data : {
                        ...this.state.data,
                        relationship_status : status
                    }
            })

            }
        })
    }


})
