import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString,RouterOutlet} from '../../package/index.js'


    export const InformationsForm = defineComponent({
        state(){
            return {
                isLoading : true,
        }
        },
        
        async handelSubmit(event)
        {
            event.preventDefault()
            const csrf = await fetch('http://localhost:3000/csrf')
            const csrfToken = await csrf.json()
            console.log("thiiis",csrfToken.csrf_token)
            fetch('http://localhost:3000/auth/register',{
                method: 'POST' ,
                body:new FormData(document.querySelector(".infoForm")),
                // headers: {
                //     'CSRF_COOKIE':csrfToken.csrf_token},
                credentials: 'include', 
            }).then(((res)=>{
              
                console.log("JUUUST TEST OF SUBMIIIT ",res)
            })).catch({
                // console.log("errrrrrrrrrrrrrrrrrrrrrrrrr")
            })
        },
     
        render(){
            return h('div',{class:'RegistrationForm'},[
                    h('div',{class:'formCard'},[
                        h('h1',{},['Complete Info']),
                        h('img',{src:'./images/accountUser.png',alt:'account user icon' }),
                        h('form',{class :'infoForm',onsubmit:this.handelSubmit},[
                            h('input',{type:'text' ,required:true,name:'username',placeholder:'Username'}),
                            h('input',{type:'text' ,name:'gender',placeholder:'Gender'}),
                            h('input',{type:'text' ,name:'nationality', placeholder:'Nationality'}),
                            h('input',{type:'text' ,name:'number',placeholder:'Phone Number'}),
                            h('button',{type:'submit',class:'register-btn'},['Register'])
                        ])
                    ])
                ])
           
        }
    })