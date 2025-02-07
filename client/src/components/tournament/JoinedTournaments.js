import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'


export const JoinedTournaments = defineComponent({
    state(){
        return {
            data : [
                {
                    tournamentId:'1',
                    tournamentName:'kawtar sfkdhjsssssssssssssssssssssssgiosjgs',
                    creator : { nickname:'niboukha', avatar: {src: './images/niboukha.png'}}

                }
            ]
        }
    },

    render()
    {
        return h('div', { class: 'joinedTournament' },
            [
                h('div', { class: 'title' }, [
                    h('h1', {}, ['Joined Tournaments'])]),
                h('div', { class: 'tournaments' },
                    this.state.data.map(({ tournamentId, tournamentName, creator }, i) =>
                        h('div', {class: 'available'}, [
                            h('img', {src: `${creator.avatar.src}` }),
                            h('a', {href: '#'},  [tournamentName]),
                            h('i', {
                                class: 'fa fa-close icon', 
                                style: { color:'#D44444' },
                                on : {
                                    click : () => {
                                        this.updateState()
                                    }
                                }
                            })
                        ])
                    )
                )
            ]
        );        
    }                    
})
