import{defineComponent,h} from '../../package/index.js'

// change

export const Footer = defineComponent({
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
                            h('a',{href:"https://www.linkedin.com/in/kaoutarbm/"},[
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
                        h('a',{href:"#",className:'scroll-link',
                            onclick:(e)=>{
                                e.preventDefault()
                                this.appContext.router.navigateTo('/login?key=value')
                            }
                        },['Join us']),
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