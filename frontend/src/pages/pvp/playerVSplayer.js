import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString}  from '../../package/index.js'

import { header }               from '../../components/header.js'
import { sidebarLeft }          from '../../components/sidebar-left.js'

export const PlayerVsPlayer = defineComponent({
    state(){
        return {
            }
    },
    render()
    {
        return h('div', {id:'global'}, [h(header, {}),h('div', {class:'content'}, 
            [h(sidebarLeft, {}), h('div', { class: 'local-online' },
                [
                    h('div', { class: 'game-title' }, [
                        h('h1', {}, ['How Do You Prefer to Game?'])
                    ]),
                    h('div', { class: 'content-body' }, [
                        h('div', { class: 'online' }, [
                            h('button', {
                                type    : 'button',
                                class   : 'btn',
                                on      : { click:()=>{ this.appContext.router.navigateTo('/pvp_online') }}
                                
                             }, ['Online'])
                        ]),
                        h('div', { class: 'local' }, [
                            h('button', {
                                type    : 'button',
                                class   : 'btn', //souad request to update status 
                                on      : { click:()=>{   this.appContext.router.navigateTo('/pvp_local')}}
                            }, ['Local'])
                        ])
                    ])
                ])
            ]) 
        ])
    }                    
})
