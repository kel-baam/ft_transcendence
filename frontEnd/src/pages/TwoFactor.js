import createElement from "../framework/createElement.js";
import { diff , patch} from "../framework/diff.js";
import  { customFetch } from "../framework/fetch.js";


class TwoFactor{

    constructor()
    {
        this.root = document.body;
        this.state = {codeError: true};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.render();
    }

    getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }

        return cookieValue;
    }
    
    // useState(value,key)
    // {
    //     this.state.key = value;
    //     this.render();
    // }
    async handleSubmit(event) {
        event.preventDefault(); 
        try
        { 
            const csrf = await customFetch("https://legendary-bassoon-jpvw6597q7jcq7rp-8000.app.github.dev/get-csrf-token/",{})
            console.log(csrf)
            const response = await fetch("https://legendary-bassoon-jpvw6597q7jcq7rp-8000.app.github.dev/authentication/twoFactor/verify/",
            {
                method:'POST',
                body:new FormData(document.querySelector(".twoFactorForm")),
                headers: {
                    'X-CSRFToken':csrf.csrf_token,
                },
                credentials: 'include', 
            });
            console.log("test",response)
            if (response.ok) {
                window.location.href = "https://legendary-bassoon-jpvw6597q7jcq7rp-80.app.github.dev/home";
            } else {
                this.state.codeError = false;
                this.render();
                setTimeout(() => {
                    this.closeNotification();
                  }, 2000);
                // window.location.href = "https://legendary-bassoon-jpvw6597q7jcq7rp-80.app.github.dev/twoFactor";
            }

        }catch(error){
            console.log("eeeeeeeeeeeeeeror",error)
        }
    }
    
    closeNotification()
    {
        this.state.codeError = true;
        this.render();
    }
    render()
    {
        const vdom = createElement("div",{id:"global"},createElement("div",{id:"content"},
            createElement("div",{className:"twoFactor"},
            (!this.state.codeError) ?
            createElement('div',{className:'notification-container'},
                            createElement('div',{className:'error-notification'},
                            createElement('span',{className:'error-message'},"Invalid code. Please try again.")
                            )):
                createElement('undefiend',{}),
                createElement("h1",{className:"title"},"Two-Factor Login"),
                createElement("div",{className:"inputCode"},
                    createElement("form",{className:"twoFactorForm",onSubmit: this.handleSubmit},
                        createElement("input",{id:"code",type:"text",name:"code",placeholder:"Enter the 6-digit code"}),
                    createElement("br",{}),
                createElement("input",{type:"submit",id:"submit",value:"submit"}))
                )
            )
        ))
        // this.state.codeError = true;
        const container = document.body;
        const patches = diff(container.__vdom, vdom, container, 0);
        patch(document.body, patches);
        container.__vdom = vdom;
     
    }
}

export default TwoFactor