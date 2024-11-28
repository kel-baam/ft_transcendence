import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'

export const TournamentSection = defineComponent({
    state(){
        return {
        }
    },

    render(){
        return h('div', { class: 'tournament' }, [
            h('h1', {}, ['Tournament']),
            h('div', { class: 'hierarchy' }, [
                h('div', { class: 'col1' }, [
                    h('div', { class: 'girl-div' }, [
                        h('img', { src: './images/bnt-removebg-preview.png', class: 'player1' })
                    ]),
                    h('div', { class: 'vs1-div' }, [
                        h('img', { src: './images/vs (2).png', class: 'vs' })
                    ]),
                    h('div', { class: 'girl-div' }, [
                        h('img', { src: './images/girlplay-removebg-preview.png', class: 'player3' })
                    ])
                ]),
                h('div', { class: 'girl-div' }, [
                    h('img', { src: './images/girlplay-removebg-preview.png', class: 'player2' })
                ]),
                h('div', { class: 'trophy-div' }, [
                    h('img', { src: './images/gold-cup-removebg-preview.png', class: 'trophy' })
                ]),
                h('div', { class: 'boy-div' }, [
                    h('img', { src: './images/playervs-removebg-preview.png', class: 'player4' })
                ]),
                h('div', { class: 'col3' }, [
                    h('div', { class: 'boy-div' }, [
                        h('img', { src: './images/player.jpg.png', class: 'player6' })
                    ]),
                    h('div', { class: 'vs2-div' }, [
                        h('img', { src: './images/vs (2).png', class: 'vs' })
                    ]),
                    h('div', { class: 'boy-div' }, [
                        h('img', { src: './images/playervs-removebg-preview.png', class: 'player5' })
                    ])
                ])
            ]),
            h('a', { href: '/tournament' }, [
                h('button', { type: 'button', class: 'btn', onclick: this.handleButtonClick }, ['PLAY'])
            ])
        ]);        
    }
})