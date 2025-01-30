import{createApp, defineComponent, DOM_TYPES, h} from '../package/index.js'

import { header } from '../components/header.js'
import { sidebarLeft } from '../components/sidebar-left.js'
import { LeaderboardHome } from '../components/home/LeaderboardHome.js'
import { WelcomingSection } from '../components/home/WelcomingSection.js'
import { TrainingBoot } from '../components/home/TrainingBoot.js'
import { TournamentSection } from '../components/home/TournamentSection.js'
import { PlayerVsPlayer } from '../components/home/PlayerVsPlayer.js'

export const Home = defineComponent({
    state(){
        return {
            socket  : null,
            isFilled:true,
            notificationActive: false,
        }
    },

    // onMounted() {
    //     this.initWebSocket();
    // },

    // initWebSocket() {
    //     if (!this.state.socket || this.state.socket.readyState !== WebSocket.OPEN) {

    //         this.state.socket = new WebSocket('ws://localhost:8001/ws/notification/');
    
    //         this.state.socket.onopen = () => {
    //             console.log('WebSocket connection established');
    
    //         };
    
    //         this.state.socket.onmessage = async (event) => {

    //             console.log('Message received in notif : ');
                
    //             const data = JSON.parse(event.data);
    //             this.updateState({
    //                 notificationActive : true,
    //             })
    //             console.log("--------------> ", data)
    //         };
    
    //         this.state.socket.onerror = (error) => {
    //             console.error('WebSocket error:', error);
    //         };
    
    //         this.state.socket.onclose = () => {
    //             console.log('WebSocket connection closed');
    //         };
    //     }
    // },

    render()
    {
        return h('div', {id:'global'}, [h(header, {
            icon_notif: this.state.notificationActive,
            on          : {
                iconClick :()=>{
                    this.updateState({ notificationActive: !this.state.notificationActive }); 
                }
            }
        }),h('div', {class:'content'}, 
            [
                h(sidebarLeft, {}), h('div', {class:'home-content' ,style:{  filter: !this.state.isFilled?'blur(3px)':undefined }},
                [
                    h('div', { class: 'home-top' },
                        [h(LeaderboardHome, {}), h(WelcomingSection, {})]
                    ),
                    h('div', { class: 'home-down'},
                        [h(TrainingBoot, {}), h(TournamentSection, {}), h(PlayerVsPlayer, {}) ]
                    )
                ]),
            !this.state.isFilled ? h(InformationsForm,{}):undefined,
        ]) 
        ])
    }                    
})

