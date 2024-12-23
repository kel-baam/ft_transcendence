import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'

export const WelcomingSection = defineComponent({
    state(){
        return {
        }
    },
    render(){
        return (h('div', { class: 'welcoming-section' }, [
            h('div', { class: 'left-side' }),
            h('div', { class: 'info' }, [
                h('div', { class: 'rank' }, [
                    h('h1', {}, [
                        'Rank ',
                        h('span', {}, ['17'])
                    ])
                ]),
                h('div', { class: 'score' }, [
                    h('h1', {}, [
                        'Score ',
                        h('span', {}, ['3.6'])
                    ]),
                    h('img', { src: './images/star_12921513.png' })
                ]),
                h('div', { class: 'acheivement' }, [
                    h('img', { src: './images/ach.png' }),
                    h('h1', {}, ['Silver'])
                ])
            ]),
            h('img', {
                src: './images/girlplayer-removebg-preview.png',
                class: 'girl'
            })
        ]));
    }
})

