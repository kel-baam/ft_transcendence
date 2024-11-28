import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../../package/index.js'
// import { Match } from './match.js'
import { header } from '../../../components/header.js'
import { sidebarLeft } from '../../../components/sidebar-left.js'

export const Hierarchy = defineComponent({

    state(){
        return {
            data : [
                {
                    player1: { username:"niboukha", image:'./images/niboukha.png'  },
                    player2: { username:"kel-baam", image:'./images/niboukha.png'  },
                },
                {
                    player1: {  username:"shicham", image:'./images/niboukha.png'  },
                    player2: { username:"kjarmoum", image:'./images/niboukha.png' },
                }
            ],
            // firstMatch:"", // You should add it to the props of LocalTournament to avoid the problem of re-initialization
            // secondMatch:""
        }
    },

    render()
    { 
        return h('div', {id:'global'}, [h(header, {}),h('div', {class:'content'}, 
            [h(sidebarLeft, {}),
                h('div', { class: 'hierarchy-global-content' }, [
                    h('div', { class: 'title' }, [
                        h('h1', {}, ['Tournament in Progress'])
                    ]),
                    h('div', { class: 'rounds' }, [
                        h('div', { class: 'round1' }, 
                            this.state.data.map((players, i) =>
                                h('div', { class: `match${i + 1}` }, [
                                    h('div', { class: 'player1' }, [
                                        h('img', { src: `${players.player1.image}` }),
                                        h('h2', {}, [ `${players.player1.username}`])
                                    ]),
                                    h('div', { class: 'vs' }, [
                                        h('img', { src: './images/vs (2).png' })
                                    ]),
                                    h('div', { class: 'player2' }, [
                                        h('img', { src: `${players.player2.image}` }),
                                        h('h2', {}, [`${players.player2.username}`])
                                    ])
                                ])
                            ),
                        ),
                        h('div', { class: 'btn_1' }, [
                            h('div', { class: 'first' }, [
                                // h('a', { href: '' }, [
                                    h('button', { type: 'button', class: 'btn', on : {click:()=>{
                                        this.emit('firstMatch-start',  'playable')
                                        // this.updateState({firstMatch:"playable"}) 
                                    }} ,
                                    // style : (firstMatch === "completed") ? {
                                    //     cursor: 'not-allowed', opacity: '0.6'
                                    // } : {},
                                    // disabled:firstMatch === "completed"
                                }, ['play'])
                                // ])
                            ]),
                            h('div', { class: 'second' }, [
                                // h('a', { href: '' }, [
                                    h('button', { type: 'button', class: 'btn', on : {click:()=>{
                                        this.emit('secondMatch-start', 'playable')
                                        // this.updateState({secondMatch:"playable"})
                                    }
                                } ,
                                // style : (secondMatch === "completed") ? {
                                //     cursor: 'not-allowed', opacity: '0.6'
                                // } : {},
                                // disabled:secondMatch === "completed"
                            }, ['play'])
                            // ])
                        ])
                    ]),
                    h('div', { class: 'round2' }, [
                        
                        h('div', { class: 'player1' }, [
                            h('img', { src: './images/people_14024721.png' }),
                            h('h2', {}, ['username'])
                        ]),
                        h('div', { class: 'vs' }, [
                            h('img', { src: './images/vs (2).png' })
                        ]),
                        h('div', { class: 'player2' }, [
                            h('img', { src: './images/people_14024721.png' }),
                            h('h2', {}, ['username'])
                        ])
                    ]),
                    h('div', { class: 'btn_2' }, [
                        h('a', { href: '' }, [
                            h('button', { type: 'button', class: 'btn', 
                                // style: (this.state.firstMatch || this.state.secondMatch)?
                                // {
                                //     cursor: 'not-allowed', opacity: '0.6'
                                // } : {},
                                // disabled:(this.state.firstMatch || this.state.secondMatch)
                            }, ['play'])
                        ])
                    ]),
                    h('div', { class: 'round3' }, [
                        h('img', { src: './images/people_14024721.png' }),
                        h('h2', {}, ['username'])
                    ]),
                    h('div', { class: 'trophy' }, [
                        h('img', { src: './images/gold-cup-removebg-preview.png' })
                        ])
                    ])
                ])
            ]) 
        ])  
    }                    
})

// console.log(">>>>>>>>>>>>>>>>>>> this.props in he ",this.props)
// const {firstMatch, secondMatch} = this.props
// console.log(">>>>>>>>>>>>>>>>>>> firstMatch ", firstMatch , " | secondMatch ", secondMatch)
// this.state.firstMatch= this.props.firstMatch
// this.state.secondMatch = this.props.secondMatch

// console.log(">>>>>>>>>>>>>> ", this.state.firstMatch, this.state.secondMatch)

// if (firstMatch === "playable" || secondMatch === "playable")
// {
//     console.log("<<<<<<<<<<<<<<<< here create a match")
//     return h(Match,{type:"local_tournament", on : {
//     'firstMatch-start' : (status)=>{
//         console.log("++++++++++++++++++++>  hello here")
//         this.emit('firstMatch-start', status)}
//     }})
// }

// if(Object.keys(this.props).length !==0)
// {
//     // console.log("------------------> ", (Object.keys(this.props)))
//     (Object.entries(this.props)[0][0] === "this.state.firstMatch")? 
//     this.state.firstMatch = "completed" : this.state.secondMatch="completed"
// }
