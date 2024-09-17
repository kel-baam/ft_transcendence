import createElement from "../framework/createElement.js";
import createDOMElement from "../framework/createDOMElement.js";
import render from "../framework/render.js";
import  "../components/header.js";
import "../components/sidebar.js"
import "../components/homedown.js"
import "../components/hometop.js"
import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";
import HomeTop from "../components/hometop.js";
import HomeDown from "../components/homedown.js";
 
class HomePage
{
    constructor(props)
    {
        this.props = props;
        this.render();
    }

    render()
    {
        const virtualDOM = createElement('div', {id: 'global'}, createElement(Header, {}), 
                            createElement('div', {className: 'content'}, 
                                createElement(Sidebar, {}),createElement('div', {className: 'home-content'},
                                    createElement(HomeTop, {}),
                                    createElement(HomeDown, {})
                                ), createElement('div', {className: 'friends'})
                            ));
        const container = document.body;

        

        render(virtualDOM, container);
    }
}

export default HomePage
