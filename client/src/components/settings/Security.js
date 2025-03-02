import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString,RouterOutlet} from '../../package/index.js'
import { EnableTwoFactor } from './enable2FA.js'
import { customFetch } from '../../package/fetch.js'


export const Security = defineComponent(
    {
        state()
        {
            return {
                isQrCodeVisible : false,
                isEnabled : false,
                isLoading : true,


            }
        },
        disable2FA(event)
        {
            event.preventDefault()    
            customFetch(`https://${window.env.IP}:3000/auth/twoFactor/desactivate/`,{}).then(async(result)=>{
                if(!result.ok)
                {
                    if(result.status == 401)
                        this.appContext.router.navigateTo('/login')
                }
                // to check else
            })
        },
        onMounted()
        {
            customFetch(`https://${window.env.IP}:3000/auth/twoFactor/state/`,{}).then(async(result)=>{
                if(!result.ok)
                {
                    if(result.status == 401)
                        this.appContext.router.navigateTo('/login')
                }
                else
                {
                    this.updateState({isLoading : false})
                    const data = await result.json()
                    if(data.active2FA == true)
                        this.updateState({isQrCodeVisible : false, isEnabled : true, isLoading : false})
                }
                    
            })
        },
        render()
        {
            const formData = new FormData();
            const {isQrCodeVisible, isEnabled , isLoading} = this.state
            if (isLoading)
                return h('div', {class : 'security-settings-ctn'})
            return h('div', {class : 'security-settings-ctn'},[
                    h('div', {class : 'secure-auth-card'},!this.state.isQrCodeVisible ?  [
                        h('span', {style :{color : '#224A88', fontSize: '24px'}, 'data-translate' : 'two_factor_label'}, ['Two-factor authentication 2FA:']),
                        h('div', {style : {
                            color : '#224A88',
                            lineHeight: '2'
                            
                        }, 'data-translate' : 'security_message'}, [
                            'Enhance your security with Two-Factor Authentication (2FA).\
                            This robust security measure adds an extra layer of protection\
                            to your account by requiring two forms of verification before \
                            granting access.'
                        ]),
                        h('button', {style:{
                            'background-color': '#D44444',
                            color: '#FFEEBF',
                            width: '120px',
                            height: '40px',
                            'border-radius': '12px',
                            border: 'none'
                            },
                            on : {
                                click : (event) =>
                                {
                                    if (!isEnabled)
                                        this.updateState({isQrCodeVisible : true})
                                    else
                                    {
                                        this.disable2FA(event)
                                        this.updateState({isEnabled : false})
                                    }
                                }
                            },
                            'data-translate' : 'enable'
                        },   [!isEnabled ?  'Enable' : 'Disable'])
                    ] : [
                        h(EnableTwoFactor,{on : {
                            '2faVerified' : ()=>{
                                this.updateState({isQrCodeVisible : false, isEnabled : true})
                            }
                        }}), 
                        // h('button', {style:{
                        //     'background-color': '#D44444',
                        //     color: '#FFEEBF',
                        //     width: '120px',
                        //     height: '40px',
                        //     'border-radius': '12px',
                        //     border: 'none'
                        //     },
                        //     on : {
                        //         click : () =>
                        //         {
                        //             this.updateState({isQrCodeVisible : false, isEnabled : true})
                        //         }
                        //     }
                        // },   ['Verify'])
                    ]) , 
                    h('div', {class : 'auth-password-card'}, 
                        [

                        h('form', {
                            on : {
                                submit : (event)=>
                                {
                                    // console.log(">>>>>>>>>>>>>>>>>>> here the event click : ")
                                    event.preventDefault()
                                                             
                                for (let [key, value] of formData.entries()) {
                                    // console.log(`${key}:`, value);
                                }
                                customFetch(`https://${window.env.IP}:3000/api/user/`, {
                                    method : 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json', // Explicitly set content type
                                      },
                                      body : JSON.stringify({
                                          Current_password : formData.get('Current_password'),
                                          New_password : formData.get('New_password'),
                                          Confirm_password: formData.get('Confirm_password')
                                    }),
                                }
                                )
                                .then(result =>{
                                    if (!result.status == 401)
                                        this.appContext.router.navigateTo('/login')
                                    if (!result.ok) {
                                        return result.json().then(errs => {
                                            document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
                                            for (const [field, messages] of Object.entries(errs)) {
                                                // console.log(">>>>>>>>>>>>>>>>>> here  : ", `${field}_error`)
                                                const errorElement = document.getElementById(`${field}_error`);
                                                if (errorElement) {
                                                    // console.log(">>>>>>>>>>>>>>> here the element", errorElement)
                                                    errorElement.style.color = '#D44444'
                                                    errorElement.textContent = '* ' + messages;
                                                    // console.log(">>>>>>>>>>>>> errorElement.textContent : ", errorElement.textContent)
                                                }
                                            }
                                            throw new Error(`HTTP Error: ${result.status}`); // To exit the chain
                                        });
                                    }
                                    return result.json()
                                })
                                .then(res =>{
                                    // console.log("res is okey")
                                    // console.log(">>>>>>>>>>>>>>>>>>>>> res here : ", res)
                                    document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
                                    fetch(`https://${window.env.IP}:3000/auth/logout/`,{
                                        method:'POST',
                                        credentials: 'include',
                                    }).then(async (res)=>{
                                        if(res.ok)
                                        {
                                            this.appContext.router.navigateTo('/login')
                                        }
                                    })
                                })
                                .catch(error => {
                                        // console.log('>>>>>>>>>>>>>>>> error : ', error)
                                        // if(error == 401)
                                        //     this.appContext.router.navigateTo('/login')
                                })
                            }
                            }
                        }, [
                            h('span', {style :{color : '#224A88', fontSize: '24px'}, 'data-translate' : 'password_title'}, ['Password:']),
                            h('small', {class : 'error', id : "Current_password_error"}),
                            h('input', { type: 'password', placeholder: 'Current password', name : 'Current_password',
                                on : {
                                    change : (event) =>formData.set(event.target.name, event.target.value)
                                },
                                'data-translate' :'current_password_placeholder'
    
                            }),
                            h('small', {class : 'error', id : "New_password_error"}),
                            h('input', { type: 'password', placeholder: 'New password' , name :'New_password',
                                on : {
                                    change : (event)=>formData.set(event.target.name, event.target.value)
                                },
                                'data-translate' :"new_password_placeholder"
                             }),
                             h('small', {class : 'error', id : "Confirm_password_error"}),
                            h('input', { type: 'password', placeholder: 'Confirm password', name : 'Confirm_password',
                                on : {
                                    change : (event) =>formData.set(event.target.name, event.target.value)
                                },
                                'data-translate' : "confirm_password_placeholder"
                            }),
                            h('button', {style:{
                                'background-color': '#D44444',
                                color: '#FFEEBF',
                                width: '120px',
                                height: '40px',
                                'border-radius': '12px',
                                border: 'none'
                            },
                            'data-translate' : "change_button"
                        }, ['Change'])
                        ])
                       

                    ])
                ])
        }
    }
)