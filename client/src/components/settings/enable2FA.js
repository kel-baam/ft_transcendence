
import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'
import { customFetch } from '../../package/fetch.js'

export const EnableTwoFactor =  defineComponent({
    state(){
        return {
            isLoading : true,
            qrCode:{},
            error:{},
    }
    },
    onMounted(){

        customFetch('http://localhost:3000/auth/twoFactor/activate/').then(async (result)=>{

        const data = await result.json()
        if(!result.ok)
        {
            if(result.status == 401)
                this.appContext.router.navigateTo('/login')
        }
        else
            this.updateState({qrCode : data.qrImage})
        }
        )
    },
    enableTwoFactor(event)
    {
        event.preventDefault()    
        const form = document.querySelector(".twoFactorForm");
        customFetch('http://localhost:3000/auth/twoFactor/validateQrCode/',
        {
            method:'POST',
            body:new FormData(form)
        }).then(async(result)=>{
            if(!result.ok)
            {   
                const data = await result.json()
                if(result.status == 400)
                    this.updateState({error :  data})            
                else if(result.status == 401)
                    this.appContext.router.navigateTo('/login')
            }
            else
            {
                this.updateState({error :  {}})            
                this.emit('2faVerified')
            }
        })
    },
    getErrorMessage(id){
        const error = this.state.error[id];
        return error ? id : undefined;
    },
    render()
    {
        return h('div',{className:'twoFactor'},
            [
                h('p',{className:'title'},['Scan the QR code with your authentication app.']),
                h('div',{id:'qrCode'},[

                    h('img',{className:"qrCode",src:`data:image/png;base64,${this.state.qrCode}` ,alt: '2FA qr code' }),
                ]),
                h('form',{className:'twoFactorForm', on :{submit: ( event) => this.enableTwoFactor(event)}},[
                    h('input',{id:this.getErrorMessage('code'),type:"text",name:"code",placeholder:"Enter the 6-digit code"}),
                    h('br',{}),
                    h('input',{type:"submit",id:'active',value:"Active"})
                ])

        ])
            
    }
})

