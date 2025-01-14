import { customFetch } from '../../package/fetch.js'
import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString,RouterOutlet} from '../../package/index.js'
import { EnableTwoFactor } from './enable2FA.js'

export const SecuritySettings = defineComponent(
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
            customFetch('http://localhost:3000/auth/twoFactor/desactivate/',{}).then(async(result)=>{
                if(!result.ok)
                {
                    if(result.status = 401)
                        this.appContext.router.navigateTo('/login')
                }
                // to check else
            })
        },
        onMounted()
        {
            customFetch("http://localhost:3000/auth/twoFactor/state/",{}).then(async(result)=>{
                if(!result.ok)
                {
                    const data = await result.json()
                    if(data.status = 401)
                        this.appContext.router.navigateTo('/login')
                }
                else
                {
                    const data = await result.json()
                    if(data.active2FA == true)
                        this.updateState({isQrCodeVisible : false, isEnabled : true, isLoading : false})
                }
                    
            })
        },
        render()
        {
            const {isQrCodeVisible, isEnabled , isLoading} = this.state
            if (isLoading)
               return h('div', {class : 'security-settings-ctn'},["is loading .........."])
            return h('div', {class : 'security-settings-ctn'},[
                    h('div', {class : 'secure-auth-card'},!isQrCodeVisible ?  [
                        h('span', {style :{color : '#224A88', fontSize: '24px'}}, ['Two-factor authentication 2FA:']),
                        h('div', {style : {
                            color : '#224A88',
                            lineHeight: '2',
                        }}, [
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
                            }
                        },   [!isEnabled ?  'Enable' : 'Disable'])
                    ] : [
                        h(EnableTwoFactor,{on : {
                            '2faVerified' : ()=>{
                                this.updateState({isQrCodeVisible : false, isEnabled : true})
                            }
                        }}), 
                    ]) , 
                    h('div', {class : 'auth-password-card'}, [
                        h('span', {style :{color : '#224A88', fontSize: '24px'}}, ['Password:']),
                        h('input', { type: 'password', placeholder: 'Current password',}),
                        h('input', { type: 'password', placeholder: 'New password' }),
                        h('input', { type: 'password', placeholder: 'Confirm password' }),
                        h('button', {style:{
                            'background-color': '#D44444',
                            color: '#FFEEBF',
                            width: '120px',
                            height: '40px',
                            'border-radius': '12px',
                            border: 'none'
                        }}, ['Change'])
                    ])])
        }
    }
)