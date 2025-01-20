import{defineComponent,h} from '../../package/index.js'
    
    export const  LandingPageHeader = defineComponent({
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

                        }},[
                            h('button', { type: 'button' },['Join Now'])
                        ])
                    ]),
                ]),
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