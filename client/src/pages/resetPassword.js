import{defineComponent,h} from '../package/index.js'




export const ResetPassword = defineComponent({
    state(){
        return {
            isLoading : true,
    }
    },
    async changePassword(event)
    {
        event.preventDefault()
        fetch('http://localhost:3000/auth/change-password/',{
            method:'POST',
            body:new FormData(document.querySelector(".formChangePassword")),
            
        }).then((res)=>{
            console.log(res)
            if(!res.ok)
            {
                console.log("email send unsuccessfuly")
            }
            else
                console.log("email send successfuly")
        }
        )
    }
    ,
    async sendEmail(event)
    {
        event.preventDefault()
        fetch('http://localhost:3000/auth/reset-password/',{
            method:'POST',
            body:new FormData(document.querySelector(".formSendEmail")),
        }).then((res)=>{
            console.log(res)
            if(!res.ok)
            {
                console.log("email send unsuccessfuly")
            }
            else
                console.log("email send successfuly")
        }
        )
        // if(!response.ok)
        // {   
        //     const errors = await response.json();
        //     this.updateState({errors: errors });
        // }
        // else
        // {
        //     // console.log("this",this)
        //     this.appContext.router.navigateTo('/home')
        //     const errors = await response.json();
        //     console.log(errors)
        // }
    },
    render(){
        console.log("thiiiiiii=>",this)
        console.log("whhhhy=>",this.appContext.router.query.uid,"|||",this.appContext.router.query.token)
        return h('div',{id:"global"},[
            h('div',{class:"login-page-content"},[
                h('div',{class:'top'},[
                    h('img',{src:'./images/logo.png', class: 'logo'}),
                    h('a',{ href:'',onclick:(e)=>{
                        e.preventDefault()
                        this.appContext.router.navigateTo('/landing')
                    } },[
                        h('i',{class:'fa-solid fa-house icon'})
                    ])
                ]),
                h('div',{class:'down'},[
                    h('div',{class:'player'},
                        [h('img',{src:'./images/avatarback-removebg-preview.png'})]
                    ),
                    h('div',{class:'reset-password'},
                        [
                            h('div',{class:'title'},[
                                h('h1',{},this.appContext.router.query.type !== "change" ?['Reset Password']:['Change Password'])
                            ]),
                            h('div',{id:'card'},
                                this.appContext.router.query.type !== "change"?
                                [
                                    h('form',{class:'formSendEmail' ,on :{submit: ( event) => this.sendEmail(event)}},[
                                        h('input',{type:'text', name:'email',placeholder:'Enter your Email'}),
                                        h('button',{},['Send']),
                                    ]),
                                    h('p',{},[
                                        'Already a member?',
                                        h('a',{onclick:(e)=>{
                                            e.preventDefault()
                                            this.appContext.router.navigateTo('/login')
                                        }},["Log In"])
                                    ])
                            ]:
                            [
                                h('form',{class:'formChangePassword' ,on :{submit: ( event) => this.changePassword(event)}},[
                                    h('input',{type:'password', name:'new-password',placeholder:'New password'}),
                                    h('input',{type:'password', name:'confirm-password',placeholder:'Confirm password'}),
                                    h('button',{},['Send']),
                                ]),
                                h('p',{},[
                                    'Already a member?',
                                    h('a',{onclick:(e)=>{
                                        e.preventDefault()
                                        this.appContext.router.navigateTo('/login')
                                    }},["Log In"])
                                ])
                            ]
                        )
                    ]),
            ])
        ])
    ])
    }
})