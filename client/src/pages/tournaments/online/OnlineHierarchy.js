import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../../package/index.js'
import { header } from '../../../components/header.js'
import { sidebarLeft } from '../../../components/sidebar-left.js'

export const OnlineHierarchy = defineComponent({

    state(){
        return {
            matcheRounds    : [],
            socket          : null,
        }
    },

    matchmake_players()
    {
        if (!this.state.socket || this.state.socket.readyState !== WebSocket.OPEN) {
            
            this.state.socket   = new WebSocket('ws://10.14.3.3:8002/ws/matchmaking/');
            const tournamentId  = this.appContext.router.params.id;
        
            console.log("---> : ", tournamentId)
            
            this.state.socket.onopen = () => {
                console.log('WebSocket connection established');

                this.state.socket.send(JSON.stringify({
                    action          : 'online_tournament',
                    tournamentId    : tournamentId
                }));
            };

            this.state.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
            
                console.log('WebSocket Data:', data);
            
                if (data.success) {
                    this.updateState({
                        matcheRounds : data.matches
                    });
                } else {
                    console.error(`Error (${data.code}):`, data.error || 'Unknown error');
                    this.appContext.router.navigateTo(`/404`);
                }
            };

            this.state.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        }
    },
   
    onMounted()
    {
        this.matchmake_players();
    },

    onUnmounted() {
        if (this.state.socket) {
            console.log('WebSocket connection closed');
            this.state.socket.close();
        }
    },

    //onUnmounted

    render()
    {

        return h('div', {id:'global'}, [h(header, {}),h('div', {class:'content'}, 
            [h(sidebarLeft, {}),
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
                                            src: match.avatar1 ? `http://10.14.3.3:8002${match.avatar1}` : './images/people_14024721.png'
                                        }),
                                        h('h2', {}, [match.player1])
                                    ]),
                                    h('div', { class: 'vs' }, [
                                        h('img', { src: './images/vs (2).png' })
                                    ]),
                                    h('div', { class: 'player2' }, [
                                        h('img', { 
                                            src: match.avatar2 ? `http://10.14.3.3:8002${match.avatar2}` : './images/people_14024721.png'
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
                                h('img', { src: './images/vs (2) 5 (1).png' })
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
            ]) 
        ])  
    }                    
})
