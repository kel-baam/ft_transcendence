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
            activateSection:'form',
            notificationActive: false,
            isBlur:false,
            notification_data: null,
            settingsActive:false
        }
    },
    onMounted()
    {
        const userIcon = document.getElementById('settings-icon');
        console.log(userIcon)
        if (userIcon)
        {
            userIcon.style.color = "#F45250";
            userIcon.style.transform = "scale(1.1)";
            userIcon.style.webkitTransform = "scale(1.1)";
            userIcon.style.filter = "blur(0.5px)";
            userIcon.style.transition = "0.5s";
        }
        
    },
    async submitForm(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append('tournament_id', JSON.stringify(this.state.id));
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
            console.log("Player added:", successData.message);
            this.updateState({ isBlur: false });
        } catch (error) {
            showErrorNotification(error);
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
                

            ),
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