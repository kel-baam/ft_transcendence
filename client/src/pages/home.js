import{createApp, defineComponent, DOM_TYPES, h} from '../package/index.js'

import { header } from '../components/header.js'
import { sidebarLeft } from '../components/sidebar-left.js'
import { LeaderboardHome } from '../components/home/LeaderboardHome.js'
import { WelcomingSection } from '../components/home/WelcomingSection.js'
import { TrainingBoot } from '../components/home/TrainingBoot.js'
import { TournamentSection } from '../components/home/TournamentSection.js'
import { PlayerVsPlayer } from '../components/home/PlayerVsPlayer.js'
// import { InformationsForm } from '../components/login/form.js'



export const Home = defineComponent({
    state(){
        return {
            isFilled:true,
            }
    },
    test()
    {
        // onmessagee and onerror and onclose are event handler
        const socket = new WebSocket(`ws://localhost:3000/socket/`);
        
        socket.onopen = () => {
        console.log("WebSocket is connected. from the client and the handshare complete");
        socket.send(JSON.stringify({ message: "Hello WebSocket client!" }));
        };
        
        socket.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            if(data.error === "token expired")
            {
                socket.onclose()
                const refreshAccessToken = await fetch('http://localhost:3000/auth/refreshToken',{
                    method:'GET',
                    credentials: 'include',})
                    console.log("custome feeetch")
                    console.log("ref data=>",refreshAccessToken)
                
                    if(!refreshAccessToken.ok)           
                        return refreshAccessToken;
                
                console.log("yeeeeeeeeeeeeeeeeeeees message client",data.error)
                this.test()
            }
        };
        socket.onclose = (event) => {
            console.log("onclose client", event);
          };

    },
    render()
    {
        // this.test()
        return h('div', {id:'global'}, [h(header, {}),h('div', {class:'content'}, 
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

