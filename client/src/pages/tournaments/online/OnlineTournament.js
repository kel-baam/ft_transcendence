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
import { showErrorNotification, highlightInvalidInput } from '../../utils/errorNotification.js';
import { customFetch } from '../../../package/fetch.js';

let socket = null;

export const OnlineTournament = defineComponent({
    state() {
        return {
            data    : {
                joinedTournaments   : [],
                availableTournaments: [],
            },
            isBlur  : false,
            id      : null,
            notificationActive: false,
            notif_blur: false,
            notification_data: null,
        };
    },

    onMounted() {
        this.initWebSocket();
    },

    onUnmounted() {
        if (socket) {
            console.log('WebSocket connection closed');
            socket.close();
        }
    },

    initWebSocket() {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            socket = new WebSocket('ws://localhost:8002/ws/online/');
            socket.onopen = () => {
                console.log('WebSocket connection established');
                socket.send(JSON.stringify({ action: 'get_joined_tournaments' }));
                socket.send(JSON.stringify({ action: 'get_available_tournaments' }));
            };
            socket.onmessage = async (event) => {
                const data = JSON.parse(event.data);
                console.log('Parsed WebSocket Data:', data);

                if (data.error === "token expired") {
                    const refreshAccessToken = await fetch('http://localhost:3000/auth/refreshToken', {
                        method: 'GET',
                        credentials: 'include',
                    });
                    console.log("Token refreshed", refreshAccessToken);
                }

                if (data.joined_tournaments) {
                    this.updateState({ joinedTournaments: data.joined_tournaments });
                }

                if (data.available_tournaments) {
                    this.updateState({ availableTournaments: data.available_tournaments });
                }
            };

            socket.onerror = (error) => console.error('WebSocket error:', error);
        }
    },

    async submitForm(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append('tournament_id', JSON.stringify(this.state.id));
        formData.append('status', 'accepted');

        try {
            const response = await customFetch("http://localhost:3000/tournament/api/online/tournaments/", {
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
            this.updateState({ isBlur: false, notif_blur: false });
        } catch (error) {
            showErrorNotification(error);
        }
    },

    render() {
        const renderForm = (isBlur) =>
            h('div', { class: 'join-player-form' }, [
                h('i', {
                    class: 'fa-regular fa-circle-xmark icon',
                    on: { click: () => this.updateState({ [isBlur ? 'isBlur' : 'notif_blur']: false }) }
                }),
                h('form', {
                    class: 'form1',
                    on: { submit: this.submitForm.bind(this) }
                }, [
                    h('div', { class: 'avatar' }, [
                        h('img', { class: 'createAvatar', src: './images/people_14024721.png', alt: 'Avatar' }),
                        h('div', {
                            class: 'editIcon',
                            on: { click: () => document.getElementById('file-upload1').click() }
                        }, [
                            h('input', {
                                type: 'file',
                                id: 'file-upload1',
                                name: 'player_avatar',
                                accept: 'image/*',
                                style: { display: 'none' },
                                on: {
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
                on: {
                    iconClick: () => this.updateState({ notificationActive: !this.state.notificationActive }),
                    blur: (notification_data) => this.updateState({
                        notif_blur: true,
                        notification_data,
                    })
                }
            }),
            h('div', { class: 'content' }, [
                h(sidebarLeft),
                h('div', {
                    class: 'online-tournament',
                    style: this.state.isBlur || this.state.notif_blur ? { filter: 'blur(4px)' } : {}
                }, [
                    h(AvailableTournaments, {
                        tournaments: this.state.availableTournaments,
                        on: {
                            join: (id) => this.updateState({ isBlur: true, id })
                        }
                    }),
                    h(JoinedTournaments, {
                        tournaments: this.state.joinedTournaments,
                        on: {
                            start_the_tournament: (id) =>
                                this.appContext.router.navigateTo(`/tournament/online/online_hierachy/${id}`)
                        }
                    }),
                    h(CreateTournament)
                ]),
                this.state.isBlur ? renderForm(true) : null,
                this.state.notif_blur ? renderForm(false) : null
            ])
        ]);
    }
});
