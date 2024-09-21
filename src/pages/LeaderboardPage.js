import createElement from "../framework/createElement.js";
import createDOMElement from "../framework/createDOMElement.js";
import render from "../framework/render.js"

import { diff , patch} from "../framework/diff.js";
import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";
import leaderboard_main from "../components/leaderboard_main.js";

class LeaderboardPage {

    constructor()
    {
        this.root = document.body;
        this.render()
    }

    render()
    {
        const vdom= createElement("div", {id: "global"},
            createElement(Header, {}),
            createElement("div", {className: "content"},
            createElement(Sidebar, {}),
            createElement(leaderboard_main, {})
        ));

        const container = document.body;
        const patches = diff(container.__vdom, vdom, container);
        patch(document.body, patches);
        container.__vdom = vdom;
    }

}

export default LeaderboardPage
