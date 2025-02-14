import{defineComponent, h} from '../package/index.js'
import { header } from '../components/header.js'
import { sidebarLeft } from '../components/sidebar-left.js'

  export const Leaderboard = defineComponent({
    state(){
        return {
            socket : null,
            errors :{},
            state : [
                            {
                                "id": 1,
                                "name": "Alice",
                                "rank": 1,
                                "score": 95,
                                "level": 5
                            },
                            {
                                "id": 2,
                                "name": "Bob",
                                "rank": 2,
                                "score": 90,
                                "level": 4
                            },
                            {
                                "id": 3,
                                "name": "Charlie",
                                "rank": 3,
                                "score": 85,
                                "level": 4
                            },
            ]

    }
    },
    createPlayerEntry(rank, name, score, level, badgeSrc) {
        return h("div", { className: "space" },
            [
                h("div", {}, [h("p", {}, [rank])]),
                h("div", {}, [h("p", {}, [name])]),
                h("div", {}, [h("p", {}, [score])]),
                h("div", {}, [h("p", {}, [level])]),
                h("div", {}, [h("img", { src: badgeSrc })])
            ]
        );
        },

    render(){
        return(
                h('div',{id:'global'},[
                    h(header, {}),
                    h('div', {class:'content' ,style:{'overflow-y': 'hidden'}}, 
                        [h(sidebarLeft, {}),
                            h('div',{class:'home-content'},[
                                h('div',{class:'leaderboard-title'},[
                                    h('h1',{},['Leaderboard'])
                                ]),
                                h('div',{class: 'pics-rank'},[
                                    h('div',{class:'first-place'},[
                                        h('img',{class:'crown-pic', src:'./images/crown-removebg-preview.png'}),
                                        h('img',{class:'first-pic', src:'./images/kel-baam.png'}),
                                        h('h4',{},['kel-baam'])
                                    ]),
                                    h('div',{class:'second-third-place'},[
                                            h('div',{class:'second-place'},[
                                                h('img',{class:'second-symbol',src:"./images/second_1021187.png"}),
                                                h('img',{class:'second-pic',src:'./images/niboukha.png',alt:'second player picture'}),
                                                h('h4',{},['niboukha'])
                                            ]),
                                            h('div',{class:'third-place'},[
                                                h('img',{class:'third-symbol',src:'./images/third.png'}),
                                                h('img',{class:'third-pic',src:'./images/niboukha.png',alt:'third player picture'}),
                                                h('h4',{},['niboukha'])
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
                                                h('p',{},['Name']),
                                            ]),
                                            h('div',{},[
                                                h('p',{},['Score']),
                                            ]),
                                            h('div',{},[
                                                h('p',{},['Level']),
                                            ]),
                                            h('div',{},[
                                                h('p',{},['Badge']),
                                            ]),
                                        ]),
                                        h('div',{class:'info'},
                                            [
                                                this.createPlayerEntry('#1',"ffff","fffff","5","./images/diamond.png"),
                                                this.createPlayerEntry('#1',"ffff","fffff","5","./images/diamond.png"),
                                                this.createPlayerEntry('#1',"ffff","fffff","5","./images/diamond.png"),
                                                this.createPlayerEntry('#1',"ffff","fffff","5","./images/diamond.png"),
                                                this.createPlayerEntry('#1',"ffff","fffff","5","./images/diamond.png"),
                                                this.createPlayerEntry('#1',"ffff","fffff","5","./images/diamond.png"),
                                                this.createPlayerEntry('#1',"ffff","fffff","5","./images/diamond.png"),
                                                this.createPlayerEntry('#1',"ffff","fffff","5","./images/diamond.png"),
                                                this.createPlayerEntry('#1',"ffff","fffff","5","./images/diamond.png"),
                                            ]
                                        )
                                    ])
                                ])
                            ])
                    ]),
            ])
          
        )}

})