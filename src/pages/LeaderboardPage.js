import createElement from "../framework/createElement.js";
import createDOMElement from "../framework/createDOMElement.js";
import render from "../framework/render.js"


import header from "../components/header.js";
import sidebar from "../components/sidebar.js";

import leaderboard_main from "../components/leaderboard_main.js";

class leaderboardPage {

    constructor()
    {
        this.root = document.body;
        this.render()
    }

    render()
    {
       this.leaderboard()
    }

    leaderboard()
    {
        const vdom= createElement("div",{id:"global"},
            createElement(header, {}),
            createElement("div",{className:"content"},
            createElement(sidebar, {}),
            createElement("div",{id:"global-content"},
            createElement(leaderboard_main,{})
        )))
        render(vdom,this.root)
    }
}

export default leaderboardPage