import createElement from "../framework/createElement.js";
import createDOMElement from "../framework/createDOMElement.js";
import render from "../framework/render.js";
import "./trainingboot.js";
import "./tournamentsection.js";
import "./playervsplayersection.js";
import TrainingBoot from "./trainingboot.js";
import TournamentSection from "./tournamentsection.js";
import PlayerVsPlayer from "./playervsplayersection.js";
import dispatch from "../framework/dispatch.js";

class HomeDown {

    constructor(props) {
        this.props = props;
        this.render();
    }

    render() {
        const virtualDom = createElement('div', { className: 'home-down' }, 
            createElement(TrainingBoot, {}),
            createElement(TournamentSection, null),
            createElement(PlayerVsPlayer, null)
        );

        return virtualDom;
    }
}

export default HomeDown;
