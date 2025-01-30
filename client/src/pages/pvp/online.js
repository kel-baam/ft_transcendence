import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString}  from '../../package/index.js'

import { header }               from '../../components/header.js'
import { sidebarLeft }          from '../../components/sidebar-left.js'
import { showErrorNotification} from '../utils/errorNotification.js';

export const OnlinePvp = defineComponent({
    state(){
        return {
                player_data : {},
                socket      : new WebSocket('ws://10.14.3.3:8002/ws/matchmaking/')
            }
    },
    
    async initWebSocket() {
        // const socket = new WebSocket('ws://localhost:8002/ws/matchmaking/');

        this.state.socket.onopen = () => {
            console.log('WebSocket connection established');
            this.state.socket.send(JSON.stringify({ action: 'find_opponent' }));
        };
        console.log("hereeeeeeeeeeeeeeeeeeeeee")
        this.state.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('WebSocket Data:', data);
            if (data.action == "match_not_found")
            {
                showErrorNotification(data.message)
                this.appContext.router.navigateTo('/playerVSplayer')
            }
            else
            {
                this.updateState({
                    player_data: data.opponent_id_1
                })
                //now redirect to the match 
            }
        };

        this.state.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    },
    
    onMounted() {
        this.initWebSocket();
    },

    onUnmounted() {
        if (this.state.socket) {
            console.log('WebSocket connection closed');
            this.state.socket.close();
        }
    },

    render()
    {
        console.log("-----------> " , this.state.player_data)

        return h('div', {id:'global'}, [h(header, {}),h('div', {class:'content'}, 
            [h(sidebarLeft, {}), h('div', { class: 'game-content' },
                [
                    h('div', { class: 'user-profile' }, [
                        h('img', { src: './images/niboukha 1 (1).png' }),
                        h('h3', {}, ["niboukha"])
                    ]),
                    h('div', { class: 'vs' }, [
                        h('img', { src: './images/vs (2).png' })
                    ]),
                    
                    h('div', { class: 'invited' },
                        !Object.keys(this.state.player_data).length ? [
                            h('img', { src: './images/people_14024721.png' }),
                            h('h3', {}, ["searching..."])
                        ] : [
                            h('img', { src: './images/people_14024721.png' }),
                            h('h3', {}, [this.state.player_data.username])
                        ]
                    )
                ])
            ]) 
        ])
    }                    
})
