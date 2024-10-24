import createElement from "../framework/createElement.js";
import dispatch from "../framework/dispatch.js";
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
        // document.body.innerHTML = '<h1>hello world !!!</h1>'
        // Example of dispatching a navigation action
        // dispatch({ type: 'NAVIGATE', payload: '#profile'})
        // if (this.props.dispatch) {
        //     // console.log("------> yeeees ", this.props.dispatch)
        //     this.props.dispatch({ type: 'NAVIGATE', payload: '#profile'});
        // }
    }
    
    render() {
        const virtualDom = createElement('div', { className: 'training-boot' },
            createElement('h1', null, 'Training'),
            createElement('img', { src: './images/paddles-removebg-preview.png' }),
            createElement('a', { href: '#profile' }, 
                createElement('button', { type: 'button', className: 'btn', onclick:this.handleButtonClick }, 'play')
            )
        );

        return virtualDom;
    }
}

export default TrainingBoot;
