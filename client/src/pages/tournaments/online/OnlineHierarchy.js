import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../../package/index.js'
import { header } from '../../../components/header.js'
import { sidebarLeft } from '../../../components/sidebar-left.js'

let socket = null
export const OnlineHierarchy = defineComponent({

    state(){
        return {
            first_round : [],
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


    matchmake_players()
    {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            
            socket = new WebSocket(`wss://${window.env.IP}:3000/ws/matchmaking/`);
            const tournamentId = this.appContext.router.params.id;
        
            console.log("---> : ", tournamentId)
            
            socket.onopen = () => {
                console.log('WebSocket connection established');

                socket.send(JSON.stringify({
                    action       : 'online_tournament',
                    tournamentId : tournamentId
                }));
            };

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);

                console.log('WebSocket Data:', data);
                if (data.success)
                {
                    console.log(" ==--> ", data.matches);
                    this.updateState({
                        first_round: data.matches
                    });
                    this.startMatches(data.matches);
                }
                else if (data.is_user)
                {
                    this.appContext.router.navigateTo(`/game/${data.match_id}`);
                }
                else
                {
                    console.error('Ignoring message:', data);
                }
            };

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        }
    },

    async startMatches(matches)
    {
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        matches.forEach((match) => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    action  : 'start_match',
                    matchId : match.match_id
                }));
            } 
            
            console.log("here");
        });
    },
    

    onMounted()
    {
        this.matchmake_players();
    },

    onUnmounted() {
        if (socket) {
            console.log('WebSocket connection closed');
            socket.close();
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
            [h(sidebarLeft, {}),
                h('div', {
                    class: 'hierarchy-global-content',
                    style : this.state.isBlur ? { filter : 'blur(4px)',  pointerEvents: 'none'} : {}

                }, [
                    h('div', { class: 'title' }, [
                        h('h1', {}, ['Tournament in Progress'])
                    ]),
                    h('div', { class: 'rounds' }, [
                        h('div', { class: 'round1' }, 
                            (this.state.first_round || []).map((match, i) =>
                                h('div', { class: `match${i + 1}` }, [
                                    h('div', { class: 'player1' }, [
                                        h('img', { 
                                            src: './images/people_14024721.png'
                                        }),
                                        h('h2', {}, [match.player1])
                                    ]),
                                    h('div', { class: 'vs' }, [
                                        h('img', { src: './images/vs.png' })
                                    ]),
                                    h('div', { class: 'player2' }, [
                                        h('img', { 
                                            src: './images/people_14024721.png'
                                        }),
                                        h('h2', {}, [match.player2])
                                    ])
                                ])
                            )
                        ),                        
                        h('div', { class: 'round2' }, [
                            
                            h('div', { class: 'player1' }, [
                                h('img', { src: './images/people_14024721.png' }),
                                h('h2', {}, ['username'])
                            ]),
                            h('div', { class: 'vs' }, [
                                h('img', { src: './images/vs.png' })
                            ]),
                            h('div', { class: 'player2' }, [
                                h('img', { src: './images/people_14024721.png' }),
                                h('h2', {}, ['username'])
                            ])
                        ]),
                        h('div', { class: 'round3' }, [
                            h('img', { src: './images/people_14024721.png' }),
                            h('h2', {}, ['username'])
                        ]),
                        h('div', { class: 'trophy' }, [
                            h('img', { src: './images/gold-cup-removebg-preview.png' })
                        ])
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
})
