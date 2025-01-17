import{defineComponent,h} from '../package/index.js'

import { showErrorNotification } from '../package/utils.js'

import { showSuccessNotification } from '../package/utils.js'

export const ResetPassword = defineComponent({
    state(){
        return {
            isLoading : true,
            errors:{}

    }
    },
    async changePassword(event)
    {
        event.preventDefault()
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const data = {
            uid: this.appContext.router.query.uid,
            token: this.appContext.router.query.token,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
        };
        fetch('http://localhost:3000/auth/password/reset/confirm/',{
            method:'POST',
            body: JSON.stringify(data),
            
        }).then(async (res)=>{
            if(!res.ok)
            {
                const  errors = await res.json()
                console.log("eeee",errors)
                showErrorNotification(errors['password'])
            }
            else
            {
                showSuccessNotification("Your password has been successfully reset! You can now log in with your new password.")
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';
                this.updateState({errors: '' });
            }
        }
        )
    },
    async sendEmail(event)
    {
        event.preventDefault()
        fetch('http://localhost:3000/auth/password/reset/',{
            method:'POST',
            body:new FormData(document.querySelector(".formSendEmail")),
        }).then(async (res)=>{
            if(!res.ok)
            {
                const error = await res.json();
                showErrorNotification(error['email'])
                this.updateState({errors: error });
            }
            else
            {
                const message = 'A verification email has been sent to your inbox. Please check your email and follow the instructions to verify your account.';
                showSuccessNotification(message)
                document.querySelector('.email').value = '';
                this.updateState({errors:""});
            }
        }
        )
    },
    getErrorMessage(id){
        const error = this.state.errors[id];
        return error ? id : undefined;
    },
    render(){

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
                                        h('input',{class:'email',type:'text',id:this.getErrorMessage('email') ,name:'email',placeholder:'Enter your Email'}),
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
                                    h('input',{class:'input',type:'password',id:'newPassword', name:'new-password',placeholder:'New password'}),
                                    h('input',{class:'input',type:'password',id:'confirmPassword', name:'confirm-password',placeholder:'Confirm password'}),
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