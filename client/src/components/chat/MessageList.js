import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'

export const MessageList = defineComponent(
    {
        state()
        {
            return {
                messageReceived :"",
                data : [
                    {

                    },
                    {

                    }, {

                    }
                ]
            }
        },
        render()
        {
            const {roomName, socket} = this.props
            const {messageReceived} = this.state
            console.log(">>>>>>>>>>>>>> roomNme", roomName)
            return h('div', { class : 'message-list' }, roomName ? 
                [
                    h(MessageListHeader, {}),
                    h('div', { class : 'separator' }),
                    h('div', { class : 'msg-list-content' }, [
                        // ...chatlistMessages,
                        // ...real_time_msg
                    ]),

                    h('div', { 
                        class : 'typing', 
                        style: { 'border-radius' :'0px 0px 56px 56px' }
                    }, [
                        h('input', { 
                            class : 'input-msg', 
                            placeholder: 'Type a message...', 
                            type: 'text', 
                            name: 'input-msg' ,
                            on : {
                                change : (e) =>{
                                    // console.log("------------------------> input value : ", e.target.value)
                                    this.updateState({messageReceived : e.target.value})
                                },
                                keydown: (e)=>{
                                    console.log(">>>>>>>>>>>>>>>> here on keydOWN")
                                    if (e.key === 'Enter') 
                                    {
                                        console.log("-------------------------> e.target.value : ",  e.target.value)
                                    }
                                }
                            }
                            }),
                        h('div', { class : 'send-icon' }, [
                            h('i', { 
                                class : 'fa-duotone fa-solid fa-paper-plane icon', 
                                // onclick: () => this.sendMessageTo()
                                on : {
                                    click : () =>
                                    {
                                        console.log(">>>>>>>>>>>>>>>>>>>>> messageReceived : ", messageReceived)
                                    }
                                } 
                            })
                        ])
                    ])
                    
                ] : []);
            
        }
    }
)

const MessageListHeader = defineComponent(
    {
        state()
        {

        },
        render()
        {
            return h('div', { class : 'header' }, [
                h('img', { 
                    class : 'contact-avatar', 
                    alt: 'not Found', 
                    // src: './images/niboukha-intra.png' 
                }),
                h('div', { class : 'contact-name' }, ['Niboukha']),
                h('div', { class : 'play-button' }, [
                    h('a', { href: 'playerVSplayer' }),
                    h('button', { 
                        class : 'btn', 
                        type: 'button', 
                        id: 'hover-btn' 
                    }, ['play'])
                ]),
                h('div', { class : 'more-info' }, [
                    h('a', { 
                        class : 'fa-solid fa-ellipsis-vertical icon', 
                        // onclick: this.handleClick 
                    })
                ])
            ]);
            
        }
    }
)
