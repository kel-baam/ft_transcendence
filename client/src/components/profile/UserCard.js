import{defineComponent,h} from '../../package/index.js'
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
        const grades = new Map([
            ['Newbie',  '#808080'],
            ['Bronze' , '#CD7F32'],
            ['Silver', '#C0C0C0'],
            ['Master', '#0000FF'],
            ['Legend', '#FF0000']
        ])
        // console.log("******************************> data : ", data)
        // console.log("********************************** grades[data.grade]",grades.get(data.grade))
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
                                     position : 'absolute', left : '83.5%',
                                     },
                                     'data-text': 'Invite User',
                                on : {
                                        mouseover :()=>
                                        {
                                            const popup = document.getElementsByClassName("relation-txt")[0];
                                            popup.textContent="Add"
                                            popup.classList.toggle("show");
                                        },
                                        mouseout :()=>
                                        {
                                            const popup = document.getElementsByClassName("relation-txt")[0];
                                            popup.classList.remove("show");
                                        },
                                        click : ()=> this.sendRequest()
                                }
                            }) : `${data.relationship_status}` === 'sent' ? 
                            h('i', {class : 'fa fa-user-clock',
                                style : {'font-size' : '20px', color : '#5293CB' , 
                                    position : 'absolute', left : '83.5%'},
                                'data-text': 'Pending Request',
                                on : {
                                        mouseover :()=>
                                        {
                                            const popup = document.getElementsByClassName("relation-txt")[0];
                                            popup.classList.toggle("show");
                                            popup.textContent = "Cancel"
                                        },
                                        mouseout :()=>
                                        {
                                            const popup = document.getElementsByClassName("relation-txt")[0];
                                            popup.classList.remove("show");
                                        },
                                        click : ()=>this.cancelRequest(data.username)
                                } 
                                }) : 
                                `${data.relationship_status}` === 'accepted' ?  h('i', {class : 'fa fa-user-slash',
                                    style : {'font-size' : '20px', color : '#5293CB' , 
                                        position : 'absolute', left : '83.5%'},
                                        on : {
                                                mouseover : ()=>
                                                {
                                                    const popup = document.getElementsByClassName("relation-txt")[0];
                                                    popup.classList.toggle("show");
                                                    popup.textContent="Block"
                                                },
                                                mouseout :()=>
                                                {
                                                    const popup = document.getElementsByClassName("relation-txt")[0];
                                                    popup.classList.remove("show");
                                                },
                                            click : ()=>this.changeRelationshipStatus('blocked')
                                        }
                                        }): `${data.relationship_status}` === 'recieved' ?  h('i', {class : 'fa fa-user-check',
                                        style : {'font-size' : '20px', color : '#5293CB' , 
                                        position : 'absolute', left : '83.5%'},
                                        on : {
                                            mouseover : ()=>
                                            {
                                                const popup = document.getElementsByClassName("relation-txt")[0];
                                                popup.classList.toggle("show");
                                                popup.textContent="Accept"
                                            },
                                            mouseout :()=>
                                            {
                                                const popup = document.getElementsByClassName("relation-txt")[0];
                                                popup.classList.remove("show");
                                            },
                                            click : ()=>this.changeRelationshipStatus('accepted')
                                        }
                                        }):`${data.relationship_status}` === 'blocked' ?  h('i', {class : "fa-solid fa-unlock",
                                        style : {'font-size' : '20px', color : '#5293CB' , 
                                        position : 'absolute', left : '83.5%'},
                                        on : {
                                            mouseover : ()=>
                                            {
                                                const popup = document.getElementsByClassName("relation-txt")[0];
                                                popup.classList.toggle("show");
                                                popup.textContent="Unblock"
                                            },
                                            mouseout :()=>
                                            {
                                                const popup = document.getElementsByClassName("relation-txt")[0];
                                                popup.classList.remove("show");
                                            },
                                            click : ()=>this.cancelRequest(data.username)
                                        }
                                        }):null,
                                        h('span', {class:'relation-txt' }, [""])
                        ] 
                    )]
                
                ),
                h('div', {},
                    [h('div', {},
                        [
                            h('span', {},[ `${data.level}` + 'Xps']),

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
                                    h('span', {style :{color : grades.get(data.grade)}}, [`${data.grade}`])
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
        const  endPoint  = !key ? `https://${window.env.IP}:3000/api/user?fields=first_name,last_name,username,picture,score,rank,level,grade`:
        `https://${window.env.IP}:3000/api/user?username=${key}&
            fields=first_name,last_name,username,picture,score,rank,level,grade`
       
        customFetch(endPoint)
        .then(result =>{
                 switch(result.status)
                {
                    case 401:
                        this.appContext.router.navigateTo('/login')
                        break;
                    case 404:
                        throw Error("404 User not found")
                        break;
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
        .catch(error => {
            this.appContext.router.navigateTo("/404")
        })
      
    },
    handleFileChange(event)
    {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('picture', file);
        customFetch(`https://${window.env.IP}:3000/api/user`, {
            method : 'PUT',
            body : formData
        }
       )
        .then(result =>{
            switch(result.status)
            {
                case 401:
                    this.appContext.router.navigateTo('/login')
                    break;
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
            if (res.status == 401)
                this.appContext.router.navigateTo("/login")
            if (res.status == 201)
                this.updateState({
                    data : {
                        ...this.state.data,
                        relationship_status : 'sent'
                    },
                })
        })
    },
    changeRelationshipStatus(status)
    {
        const {data} = this.state
        console.log(">>>>>>>>>>>>>>>>>>>>>> data is here : ", data.username)
        customFetch(`https://${window.env.IP}:3000/api/user/friendships`, {
            method : 'PUT',
            headers: {
                'Content-Type': 'application/json',
              },
            body : JSON.stringify({
                target: data.username,
                status : status,
            })
        }).then((res)=>
        {
            if (res.status == 200)
            {
                this.updateState({
                    data : {
                        ...this.state.data,
                        relationship_status : status
                    }
            })

            }
        })
    },
    cancelRequest(target)
    {
        customFetch(`https://${window.env.IP}:3000/api/user/friendships?target=${target}`, 
            {
                method : 'DELETE'
            }
        )
            .then(result =>{

                if (!result.status == 401)
                    this.appContext.router.navigateTo('/login')
                if (result.status == 204)
                {
                    console.log("-------------------------> here ")
                    this.updateState({
                        data:{
                            ...this.state.data, 
                            relationship_status: "no_request"
                        }
                    });

                }
            })
    }


})
