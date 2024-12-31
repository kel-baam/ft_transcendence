import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'

export const MessageList = defineComponent(
    {
        state()
        {
            return {
                messageReceived :"",
                all_stored_msg : [
                  
                ],
                isLoading:true
            }
        },
        render()
        {
            const {roomName, UserTarget,socket} = this.props
            // console.log("<<<<<<<<<<<<<<<<<<<<<< typeof roomName : ", typeof(roomName))
            const {messageReceived, all_stored_msg, isLoading} = this.state
            // console.log(">>>>>>>>>>>>>> roomNme", roomName, "   userTarget : ", UserTarget)
            // console.log("----------------> all_stored_msg : ", all_stored_msg)
            if (isLoading)
                return h('div', { class : 'message-list' },['is Loading .............'])
            return h('div', { class : 'message-list' }, roomName ? 
                [
                    h(MessageListHeader, {UserTarget: UserTarget}),
                    h('div', { class : 'separator' }),
                    h('div', { class : 'msg-list-content' }, 
                        // ...chatlistMessages,
                        // ...real_time_msg
                        all_stored_msg.map((msgData)=> 
                        {
                            // console.log('data===',msgData.sender, "   ", roomName)
                            // console.log("------------------> typeof roomname : ", typeof(roomName))
                            const result = msgData.roomName.split("_")
                            console.log(">>>>>>>>>>>>>>>>> result : ", result)
                            if (result[1] === msgData.sender.username)
                                return  h(Sender, {msgData})
                            else
                                return h(Receiver, {msgData})
                        }
                        )

                    ),

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
                                    e.target.value =''
                                },
                                // keydown: (e)=>{
                                //     console.log(">>>>>>>>>>>>>>>> here on keydOWN")
                                //     if (e.key === 'Enter') 
                                //     {
                                //         console.log("-------------------------> e.target.value : ",  e.target.value)
                                //     }
                                // }
                            }
                            }),
                        h('div', { class : 'send-icon' }, [
                            h('i', { 
                                class : 'fa-duotone fa-solid fa-paper-plane icon', 
                                // onclick: () => this.sendMessageTo()
                                on : {
                                    click : () =>
                                    {
                                        this.emit('newMessage', messageReceived)
                                        console.log(">>>>>>>>>>>>>>>>>>>>> messageReceived : ", messageReceived)

                                    }
                                } 
                            })
                        ])
                    ])
                    
                ] : []);
            
        }, 
        onMounted(){
            const data = [
                {
                    sender: {
                        id: "338",
                        username: "walkerbarbara",
                        first_name: "Theresa",
                        last_name: "Johnson",
                        picture: {src : './images/kjarmoum.png'},
                        // "status": "active"
                    },
                    receiver: {
                        id: "345",
                        username: "joshuabrown",
                        first_name: "Kimberly",
                        last_name: "Dunn",
                        picture: {src : './images/kjarmoum.png'},
                        // "status": "active"
                    },
                    roomName: "walkerbarbara_joshuabrown",
                    content: "salut",
                    read: false,
                    timestamp: "2024-12-30T11:02:49.536257Z"
                },
                {
                    receiver: {
                        id: "338",
                        username: "walkerbarbara",
                        first_name: "Theresa",
                        last_name: "Johnson",
                        picture: {src : './images/kjarmoum.png'},
                        // "status": "active"
                    },
                    sender: {
                        id: "345",
                        username: "joshuabrown",
                        first_name: "Kimberly",
                        last_name: "Dunn",
                        picture: {src : './images/kjarmoum.png'},
                        // "status": "active"
                    },
                    roomName: "walkerbarbara_joshuabrown",
                    content: "salut",
                    read: false,
                    timestamp: "2024-12-30T11:02:49.536257Z"
                },
                
            ]
            this.updateState({all_stored_msg:data, isLoading:false})
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
            const {UserTarget} = this.props
            return h('div', { class : 'header' }, [
                h('img', { 
                    class : 'contact-avatar', 
                    alt: 'not Found', 
                    src: UserTarget.picture.src
                    // src: './images/niboukha-intra.png' 
                }),
                h('div', { class : 'contact-name' }, [UserTarget.username]),
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

const Receiver = defineComponent({
    state()
    {

    },
    render()
    {
        const {sender, content, timestamp} = this.props.msgData

        return h('div', { class: 'receiver', style: {'gap': '1em'} }, [
            h('div', { class: 'msg' }, [
                h('div', { class: 'msg-content' }, [content]),
                h('div', { class: 'msg-time' }, ['04.25'])
            ]),
            h('img', { 
                class: 'receiver-avatar', 
                alt: 'not Found', 
                src: sender.picture.src
            })
        ]);
        
    }
})


const Sender = defineComponent({
    state()
    {

    },
    render()
    {
        const {receiver, content, timestamp} = this.props.msgData
        // console.log(">>>>>>>>>>>>>>>>>>. receiver : ", this.props)
        return h('div', { class: 'sender', style: {'gap': '1em'} }, [
            h('img', { 
                class: 'sender-avatar', 
                alt: 'not Found', 
                src: receiver.picture.src
            }),
            h('div', { class: 'msg' }, [
                h('div', { class: 'msg-content' }, [content]),
                h('div', { class: 'msg-time' }, ['04.25'])
            ])
        ]);
        
    }
})