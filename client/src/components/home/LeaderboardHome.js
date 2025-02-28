import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'

export const LeaderboardHome = defineComponent({
    state(){
        return {
            data:[
                  
            ]
        }
    },
    
    render(){
        // console.log(">>>>>>>>>>>>> data : ",  this.state.data.map(item =>
        //     h('div', { class: 'second-one' }, [
        //         h('p', {}, [`${item.user.Rank}`]),
        //         h('h3', {}, [`${item.user.username}`]),
        //         h('div', { class: 'scor-coin' }, [
        //             h('p', {}, [`${item.user.score}`]),
        //             h('img', { src: './images/star_12921513.png', class: 'coin' })
        //         ])
        //     ])
        // ))
        const {data} = this.state
        const playersLen = Object.keys(data).length
        return h('div', { class: 'leader-board' }, playersLen > 0?[
            h('div', { class: 'winners' }, [
                h('div', { class: 'coll1' },[
                    h('img', { src: './images/crown-removebg-preview.png' })
                ]),
                h('div', { class: 'coll2' }, [
                    h('div', { class: 'sec' }, [
                        h('img', { src: './images/second_1021187.png', class: 'second' })
                    ]),
                    h('div', { class: 'player' }, playersLen > 0?[
                        h('img', { src: this.state.data[0].picture, class: 'first-player' })
                        // h('img', { src: './images/niboukha.png', class: 'first-player' }),

                    ]:[
                        h('img', { src: './images/accountUser.png'})
                    ]),
                    h('div', { class: 'three' }, [
                        h('img', { src: './images/third.png', class: 'third' })
                    ])
                ]),
                h('div', { class: 'coll3' }, [
                    h('div', { class: 'second-player' },playersLen > 1 ? [
                        h('img', { src: this.state.data[1].picture })
                    ]:[
                        h('img', { src: './images/accountUser.png'})
                    ]),
                    h('div', { class: 'third-player' }, playersLen > 2 ? [
                        h('img', { src: this.state.data[2].picture})
                    ]:[
                        h('img', { src: './images/accountUser.png'})
                    ])
                ]),
                h('div', { class: 'coll4' }, [
                    h('div', { class: 'rank-div' }, [
                        h('img', { src: './images/fa6-solid_ranking-star.png', class: 'rank' })
                    ]),
                    h('div', { class: 'user' }, [
                        h('h2', {}, ['Username'])
                    ]),
                    h('div', { class: 'score-div' }, [
                        h('h2', {}, ['Score'])
                    ])
                ]),
                h('div', { class: 'board' }, [
                    h('div', { class: 'lead' }, 
                        this.state.data.map((item )=>
                            h('div', { class: 'second-one' }, [
                            h('p', {}, [`${item.Rank}`]),
                            h('h3', {}, [`${item.username}`]),
                            h('div', { class: 'scor-coin' }, [
                                h('p', {}, [`${item.score}`]),
                                h('img', { src: './images/star_12921513.png', class: 'coin' })
                            ])
                        ]))
                    )
                ])
            ])
        ]:[
            h('div',{class:'empty-leader-board'},[
                h('img',{class:'trophy-pic', src:'./images/gold-cup-removebg-preview.png'}),
                h('h1',{},['No matches played yet'])

            ])

        
        ]
    );        
    }
})
