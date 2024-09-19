import createElement from "../framework/createElement.js";
import render from "../framework/render.js";
import createDOMElement from "../framework/createDOMElement.js";
class welcomingsection extends HTMLElement
{
    constructor()
    {
        super();
        this.attachShadow({ mode: 'open'});
        this.connectedCallback();
    }

    connectedCallback()
    {
        this.render();
    }

    render()
    {
        this.leftSideCreate();
        this.infoCreate();
        this.girlPictureCreate();
    }
        
    leftSideCreate()
    { 
        const virtualDom = createElement('div', { className: 'left-side' });
        const domElement = createDOMElement(virtualDom);
        document.getElementsByClassName('welcoming-section')[0].appendChild(domElement);

        const container = document.getElementsByClassName('welcoming-section')[0];
        render(virtualDom, container);
    }

    createRank()
    {
        return createElement('div', { className: 'rank' }, 
            createElement('h1', null, 
                'Rank ', 
                createElement('span', null, '17')
            )
        );
    }
    
    createScore()
    {
        return createElement('div', { className: 'score' }, 
            createElement('h1', null, 
                'Score ', 
                createElement('span', null, '3.6')
            ),
            createElement('img', { src: './images/star_12921513.png' })
        );
    }
    
    createAcheivement()
    {
        return createElement('div', { className: 'acheivement' }, 
            createElement('img', { src: './images/ach.png' }),
            createElement('h1', null, 'Silver')
        );
    }
    
    infoCreate()
    {
        const rank = this.createRank();
        const score = this.createScore();
        const acheivement = this.createAcheivement();
    
        const virtualDom = createElement('div', { className: 'info' },
            rank,
            score,
            acheivement
        );
        const domElement = createDOMElement(virtualDom);
        
        document.getElementsByClassName('welcoming-section')[0].appendChild(domElement);
    }

    girlPictureCreate()
    {
        const virtualDom = createElement('img', {
            src: './images/girlplayer-removebg-preview.png',
            className: 'girl'
        });
        const domElement = createDOMElement(virtualDom);
        
        document.getElementsByClassName('welcoming-section')[0].appendChild(domElement);
    }

}

window.customElements.define('welcomingsection-component', welcomingsection);

export default welcomingsection;
