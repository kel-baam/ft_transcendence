import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString,RouterOutlet} from '../package/index.js'



export const TwoFactor =  defineComponent({
    state(){
        return {
            isLoading : true,
    }
    },
    render()
    {
        return h('div',{id:"global"},[
            h('div',{id:"content"},[
                h('div',{className:"twoFactor"},[
                    h('h1',{className:"title"},["Two-Factor Login"]),
                    h('div',{className:"inputCode"},[
                        h('form',{className:"twoFactorForm",onSubmit: this.handleSubmit},[
                            h('input',{id:"code",type:"text",name:"code",placeholder:"Enter the 6-digit code"}),
                            h('br',{}),
                            h('input',{type:"submit",id:"submit",value:"submit"})
                        ])
                    ])
                ])
            ])
        ])
    }
})




