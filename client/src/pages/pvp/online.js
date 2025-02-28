import { createApp, defineComponent, h } from '../../package/index.js'
import { header } from '../../components/header.js'
import { sidebarLeft } from '../../components/sidebar-left.js'
import { showErrorNotification } from '../utils/errorNotification.js'

let socket = null;
let redirectTimeout = null;

export const OnlinePvp = defineComponent({
    state() {
        return {
            player_data       : {},
            user_data         : {},
            notificationActive: false,
            isBlur            :false,
            notification_data : null,
            isLoading         : true
        }
    },

    async submitForm(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        formData.append('tournament_id', JSON.stringify(this.state.notification_data.object_id));
        formData.append('status', 'accepted');
        
        try
        {
            const response = await customFetch(`https://${window.env.IP}:3000/api/tournament/online/tournaments/`, {
                method     : 'PUT',
                body       : formData,
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 401) this.appContext.router.navigateTo('/login');
                const errorText = await response.json();
                throw new Error(Object.values(errorText)[0]);
            }

            const successData = await response.json();
            console.log("Player added:", successData.message);
        }
        catch (error)
        { showErrorNotification(error); }
        this.updateState({ isBlur: false });
    },

    async initWebSocket() {
        if (!socket || socket.readyState !== WebSocket.OPEN) {

            socket = new WebSocket(`wss://${window.env.IP}:3000/ws/matchmaking/`);
    
            socket.onopen = () => {
                console.log('WebSocket connection established');
                socket.send(JSON.stringify({ action: 'find_opponent' }));
            };
    
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                
                console.log('WebSocket Data:', data);
    
                if (data.action === "match_not_found")
                {
                    showErrorNotification(data.message);
                    this.appContext.router.navigateTo('/pvp');
                } 
                else if (data.action === "user_data")
                {
                    this.updateState({ user_data: data.user, isLoading: false });
                } 
                else if (data.action === "match_found")
                {
                    this.updateState({ player_data: data.opponent });
                    print("match_found-----------------------")
                    clearTimeout(redirectTimeout);
                    redirectTimeout = setTimeout(() => {
                        this.appContext.router.navigateTo(`/game?id=${data.id}&type=online`);
                    }, 3000);
                }
                else if (data.action === "opponent_disconnected")
                {
                    console.log("------------------------------------------------------------")
                    showErrorNotification(data.message);
                    this.appContext.router.navigateTo('/pvp');
                    clearTimeout(redirectTimeout);
                }
            };
    
            socket.onerror = (error) => { console.error('WebSocket error:', error); };
        }
    },
    
    onMounted() {
        clearTimeout(redirectTimeout);
        this.initWebSocket();
    },
    
    onUnmounted() {
        clearTimeout(redirectTimeout);
        if (socket)
        {
            socket.close();
            socket = null;
        }
    },
    
    render() {
        const {isLoading} = this.state
        return h('div', { id: 'global' }, [
            h(header, {
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
            }),
            h('div', { class: 'content' }, [
                h(sidebarLeft, {}),
                h('div', {
                    class : 'game-content',
                    style : this.state.isBlur ? { filter : 'blur(4px)',  pointerEvents: 'none'} : {}
                 }, [
                    h('div', { class: 'user-profile' }, [
                        h('img', { src: `https://${window.env.IP}:3000/media${this.state.user_data.picture}`, style : {'object-fit': 'cover'} }),
                        h('h3', {}, [this.state.user_data.username || "Unknown"])
                    ]),
                    h('div', { class: 'vs' }, [h('img', { src: './images/vs.png' })]),
                    h('div', { class: 'invited' }, [
                        h('img', { src: `https://${window.env.IP}:3000/media${this.state.player_data.picture}`,style : {'object-fit': 'cover'}  }),
                        h('h3', {}, [this.state.player_data.username || "Searching..."])
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
    }
});
