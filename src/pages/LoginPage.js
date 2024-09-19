
import createElement from "../framework/createElement.js";
import createDOMElement from "../framework/createDOMElement.js";
import render from "../framework/render.js"
import Login from "../components/Login.js";


class LoginPage{
    constructor()
    {
        this.root = document.body;
        this.render()
        
    }
    render()
    {
        this.creatLoginPage();
    }
    
    creatLoginPage()
    {
        const vdom = createElement("div",{id:"global"},
            createElement(Login,{}));
        render(vdom,this.root)
    }

}
export default LoginPage