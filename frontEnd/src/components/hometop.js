import createElement from "../framework/createElement.js";
import createDOMElement from "../framework/createDOMElement.js";
import LeaderboardHome from "./leaderboardHome.js";
import WelcomingSection from "./welcomingsection.js";

class HomeTop {
    constructor(props) {
        this.props = props;
        this.render();
    }

    render() {
        const virtualDom = createElement('div', { className: 'home-top' }, 
            createElement(LeaderboardHome, {}),
            createElement(WelcomingSection, {})
        );

        return virtualDom;
    }
}

export default HomeTop;
