import{defineComponent, h} from '../../package/index.js'
import { customFetch } from '../../package/fetch.js'
import { showErrorNotification } from '../../package/utils.js'

// TO CHANGE
export const TwoFactor =  defineComponent({
    state(){
        return {
            isLoading : true,
    }
    },
    getErrorMessage(id){
        const error = this.state.errors[id];
        return error ? id : undefined;
    },
    handleSubmit(event)
    {
        event.preventDefault()    
                
        customFetch(`https://${window.env.IP}:3000/auth/twoFactor/verify/`,
        {
            method:'POST',
            body:new FormData(document.querySelector(".twoFactorForm")),  
        }).then(async(result)=>{
            if(!result.ok)
            {
                if(result.status == 401)
                    this.appContext.router.navigateTo('/login')
                else{

                    const error = await result.json()
                    showErrorNotification(Object.values(error)[0])
                }
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
                            h('input',{id:'input',type:"password",name:"code",placeholder:"Enter the 6-digit code"}),
                            h('br',{}),
                            h('input',{type:"submit",id:"submit",value:"submit"})
                        ])
                    ])
                ])
            ])
        ])
    }
})