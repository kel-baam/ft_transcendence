import{defineComponent,h} from '../package/index.js'
import { RegisterForm } from '../components/login/registerForm.js'

export const Register = defineComponent({
    state(){
        return {
            isLoading : true,
    }
    },
    intraEvent()
    {
        window.location.href = `http://localhost:3000/auth/intra/?type=${encodeURIComponent('register')}`
    },
    googleEvent(){
        
        window.location.href = `http://localhost:3000/auth/google/?type=${encodeURIComponent('register')}`
    },


    render(){
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
                                h('h1',{},['Create an Account'])]),

                    h('div',{class:'register'},[
                       h('p',{},[
                        'Already a member?',
                        h('a',{onclick:(e)=>{
                            e.preventDefault()
                            this.appContext.router.navigateTo('/login')

                        }},['Log In'])
                        ]),
                        h(RegisterForm,{}),
                        h('div',{class:'separater'},[
                            h('hr',{class:'line'}),
                            h('h1',{},['Or Register With']),
                            h('hr',{class:'line'}),
                        ]),
                        h('div',{class:'Oauth_section'},[
                            h('button',{onclick:this.intraEvent, class:'wrapLogo'},[
                                h('img',{alt:"42" ,src:"./images/42_Logo.png"}),
                            ]),
                            h('button',{onclick:this.googleEvent , class:'wrapLogo'},[
                                h('img',{alt:"42" ,src:"./images/google.png"}),
                            ])
                        ]),
                    ])
                ]),
            ])
        ])
    ])
},})