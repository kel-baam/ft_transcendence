import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'

export const LeaderboardHome = defineComponent({
    state(){
        return {
            data:[
                {
                    user : {rank:'1', username:'niboukha', score:'2500'}
                },
                {
                    user : {rank:'2', username:'dfgdg', score:'2500'}
                },
                {
                    user : {rank:'3', username:'nxcvxc', score:'2500'}
                },
                {
                    user : {rank:'4', username:'dfsdftwer', score:'2500'}
                },
                {
                    user : {rank:'5 ', username:'sdfsda', score:'2500'}
                }
            ]
        }
    },
    
    render(){
        // console.log(">>>>>>>>>>>>> data : ",  this.state.data.map(item =>
        //     h('div', { class: 'second-one' }, [
        //         h('p', {}, [`${item.user.rank}`]),
        //         h('h3', {}, [`${item.user.username}`]),
        //         h('div', { class: 'scor-coin' }, [
        //             h('p', {}, [`${item.user.score}`]),
        //             h('img', { src: './images/star_12921513.png', class: 'coin' })
        //         ])
        //     ])
        // ))
        return h('div', { class: 'leader-board' }, [
            h('div', { class: 'winners' }, [
                h('div', { class: 'coll1' }, [
                    h('img', { src: './images/crown-removebg-preview.png' })
                ]),
                h('div', { class: 'coll2' }, [
                    h('div', { class: 'sec' }, [
                        h('img', { src: './images/second_1021187.png', class: 'second' })
                    ]),
                    h('div', { class: 'player' }, [
                        h('img', { src: './images/niboukha.png', class: 'first-player' })
                    ]),
                    h('div', { class: 'three' }, [
                        h('img', { src: './images/third.png', class: 'third' })
                    ])
                ]),
                h('div', { class: 'coll3' }, [
                    h('div', { class: 'second-player' }, [
                        h('img', { src: './images/kel-baam.png' })
                    ]),
                    h('div', { class: 'third-player' }, [
                        h('img', { src: './images/kjarmoum.png' })
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
                            h('p', {}, [`${item.user.rank}`]),
                            h('h3', {}, [`${item.user.username}`]),
                            h('div', { class: 'scor-coin' }, [
                                h('p', {}, [`${item.user.score}`]),
                                h('img', { src: './images/star_12921513.png', class: 'coin' })
                            ])
                        ]))
                    )
                ])
            ])
        ]);        
    }
})
