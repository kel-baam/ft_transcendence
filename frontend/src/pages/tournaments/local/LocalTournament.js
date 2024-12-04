import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../../package/index.js'
import { header } from '../../../components/header.js'
import { sidebarLeft } from '../../../components/sidebar-left.js'

export const LocalTournament = defineComponent({
    state(){
        return { }
    },
    
    render()
    {
        return h('div', {id:'global'}, [h(header, {}),h('div', {class:'content'}, 
            [h(sidebarLeft, {}),
                h('div', { class: 'local-tournament' }, [
                    h('div', { class: 'create' }, [
                        h('div', { class: 'title' }, [
                            h('h1', {}, ['Created Tournaments'])
                        ]),
                        h('div', { class: 'tournaments' }, [
                            ...[
                                { title: 'Battle of the Bgggggggggggggggggggggggggggggggest' },
                                { title: 'Battle of the Best' },
                                { title: 'Battle of the Best' },
                                { title: 'Battle of the Best' },
                                { title: 'Battleaaaaaaaaaaaaa of the Besta' },
                                { title: 'Battle of the Best' },
                                { title: 'Battle of the Best' },
                                { title: 'Battle of the Best' },
                                { title: 'Battle of the Best' },
                                { title: 'Battle of the Best' },
                                { title: 'Battle of the Best' },
                                { title: 'Battle of taaaaaaaaaaaaaaahe Best' },
                                { title: 'Battle of the Best' },
                                { title: 'Battle of the Best' },
                                { title: 'Battle of the Best' }
                            ].map(tournament => 
                                h('div', { class: 'created' }, [
                                    h('img', { src: './images/niboukha.png' }),
                                     h('a', { href: '#' }, [tournament.title]),
                                    h('i', { class: 'fa-regular fa-circle-xmark icon' })
                                ])
                            )
                        ])
                    ]),
                    h('div', { class: 'create_one' }, [
                        h('div', { class: 'title' }, [
                            h('h2', {}, ['Create A Tournament'])
                        ]),
                        h('form', {}, [
                            h('div', { class: 'form' }, [
                                h('div', { class: 'tournament-name' }, [
                                    h('label', { htmlFor: 'fname' }, ['Tournament Name:']),
                                    h('input', { type: 'text', name: 'tournament_name', placeholder: 'Enter tournament name...' })
                                ]),
                                h('div', { class: 'players-name' }, [
                                    h('label', { htmlFor: 'players' }, ['Player Names:']),
                                    h('div', { class: 'players' }, [
                                        ...[1, 2, 3].map(i =>
                                            h('div', { class: 'section' }, [
                                                h('input', { 
                                                    type: 'text', 
                                                    name: `player${i}`, 
                                                    class: `player${i}`, 
                                                    placeholder: 'Enter player name...' 
                                                }),
                                                h('div', { class: 'image' }, [
                                                    h('img', { 
                                                        src: './images/people_14024721.png', 
                                                        alt: `Player ${i} Image`, 
                                                        class: `player${i}-image` 
                                                    }),
                                                    h('div', { 
                                                        class: 'edit_icon',
                                                        on: {
                                                            click: () => {
                                                                document.getElementById(`file-upload-${i}`).click();
                                                            }
                                                        }
                                                    }, [
                                                        h('input', { 
                                                            type: 'file', 
                                                            id: `file-upload-${i}`, 
                                                            name: `player${i}_image`, 
                                                            accept: 'image/*', 
                                                            on: { change: (event) => {
                                                                const file = event.target.files[0];
                                                                if (file) {
                                                                    const reader = new FileReader();
                                                                    reader.onload = (e) => {
                                                                        document.querySelector(`.player${i}-image`).src = e.target.result;
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                }
                                                            }}
                                                        }),
                                                        h('i', { class: 'fas fa-edit' })
                                                    ])
                                                ])
                                            ])
                                        )
                                    ])
                                ]),
                                h('div', { class: 'submit' }, [
                                    h('button', { 
                                        type: 'submit',
                                        disabled: false, 
                                        on :{ click:()=>{ this.appContext.router.navigateTo('/tournament/local/hierachy/1') } }
                                    }, ['SUBMIT'])
                                ])
                            ])
                        ])
                    ])                    
                ]) 
            ]) 
        ])
    }
})

// h('div', { class: 'game-title' }, [
//     h('h1', {}, ['Create Your Local Ping Pong Tournament'])
// ]),
// h('form', { onSubmit: this.handleSubmit }, [
//     h('div', { class: 'form' }, [
//         h('div', { class: 'tournament-name' }, [
//             h('label', { htmlFor: 'fname' }, ['Tournament Name:']),
//             h('input', { type: 'text', name: 'tournament_name', placeholder: 'Enter tournament name...' })
//         ]),
//         h('div', { class: 'players-name' }, [
//             h('label', { htmlFor: 'players' }, ['Player Names:']),
//             h('div', { class: 'players' }, [
//                 ...[1, 2, 3, 4].map(i => h('div', { class: `line${i}` }, [
//                     h('input', { 
//                         type: 'text', 
//                         name: `player${i}`, 
//                         class: `player${i}`, 
//                         placeholder: 'Enter player name...' 
//                     }),
//                     h('div', { class: 'image' }, [
//                         h('img', { 
//                             src: './images/people_14024721.png', 
//                             alt: `Player ${i} Image`, 
//                             class: `player${i}-image` 
//                         }),
//                         h('div', { 
//                             class: 'edit_icon',
//                             on : {
//                                 click:()=>{
//                                     document.getElementById(`file-upload-${i}`).click()
//                                 }
//                             }
//                         }, [
//                             h('input', { 
//                                 type: 'file', 
//                                 id: `file-upload-${i}`, 
//                                 name: `player${i}_image`, 
//                                 accept: 'image/*', 
//                                 on : {change: (event) => {
//                                     const file = event.target.files[0];
//                                     if (file) {
//                                         const reader = new FileReader();
//                                         reader.onload = (e) => {
//                                             const imgElement = document.querySelector(`.player${i}-image`);
//                                             imgElement.src = e.target.result;
//                                         };
//                                         reader.readAsDataURL(file);
//                                     }
//                                 }}
//                             }),
//                             h('i', { class: 'fas fa-edit' })
//                         ])
//                     ])
//                 ]))
//             ])
//         ])
//     ]),
//     h('div', { class: 'submit' }, [
//             h('button', { type: 'submit', id: 'submitbtn', disabled: false , on :{click:()=>{
//                 this.appContext.router.navigateTo('/tournament/local/hierachy/1')
//             }}}, ['SUBMIT'])
//     ])