import createElement from "../framework/createElement.js";
import createDOMElement from "../framework/createDOMElement.js";
import render from "../framework/render.js"
import Login from "../components/Login.js";
import { diff, patch } from "../framework/diff.js";


class LoginPage{
    constructor()
    {
        this.root = document.body;
        this.render()
        
    }
    render()
    {
        const vdom = createElement("div",{id:"global"},
            createElement(Login,{}));

        const container = document.body;
        const patches = diff(container.__vdom, vdom, container);
        patch(document.body, patches);
        container.__vdom = vdom;
    }

}
export default LoginPage