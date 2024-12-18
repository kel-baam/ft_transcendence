import{defineComponent,h} from '../../package/index.js'

export const RegisterForm = defineComponent({
    state(){
        return {
                isLoading : true,
    }
    },
    handelSubmit  : async (event)=>
        {
            event.preventDefault()      
            const form = new FormData(document.querySelector(".registerForm"))
            fetch('http://localhost:3000/auth/register',{
                method: 'POST' ,
                body:form,
                // headers: {
                //     'CSRF_COOKIE':csrfToken.csrf_token},
                credentials: 'include', 
            }).then((async (res)=>{
                if (!res.ok) {
                    const error = await res.json();
                Object.keys(error).forEach((field) => {
                const input = document.getElementById(field);
                console.log("input",input)
                if (input) {
                    input.style.borderColor = 'red';
                    input.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
                }
            });
            }
            }))
            .catch((error)=>{
               
            })
        },
    
    render()
    {
         return h('form',{class:'registerForm' , onsubmit:this.handelSubmit},[
            h('div',{class:'firstRow'},[
                h('input',{type:'text' ,id:'firstname',name:'firstname ',placeholder:'First Name'}),
                h('input',{type:'text' ,id:'lastname',name:'lastname',placeholder:'Last Name'}),

            ]),
            h('input',{class:'inputInfo',type:'text' ,id:'username',name:'username',placeholder:'Username'}),
            h('input',{class:'inputInfo',type:'email' ,id:'email',name:'email',placeholder:'Email'}),
            h('input',{class:'inputInfo',type:'password' ,id:'password',name:'password',placeholder:'Password'}),
            h('button',{class:'register-btn'},['Sign Up']),

        ])
    }
    })