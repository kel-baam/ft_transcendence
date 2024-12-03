import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString,RouterOutlet} from '../package/index.js'

export const Login = defineComponent({
    state(){
        return {
            isLoading : true,
    }
    },
    intraEvent()
    {
                window.location.href = "http://localhost:8000/authentication/intra/"
    },
    googleEvent(){
    
                    window.location.href = "http://localhost:8000/authentication/google/"
    },
    render(){
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>> router.query", this.appContext.router.query)
        return h ('div',{id:"global"},[
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
                    h('div',{class:'info'},
                        [
                            h('div',{class:'title'},[
                                h('h1',{},['Step Into Your World'])
                            ]),
                    h('div',{class:'login'},[
                        h('button',{class:'btn'},[
                            h('img',{src:'./images/google.png'}),
                            h('p',{class:'google',onclick:this.intraEvent},['Sign in with Google'])
                        ]),
                        h('span',{},['Or']),
                        h('button',{class:'btn',onclick:this.intraEvent},[
                            h('img',{src:'./images/42_Logo.png'}),
                            h('p',{class:'intra'}
                                ,['Sign in with Intra'])
                        ])
                    ])
                ]),
            ])
            ])
        ])
    },})


// this should change