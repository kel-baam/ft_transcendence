import{defineComponent,h} from '../../package/index.js'
    
    export const AboutUs = defineComponent({
        state(){
            return {
                isLoading : true,
        }
        },
        render()
        {
            // return h('div',{id:"about-section"},[
            //     h('h2',{},['ABOUT US']),
            //     h('div',{className:"about"},[
            //         h('div',{className:"glass-cart"},[
            //             h('div',{className:"about-text"},[
            //                 h('p',{},['Welcome to our website, we Designed this website as a final project for our',
            //                     h('br',{}),
            //                     "school 1337, where the excitement of ping pong meets a vibrant community",
            //                     h('br',{}),
            //                     "experience.Dive into thrilling matches, connect with fellow players through",
            //                     h('br',{}),
            //                     "dynamic chatroom,and track your achievements as you climb the leader-board",
            //                     h('br',{}),
            //                     "Whether you're a seasoned competitor or new to the game,our website",
            //                     h('br',{}),
            //                     "is your go-to destination for enjoying and improving your ping pong skills",
            //                     h('br',{}),
            //                     "in a friendly and competitive atmosphere. Join us today and discover",
            //                     h('br',{}),
            //                     "the thrill of ping pong like never before!",
            //                 ]
            //                 )
            //             ]),
            //             h('img',{src:"./images/aboutPic.png"})
            //         ]
            //         )
            //     ]
            //     )]
            // )
            return h('div',{id:"about-section"},[
                h('h2',{'data-translate' : 'about_us'},['ABOUT US']),
                h('div',{className:"about"},[
                    h('div',{className:"glass-cart"},[
                        h('div',{className:"about-text"},[
                            // h('p',{},['Welcome to our website, we Designed this website as a final project for our',
                            //     h('br',{}),
                            //     "school 1337, where the excitement of ping pong meets a vibrant community",
                            //     h('br',{}),
                            //     "experience.Dive into thrilling matches, connect with fellow players through",
                            //     h('br',{}),
                            //     "dynamic chatroom,and track your achievements as you climb the leader-board",
                            //     h('br',{}),
                            //     "Whether you're a seasoned competitor or new to the game,our website",
                            //     h('br',{}),
                            //     "is your go-to destination for enjoying and improving your ping pong skills",
                            //     h('br',{}),
                            //     "in a friendly and competitive atmosphere. Join us today and discover",
                            //     h('br',{}),
                            //     "the thrill of ping pong like never before!",
                            // ]
                            // )
                            h('p', {},[
                                h('span', { 'data-translate': 'welcome' }, ['Welcome to our website, we Designed this website as a final project for our']),
                                h('br', {}),
                                h('span', { 'data-translate': 'school' }, [ "school 1337, where the excitement of ping pong meets a vibrant community"]),
                                h('br', {}),
                                h('span', { 'data-translate': 'experience' }, ["experience.Dive into thrilling matches, connect with fellow players through"]),
                                h('br', {}),
                                h('span', { 'data-translate': 'chat' }, ["dynamic chatroom,and track your achievements as you climb the leader-board"]),
                                h('br', {}),
                                h('span', { 'data-translate': 'beginner' }, ["Whether you're a seasoned competitor or new to the game,our website"]),
                                h('br', {}),
                                h('span', { 'data-translate': 'goal' }, [ "is your go-to destination for enjoying and improving your ping pong skills"]),
                                h('br', {}),
                                h('span', { 'data-translate': 'atmosphere' }, ["in a friendly and competitive atmosphere. Join us today and discover"]),
                                h('br', {}),
                                h('span', { 'data-translate': 'thrill' }, ["the thrill of ping pong like never before!"])
                            ])
                        ]),
                        h('img',{src:"./images/aboutPic.png"})
                    ]
                    )
                ]
                )
            ]
            )
        }
    })