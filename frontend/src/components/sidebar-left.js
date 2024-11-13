import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../package/index.js'

export const sidebarLeft = defineComponent({render()
    {
        return h('div', { class: 'side-bar' }, 
            [h('a', { href: 'profile' },
                [h('i', { class: 'fa-regular fa-circle-user icon' })]
            ),
            h('a', { href: 'chat' }, 
                [h('i', { class: 'fa-regular fa-message icon' })]
            ),
            h('a', { href: 'home' }, 
                [h('i', { class: 'fa-sharp fa-solid fa-house-chimney icon' })]
            ),
            h('a', { href: 'leaderboard' }, 
               [ h('i', { class: 'fa-solid fa-ranking-star icon' })]
            ),
            h('a', { href: 'playerVSplayer' }, 
                [h('i', { class: 'fa-solid fa-network-wired fa-rotate-90 icon' })]
            ),
            h('a', { href: 'tournament' }, 
                [h('i', { class: 'fa-solid fa-trophy icon' })]
            )]
        );

    }
})
