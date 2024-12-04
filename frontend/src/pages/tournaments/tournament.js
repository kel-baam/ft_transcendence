import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'
import { header } from '../../components/header.js'
import { sidebarLeft } from '../../components/sidebar-left.js'

export const Tournament = defineComponent({
    
    state(){
        return {
        }
    },

    render()
    {
        // console.log(">>>>>>>>>>>>>>>>>>>>>>> type ", this.appContext.router.params)
        return h('div', {id:'global'}, [h(header, {}),h('div', {class:'content'}, 
            [h(sidebarLeft, {}),
                h('div', {class:'tournament-content'},
                [ h('div', { class: 'game-title' }, [ h('h1', {}, ['How Do You Prefer to Game?']) ]),
                    h('div', { class: 'btns-local-online' }, [
                        h('div', { class: 'online' },
                            [ h('button', { type: 'button', class: 'btn',
                                on :{click:()=>{
                                    this.appContext.router.navigateTo('/tournament/online')
                                }}
                            }, ['Online']) ]),
                        h('div', { class: 'or' }, [
                            h('h2', {}, ['Or'])
                        ]),
                        h('div', { class: 'local' }, [
                            h('button', { type: 'button', 
                                on :{click:()=> {
                                    this.appContext.router.navigateTo('/tournament/local')
                                }} ,class: 'btn'}, ['Local'])
                        ])
                    ])
                ])
            ]) 
        ])
    }
})
