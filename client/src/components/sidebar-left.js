import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../package/index.js'

export const sidebarLeft = defineComponent({render()
    {
        return h('div', { class: 'side-bar' },
            [h('i', {
                class: 'fa-regular fa-circle-user icon',
                on :{ click:()=>{ this.appContext.router.navigateTo('/profile')}
            }}),
            h('i', {
                class: 'fa-regular fa-message icon',
                on :{ click:()=>{ this.appContext.router.navigateTo('/chat')} }
            }),
            h('i', {
                class: `fa-sharp fa-solid fa-house-chimney icon`,
                on :{
                    click:()=>
                    {
                        this.appContext.router.navigateTo('/home')
                    },
                }
            }),
            h('i', {
                class: 'fa-solid fa-ranking-star icon', 
                on :{ click:()=>{ this.appContext.router.navigateTo('/leaderboard')} }
            }),
            h('i', {
                class: 'fa-solid fa-network-wired fa-rotate-90 icon',
                on :{ click:()=>{ this.appContext.router.navigateTo('/pvp')} }
            }),
            h('i', {
                class: 'fa-solid fa-trophy icon',
                on :{ click:()=>{ this.appContext.router.navigateTo('/tournament')} }
            })]
        );

    }
})
