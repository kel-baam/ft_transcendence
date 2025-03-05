import{defineComponent, h} from '../package/index.js'
import { header } from '../components/header.js'
import { sidebarLeft } from '../components/sidebar-left.js'
import { sidebarRight } from '../components/sidebar-right.js'
import { customFetch } from '../package/fetch.js'

  export const Leaderboard = defineComponent({
    state(){
        return {
            socket : null,
            errors :{},
            data :[],
            isloading : true,

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
        customFetch(`https://${window.env.IP}:3000/api/user/ranking`)
        .then(res=>
            {
                console.log(">>>>>>>>>>>>>>>>>>>> res status in leaderboard : ", res.status)
                return res.json()
            }
        )
        .then(result=>
        {
            this.updateState({
                data : result,
                isloading:false

            })
            console.log("----------------------> result : ", result)
        }
        )

    },
    createPlayerEntry(rank, name, score, level, badgeSrc) {
        // console.log("yyyy",rank,name)
        return h("div", { class: "space" },
            [
                h("div", {}, [h("p", {}, [rank])]),
                h("div", {}, [h("p", {}, [name])]),
                h("div", {}, [h("p", {}, [score])]),
                h("div", {}, [h("p", {}, [level])]),
                // h("div", {}, [h("img", { src: badgeSrc })])
            ]
        );
        },
// style:{'overflow-y': 'hidden'}
    render(){
        const {data, isloading} = this.state
        const playersLen = Object.keys(data).length

        // console.log("this.state.data",Object.keys(data).length 
        return(
                h('div',{id:'global'},[
                    h(header, {}),
                    h('div', {class:'content',style:{'overflow-y': 'hidden'} }, 
                        [h(sidebarLeft, {}),
                            h('div',{class:'home-content'}, playersLen > 0 ?[
                                
                                h('div',{class:'leaderboard-title'},[
                                    h('h1',{},['Leaderboard'])
                                ]),
                                h('div',{class: 'pics-rank'},[
                                    h('div',{class:'first-place'}, playersLen >= 1  ?[
                                        h('img',{class:'crown-pic', src:'./images/crown-removebg-preview.png'}),
                                        h('img',{class:'first-pic', src:`${data[0].picture}`}),
                                        h('h4',{},[`${data[0].username}`])
                                    ]:[h('img',{class:'crown-pic', src:'./images/crown-removebg-preview.png'}),
                                        h('img',{class:'first-pic',src:'./images/accountUser.png',alt:'third player picture'}),
                                        h('h1',{},['?'])
                                    ]),
                                    h('div',{class:'second-third-place'},[
                                        h('div',{class:'second-place'},playersLen >= 2 ?[
                                            h('img',{class:'second-symbol',src:"./images/second_1021187.png"}),
                                            h('img',{class:'second-pic',src:`${data[1].picture}`,alt:'second player picture'}),
                                            h('h4',{},[`${data[1].username}`])
                                        ]:[h('img',{class:'second-symbol',src:"./images/second_1021187.png"}),
                                            h('img',{class:'second-pic',src:'./images/accountUser.png',alt:'third player picture'}),
                                            h('h1',{style:{fontSize:'20px',color:"#BBB7B3"}},['?'])]
                                        ),
                                        h('div',{class:'third-place'},playersLen >= 3 ?[
                                            h('img',{class:'third-symbol',src:'./images/third.png'}),
                                            h('img',{class:'third-pic',src:`${data[2].picture}`,alt:'third player picture'}),
                                            h('h4',{},[`${data[2].username}`])
                                        ]:[h('img',{class:'third-symbol',src:'./images/third.png'}),
                                            h('img',{class:'third-pic unknown',src:'./images/accountUser.png',alt:'third player picture'}),
                                            h('h1',{style:{fontSize:'20px',color:"#BBB7B3"}},['?'])
                                        ])
                                    ])
                                ]),
                                h('div',{class:'rank-info'},[
                                    h('div',{class:'players-info'},[
                                        h('div',{class:'space first-row'},[
                                            h('div',{},[
                                                h('p',{},['Rank']),
                                            ]),
                                            h('div',{},[
                                                h('p',{},['UserName']),
                                            ]),
                                            h('div',{},[
                                                h('p',{},['Score']),
                                            ]),
                                            h('div',{},[
                                                h('p',{},['Level']),
                                            ]),
                    
                                        ]),
                                        h('div',{class:'info'},
                                                data.map((player, index) => {
                                                    
                                                    return this.createPlayerEntry(index + 1, player.username,player.score,player.level,"./images/diamond.png")

                                                }),
                                            )
                                              
                                        // )
                                            
                                    ])
                                ])
                            ] : !isloading ?[
                                h('div',{class:'empty'},[
                                    h('div',{class:'leaderboard-title'},[
                                        h('h1',{},['Leaderboard'])
                                    ]),
                                    h('img',{class:'trophy-pic', src:'./images/gold-cup-removebg-preview.png'}),
                                    h('h1',{},['No matches played yet'])

                                ])
                            ] : []),
                              h('div', { class: 'friends-bar' }, [
                                h(sidebarRight, {})
                                ]),
                    ]),
            ])
          
        )}

})