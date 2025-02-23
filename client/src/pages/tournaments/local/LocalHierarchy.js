import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../../package/index.js'
import { header } from '../../../components/header.js'
import { sidebarLeft } from '../../../components/sidebar-left.js'


let socket = null;

export const LocalHierarchy = defineComponent({

    state(){
        return {
            matcheRounds : [],
            currentMatch : null,
            matchIndex   : 0
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
                console.log(data.error !== "Matchmaking already done")
                
                if (data.success)
                {
                    this.updateState({
                        matcheRounds : data.matches
                    })
                    // setTimeout(() => {
                    //     this.announceMatch(0)
                    // }, 2000);
                }
            };

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        }
    },

    announceMatch(index) {
        const matches = this.state.matcheRounds;

        if (index >= matches.length) {
            this.updateState({
                currentMatch : null,
                matchIndex   : 0
            });
            return;
        }
        
        console.log("---> : ", matches[index])
        
        this.updateState({
            currentMatch : matches[index],
            matchIndex   : index
        });

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

        return h('div', {id:'global'}, [h(header, {}),h('div', {class:'content'}, 
            [h(sidebarLeft, {}),
                this.state.currentMatch === null ?
                h('div', { class: 'hierarchy-global-content' }, [
                    h('div', { class: 'title' }, [
                        h('h1', {}, ['Tournament in Progress'])
                    ]),
                    h('div', { class: 'rounds' }, [
                        h('div', { class: 'round1' }, 
                            (this.state.matcheRounds || []).map((match, i) =>
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
