import createElement from "../framework/createElement.js";
import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";
import { diff, patch } from "../framework/diff.js";

class Hierarchy {
    constructor(props) {
        this.props = props;
        this.render();
    }

    createTournamentBracket(numPlayers, container) {
        const rounds = Math.log2(numPlayers);
        for (let i = 0; i < rounds; i++) {
            const roundDiv = document.createElement("div");
            roundDiv.className = "round";

            const matchesPerRound = Math.pow(2, rounds - i - 1);
            for (let j = 0; j < matchesPerRound; j++) {
                const matchDiv = document.createElement("div");
                matchDiv.className = "match";
                matchDiv.innerText = `Match ${j + 1}`;
                roundDiv.appendChild(matchDiv);
            }

            container.appendChild(roundDiv);
        }
    }

    createHierarchy() {
        document.getElementById("generateBracket").addEventListener("click", () => {
            const numPlayers = parseInt(document.getElementById("numPlayers").value);
            const bracketContainer = document.getElementById("bracket");
            bracketContainer.innerHTML = '';

            if (numPlayers < 2 || (numPlayers & (numPlayers - 1)) !== 0) {
                alert("Please enter a valid power of 2 (2, 4, 8, 16, ...).");
                return;
            }

            this.createTournamentBracket(numPlayers, bracketContainer);
        });
    }

    render() {
        const newVdom = createElement(
            'div',
            { id: 'global' },
            createElement(Header, {}),
            createElement('div', { className: 'content' },
                createElement(Sidebar, {}),
                createElement('div', { className: 'hierarchy-content' },
                    createElement('div', {},
                        createElement('label', { htmlFor: 'numPlayers' }, 'Enter number of players:'),
                        createElement('input', { type: 'number', id: 'numPlayers', min: 2 }),
                        createElement('button', { id: 'generateBracket' }, 'Generate Bracket')
                    ),
                    createElement('h1', {}, 'Tournament in Progress'),
                    createElement('div', { id: 'bracket' })
                ),
                createElement('div', { className: 'friends' })
            )
        );

        const container = document.body;

        // Initialize __vdom if it's not already defined
        if (!container.__vdom) {
            container.__vdom = null;
        }

        const patches = diff(container.__vdom, newVdom, container);
        patch(document.body, patches);
        container.__vdom = newVdom;

        // Call createHierarchy after the new elements have been rendered
        this.createHierarchy(); 
    }
}

export default Hierarchy;
