import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'

export const ChatList = defineComponent(
    {
        state()
        {
            return {
                chatItems: [],
                isLoading: false,
            }
        },
        render()
        {
            return h('div', { class : 'chat-list-container' }, [
                h('div', { class : 'chat-list-header' }, [
                    h('h1', {}, ['Chat']),
                    h('i', { class : 'fa-brands fa-rocketchat' })
                ]),
                h('div', { class : 'separator' }),
                h(ChatListItems, {
                    on : {
                        showMessages: (roomName) => {
                            // console.log(">>>>>>>>>>>> rooom : ", roomName)
                            this.emit('showMessages', roomName)
                        }
                    }
                   
                    // socket: this.socket,
                    // room: this.room,
                    // ChatListData: this.ChatListData
                })
            ])
            
            // createElement('div', { className: 'chat-list-container'},  
            //     createElement('div', { className: 'chat-list-header'},
            //         createElement('h1',{},'Chat'),
            //         createElement('i', { className: 'fa-brands fa-rocketchat'})
            //     ),
            //     createElement('div',{ className: 'separator'}),
            //     createElement(ChatListItems, {
            //                 socket: this.socket,
            //                 room : this.room,
            //                 ChatListData : this.ChatListData
            //             }),)
        }
    }
)
 const ChatListItems = defineComponent(
    {
        state()
        {
            return {
                isLoading : false,
                data : [
                    {
                        user : {username : 'shicham', picture : {src : './images/kjarmoum.png'}},
                        roomName: "walkerbarbara_joshuabrown",
                        content: "salut",
                        read: false,
                        timestamp: "2024-12-30T11:02:49.536257Z"
                    },
                    {
                        user : {username : 'shicham', picture : {src : './images/kjarmoum.png'}},
                        roomName: "walkerbarbara_joshuabrown",
                        content: "salut",
                        read: false,
                        timestamp: "2024-12-30T11:02:49.536257Z"
                    },
                    {
                        user : {username : 'shicham', picture : {src : './images/kjarmoum.png'}},
                        roomName: "walkerbarbara_joshuabrown",
                        content: "salut",
                        read: false,
                        timestamp: "2024-12-30T11:02:49.536257Z"
                    },
                    {
                        user : {username : 'shicham', picture : {src : './images/kjarmoum.png'}},
                        roomName: "walkerbarbara_joshuabrown",
                        content: "salut",
                        read: false,
                        timestamp: "2024-12-30T11:02:49.536257Z"
                    },
                    {
                        user : {username : 'shicham', picture : {src : './images/kjarmoum.png'}},
                        roomName: "walkerbarbara_joshuabrown",
                        content: "salut",
                        read: false,
                        timestamp: "2024-12-30T11:02:49.536257Z"
                    },
                ]
            }
        },
        render()
        {
            
            // console.log('>>>>>>>>>>>>>>>>>>>> here in ')
            const  { data , isLoading} = this.state
            // console.log(">>>>>>>>>>>>>>>>>>> data : ", data)
            // if (isLoading)
            //     return h('div', { class: 'chat-list-items' }, ['is loading....']
            //      )
            return h('div', { class: 'chat-list-items' }, data.map((itemData)=>
               h(ChatItem, {itemData, on : {
                showMessages: (roomName) => {
                    // console.log(">>>>>>>>>>>> rooom : ", roomName)
                    this.emit('showMessages', roomName)
                }
            }
        })
            ))
        },
        onMounted()
        {
            //check if the query params contains something before fetch and update isloading after fetch datato false
        }

    }
 )

const ChatItem =  defineComponent(
    {
        state()
        {
            return {
                isClicked : false
            }
        },
        render()
        {
            // console.log('>>>>>>>>>>>>>>>>>>>>>>>> props ', this.props)
            const {user, roomName, content, timestamp, read} = this.props.itemData
            const {isClicked} = this.state
            return h('div', {
                class : 'chat-item',
                on : {
                    click : () => {
                        this.updateState({isClicked:true})
                        this.emit('showMessages', roomName)
                    }
                },
                style : isClicked ? {'background-color': 'rgba(208, 210, 217, 0.514)' } : {}

                // onClick: () => {
                //     this.handleClick(this);  // Ensure handleClick is properly defined
                //     this.handleOnClick(`/chat_${this.room}`, this.socket);
                // }
            }, [
                h('img', {
                    class : 'contact-avatar',
                    alt: 'Avatar not Found',
                    src:  user.picture.src  // Default image
                }),
                h('div', { class : 'contact-box' }, [
                    h('div', { class : 'contact-box-header' }, [
                        h('div', { class : 'contact-name' }, [user.username]),  // Adjusted room name trimming
                        h('div', { class : 'time-last-message' }, [timestamp]),
                        // !read ?  h('div', {},  ['hello']) : null
                    ]),
                    h('div', { class : 'last-message' },  [content]) 
                    //  style :read ? {}: {}
                ])
            ]);
            
        }
    }
)

