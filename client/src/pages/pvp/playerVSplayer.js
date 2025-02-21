import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString}  from '../../package/index.js'

import { header }               from '../../components/header.js'
import { sidebarLeft }          from '../../components/sidebar-left.js'

export const PlayerVsPlayer = defineComponent({
    state(){
        return {
            notificationActive: false,
            isBlur:false,
            notification_data: null,
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
            console.log("Player added:", successData.message);
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
            }
        }),h('div', {class:'content'}, 
            [h(sidebarLeft, {}), h('div', {
                class: 'local-online',
                style : this.state.isBlur ? { filter : 'blur(4px)',  pointerEvents: 'none'} : {}
             },
                [
                    h('div', { class: 'game-title' }, [
                        h('h1', {}, ['How Do You Prefer to Game?'])
                    ]),
                    h('div', { class: 'content-body' }, [
                        h('div', { class: 'online' }, [
                            h('button', {
                                type    : 'button',
                                class   : 'btn',
                                on      : {
                                    click:()=>{ this.appContext.router.navigateTo('/pvp_online')},
                                }
                             }, ['Online'])
                        ]),
                        h('div', { class: 'or' }, [
                            h('h2', {}, ['Or'])
                        ]),
                        h('div', { class: 'local' }, [
                            h('button', {
                                type    : 'button',
                                class   : 'btn',
                                on      : { click:()=>{   this.appContext.router.navigateTo('/game?type=local')}}
                            }, ['Local'])
                        ])
                    ])
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
