import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../../package/index.js'
// import { JoinedTournaments } from './JoinedTournaments.js'
import { header } from '../../../components/header.js'
import { sidebarLeft } from '../../../components/sidebar-left.js'
import { OnlineTournamentForm } from '../../../components/tournament/OnlineTournamentForm.js'
import { JoinedTournaments } from '../../../components/tournament/JoinedTournaments.js'
import { AvailableTournaments } from '../../../components/tournament/AvailableTournaments.js'

export const OnlineTournament = defineComponent({
    state(){
        return {
        }
    },

    render()
    {
        return h('div', {id:'global'}, [h(header, {}),h('div', {class:'content'}, 
            [h(sidebarLeft, {}), h('div', {className: 'online-tournament'},
                [
                    h('div', {}, [h(AvailableTournaments, {})]),
                    h('div', {}, [h(JoinedTournaments, {})]),
                    h('div', {}, [h(OnlineTournamentForm, {})])
                ])
            ]) 
        ])
    },
})

