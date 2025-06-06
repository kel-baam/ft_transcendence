import {
    createApp, 
    defineComponent, 
    DOM_TYPES, 
    h, 
    hFragment, 
    hSlot, 
    hString
} from '../../../package/index.js';

import { header } from '../../../components/header.js';
import { sidebarLeft } from '../../../components/sidebar-left.js';
import { CreateTournament } from '../../../components/tournament/createTournament.js';
import { JoinedTournaments } from '../../../components/tournament/JoinedTournaments.js';
import { AvailableTournaments } from '../../../components/tournament/AvailableTournaments.js';
import { showErrorNotification} from '../../utils/errorNotification.js';
import { customFetch } from '../../../package/fetch.js';
import { ComingSoon } from '../../../components/errorPages/coming_soon.js';
import { sidebarRight } from '../../../components/sidebar-right.js';

let socket = null;

export const OnlineTournament = defineComponent({
    state() {
        return {
            data : {
                joinedTournaments   : [],
                availableTournaments: [],
            },
            isloading : true,

            isBlur             : false,
            id                 : null,
            notificationActive : false,
            notif_blur         : false,
            notification_data  : null,
            coming_soon        : false
        };
    },

    onMounted() {

        this.initWebSocket();
    },

    onUnmounted() {
        if (socket) {
            socket.close();
        }
    },

    initWebSocket() {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            socket = new WebSocket(`wss://${window.env.IP}:3000/ws/tournament/online/`);

            socket.onopen = () => {
                socket.send(JSON.stringify({ action: 'get_joined_tournaments' }));
                socket.send(JSON.stringify({ action: 'get_available_tournaments' }));
            };
            socket.onmessage = async (event) => {
                const data = JSON.parse(event.data);

                if (data.joined_tournaments) {
                    this.updateState({ joinedTournaments: data.joined_tournaments , isloading:false});
                }
                if (data.available_tournaments) {
                    this.updateState({ availableTournaments: data.available_tournaments, isloading:false });
                }
            };

            socket.onerror = (error) => console.error('WebSocket error:', error);
        }
    },

    async submitForm(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        if (this.state.notification_data)
            formData.append( 'tournament_id',  JSON.stringify(this.state.notification_data.object_id))
        else
            formData.append( 'tournament_id',  JSON.stringify(this.state.id))

        formData.append('status', 'accepted');
        
        try
        {
            const response = await customFetch(`https://${window.env.IP}:3000/api/tournament/online/tournaments/`, {
                method      : 'PUT',
                body        : formData,
                credentials : 'include',
            });

            if (!response.ok) {
                if (response.status === 401) this.appContext.router.navigateTo('/login');
                const errorText = await response.json();
                throw new Error(Object.values(errorText)[0]);
            }

            const successData = await response.json();
            this.updateState({
                notif_blur        : false,
                isBlur            : false,
                notification_data : null,
                id                : null
            });
        }
        catch (error) { showErrorNotification(error); }
    },

    render() {
        const {coming_soon, isloading} = this.state

        if (coming_soon)
            return h(ComingSoon, {});


        const renderForm = (isBlur) =>
            h('div', { class: 'join-player-form' }, [
                h('i', {
                    class: 'fa-regular fa-circle-xmark icon',
                    on   : {
                        click: () => this.updateState({
                            notif_blur : false,
                            isBlur     : false,
                        }) 
                    }
                }),
                h('form', {
                    class: 'form1',
                    on   : { submit: (event) => this.submitForm(event) }
                }, [
                    h('div', { class: 'avatar' }, [
                        h('img', { class: 'createAvatar', src: './images/people_14024721.png', alt: 'Avatar' }),
                        h('div', {
                            class: 'editIcon',
                            on   : {
                                click: () => document.getElementById('file-upload1').click()
                            }
                        }, [
                            h('input', {
                                type   : 'file',
                                id     : 'file-upload1',
                                name   : 'player_avatar',
                                accept : 'image/*',
                                style  : { display: 'none' },
                                on     : {
                                    change: (event) => {
                                        const file = event.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (e) => {
                                                document.querySelector('.createAvatar').src = e.target.result;
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }
                                }
                            }),
                            h('i', { class: 'fas fa-edit icon' })
                        ])
                    ]),
                    h('div', { class: 'createInput' }, [
                        h('label', { htmlFor: 'playerNickname' }, ['Nickname:']),
                        h('input', { type: 'text', name: 'nickname', placeholder: 'Enter Nickname...' })
                    ]),
                    h('button', { type: 'submit' }, ['Submit'])
                ])
            ]);

        return h('div', { id: 'global' }, [
            h(header, {
                icon_notif: this.state.notificationActive,
                on        : {
                    iconClick: () => this.updateState({ notificationActive: !this.state.notificationActive }),
                    blur     : (notification_data) => this.updateState({
                        notif_blur        : true,
                        notification_data : notification_data,
                    })
                }
            }),
            h('div', { class: 'content' }, [
                h(sidebarLeft),
                h('div', {
                    class: 'online-tournament',
                    style: this.state.isBlur || this.state.notif_blur ? { filter: 'blur(4px)', pointerEvents: 'none' } : {}
                }, [
                    h(AvailableTournaments, {
                        tournaments : this.state.availableTournaments,
                        on          : {
                            join: (id) => this.updateState({ isBlur: true, id })
                        },
                        isloading:isloading
                    }),
                    h(JoinedTournaments, {
                        tournaments : this.state.joinedTournaments,
                        on          : {
                            start_the_tournament: (id) =>
                                this.updateState({
                                    coming_soon: true,
                                })
                        },
                        isloading:isloading
                    }),
                    h(CreateTournament)
                ]),h('div', { class: 'friends-bar' }, [
                    h(sidebarRight, {})
                ]),
                this.state.isBlur ? renderForm(true) : null,
                this.state.notif_blur ? renderForm(false) : null
            ])
        ]);
    }
});
