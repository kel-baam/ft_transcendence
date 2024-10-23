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

    handleButtonClick = () => {
        const link = event.target.closest('a');
        
        if (link) {
            event.preventDefault();
            const path = link.getAttribute('href');
            handleRouting(path);
            window.history.pushState(null, '', path);
        }
    }

    render()
    {
        const newVdom = createElement('div', {id: 'global'}, createElement(Header, {}), 
        createElement('div', {className: 'content'}, 
            createElement(Sidebar, {}), createElement('div', { className: 'tournament-content' },
                createElement('div', { className: 'game-title' },
                    createElement('h1', {}, "How Do You Prefer to Game?")
                ),
                createElement('div', { className: 'btns-local-online' },
                    createElement('div', { className: 'online' },
                        createElement('a', { href: 'your-link-here'},
                        createElement('button', { type: 'button', className: 'btn' }, 'Online')
                    )),
                    createElement('div', { className: 'or' },
                        createElement('h2', {}, 'Or')
                    ),
                    createElement('div', { className: 'local' },
                        createElement('a', { href: '/Local_tournament_form'},
                        createElement('button', { type: 'button', className: 'btn', onclick:this.handleButtonClick}, 'Local')
                    ))
                )
            ),createElement('div', {className: 'friends'})));
        const container = document.body;

        const patches = diff(container.__vdom, newVdom, container);
        patch(document.body, patches);
        container.__vdom = newVdom;
    }
}

export default TournamentPage;

