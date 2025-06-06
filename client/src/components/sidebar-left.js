import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../package/index.js'

export const sidebarLeft = defineComponent({
    render()
    {
        return h('div', { class: 'side-bar', key : 'side-bar'},
            [h('i', {
                id:'user-icon',
                class: 'fa-regular fa-circle-user icon',
                on :{ click:(e)=>{ 
                    const target = e.currentTarget;
                    target.style.color = "#F45250";
                    this.appContext.router.navigateTo('/user');
            }
            }}),
            h('i', {
                id:'home-icon',
                class: 'fa-sharp fa-solid fa-house-chimney icon',
                on :{ click:(e)=>{
                 
                    e.target.style.color  = 'red'
                     this.appContext.router.navigateTo('/home')} }
            }),
            h('i', {
                id:'leaderboard-icon',
                class: 'fa-solid fa-ranking-star icon', 
                on :{ click:(e)=>{ 
                    this.appContext.router.navigateTo('/leaderboard')} }
            }),
            h('i', {
                id:'pvp-icon',
                class: 'fa-solid fa-network-wired fa-rotate-90 icon',
                on :{ click:()=>{ this.appContext.router.navigateTo('/pvp')} }
            }),
            h('i', {
                id:'tournament-icon',
                class: 'fa-solid fa-trophy icon',
                on :{ click:()=>{ this.appContext.router.navigateTo('/tournament')} }
            })]
        );

    }
})
