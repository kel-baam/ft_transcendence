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
import { diff , patch} from "../framework/diff.js";
import UserProfile from "../components/UserProfile.js";
import WinningRate from "../components/WiningRate.js";
import Achievement from "../components/Achievement.js";
import Friends from "../components/FreindsReqPending.js";
import MatchHistory from "../components/MatchHistory.js";

 
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
                                        createElement('div', {}, "heeeeeeee")
                                )));

        const container = document.body;
        render(virtualDOM, container);
        container.__vdom = virtualDOM;

        const newVdom = createElement('div', {id: 'global'}, createElement(Header, {}), 
                            createElement('div', {className: 'content'}, 
                                createElement(Sidebar, {}),createElement('div', {className: 'home-content'}, 
                                    createElement('h1', {}, "nisrinnnnnnnnnnnnnnn"))));

        const patches = diff(container.__vdom, newVdom, container);
        patch(patches);
    }
}

export default HomePage
