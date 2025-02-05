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
            isFilled:true,
            }
    },
   
    render()
    {
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
        ]) 
        ])
    }                    
})

