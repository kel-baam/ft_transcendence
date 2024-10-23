import createElement from "../framework/createElement.js";
import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";
import { diff , patch} from "../framework/diff.js";
import { handleRouting } from "../framework/routing.js";

class TournamentPage
{
    constructor(props) {
        this.props = props;
        this.render();
    }

    render()
    {
        const newVdom = createElement('div', {id: 'global'}, createElement(Header, {}), 
        createElement('div', {className: 'content'}, 
            createElement(Sidebar, {}),createElement('div', { className: 'hierarchy-content' },
                createElement('div', {},
                    createElement('label', { htmlFor: 'numPlayers' }, 'Enter number of players:'),
                    createElement('input', { type: 'number', id: 'numPlayers', min: 2 }),
                    createElement('button', { id: 'generateBracket' }, 'Generate Bracket')
                ),
                createElement('h1', {}, 'Tournament in Progress'),
                createElement('div', { id: 'bracket' })
            ),createElement('div', {className: 'friends'})));
        const container = document.body;

        const patches = diff(container.__vdom, newVdom, container);
        patch(document.body, patches);
        container.__vdom = newVdom;
    }
}

export default TournamentPage;

