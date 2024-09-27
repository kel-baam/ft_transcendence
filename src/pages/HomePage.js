import createElement from "../framework/createElement.js";
import createDOMElement from "../framework/createDOMElement.js"; 
import render from "../framework/render.js";
import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";
import HomeTop from "../components/hometop.js";
import HomeDown from "../components/homedown.js";
import { diff , patch} from "../framework/diff.js";


 
class HomePage
{
    constructor()
    {
        
        this.render();
    }

    render()
    {
        const newVdom = createElement('div', {id: 'global'}, createElement(Header, {}), 
                createElement('div', {className: 'content'}, 
                    createElement(Sidebar, {}),createElement('div', {className: 'home-content'},
                        createElement(HomeTop, {}),
                        createElement(HomeDown, {})
                    ), createElement('div', {className: 'friends'})
                ));

        const container = document.body;
        // document.body.innerHTML = ''
        // render(newVdom, container);

        const patches = diff(container.__vdom, newVdom, container);
        patch(document.body, patches);
        container.__vdom = newVdom;
    }
}

export default HomePage
