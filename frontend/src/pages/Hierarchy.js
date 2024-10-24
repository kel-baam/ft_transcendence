import createElement from "../framework/createElement.js";
import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";
import { diff, patch } from "../framework/diff.js";

class Hierarchy {
    constructor(props) {
        this.props = props;
        this.render();
    }

    render() {
        const newVdom = createElement(
            'div',
            { id: 'global' },
            createElement(Header, {}),
            createElement('div', { className: 'content' },
                createElement(Sidebar, {}),
                createElement('div', { className: 'hierarchy-global-content' }, 
                    createElement('div', { className: 'title' }, 
                        createElement('h1', {}, 'Tournament in Progress')
                    ),
                    createElement('div', { className: 'rounds' },
                        createElement('div', { className: 'round1' },
                            createElement('div', { className: 'match1' },
                                createElement('div', { className: 'player1' },
                                    createElement('img', { src: './images/kel-baam.png' }),
                                    createElement('h2', {}, 'username')
                                ),
                                createElement('div', { className: 'vs' },
                                    createElement('img', { src: './images/vs (2).png' })
                                ),
                                createElement('div', { className: 'player2' },
                                    createElement('img', { src: './images/shicham.png' }),
                                    createElement('h2', {}, 'username')
                                )
                            ),
                            createElement('div', { className: 'match2' },
                                createElement('div', { className: 'player1' },
                                    createElement('img', { src: './images/niboukha.png' }),
                                    createElement('h2', {}, 'username')
                                ),
                                createElement('div', { className: 'vs' },
                                    createElement('img', { src: './images/vs (2).png' })
                                ),
                                createElement('div', { className: 'player2' },
                                    createElement('img', { src: './images/kjarmoum.png' }),
                                    createElement('h2', {}, 'username')
                                )
                            )
                        ),
                        createElement('div', { className: 'round2' },
                            createElement('div', { className: 'player1' },
                                createElement('img', { src: './images/kel-baam.png' }),
                                createElement('h2', {}, 'username')
                            ),
                            createElement('div', { className: 'vs' },
                                createElement('img', { src: './images/vs (2).png' })
                            ),
                            createElement('div', { className: 'player2' },
                                createElement('img', { src: './images/kjarmoum.png' }),
                                createElement('h2', {}, 'username')
                            )
                        ),
                        createElement('div', { className: 'round3' },
                            createElement('img', { src: './images/kel-baam.png' }),
                            createElement('h2', {}, 'username')
                        ),
                        createElement('div', { className: 'trophy' },
                            createElement('img', { src: './images/gold-cup-removebg-preview.png' })
                        )
                    )
                ),
                createElement('div', { className: 'friends' })
            )
        );

        const container = document.body;

        if (!container.__vdom) {
            container.__vdom = null;
        }

        const patches = diff(container.__vdom, newVdom, container);
        patch(document.body, patches);
        container.__vdom = newVdom;

    }
}

export default Hierarchy;
