import{defineComponent,h} from '../../package/index.js'
import { showSuccessNotification } from '../../package/utils.js'
export const RegisterForm = defineComponent({
    state(){
        return {
                isLoading : true,
                errors:{}
    }
    },
    getErrorMessage(id){
            const error = this.state.errors[id];
            return error ? id : undefined;
    },
    async handelSubmit(event)
    {
        event.preventDefault()      
        const form = new FormData(document.querySelector(".registerForm"))
        fetch('http://localhost:3000/auth/register/',{
            method: 'POST' ,
            body:form,
            credentials: 'include', 
        }).then((async (res)=>{
            if (!res.ok) {
                const errors = await res.json();
                this.updateState({errors:errors})
            }
            else
            {
                const inputFields= document.querySelectorAll('.input');
                inputFields.forEach(input => {
                    input.value='';
                    });
                showSuccessNotification("Almost there! 🎉\n\nPlease check your inbox to verify your email.")  
                this.updateState({errors: ''});
            }
        }))
    },

    render()
    {
        return h('form',{class:'registerForm' , on :{submit: ( event) => this.handelSubmit(event)}},[
            h('div',{class:'firstRow'},[
                h('input',{class:'input',type:'text' ,id:this.getErrorMessage('first_name'),name:'firstname ',placeholder:'First Name'}),
                h('input',{class:'input', type:'text' ,id:this.getErrorMessage('last_name'),name:'lastname',placeholder:'Last Name'}),
            ]),
            h('input',{class:'inputInfo input',type:'text' ,id:this.getErrorMessage('username'),name:'username',placeholder:'Username'}),
            h('input',{class:'inputInfo input',type:'text' ,id:this.getErrorMessage('email'),name:'email',placeholder:'Email'}),
            h('input',{class:'inputInfo input',type:'password' ,id:this.getErrorMessage('password'),name:'password',placeholder:'Password'}),
            h('button',{class:'register-btn'},['Sign Up']),

        ])
    }
    })