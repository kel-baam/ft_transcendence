import createElement from "../framework/createElement.js";
import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";
import HomeTop from "../components/hometop.js";
import HomeDown from "../components/homedown.js";
import { diff , patch} from "../framework/diff.js";
import dispatch from "../framework/dispatch.js";


class WaitPlayerJoinPage
{
    constructor(props)
    {
        this.props = props;
        this.render();
    }

    render()
    {
        const newVdom = createElement('div', {id: 'global'}, createElement(Header, {}), 
                createElement('div', {className: 'content'}, 
                    createElement(Sidebar, {}), createElement('div', { className: 'game-wait-content' },
                        createElement('h1', {}, "Waiting for your opponent..."),
                        createElement('div', { className: 'players' },
                            createElement('div', { className: 'user' },
                                createElement('img', { src: './images/niboukha 1 (1).png' }),
                                createElement('h2', {}, "niboukha")
                            ),
                            createElement('div', { className: 'vs' },
                                createElement('img', { src: './images/vs (2).png', alt: '' })
                            ),
                            createElement('div', { className: 'opponent' },
                                createElement('img', { src: './images/question-mark-symbol.png' }),
                                createElement('h2', {}, "....")
                            )
                        )
                    ), createElement('div', {className: 'friends'})
                ));

        const container = document.body;
        // document.body.innerHTML = ''
        // render(newVdom, container);

        const patches = diff(container.__vdom, newVdom, container);
        patch(document.body, patches);
        container.__vdom = newVdom;
    }                    
}

export default WaitPlayerJoinPage