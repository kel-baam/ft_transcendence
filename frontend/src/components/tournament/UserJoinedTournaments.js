import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'


export const UserJoinedTournaments = defineComponent({
    state(){
        return {
           
        }
    },

    render()
    {
        return h('div', { className: 'joinedTournament' },
            h('div', { className: 'title' },
                h('h1', {}, 'Joined Tournaments')),
            h('div', { className: 'tournaments' }, 
                // ...joinedTournamentList
            )
        );        
    }                    
})
