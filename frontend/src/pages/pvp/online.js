import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString}  from '../../package/index.js'

import { header }               from '../../components/header.js'
import { sidebarLeft }          from '../../components/sidebar-left.js'

export const OnlinePvp = defineComponent({
    state(){
        return {
                player_data: []
            }
    },
    
    initWebSocket() {
        const socket = new WebSocket('ws://localhost:8000/ws/matchmaking/');

        socket.onopen = () => {
            console.log('WebSocket connection established');
            socket.send(JSON.stringify({ action: 'find_opponent' }));
        };
        console.log("hereeeeeeeeeeeeeeeeeeeeee")
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('WebSocket Data:', data);
            // this.updateState({
            //     player_data: data
            // })
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    },
    
    onMounted() {
        this.initWebSocket();
    },

    render()
    {
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
                    h('div', { class: 'invited' }, [
                        h('img', { src: './images/people_14024721.png' }),
                        h('h3', {}, ["searching..."])
                    ])
                ])
            ]) 
        ])
    }                    
})
