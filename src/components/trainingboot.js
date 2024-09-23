import createElement from "../framework/createElement.js";
import render from "../framework/render.js";

class TrainingBoot {
    constructor(props) {
        this.props = props;
        // this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this);
        this.render();
    }

    handleButtonClick = () => {
        // Dispatch an action or event here
        console.log('PLAY button clicked!');
        
        // Example of dispatching a navigation action
        if (this.props.dispatch) {
            this.props.dispatch({ type: 'NAVIGATE', payload: '#profile'});
        }
    }
    
    render() {
        const virtualDom = createElement('div', { className: 'training-boot' },
            createElement('h1', null, 'Training'),
            createElement('img', { src: './images/paddles-removebg-preview.png' }),
            createElement('a', { href: '#profile' }, 
                createElement('button', { type: 'button', className: 'btn', onclick:this.handleButtonClick }, 'PLAY')
            )
        );

        return virtualDom;
    }
}

export default TrainingBoot;
