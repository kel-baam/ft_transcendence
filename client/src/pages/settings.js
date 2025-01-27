import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString,RouterOutlet} from '../package/index.js'
import { header } from '../components/header.js'
import { sidebarLeft } from '../components/sidebar-left.js'
import { Form } from '../components/settings/form.js'
import { listBlockedFriends } from '../components/settings/listBlockedFriends.js'
import {SecuritySettings} from '../components/settings/SecuritySettings.js'

export const settings = defineComponent({
    state()
    {
        return {
            activateSection:'form'
        }
    },
    render()
    {
        return h('div', {id:'global'}, [h(header, {}),h('div', {class:'content'}, 
            [h(sidebarLeft, {}), h('div', {class:'global-content'},
                [h(
                    'div',
                    { class: 'settings-container' },
                    [
                        h(
                            'div',
                            { class: 'section-headings' },
                            [
                                h(
                                    'button',
                                    {
                                        on : {click : () =>{
                                        this.updateState({activateSection:'form'})
                                        }},
                                        style : this.state.activateSection ==='form' ? { 'background-color' : 'rgba(0, 0, 0, 0.2)'}: {}
                                    },
                                    [
                                        h('img', { src: 'images/informations_icon.png', alt: 'informations icon' }),
                                        h('h2', {}, ['Informations'])
                                    ]
                                ),
                                h('button',
                                    {
                                        on : {click : () =>{
                                            this.updateState({activateSection:'BlockedFriends'})
                                            }},
                                            style : this.state.activateSection === 'BlockedFriends'? { 'background-color' : 'rgba(0, 0, 0, 0.2)'}:{}
                                        
                                    },
                                    [
                                        h('img', { src: 'images/blocked_fr_icon.png', alt: 'blocked friends icon' }),
                                        h('h2', {}, ['Blocked friends'])
                                    ]
                                ),
                                h(
                                    'button',
                                    {
                                        on : {click : () =>{
                                            this.updateState({activateSection:'securitySettings'})
                                            }},
                                            style : this.state.activateSection === 'securitySettings'? { 'background-color' : 'rgba(0, 0, 0, 0.2)'}:{}
                                    },
                                    [
                                        h('i', { class: 'fas fa-lock', style: {'font-size':'20px' ,  color: '#0A377E'} }),
                                        h('h2', {}, ['Security'])
                                    ]
                                )
                            ]
                        ),
                        this.state.activateSection === 'form' ? h(Form , {}) : 
                        this.state.activateSection === 'BlockedFriends'? h(listBlockedFriends, {}) : 
                        h(SecuritySettings, {})
                    ]
                )]
                

            )

            ]) 
            ])
    }
})