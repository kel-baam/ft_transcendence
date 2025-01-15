import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'

export const PlayerVsPlayer = defineComponent({
    state(){
        return {
        }
    },

    render(){
        return h('div', { class: 'player-vs-player' }, [
            h('div', { class: 'player-vs-player' }),
            h('div', { class: 'player-vs-player' }, [
                h('h1', {}, ['Lets Play']),
                h('div', { class: 'players' }, [
                    h('div', { class: 'play-girl' }, [
                        h('img', { src: './images/bnt-removebg-preview.png', class: 'girlplay' })
                    ]),
                    h('div', { class: 'play-girl' }, [
                        h('img', { src: './images/vs (2).png', class: 'vs2' })
                    ]),
                    h('div', { class: 'play-girl' }, [
                        h('img', { src: './images/playervs-removebg-preview.png', class: 'boy' })
                    ])
                ])
            ]),
            h('button', {
                type: 'button', class: 'btn',
                on : { click:()=>{ this.appContext.router.navigateTo('/playerVSplayer') }}
            }, ['PLAY'])
        ]);
        
        
    }
})