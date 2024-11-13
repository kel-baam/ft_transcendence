import createElement from "../framework/createElement.js";
import render from "../framework/render.js";

class WelcomingSection {
    constructor(props) {
        this.props = props;
        this.render();
    }

    render() {

        const virtualDom = createElement('div', { className: 'welcoming-section' }, 
            createElement('div', { className: 'left-side' }),
            createElement('div', { className: 'info' }, 
                createElement('div', { className: 'rank' }, 
                    createElement('h1', {}, 
                        'Rank ', 
                        createElement('span', {}, '17')
                    )
                ),
                createElement('div', { className: 'score' }, 
                    createElement('h1', {}, 'Score ', 
                        createElement('span', {}, '3.6')
                    ),
                    createElement('img', { src: './images/star_12921513.png' })
                ),
                createElement('div', { className: 'acheivement' },
                    createElement('img', { src: './images/ach.png' }),
                    createElement('h1', {}, 'Silver')
                )
            ),
            createElement('img', { 
                src: './images/girlplayer-removebg-preview.png', 
                className: 'girl' 
            })
        );

        return virtualDom;
    }

}

export default WelcomingSection;
