import{ defineComponent, h,} from '../package/index.js'
import { header } from '../components/header.js'
import { sidebarLeft } from '../components/sidebar-left.js'
import { Form } from '../components/settings/form.js'
import { sidebarRight } from '../components/sidebar-right.js'
import { showErrorNotification } from './utils/errorNotification.js'
import { customFetch } from '../package/fetch.js'

export const EditInfoForm = defineComponent({
    state()
    {
        return {
            // activateSection:'form',

            notificationActive: false,
            isBlur:false,
            notification_data: null,
            settingsActive:false
        }
    },

    async submitForm(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        formData.append('tournament_id', JSON.stringify(this.state.notification_data.object_id));
        formData.append('status', 'accepted');
        
        try {
            const response = await customFetch(`https://${window.env.IP}:3000/api/tournament/online/tournaments/`, {
                method: 'PUT',
                body: formData,
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 401) this.appContext.router.navigateTo('/login');
                const errorText = await response.json();
                throw new Error(Object.values(errorText)[0]);
            }

            const successData = await response.json();

            this.updateState({ isBlur: false });
        } catch (error) {
            showErrorNotification(error);
            
            this.updateState({
                isBlur: false,
            })
        }
    },


    render()
    {
        return h('div', {id:'global'}, [h(header, {
            icon_notif: this.state.notificationActive,
            icon_settings: this.state.settingsActive,
            on          : {
                iconClick :()=>{
                    this.updateState({ notificationActive: !this.state.notificationActive }); 
                },
                blur :(notification_data)=> {
                    this.updateState({
                        isBlur            : !this.state.isBlur,
                        notification_data : notification_data
                    })
                },
                settingsIconClick :()=>{
                    this.updateState({ settingsActive: true }); 
                }
            }
            }),h('div', {class:'content'}, 
            [h(sidebarLeft, {}), h('div', {
                class:'global-content',
                style : this.state.isBlur ? { filter : 'blur(4px)',  pointerEvents: 'none'} : {}
            },
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
                                            this.appContext.router.navigateTo('/settings/edit-info')
                                        }},
                                        style : { 'background-color' : 'rgba(0, 0, 0, 0.2)'}
                                    },
                                    [
                                        h('img', { src: 'images/informations_icon.png', alt: 'informations icon' }),
                                        h('h2', {'data-translate' : 'informations'}, ['Informations'])
                                    ]
                                ),
                                h('button',
                                    {
                                        on : {click : () =>{
                                            this.appContext.router.navigateTo('/settings/blocked-friends')
                                            }},
                                        
                                    },
                                    [
                                        h('img', { src: 'images/blocked_fr_icon.png', alt: 'blocked friends icon' }),
                                        h('h2', {'data-translate' : 'blocked_friends'}, ['Blocked friends'])
                                    ]
                                ),
                                h(
                                    'button',
                                    {
                                        on : {click : () =>{
                                            this.appContext.router.navigateTo('/settings/security')
                                            }},
                                    },
                                    [
                                        h('i', { class: 'fas fa-lock', style: {'font-size':'20px' ,  color: '#0A377E'} }),
                                        h('h2', {'data-translate' : 'security'}, ['Security'])
                                    ]
                                )
                            ]
                        ),
                        h(Form , {})
                    ]
                )]
                

            ),
            h('div', { class: 'friends-bar' }, [
                h(sidebarRight, {})
              ]),
            this.state.isBlur ? 
            h('div', { class: 'join-player-form' }, [
                h('i', {
                    class   : 'fa-regular fa-circle-xmark icon',
                    on      : {
                        click : () => {
                            this.updateState({
                                isBlur: false,
                            })
                        }
                    }
                }),
                h('form', {
                    class   : 'form1',
                    on      : { submit: (event) => this.submitForm(event) }
                }, [
                    h('div', { class: 'avatar' }, [
                        h('img', { 
                            class   : 'createAvatar', 
                            src     : './images/people_14024721.png', 
                            alt     : 'Avatar' 
                        }),
                        h('div', { 
                            class   : 'editIcon', 
                            on      : {
                                click: () => { document.getElementById(`file-upload1`).click(); }
                            }
                        }, [
                            h('input', {
                                type    : 'file',
                                id      : 'file-upload1',
                                name    : 'player_avatar',
                                accept  : 'image/*',
                                style   :{
                                    display         : 'none',
                                    pointerEvents   : 'none'
                                },
                                on      : { change: (event) => {
                                    const file = event.target.files[0];
                                    if (file) {
                                        const reader    = new FileReader();
                                        reader.onload   = (e) => {
                                            document.querySelector(`.createAvatar`).src = e.target.result;
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            }),
                            h('i', { class: 'fas fa-edit icon' })
                        ])
                    ]),
                    h('div', { class: 'createInput' }, [
                        h('label', { htmlFor: 'playerNickname' }, ['Nickname:']),
                        h('br'),
                        h('input', { 
                            type        : 'text', 
                            name        : 'nickname', 
                            placeholder : 'Enter Nickname...' 
                        })
                    ]),
                    h('button', { type: 'submit' }, ['Submit'])
                ])
            ]) : null

            ]) 
            ])
    }
})