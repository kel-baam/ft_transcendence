import{defineComponent,h} from '../../package/index.js'
   

// change

   const TeamCards = defineComponent({
    props :{
        name:String,
        githubLink:String,
        linkdenLink:String,
        emailLink:String,
        picture:String

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
                h('img',{src:this.props.picture}),
       
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
                    h('span', {class:'team','data-translate': 'TEAM_HEADER'}, ["The team"]),
                    h('br',{}),
                    h('span',{ class:'magic','data-translate': 'magic'},[
                        "behind the magic"
                    ])
                ]),
                h('p', { }, [
                    h('span', { 'data-translate': 'TEAM_LINE_1' }, ["Our developers work tirelessly to bring the ping pong website to life,"]),
                    h('br', {}),
                    h('span', { 'data-translate': 'TEAM_LINE_2' }, ["ensuring every user enjoys a seamless and unforgettable experience."]),
                    h('br', {}),
                    h('span', { 'data-translate': 'TEAM_LINE_3' }, ["Meet the team behind the magic!"])
                ])
                
            ]
            ),
             
            h('div',{className:"team-pics"},[
                h(TeamCards,{name:'KAOUTAR EL BAAMRANI',githubLink:"https://github.com/kel-baam",linkdenLink:"https://www.linkedin.com/in/kaoutarbm/",emailLink:"kaoutarelbaamrani@gmail.com",picture:"./images/kel-baam.png"}),
                h(TeamCards,{name:'NISIN BOUKHARI',githubLink:"https://github.com/niboukha",linkdenLink:"https://www.linkedin.com/in/nisrinboukhari/",emailLink:"nisrinboukhari19@gmail.com",picture:"./images/niboukha.jpeg"}),
                h(TeamCards,{name:'SOUAD HICHAM',githubLink:"https://github.com/s-hicham",linkdenLink:"https://www.linkedin.com/in/souad-hicham/",emailLink:"ms.souadhicham@gmail.com",picture:"./images/shicham.JPG"}),
            ]),
        ])
    }
   })