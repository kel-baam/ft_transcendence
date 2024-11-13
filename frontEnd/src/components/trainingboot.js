import createElement from "../framework/createElement.js";
import { handleRouting } from "../framework/routing.js";

class TrainingBoot {
    constructor(props) {
        this.props = props;
        // this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this);
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
        const virtualDom = createElement('div', { className: 'training-boot' },
            createElement('h1', null, 'Training'),
            createElement('img', { src: './images/paddles-removebg-preview.png' }),
            createElement('a', { href: 'profile' }, 
                createElement('button', { type: 'button', className: 'btn', onclick:this.handleButtonClick }, 'PLAY')
            )
        );
        return virtualDom;
    }
}

export default TrainingBoot;
