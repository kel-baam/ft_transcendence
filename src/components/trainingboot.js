import createElement from "../framework/createElement.js";
import render from "../framework/render.js";

class TrainingBoot {
    constructor(props) {
        this.props = props;
        this.render();
    }

    render() {
        const virtualDom = createElement('div', { className: 'training-boot' },
            createElement('h1', null, 'Training'),
            createElement('img', { src: './images/paddles-removebg-preview.png' }),
            createElement('a', { href: 'playerVSplayer' }, 
                createElement('button', { type: 'button', className: 'btn' }, 'PLAY')
            )
        );

        return virtualDom;
    }
}

export default TrainingBoot;
