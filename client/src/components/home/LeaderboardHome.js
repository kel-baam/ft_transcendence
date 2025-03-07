import{defineComponent,  h} from '../../package/index.js'
import { customFetch } from '../../package/fetch.js';

export const LeaderboardHome = defineComponent({
    state(){
        return {
            data:[],
            isloading:true
        }
    },
    onMounted()
    {
        const userIcon = document.getElementById('leaderboard-icon');
  
        if (userIcon) {
          userIcon.style.color = "#F45250";
          userIcon.style.transform = "scale(1.1)";
          userIcon.style.webkitTransform = "scale(1.1)";
          userIcon.style.filter = "blur(0.5px)";
          userIcon.style.transition = "0.5s";
        }
        customFetch(`https://${window.env.IP}:3000/api/user/ranking?top=5`)
        .then(res=>
            {
                return res.json()
            }
        )
        .then(result=>
        {
            this.updateState({
                data     : result,
                isloading:false

            })
        }
        )
    },
    render(){
        const {data, isloading} = this.state
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
                        h('img', { src: this.state.data[0].picture, class: 'first-player', style  : {'object-fit' : 'cover'} })
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
                        h('img', { src: this.state.data[1].picture, style  : {'object-fit' : 'cover'}})
                    ]:[
                        h('img', { src: './images/accountUser.png'})
                    ]),
                    h('div', { class: 'third-player' }, playersLen > 2 ? [
                        h('img', { src: this.state.data[2].picture, style  : {'object-fit' : 'cover'}})
                    ]:[
                        h('img', { src: './images/accountUser.png'})
                    ])
                ]),
                h('div', { class: 'coll4' }, [
                    h('div', { class: 'rank-div' }, [
                        h('img', { src: './images/fa6-solid_ranking-star.png', class: 'rank' })
                    ]),
                    h('div', { class: 'user' }, [
                        h('h2', {'data-translate' : 'Username'}, ['Username'])
                    ]),
                    h('div', { class: 'score-div' }, [
                        h('h2', {'data-translate' : 'Score'}, ['Score'])
                    ])
                ]),
                h('div', { class: 'board' }, [
                    h('div', { class: 'lead' }, 
                        data.map((item )=>
                            h('div', { class: 'second-one' }, [
                            h('p', {}, [`${item.rank}`]),
                            h('h3', {}, [`${item.username.slice(0, 8)}`]),
                            h('div', { class: 'scor-coin' }, [
                                h('p', {}, [`${item.score}`]),
                                h('img', { src: './images/star_12921513.png', class: 'coin' })
                            ])
                        ]))
                    )
                ])
            ])
        ]: !isloading  ? [
            h('div',{class:'empty-leader-board'},[
                h('img',{class:'trophy-pic', src:'./images/gold-cup-removebg-preview.png'}),
                h('h1',{},['No matches played yet'])

            ])

        
        ]:[]
    );        
    }
})
