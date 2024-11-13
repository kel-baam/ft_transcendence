import createElement from "../framework/createElement.js";
import render from "../framework/render.js";

class LeaderboardHome {
    constructor(props) {
        this.props = props;
        this.render();
    }

    render() {
        const virtualDom = createElement('div', {className: 'leader-board'},createElement('div', { className: 'winners' }, 
            createElement('div', { className: 'coll1' }, 
                createElement('img', { src: './images/crown-removebg-preview.png' })
            ),
            createElement('div', { className: 'coll2' }, 
                createElement('div', { className: 'sec' }, 
                    createElement('img', { src: './images/second_1021187.png', className: 'second' })
                ),
                createElement('div', { className: 'player' }, 
                    createElement('img', { src: './images/niboukha.png', className: 'first-player' })
                ),
                createElement('div', { className: 'three' }, 
                    createElement('img', { src: './images/third.png', className: 'third' })
                )
            ),
            createElement('div', { className: 'coll3' }, 
                createElement('div', { className: 'second-player' }, 
                    createElement('img', { src: './images/kel-baam.png' })
                ),
                createElement('div', { className: 'third-player' },
                    createElement('img', { src: './images/kjarmoum.png' })
                )
            ),
            createElement('div', { className: 'coll4' }, 
                createElement('div', { className: 'rank-div' }, 
                    createElement('img', { src: './images/fa6-solid_ranking-star.png', className: 'rank' })
                ),
                createElement('div', { className: 'user' }, 
                    createElement('h2', null, 'Username')
                ),
                createElement('div', { className: 'score-div' }, 
                    createElement('h2', null, 'Score')
                )
            ),
            this.createBoard()
        ));

        return virtualDom;
    }

    createBoard() {
        return createElement('div', { className: 'board' }, 
            createElement('div', { className: 'lead' }, 
                this.createBoardEntry(1, 'Niboukha', 2500),
                this.createBoardEntry(2, 'Nouha', 1500),
                this.createBoardEntry(3, 'Hamza', 1400),
                this.createBoardEntry(4, 'Hamza', 1300),
                this.createBoardEntry(5, 'Hamza', 1200)
            )
        );
    }

    createBoardEntry(position, name, score) {
        return createElement('div', { className: 'second-one' }, 
            createElement('p', null, position.toString()),
            createElement('h3', null, name),
            createElement('div', { className: 'scor-coin' }, 
                createElement('p', null, score.toString()),
                createElement('img', { src: './images/star_12921513.png', className: 'coin' })
            )
        );
    }
}

export default LeaderboardHome;
