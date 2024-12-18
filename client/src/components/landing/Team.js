import{defineComponent,h} from '../../package/index.js'
   


   const TeamCards = defineComponent({
    props :{
        name:String,
        githubLink:String,
        linkdenLink:String,
        emailLink:String
    },
    state(){
        return {
            isLoading : true,
    }
    },
    render()
    {
        return h('div',{className:"card"},[
            h('div',{className:"pic"},[
                h('img',{src:"./images/pic.jpg"}),
       
            h('div',{className:"content-card"},[
                h('div',{className:"contentBx"},[
                    h('h3',{},[this.props.name,
                        h('br',{}),
                        h('span',{},["software engineer"])
                    ])
                ]),
                
                h('ul',{className:"box-icon"},[
                    h('li',{style:{ '--i': 1 }},[
                        h('a',{href:this.props.githubLink},[
                            h('i',{class:"fa-brands fa-github"})
                        ])
                    ]),
                    h('li',{style:{ '--i':2 }},[
                        h('a',{href:this.props.linkdenLink},[
                            h('i',{class:"fa-brands fa-linkedin-in"})
                        ])
                    ]), 
                    h('li',{style:{'--i': 3}},[
                        h('a',{href:`mailto:${this.props.emailLink}`},[
                            h('i',{class:"fa-solid fa-envelope"})
                        ])
                        ])
                    ]),
                    
                ])
            ])
        ])
    }
   })

   export const Team = defineComponent({
    state(){
        return {
            isLoading : true,
    }
    },
    render(){
        return h('div',{id:"team-section"},[
            h('div',{id:"team-title"},[
                h('h2',{},[
                    "The team",
                    h('span',{},[
                        h('br',{}),
                        "behind the magic"
                    ])
                ]),
                h('p',{},[
                    "Our developers work tirelessly to bring the ping pong website to life,",
                    h('br',{}),
                    "ensuring every user enjoys a seamless and unforgettable experience.",
                    h('br',{}),
                    "Meet the team behind the magic!"
                ])
            ]
            ),
            h('div',{className:"team-pics"},[
                h(TeamCards,{name:'KAOUTAR EL BAAMRANI',githubLink:"https://github.com/kel-baam",linkdenLink:"",emailLink:"kaoutarelbaamrani@gmail.com"}),
                h(TeamCards,{name:'KARIMA JARMOUMI',githubLink:"https://github.com/karimajarmoumi",linkdenLink:"",emailLink:""}),
                h(TeamCards,{name:'NISIN BOUKHARI',githubLink:"https://github.com/niboukha",linkdenLink:"",emailLink:"nisrinboukhari19@gmail.com"}),
                h(TeamCards,{name:'SOUAD HICHAM',githubLink:"https://github.com/s-hicham",linkdenLink:"",emailLink:""})
            ]),
        ])
    }
   })