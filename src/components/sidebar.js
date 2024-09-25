import createElement from "../framework/createElement.js";
import { handleRouting } from "../framework/routing.js";


class Sidebar {
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
        const virtualDom = createElement('div', { className: 'side-bar' }, 
            createElement('a', { href: 'profile' },
                createElement('i', { className: 'fa-regular fa-circle-user icon', onclick:this.handleButtonClick })
            ),
            createElement('a', { href: 'chat' }, 
                createElement('i', { className: 'fa-regular fa-message icon', onclick:this.handleButtonClick })
            ),
            createElement('a', { href: 'home' }, 
                createElement('i', { className: 'fa-sharp fa-solid fa-house-chimney icon', onclick:this.handleButtonClick })
            ),
            createElement('a', { href: 'leaderboard' }, 
                createElement('i', { className: 'fa-solid fa-ranking-star icon', onclick:this.handleButtonClick })
            ),
            createElement('a', { href: 'playerVSplayer' }, 
                createElement('i', { className: 'fa-solid fa-network-wired fa-rotate-90 icon', onclick:this.handleButtonClick })
            ),
            createElement('a', { href: 'tournament' }, 
                createElement('i', { className: 'fa-solid fa-trophy icon', onclick:this.handleButtonClick })
            )
        );

        return virtualDom;
    }
}

export default Sidebar;
