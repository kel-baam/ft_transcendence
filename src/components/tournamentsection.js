import createElement from "../framework/createElement.js";
import { handleRouting } from "../framework/routing.js";


class TournamentSection {
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

    render() {
        const virtualDom = createElement('div', { className: 'tournament' },
            createElement('h1', null, 'Tournament'),
            createElement('div', { className: 'hierarchy' }, 
                createElement('div', { className: 'col1' }, 
                    createElement('div', { className: 'girl-div' }, 
                        createElement('img', { src: './images/bnt-removebg-preview.png', className: 'player1' })
                    ),
                    createElement('div', { className: 'vs1-div' }, 
                        createElement('img', { src: './images/vs (2).png', className: 'vs' })
                    ),
                    createElement('div', { className: 'girl-div' }, 
                        createElement('img', { src: './images/girlplay-removebg-preview.png', className: 'player3' })
                    )
                ),
                createElement('div', { className: 'girl-div' }, 
                    createElement('img', { src: './images/girlplay-removebg-preview.png', className: 'player2' })
                ),
                createElement('div', { className: 'trophy-div' }, 
                    createElement('img', { src: './images/gold-cup-removebg-preview.png', className: 'trophy' })
                ),
                createElement('div', { className: 'boy-div' }, 
                    createElement('img', { src: './images/playervs-removebg-preview.png', className: 'player4' })
                ),
                createElement('div', { className: 'col3' }, 
                    createElement('div', { className: 'boy-div' }, 
                        createElement('img', { src: './images/player.jpg.png', className: 'player6' })
                    ),
                    createElement('div', { className: 'vs2-div' }, 
                        createElement('img', { src: './images/vs (2).png', className: 'vs' })
                    ),
                    createElement('div', { className: 'boy-div' }, 
                        createElement('img', { src: './images/playervs-removebg-preview.png', className: 'player5' })
                    )
                )
            ),
            createElement('a', { href: '/tournament' }, 
                createElement('button', { type: 'button', className: 'btn', onclick:this.handleButtonClick }, 'PLAY')
            )
        );

        return virtualDom;
    }
}

export default TournamentSection;
