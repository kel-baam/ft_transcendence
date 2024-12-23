import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString,RouterOutlet} from '../package/index.js'
import {showErrorNotification} from '../package/utils.js'
export const Login = defineComponent({
    state(){
        return {
            isLoading : true,
    }
    },
    intraEvent()
    {
                window.location.href = `http://localhost:3000/auth/intra/?type=${encodeURIComponent('login')}`
    },
    googleEvent(){
    
                    window.location.href = "http://localhost:3000/auth/google/"
    },
    loginForm:async(event)=>
    {
        event.preventDefault()
        const response = await fetch('http://localhost:3000/auth/login/',{
            method:'POST',
            body:new FormData(document.querySelector(".loginForm")),
        })
        if(!response.ok)
        {   
            // console.log("test=>",response)
            data = await response.json()
            // showErrorNotification(data.error)
        }

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
                                h('h1',{},['Step Into Your World'])]),

                    h('div',{class:'login'},[
                        h('form',{class :'loginForm',onsubmit:this.loginForm},[
                            h('div',{class:'inputSec',id:'username'},[

                                h('i',{class:'fa-solid fa-user'}),
                                h('input',{class:'input',type:'text',id:'username' ,name:'username',placeholder:'Username...'}),
                            ]),
                            h('div',{class:'inputSec'},[

                                h('i',{class:'fa-solid fa-lock'}),
                                h('input',{class:'input',type:'text',id:'password',name:'password',placeholder:'Password...'}),
                            ]),
                            h('div',{class:'resetPassword'},[
                                h('a',{},['Forget Password']),
                            ]),
                            h('button',{class:'btn'},['Login'])
                        ]),
                        h('div',{class:'separater'},[
                            h('hr',{class:'line'}),
                            h('h1',{},['Or continue With']),
                            h('hr',{class:'line'}),
                        ]),
                        h('div',{class:'Oauth_section'},[
                            h('button',{ onclick:this.intraEvent , class:'wrapLogo'},[
                                h('img',{alt:"42" ,src:"./images/42_Logo.png"}),
                            ]),
                            h('button',{onclick:this.googleEvent , class:'wrapLogo'},[
                                h('img',{alt:"42" ,src:"./images/google.png"}),
                            ])
                        ]),
                       h('p',{},[
                        'Dont have an account?',
                        h('a',{onclick:(e)=>{
                            e.preventDefault()
                            this.appContext.router.navigateTo('/register')

                        }},["Sign Up here"])
                       ])
                    ])
                ]),
            ])
        ])
    ])
},})

  