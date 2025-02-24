import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../../package/index.js'
import { header } from '../../../components/header.js'
import { sidebarLeft } from '../../../components/sidebar-left.js'


let socket = null;
let redirectTimeout = null;
export const LocalHierarchy = defineComponent({

    state(){
        return {
            matcheRounds : [],
            currentMatch : null,
            matchIndex   : 0,
            winners      :[]
        }
    },

    async matchmake_players()
    {
        if (!socket || socket.readyState !== WebSocket.OPEN) {

            socket              = new WebSocket(`wss://${window.env.IP}:3000/ws/matchmaking/`);
            const tournamentId  = this.appContext.router.params.id;

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
                
                if (data.success)
                {
                    this.updateState({
                        matcheRounds : data.matches,
                        winners      : data.winners
                    })
                    if (data.rounds != undefined)
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
                    console.log('Redirect timeout cleared.');
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
        // i think i will emit an event in match then when the match finish i will back here then i will update matches 
        //in screen and then qannace next index ...
    },

    onUnmounted()
    {
        if (socket) {
            console.log('WebSocket connection closed');
            socket.close();
        }
    },

    render()
    {
        console.log("------------> this.state.winners :", this.state.winners)
        return h('div', {id:'global'}, [h(header, {}),h('div', {class:'content'}, 
            [h(sidebarLeft, {}),
                this.state.currentMatch === null ?
                h('div', { class: 'hierarchy-global-content' }, [
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
                            h('img', { src: `https://${window.env.IP}:8002${this.state.currentMatch.avatar1}` }),
                            h('h3', {}, [this.state.currentMatch.player1])
                        ]),
                        h('div', { class: 'vs' }, [
                            h('img', { src: './images/vs.png' })
                        ]),
                        
                        h('div', { class: 'invited' },
                            [
                                h('img', { src: `https://${window.env.IP}:8002${this.state.currentMatch.avatar1}` }),
                                h('h3', {}, [this.state.currentMatch.player2])
                            ]
                        )
                    ])
            ]) 
        ])  
    }                    
})
