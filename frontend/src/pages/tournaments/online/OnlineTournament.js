import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'
// import { UserJoinedTournaments } from './UserJoinedTournaments.js'


export const OnlineTournament = defineComponent({
    state(){
        return {
        }
    },

    render()
    {
        return h('div', { className: 'online-tournament' },[
            h('div', {}, [h('div', {})]),
            // h('div', {}, [h(UserJoinedTournaments, {})]),
            h('div', {},
                // [this.renderCreateTournamentForm()]
            )
        ])
    }                    
})
