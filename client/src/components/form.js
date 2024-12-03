import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString,RouterOutlet} from '../package/index.js'



    export const Form = defineComponent({
        state(){
            return {
                isLoading : true,
        }
        },

        render(){
            return h('div',{id:'global'},[
                h('header',{class:'container'},[
                    h('nav',{},[
                        h('a',{href:"#"},[
                            h('img',{src:'./images/logo.png',class:'logo'})
                        ])

                    ])
                ]),
                h('div',{class:'RegistrationForm'},[
                    h('div',{class:'formCard'},[
                        h('h1',{},['Complete Info']),
                        h('img',{src:'./images/accountUser.png',alt:'account user icon' }),
                        h('form',{},[
                            h('input',{type:'text' ,placeholder:'Username'}),
                            h('input',{type:'text' ,placeholder:'Gender'}),
                            h('input',{type:'text' ,placeholder:'Nationality'}),
                            h('input',{type:'text' ,placeholder:'Phone Number'}),
                            h('button',{type:'submit',class:'register-btn'},['Register'])
                        ])
                    ])
                ])
            ])
        }
    })