import createElement from "../framework/createElement.js";
import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";
import { diff, patch } from "../framework/diff.js";
import { handleRouting } from "../framework/routing.js";

class Online_tournament {
    constructor(props) {
        this.props = props;
        this.render();
    }

    async fetchCsrfToken() {
        const response = await fetch('https://petrifying-hex-vw4x4vg966g3695j-8000.app.github.dev/api/csrf-token/');
        const data = await response.json();
        return data.csrfToken;
    }

    render() {
        const newVdom = createElement('div', {id: 'global'}, createElement(Header, {}), 
        createElement('div', {className: 'content'}, 
            createElement(Sidebar, {}),createElement('div', { className: 'online-tournament' },
                createElement('div', { className: 'availableTournament' },
                    createElement('div', { className: 'title' },
                        createElement('h1', {}, 'Available tournaments')
                    ),
                    createElement('div', { className: 'tournaments' },
                            createElement('div', { className: 'available' },
                                createElement('img', { src: './images/niboukha.png' }),
                                createElement('a', { href: '#' }, 'Victory Arena'),
                                createElement('i', { className: 'fa-solid fa-user-plus icon' })
                            ))
                ),
                createElement('div', { className: 'joinedTournament' },
                    createElement('div', { className: 'title' },
                        createElement('h1', {}, 'Joined Tournaments')
                    ),
                    createElement('div', { className: 'tournaments' },createElement('div', { className: 'available' },
                                createElement('img', { src: './images/niboukha.png' }),
                                createElement('a', { href: '#' }, 'Battle of the Best')
                            )
                    )
                ),
                createElement('div', { className: 'createTournament' },
                    createElement('div', { className: 'title' },
                        createElement('h1', {}, 'Create one')
                    ),
                    createElement('form', {},
                        createElement('div', { className: 'image' },
                            createElement('img', { src: './images/niboukha.png' }),
                            createElement('div', { className: 'edit_icon' },
                                createElement('input', { type: 'file', name: 'player1_image', accept: 'image/*', style: 'display: none;' }),
                                createElement('i', { className: 'fas fa-edit icon' })
                            )
                        ),
                        createElement('div', { className: 'createInput' },
                            createElement('label', {}, 'Tournament name:'),createElement('br'),
                            createElement('input', { type: 'text', name: 'player1', placeholder: 'Enter Tournament name...' }),createElement('br'),
                            createElement('label', {}, 'Nickname:'),createElement('br'),
                            createElement('input', { type: 'text', name: 'player1', placeholder: 'Enter Nickname...' }),createElement('br'),
                            createElement('label', {}, 'Add Players:'),createElement('br'),
                            createElement('input', { type: 'text', name: 'player1', placeholder: 'Enter Add Players...' }),createElement('br')
                        ),
                        createElement('button', {}, 'Create')
                    )
                )
            ), createElement('div', {className: 'friends'})
        ));

        const container = document.body;
        const patches = diff(container.__vdom, newVdom, container);
        patch(document.body, patches);
        container.__vdom = newVdom;
    }
}

export default Online_tournament;
