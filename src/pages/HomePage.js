import createElement from "../framework/createElement.js";
import createDOMElement from "../framework/createDOMElement.js";
import render from "../framework/render.js";
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
import landingPageHeader from "../components/landingPageheader.js";
import aboutUs from "../components/aboutUs.js";
import Team from "../components/teamSection.js";
import Footer from "../components/footer.js";
import leaderboard_main from "../components/leaderboard_main.js";


 
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
        document.body.innerHTML = ''
        render(virtualDOM, container);
        container.__vdom = virtualDOM;

        const newVdom = createElement("div",{id:"global"}, createElement(Header, {}),
            createElement("div",{className:"content"},
                createElement(Sidebar, {}), createElement(leaderboard_main,{})
                ,createElement('div', {className: 'friends'})));

        const patches = diff(container.__vdom, newVdom, container);
        console.log("----> patches : ", patches)
        patch(document.body, patches);
    }
}

export default HomePage
