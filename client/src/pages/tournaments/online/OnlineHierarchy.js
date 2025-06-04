import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../../package/index.js'
import { header } from '../../../components/header.js'
import { sidebarLeft } from '../../../components/sidebar-left.js'

let socket = null
let redirectTimeout = null;

export const OnlineHierarchy = defineComponent({

    state(){
        return {
            matcheRounds        : [],
            notificationActive : false,
            isBlur             : false,
            notification_data  : null,
            winners      :[]

        }
    },

    async submitForm(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        formData.append('tournament_id', JSON.stringify(this.state.notification_data.object_id));
        formData.append('status', 'accepted');
        
        try {
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
        }
        catch (error) { showErrorNotification(error); }
        this.updateState({ isBlur: false })
    },


    matchmake_players()
    {
        if (!socket || socket.readyState === WebSocket.CLOSED || socket.readyState === WebSocket.CLOSING) {
            const tournamentId = this.appContext.router.params.id;
            
            socket = new WebSocket(`wss://${window.env.IP}:3000/ws/matchmaking/?tournamentId=${tournamentId}`);

            socket.onopen = () => {
                socket.send(JSON.stringify({
                    action : 'online_tournament',
                }));
            };

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.success)
                {
                    this.updateState({
                        matcheRounds: data.matches,
                        winners     : data.winners
                    });

                    if (data.tournament_status === "started")
                        this.startMatches(data.matches);
                }
                else if (data.action === "redirect_match")
                {
                    this.appContext.router.navigateTo(`/game?id=${data.match_id}&type=online`);
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
                    match_id : match.match_id
                }));
            }
        });
    },

    onMounted()
    {
        this.matchmake_players();
    },

    onUnmounted() {
        if (socket) {
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
                            (this.state.matcheRounds.slice(0, 2)).map((match, i) =>
                                h('div', { class: `match${i + 1}` }, [
                                    h('div', { class: 'player1' }, [
                                        h('img', { 
                                            src: `https://${window.env.IP}:3000/media${match.avatar1}`
                                        }),
                                        h('h2', {}, [match.player1])
                                    ]),
                                    h('div', { class: 'vs' }, [
                                        h('img', { src: './images/vs.png' })
                                    ]),
                                    h('div', { class: 'player2' }, [
                                        h('img', { 
                                            src: `https://${window.env.IP}:3000/media${match.avatar2}`
                                        }),
                                        h('h2', {}, [match.player2])
                                    ])
                                ])
                            )
                        ),                        
                        h('div', { class: 'round2' }, [
                            h('div', { class: 'player1' }, [
                                h('img', {
                                    src: this.state.winners && this.state.winners[0] && this.state.winners[0][0] && this.state.winners[0][0]['avatar'] 
                                        ? `https://${window.env.IP}:3000/media${this.state.winners[0][0].avatar}` 
                                        : './images/people_14024721.png'
                                }),
                                h('h2', {}, [this.state.winners && this.state.winners[0] && this.state.winners[0][0] && this.state.winners[0][0]['nickname'] || 'nickname'])
                            ]),
                            h('div', { class: 'vs' }, [
                                h('img', { src: './images/vs.png' })
                            ]),
                            h('div', { class: 'player2' }, [
                                h('img', {
                                    src: this.state.winners && this.state.winners[1] && this.state.winners[1][0] && this.state.winners[1][0]['avatar'] 
                                        ? `https://${window.env.IP}:3000/media${this.state.winners[1][0].avatar}` 
                                        : './images/people_14024721.png'
                                }),
                                h('h2', {}, [this.state.winners && this.state.winners[1] && this.state.winners[1][0] && this.state.winners[1][0]['nickname'] || 'nickname'])
                            ])
                        ]),
                        h('div', { class: 'round3' }, [
                            h('img', {
                                src: this.state.winners && this.state.winners[2] && this.state.winners[2][0] && this.state.winners[2][0]['avatar'] 
                                    ? `https://${window.env.IP}:3000/media${this.state.winners[2][0].avatar}` 
                                    : './images/people_14024721.png'
                            }),
                            h('h2', {}, [this.state.winners && this.state.winners[2] && this.state.winners[2][0] && this.state.winners[2][0]['nickname'] || 'nickname'])
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
