import createElement from "../framework/createElement.js";
import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";
import HomeTop from "../components/hometop.js";
import HomeDown from "../components/homedown.js";
import { diff , patch} from "../framework/diff.js";
import dispatch from "../framework/dispatch.js";

class HomePage
{
    constructor(props)
    {
        this.props = props;
        this.render();
    }

    render()
    {
        const newVdom = createElement('div', {id: 'global'}, createElement(Header, {}), 
                createElement('div', {className: 'content'}, 
                    createElement(Sidebar, {}),createElement('div', {className: 'home-content'},
                        createElement(HomeTop, {}),
                        createElement(HomeDown, {dispatch})
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
