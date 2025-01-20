import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString,RouterOutlet} from '../../package/index.js'

export const SecuritySettings = defineComponent(
    {
        state()
        {
            return {
                isQrCodeVisible : false,
                isEnabled : false

            }
        },
        render()
        {
            return h('div', {class : 'security-settings-ctn'},[
                    h('div', {class : 'secure-auth-card'},!this.state.isQrCodeVisible ?  [
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
                                click : () =>
                                {
                                    if (!this.state.isEnabled)
                                        this.updateState({isQrCodeVisible : true})
                                    else
                                        this.updateState({isEnabled : false})
                                }
                            }
                        },   [!this.state.isEnabled ?  'Enable' : 'Disable'])
                    ] : [h('div', {}, ['qr two factor', 
                        h('button', {style:{
                            'background-color': '#D44444',
                            color: '#FFEEBF',
                            width: '120px',
                            height: '40px',
                            'border-radius': '12px',
                            border: 'none'
                            },
                            on : {
                                click : () =>
                                {
                                    this.updateState({isQrCodeVisible : false, isEnabled : true})
                                }
                            }
                        },   ['Verify'])
                    ])]) , 
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