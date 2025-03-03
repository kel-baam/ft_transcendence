import{ defineComponent, h} from '../package/index.js'
import {showErrorNotification} from '../package/utils.js'



export const Login = defineComponent({
    state(){
        return {
            errors :{}
    }
    },

    intraEvent()
    {
                window.location.href = `https://${window.env.IP}:3000/auth/intra/?type=${encodeURIComponent('login')}`
    },

    googleEvent(){
    
                    window.location.href = `https://${window.env.IP}:3000/auth/google/?type=${encodeURIComponent('login')}`
    },

    getErrorMessage(id){
        const error = this.state.errors[id];
        return error ? id : undefined;
    },
    
    async loginForm(event)
    {
        try{
            event.preventDefault()
            console.log("=>beforrrre over")
            
            const response = await fetch(`https://${window.env.IP}:3000/auth/login/`,{
                method:'POST',
                body:new FormData(document.querySelector(".loginForm")),
            })
            if(!response.ok)
            { 
                const errors = await response.json();
                showErrorNotification(Object.values(errors)[0])
                this.updateState({errors: errors });
            }
            else
            {
                const res = await response.json();
                if(res.message === "2fa active")
                    this.appContext.router.navigateTo('/2FA')
                else
                    this.appContext.router.navigateTo('/home')
            }

        }
        catch (e)
        {
            console.log("yeees")
        }
    
        // console.clear();  

    },
    
        // TO CHANGE
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
                        h('form',{class :'loginForm',  on :{submit: ( event) => this.loginForm(event)}},[
                            h('div',{class:'inputSec', id:this.getErrorMessage('username') || this.getErrorMessage('verification')},[

                                h('i',{class:'fa-solid fa-user'}),
                                h('input',{class:'input',type:'text',name:'username',placeholder:'Username...'}),
                            ]),
                            h('div',{class:'inputSec',id:this.getErrorMessage('password') || this.getErrorMessage('verification')},[

                                h('i',{class:'fa-solid fa-lock'}),
                                h('input',{class:'input',type:'password',name:'password',placeholder:'Password...'}),
                            ]),
                            h('div',{class:'resetPassword'},[
                                h('a',{onclick:(e)=>{
                                    e.preventDefault()
                                    this.appContext.router.navigateTo('/password/reset?type=reset')
        
                                }},['Forget Password']),
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

  