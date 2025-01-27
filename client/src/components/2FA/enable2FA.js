
import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'

export const EnableTwoFactor =  defineComponent({
    state(){
        return {
            isLoading : true,
    }
    },
    render()
    {
        return h('div',{},
            [
                // h("h1",{},"jsdkhjf"),
                h('img',{className:"qrCode",alt: '2FA qr code' }),
                h('p',{},['Scan the QR code with your authentication app.']),
                h('form',{className:'twoFactorForm'},[
                    h('input',{id:'code',type:"text",name:"code",placeholder:"Enter the 6-digit code"}),
                    h('br',{}),
                    h('input',{type:"submit",id:'active',value:"Active"})
                ])


        ])
            
    }
})



// createElement('div', {},
//     createElement('img', {className:"qrCode",src: `data:image/png;base64,${this.state.qrCodeUrl}`, alt: '2FA qr code' }),
//     createElement('p', {}, 'Scan the QR code with your authentication app.'),
//     createElement('form',{className:'twoFactorForm',onSubmit: this.handleSubmit},
//         createElement('input',{id:'code',type:"text",name:"code",placeholder:"Enter the 6-digit code"}),
//         createElement('br',{}),
//         createElement('input',{type:"submit",id:'active',value:"Active"})),
// ) 