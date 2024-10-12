import createElement from "../framework/createElement.js";
import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";
import HomeTop from "../components/hometop.js";
import HomeDown from "../components/homedown.js";
import { diff , patch} from "../framework/diff.js";
import dispatch from "../framework/dispatch.js";

class Local_tournament_form
{
    constructor(props)
    {
        this.props = props;
        this.render();
    }

    render()
    {
        const newVdom = createElement('div', { id: 'global' }, 
            createElement(Header, {}), 
            createElement('div', { className: 'content' }, 
                createElement(Sidebar, {}), 
                createElement('div', { className: 'tournament-form' },
                    createElement('div', { className: 'game-title' },
                        createElement('h1', {}, "Create Your Local Ping Pong Tournament")
                    ),
                    createElement('div', { className: 'form' },
                        createElement('div', { className: 'tournament-name' },
                            createElement('label', { htmlFor: 'fname' }, 'Tournament Name:'),
                            createElement('input', { type: 'text', id: 'fname', name: 'fname', value: 'tournament' })
                        ),
                        createElement('div', { className: 'players-name' },
                            createElement('label', { htmlFor: 'players' }, 'Player Names:'),
                            createElement('input', { type: 'text', name: 'player1', value: 'player1', className: 'player1' }),
                            createElement('input', { type: 'text', name: 'player2', value: 'player2', className: 'player2' }),
                            createElement('input', { type: 'text', name: 'player3', value: 'player3', className: 'player3' }),
                            createElement('input', { type: 'text', name: 'player4', value: 'player4', className: 'player4' })
                        )
                    ),
                    createElement('div', { className: 'submit' },
                        createElement('button', { type: 'button' }, 'SUBMIT')
                    )
                ),
                createElement('div', { className: 'friends' })
            )
        );
        

        const container = document.body;

        const patches = diff(container.__vdom, newVdom, container);
        patch(document.body, patches);
        container.__vdom = newVdom;
    }                    
}

export default Local_tournament_form
