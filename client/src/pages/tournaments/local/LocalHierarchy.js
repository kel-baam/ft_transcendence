import{defineComponent,h} from '../../../package/index.js'
import { header } from '../../../components/header.js'
import { sidebarLeft } from '../../../components/sidebar-left.js'
import { NotFound } from '../../../components/errorPages/404.js';
import { Unauthorized } from '../../../components/errorPages/401.js';
import { showErrorNotification } from '../../utils/errorNotification.js';
import { customFetch } from '../../../package/fetch.js';
import { sidebarRight } from '../../../components/sidebar-right.js';

let socket          = null;
let redirectTimeout = null;

export const LocalHierarchy = defineComponent({

    state(){
        return {
            matcheRounds : [],
            currentMatch : null,
            matchIndex   : 0,
            winners      : [],
            error        : null,
            
            notificationActive: false,
            isBlur            :false,
            notification_data : null,
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

    async matchmake_players()
    {
        if (!socket || socket.readyState !== WebSocket.OPEN) {

            const tournamentId  = this.appContext.router.params.id;
            socket              = new WebSocket(`wss://${window.env.IP}:3000/ws/matchmaking/?tournamentId=${tournamentId}`);

            console.log("---> : ", tournamentId)

            socket.onopen = () => {
                console.log('WebSocket connection established');
                
                socket.send(JSON.stringify({
                    action       : 'local_tournament',
                    tournamentId : tournamentId
                }));
            };

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                
                console.log('WebSocket Data:', data);
                
                if (data && data.action == "tournament_not_found")
                {
                    this.updateState({error:"match not found"})

                    if (socket) {
                        socket.close();
                    }
                }
                if (data && data.action == "unauthorized")
                {
                    this.updateState({error: "unauthorized"})

                    if (socket) {
                        socket.close();
                    }
                }
                if (data.success)
                {
                    this.updateState({
                        matcheRounds : data.matches,
                        winners      : data.winners
                    })

                    if (data.rounds != undefined && data.tournament_status != "finished")
                    {
                       redirectTimeout = setTimeout(() => {
                            if (socket.readyState === WebSocket.OPEN) {
                                this.appContext.router.navigateTo(`/game?id=${data.rounds}&type=local`);
                            } else {
                                console.log('WebSocket is closed. Redirection canceled.');
                            }
                        }, 5000); 
                    }
                }
            };

            socket.onclose = () => {
                console.log('WebSocket connection closed.');

                if (redirectTimeout) {
                    clearTimeout(redirectTimeout);
                }
            };

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        }
    },

    onMounted()
    {
        this.matchmake_players();
    },

    onUnmounted()
    {
        if (socket) {
            socket.close();
        }
    },

    render()
    {
        const {error} = this.state
        
        if (error && error === "match not found")
        {
            return h(NotFound, {}, ["404 game not found !!!"])
        }
        if (error && error === "unauthorized")
        {
            return h(Unauthorized, {}, ["404 game not found !!!"])
        }

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
                },
                key : 'header'
        }),h('div', {class:'content'}, 
            [h(sidebarLeft, {}),
                this.state.currentMatch === null ?
                h('div', {
                    class : 'hierarchy-global-content',
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
                                            src: match.avatar1 
                                                ? `https://${window.env.IP}:3000/media${match.avatar1}` 
                                                : './images/people_14024721.png'
                                        }),
                                        h('h2', {}, [match.player1])
                                    ]),
                                    h('div', { class: 'vs' }, [
                                        h('img', { src: './images/vs.png' })
                                    ]),
                                    h('div', { class: 'player2' }, [
                                        h('img', { 
                                            src: match.avatar2 
                                                ? `https://${window.env.IP}:3000/media${match.avatar2}` 
                                                : './images/people_14024721.png'
                                        }),
                                        h('h2', {}, [match.player2])
                                    ])
                                ])
                            )
                        ),                       
                        h('div', { class: 'round2' }, [
                            h('div', { class: 'player1' }, [
                                h('img', { 
                                    src: this.state.winners && this.state.winners[0] && this.state.winners[0]['avatar'] 
                                        ? `https://${window.env.IP}:3000/media${this.state.winners[0]['avatar']}` 
                                        : './images/people_14024721.png'
                                }),
                                h('h2', {}, [this.state.winners && this.state.winners[0] && this.state.winners[0]['nickname'] || 'nickname'])
                            ]),
                            h('div', { class: 'vs' }, [
                                h('img', { src: './images/vs.png' })
                            ]),
                            h('div', { class: 'player2' }, [
                                h('img', { 
                                    src: this.state.winners && this.state.winners[1] && this.state.winners[1]['avatar'] 
                                        ? `https://${window.env.IP}:3000/media${this.state.winners[1]['avatar']}` 
                                        : './images/people_14024721.png'
                                }),
                                h('h2', {}, [this.state.winners && this.state.winners[1] && this.state.winners[1]['nickname'] || 'nickname'])
                            ])
                        ]),
                        h('div', { class: 'round3' }, [
                            h('img', { 
                                src: this.state.winners && this.state.winners[2] && this.state.winners[2]['avatar'] 
                                    ? `https://${window.env.IP}:3000/media${this.state.winners[2]['avatar']}` 
                                    : './images/people_14024721.png'
                            }),
                            h('h2', {}, [this.state.winners && this.state.winners[2] && this.state.winners[2]['nickname'] || 'nickname'])
                        ]),
                        h('div', { class: 'trophy' }, [
                            h('img', { src: './images/gold-cup-removebg-preview.png' })
                        ])
                    ])
                ]) : h('div', { class: 'game-content' },
                    [
                        h('div', { class: 'user-profile' }, [
                            h('img', { src: `https://${window.env.IP}:3000${this.state.currentMatch.avatar1}` }), // /media kkk
                            h('h3', {}, [this.state.currentMatch.player1])
                        ]),
                        h('div', { class: 'vs' }, [
                            h('img', { src: './images/vs.png' })
                        ]),
                        
                        h('div', { class: 'invited' },
                            [
                                h('img', { src: `https://${window.env.IP}:3000${this.state.currentMatch.avatar1}` }),
                                h('h3', {}, [this.state.currentMatch.player2])
                            ]
                        )
                    ]), h('div', { class: 'friends-bar' }, [
                            h(sidebarRight, {})
                    ]), this.state.isBlur ? 
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
