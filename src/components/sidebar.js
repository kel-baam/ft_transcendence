import createElement from "../framework/createElement.js";
import render from "../framework/render.js";

class Sidebar {
    constructor(props) {
        this.props = props;
        this.render();
    }

    render() {
        // Create the virtual DOM structure
        const virtualDom = createElement('div', { className: 'side-bar' }, 
            createElement('a', { href: 'profile' },
                createElement('i', { className: 'fa-regular fa-circle-user icon' })
            ),
            createElement('a', { href: 'chat' }, 
                createElement('i', { className: 'fa-regular fa-message icon' })
            ),
            createElement('a', { href: 'home' }, 
                createElement('i', { className: 'fa-sharp fa-solid fa-house-chimney icon' })
            ),
            createElement('a', { href: 'leaderboard' }, 
                createElement('i', { className: 'fa-solid fa-ranking-star icon' })
            ),
            createElement('a', { href: 'playerVSplayer' }, 
                createElement('i', { className: 'fa-solid fa-network-wired fa-rotate-90 icon' })
            ),
            createElement('a', { href: 'tournament' }, 
                createElement('i', { className: 'fa-solid fa-trophy icon' })
            )
        );

        return virtualDom;
    }
}

export default Sidebar;
