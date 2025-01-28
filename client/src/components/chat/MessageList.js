import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'

let  inputElement
let newMSG = false
export const MessageList = defineComponent(
    {
        state() {
            return {
                all_stored_msg: [],
                isLoading: true,
                newMsg: false,
                currentMessage: ""
            };
        },        
        render()
        {
            
            const {roomName, UserTarget, realTimeMsg} = this.props
            const {all_stored_msg, isLoading, newMsg} = this.state
            console.log("-------------------> this.state : ", this.state)

            // console.log("ALL MESSAGES -----", realTimeMsg)

        //    console.log(">>>>>>>>>>>>>>>>>>>>>> roomName ", roomName)d
            if (isLoading)
                return h('div', { class : 'message-list' })

            // console.log("all_stored_msg-----", JSON.stringify(all_stored_msg, null, 2))
            // console.log("realTimeMsg-----", JSON.stringify(realTimeMsg, null, 2))
            
            if (!newMSG && Object.keys(realTimeMsg).length > 0)
            {
                    const updatedMessages = [...all_stored_msg, realTimeMsg]
                            console.log("----------------->  updatedMessages ",  updatedMessages)
                newMSG = true
                this.updateState({ 
                    all_stored_msg: updatedMessages, 
                    newMsg: true, 
                    isLoading: false 
                })
            }

            // if (realTimeMsg && realTimeMsg.length > 0 && !newMsg) {
            //     // const uniqueMessages = realTimeMsg.filter((lastMessage) => {
            //     //     return !all_stored_msg.some(
            //     //         (msg) => msg.timestamp === lastMessage.timestamp &&
            //     //                  msg.content === lastMessage.content &&
            //     //                  msg.sender.username === lastMessage.sender.username
            //     //     );
            //     // });
            
            //     // if (realTimeMsg) {
            //         console.log(">>>>>>>>>>>> here ")
            //         // const updatedMessages = [...all_stored_msg, ...realTimeMsg];
            //         // // console.log("---------------------> ")
            //     );
            //     // console.log("-----ALL MESSAGES -----", this.state.all_stored_msg)
            //     // }
            // }
            // console.log(">>>>>>>>>>>>>>> -ALL MESSAGES -----", this.state.all_stored_msg)
            return h('div', { class : 'message-list' }, roomName ? 
                [
                    h(MessageListHeader, {UserTarget: UserTarget}),
                    h('div', { class : 'separator' }),
                    h('div', { class : 'msg-list-content' }, 
                        this.state.all_stored_msg.map((msgData)=> 
                        {
                            
                                console.log("biiiiiiiiiiiiiiiiiiiiiiiiiiiiiii ",msgData)
                                // console.log("biiiiiiiiiiiiiiiiiiiiiiiiiiiiiii ",msgData)
                                const result = msgData.room.split("_")
                                if (result[0] === msgData.sender.username)
                                {
                                    // console.log("sender of all stored msg ")
                                    return  h(Sender, {msgData})
                                }
                                else if (result[1] === msgData.sender.username)
                                {
                                    // console.log("recevier of all stored msg ")
                                    return h(Receiver, {msgData})
                                }
                            
                            
                        }),
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
                                keypress: (e)=>{
                                    if (e.key === 'Enter' && e.target.value !== "") 
                                    {
                                        console.log("-------------------------> e.target.value : ",  e.target.value)
                                        
                                        const tab = roomName.split('_')
                                        
                                        const data = [{
                                            content : e.target.value, 
                                            roomName : roomName, 
                                            sender: tab[0], 
                                            receiver : tab[1]}
                                        ]
                                        
                                        e.target.value = ''
                                        newMSG = false
                                        // console.log(">>>>>>>>>>> new Msg status : ",newMSG )
                                        this.emit('newMessage', data)

                                    }
                                }
                            },
                            // hook: {
                            //     insert: (vnode) => {
                            //         inputElement = vnode.elm; // Stocker l'élément DOM dans une variable
                            //     }
                            // }
                            }),
                        h('div', { class : 'send-icon' }, [
                            h('i', { 
                                class : 'fa-duotone fa-solid fa-paper-plane icon', 
                                // onclick: () => this.sendMessageTo()
                                // on : {
                                //     click : () =>
                                //     {
                                //         if (inputElement && inputElement.value != "")
                                //         {
                                //             messageReceived = inputElement.value.trim();
                                //             console.log(">>>>>>>>>>>>>>>>>>>>> messageReceived : ", messageReceived)
                                //             const tab = roomName.split('_')
                                        
                                //             const data = [{
                                //                 content : messageReceived , 
                                //                 roomName : roomName, 
                                //                 sender: tab[0], 
                                //                 receiver : tab[1]}
                                //             ]
                                            
                                //             this.emit('newMessage', data)
                                //         }
                                        

                                //     }
                                // } 
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
                        username: "shicham",
                        first_name: "Souad",
                        last_name: "Hicham",
                        picture: {src : './images/kjarmoum.png'},
                        // "status": "active"
                    },
                    receiver: {
                        id: "345",
                        username: "kjarmoum",
                        first_name: "Karima",
                        last_name: "Jarmoumi",
                        picture: {src : './images/kjarmoum.png'},
                        // "status": "active"
                    },
                    room: "shicham_kjarmoum",
                    content: "salam",
                    read: false,
                    timestamp: "2024-12-30T11:02:49.536257Z"
                },
                {
                    sender: {
                        id: "338",
                        username: "kjarmoum",
                        first_name: "Karima",
                        last_name: "Jarmoumi",
                        picture: {src : './images/kjarmoum.png'},
                        // "status": "active"
                    },
                    receiver: {
                        id: "345",
                        username: "shicham",
                        first_name: "Souad",
                        last_name: "Hicham",
                        picture: {src : './images/kjarmoum.png'},
                        // "status": "active"
                    },
                    room: "shicham_kjarmoum",
                    content: "salut",
                    read: false,
                    timestamp: "2024-12-30T11:02:49.536257Z"
                },
                
            ]
            this.updateState({all_stored_msg:data, isLoading:false})

            console.log("checkkk")
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

const Sender = defineComponent({
    state()
    {

    },
    render()
    {
        const {sender, content, timestamp} = this.props.msgData
        // console.log(">>>>>>>>>>>>>>>>>>. sender component: ", this.props.msgData)

        return h('div', { class: 'sender', style: {'gap': '1em'} }, [
            h('div', { class: 'msg' }, [
                h('div', { class: 'msg-content' }, [content]),
                h('div', { class: 'msg-time' }, ['04.25'])
            ]),
            h('img', { 
                class: 'sender-avatar', 
                alt: 'not Found', 
                // src: sender.picture.src
                src: ''
            })
        ]);
        
    }
})


const Receiver = defineComponent({
    state()
    {

    },
    render()
    {
        const {receiver, content, timestamp} = this.props.msgData
        // console.log(">>>>>>>>>>>>>>>>>>. receiver component : ", this.props)
        return h('div', { class: 'receiver', style: {'gap': '1em'} }, [
            h('img', { 
                class: 'receiver-avatar', 
                alt: 'not Found', 
                // src: receiver.picture.src 
                src: ''
                
            }),
            h('div', { class: 'msg' }, [
                h('div', { class: 'msg-content' }, [content]),
                h('div', { class: 'msg-time' }, ['04.25'])
            ])
        ]);
        
    }
})