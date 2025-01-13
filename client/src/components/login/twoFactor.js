import{defineComponent, h} from '../../package/index.js'
import { customFetch } from '../../package/fetch.js'


export const TwoFactor =  defineComponent({
    state(){
        return {
            isLoading : true,
    }
    },
    handleSubmit(event)
    {
        event.preventDefault()    
                
        customFetch("http://localhost:3000/auth/twoFactor/verify/",
        {
            method:'POST',
            body:new FormData(document.querySelector(".twoFactorForm")),  
        }).then((result)=>{
            if(!result.ok)
            {
                if(result.status == 401)
                    this.appContext.router.navigateTo('/login')
                
            }
            else
                this.appContext.router.navigateTo('/home')
        })
    },
    render()
    {
        return h('div',{id:"global"},[
            h('div',{id:"twoFactor"},[
                h('div',{className:"twoFactorCard"},[
                    h('h1',{className:"title"},["Two-Factor Login"]),
                    h('div',{className:"inputCode"},[
                        h('form',{className:"twoFactorForm",on:{submit:(event)=> this.handleSubmit(event)}},[
                            h('input',{id:'input',type:"text",name:"code",placeholder:"Enter the 6-digit code"}),
                            h('br',{}),
                            h('input',{type:"submit",id:"submit",value:"submit"})
                        ])
                    ])
                ])
            ])
        ])
    }
})


