import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'


export const AvailableTournaments = defineComponent({
    state(){
        return {
           
        }
    },

    render()
    {
        return h('div', { class: 'availableTournament' },
            [
                h('div', { class: 'title' }, [
                    h('h1', {}, ['Available Tournaments'])]),
                h('div', { class: 'tournaments' },
                [
                    h('div', {class: 'available'},[
                        h('img', {src: './images/kel-baam.png' }),
                        h('a', {href: '#'}, ["Souad sfkdh"]),
                        h('i', { class: 'fa-solid fa-user-plus icon'})
                    ]),
                    h('div', {class: 'available'},[
                        h('img', {src: './images/kel-baam.png' }),
                        h('a', {href: '#'}, ["Souad 65sjgs"]),
                        h('i', { class: 'fa-solid fa-user-plus icon'})
                    ]),
                    h('div', {class: 'available'},[
                        h('img', {src: './images/kel-baam.png' }),
                        h('a', {href: '#'}, ["Souad tryugs"]),
                        h('i', { class: 'fa-solid fa-user-plus icon'})
                    ])
                ]
                )
            ]
        );
    }
})
