import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'
export const ChatList = defineComponent(
    {
        state()
        {
            return {
                chatItems: [],
                isLoading: true, 
            }
        },
        render()
        {
            console.log("ChatList==>")
            const {isLoading} = this.state
            if (isLoading)
                return h('div', { class : 'chat-list-container' })
            return h('div', { class : 'chat-list-container' }, [
                h('div', { class : 'chat-list-header' }, [
                    h('h1', {}, ['Chat']),
                    h('i', { class : 'fa-brands fa-rocketchat' })
                ]),
                h('div', { class : 'separator' }),
                h(ChatListItems, {
                    on : {
                        showMessages: (data) => {
                            console.log("data catched on ChatListItems by emit: ", JSON.stringify(data, null, 2))  // roomName + UserData
                            
                            this.emit('showMessages', data)
                        }
                    }
                   
                    // socket: this.socket,
                    // room: this.room,
                    // ChatListData: this.ChatListData
                })
            ])
        },
        onMounted()
        {
            this.updateState({isLoading:false})
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
                        user : {username : 'shicham', picture : {src : './images/kjarmoum.png'}, level : '7.77'},
                        roomName: "shicham_kjarmoum",
                        content: "salut",
                        read: false,
                        timestamp: "2024-12-30T11:02:49.536257Z"
                    },
                    {
                        user : {username : 'shicham', picture : {src : './images/kjarmoum.png'}, level : '7.77'},
                        roomName: "walkerbarbara_joshuabrown",
                        content: "salut",
                        read: false,
                        timestamp: "2024-12-30T11:02:49.536257Z"
                    },
                    {
                        user : {username : 'shicham', picture : {src : './images/kjarmoum.png'},level : '7.77'},
                        roomName: "walkerbarbara_joshuabrown",
                        content: "salut",
                        read: false,
                        timestamp: "2024-12-30T11:02:49.536257Z"
                    },
                    {
                        user : {username : 'shicham', picture : {src : './images/kjarmoum.png'}, level : '7.77'},
                        roomName: "walkerbarbara_joshuabrown",
                        content: "salut",
                        read: false,
                        timestamp: "2024-12-30T11:02:49.536257Z"
                    },
                    {
                        user : {username : 'shicham', picture : {src : './images/kjarmoum.png'}, level : '7.77'},
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
            // console.log("ChatListItems==>")
            const  { data , isLoading} = this.state
            // console.log(">>>>>>>>>>>>>>>>>>> data : ", data)
            // if (isLoading)
            //     return h('div', { class: 'chat-list-items' }, ['is loading....']
            //      )
            return h('div', { class: 'chat-list-items' }, data.map((itemData)=>
                // console.log(">>>>>>>>>>>>>>>>>> itemD")
               h(ChatItem, {itemData, 
                on : {
                showMessages: (data) => {//roomName passed by chat item by emit
                   
                    console.log("data catched on ChatItem by emit: ", JSON.stringify(data, null, 2)) // roomName  of room clicked  

                    this.emit('showMessages', {roomName: data.roomName, UserTarget: itemData.user}) // roomName + dataOfUser clicked
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
            // console.log("ChatItem==>")
            const {user, roomName, content, timestamp, read} = this.props.itemData
            const {isClicked} = this.state
            return h('div', {
                class : 'chat-item',
                on : {
                    click : () => {
                        // console.log("befooooooooore emit on ChatItem")
                        this.updateState({isClicked:true})

                        // console.log("data  emited by ChatItem: ", JSON.stringify(roomName, null, 2))

                        this.emit('showMessages', {roomName})
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
