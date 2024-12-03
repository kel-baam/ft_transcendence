import{defineComponent, h} from '../package/index.js'

// import { RouterLink } from '../package/index.js'



    const  landingPageHeader = defineComponent({
            state(){
                return {
                    isLoading : true,
            }
            },
            render(){
                return   h('div',{id:"landing-header"},[
                    h('nav',{ class: 'landing-nav' },[
                    h('img', { class: 'logo', src: './images/logo.png', alt: 'logo'}),
                    h('ul',{ class: 'nav-links' },[
                        h('li',{},[
                                h('a',{ href: '#header-intro', class: 'navLink scroll-link' },['Home'])
                        ]),
                        h('li',{},[
                            h('a', { href: '#about-section', class: 'navLink' ,class:'scroll-link' },['About'])
                        ]),
                        h('li',{},[
                            h('a',{href: '#team-section', class: 'navLink scroll-link' },['Our Team'])
                        ]),
                        h('a',{href: '', class: 'btn' ,onclick:(e)=>{
                            e.preventDefault()
                            this.appContext.router.navigateTo('/login?key=value')
                            // console.log("this query",this.appContext.router.query)
                            // console.log("this param",this.appContext.router.params)

                        }},[
                            h('button', { type: 'button' },['Join Now'])
                        ])
                    ]
                    ),
                ]
                  ),
                h('div',{ id: 'header-intro' },[
                    h('div',{ class: 'intro' },[
                        h('h1',{},[
                            'Dive into our',
                            h('br',{}),
                            '\u00A0\u00A0\u00A0',
                            h('span',{},['ping pong']),
                            h('br',{}),
                            '\u00A0\u00A0\u00A0',
                            'universe!'
                        ]),
                        h('p',{},[
                            'Welcome to your ultimate ping pong playground! Get ready to smash your way to victory.',
                            h('br',{}),
                            'Whether you\'re a seasoned player or just starting out, let\'s bounce into action together.',
                            h('br',{}),

                        ]),
                        h('div',{ class: 'join-btn' },[
                            h('a',{href: '', class: 'btn',
                                onclick:(e)=>{
                                    e.preventDefault()
                                    this.appContext.router.navigateTo('/login')

                                }
                            },[
                                h('button', { type: 'button' },['Join Now'])
                            ])
                        ])
                    ]
                    ),
                    h('img',{src: './images/player1.png',alt: 'player-pic'})
                ])
            ])
            }
        })

    const AboutUs = defineComponent({
        state(){
            return {
                isLoading : true,
        }
        },
        render()
        {
            return h('div',{id:"about-section"},[
                h('h2',{},['ABOUT US']),
                h('div',{className:"about"},[
                    h('div',{className:"glass-cart"},[
                        h('div',{className:"about-text"},[
                            h('p',{},['Welcome to our website, we Designed this website as a final project for our',
                                h('br',{}),
                                "school 1337, where the excitement of ping pong meets a vibrant community",
                                h('br',{}),
                                "experience.Dive into thrilling matches, connect with fellow players through",
                                h('br',{}),
                                "dynamic chatroom,and track your achievements as you climb the leader-board",
                                h('br',{}),
                                "Whether you're a seasoned competitor or new to the game,our website",
                                h('br',{}),
                                "is your go-to destination for enjoying and improving your ping pong skills",
                                h('br',{}),
                                "in a friendly and competitive atmosphere. Join us today and discover",
                                h('br',{}),
                                "the thrill of ping pong like never before!",
                            ]
                            )
                        ]),
                        h('img',{src:"./images/aboutPic.png"})
                    ]
                    )
                ]
                )]
            )
        }
    })

   const Team = defineComponent({
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
   const Footer = defineComponent({
    state(){
        return {
            isLoading : true,
    }
    },
    render(){
        return h('div',{id:"footer-section"},[
            h('div',{class:"footer-media"},[
                h('ul',{},[
                    h('div',{className:"media-bg"},[
                        h('li',{},[
                            h('a',{href:"https://github.com/kel-baam"},[
                                h('i',{className:"fa-brands fa-github"})
                            ])
                        ])
                    ]),
                    h('div',{className:"media-bg"},[
                        h('li',{},[
                            h('a',{href:"www.linkedin.com/in/kaoutar-el-baamrani-a99235271"},[
                                h('i',{className:"fa-brands fa-linkedin-in"})
                            ])
                        ])
                    ]),
                    h('div',{className:"media-bg"},[
                        h('li',{},[
                            h('a',{href:"mailto:kaoutarelbaamrani@gmail.com"},[
                                h('i',{className:"fa-solid fa-envelope"})
                            ])
                        ])
                    ])
                ])
            ]),
            h('div',{className:"footer-services"},[
                h('ul',{},[
                    h('li',{},[
                        h('a',{href:"#header-intro",className:'scroll-link'},['Home']),
                    ]),
                    h('li',{},[
                        h('a',{href:"#about-section",className:'scroll-link'},['About us']),
                    ]),
                    h('li',{},[
                        h('a',{href:"#team-section",className:'scroll-link'},['Our Team']),
                    ]),
                    h('li',{},[
                        h('a',{href:"#",className:'scroll-link'},['Join us']),
                    ]),

                ])
            ]),
            h('div',{className:"footer-copy-right"},[
               h('p',{},[
                "Copyright &copy;2024 Designed by 1337 students (power girls team)"
                ]
            )]
            )
          
        ])
    }
   })
    export const LandingPage = defineComponent({

        state(){
            return {
                isLoading : true,
        }
        },
        render(){
            return h('div',{id:"all"},
                [
                   
                    h(landingPageHeader,{}),
                    h(AboutUs,{}),
                    h(Team,{}),
                    h(Footer,{})                   
                ]
            )
        }
    })

