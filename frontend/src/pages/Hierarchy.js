import createElement from "../framework/createElement.js";
import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";
import { diff, patch } from "../framework/diff.js";

class Hierarchy {
    constructor(props) {
        this.props = [];
        this.fetchData();
    }
    
    fetchPlayerDetails = async (matchIds) => {
        try {
            const response = await fetch('https://petrifying-hex-vw4x4vg966g3695j-8000.app.github.dev/api/players-by-match-id/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ match_id: matchIds }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch player details');
            }
            
            this.props = await response.json();
            console.log('Player Details:',this.props);
            console.log(this.props.players[0].player1.name);
            this.render();

        } catch (error) {
            console.error('Error fetching player details:', error);
        }
    };
    
    fetchData = () => {
        const tournamentData = JSON.parse(localStorage.getItem("tournamentData"));
        
        if (tournamentData) {
            console.log("Tournament ID:", tournamentData.tournament_id);
            console.log("Match IDs:", tournamentData.match_id);
            
            this.fetchPlayerDetails(tournamentData.match_id);
        } else {
            console.error("No tournament data found!");
        }
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
                            createElement('h2', {}, `${this.props.players[0].player1.name}`)
                        ),
                        createElement('div', { className: 'vs' },
                            createElement('img', { src: './images/vs (2).png' })
                        ),
                        createElement('div', { className: 'player2' },
                            createElement('img', { src: './images/shicham.png' }),
                            createElement('h2', {}, `${this.props.players[0].player2.name}`)
                        )
                    ),
                    createElement('div', { className: 'match2' },
                        createElement('div', { className: 'player1' },
                            createElement('img', { src: './images/niboukha.png' }),
                            createElement('h2', {}, `${this.props.players[1].player1.name}`)
                        ),
                        createElement('div', { className: 'vs' },
                            createElement('img', { src: './images/vs (2).png' })
                        ),
                        createElement('div', { className: 'player2' },
                            createElement('img', { src: './images/kjarmoum.png' }),
                            createElement('h2', {}, `${this.props.players[1].player2.name}`)
                        )
                    )
                ),
                createElement('div', { className: 'btn_1' },
                    createElement('div', { className: 'first' },
                        createElement('a', { href: '' },
                            createElement('button', { type: 'button', className: 'btn' }, 'play')
                        )
                    ),
                    createElement('div', { className: 'second' },
                        createElement('a', { href: '' },
                            createElement('button', { type: 'button', className: 'btn' }, 'play')
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
                createElement('div', { className: 'btn_2' },
                    createElement('a', { href: '' },
                        createElement('button', { type: 'button', className: 'btn' }, 'play')
                    )
                ),
                createElement('div', { className: 'round3' },
                    createElement('img', { src: './images/kel-baam.png' }),
                    createElement('h2', {}, 'username')
                ),
                createElement('div', { className: 'trophy' },
                    createElement('img', { src: './images/gold-cup-removebg-preview.png' })
                ))
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
