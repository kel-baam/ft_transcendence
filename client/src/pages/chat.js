import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../package/index.js'

import { header } from '../components/header.js'
import { sidebarLeft } from '../components/sidebar-left.js'
import { ChatList } from '../components/chat/ChatList.js'
import { MessageList } from '../components/chat/MessageList.js'


function waitForMessage(socket) {
    return new Promise((resolve) => {
        socket.onmessage = (event) => {
            resolve(JSON.parse(event.data));
        }; 
    });
}
// export const socketChat = new WebSocket(`ws://localhost:8080/ws/chat/chat/`)

export const Chat = defineComponent(
  {  
        state()
        {
            return {
                roomName : '',
                UserTarget: {},
                socket : {},
                realTimeMsg: {},
                
                // isNewMsgReceived : false,
                wsUrl: `ws://localhost:8080/ws/chat/chat/`

            }
        },
        render()
        {
            const {roomName, UserTarget} = this.state
            // console.log("Chat==>  roomName  ", typeof roomName,roomName , "  UserTarget  ", UserTarget)
            return h('div', { id: 'global' }, [
                h(header, {}),
                h('div', { class : 'content' }, [
                    h(sidebarLeft, {}),
                    h('div', { class : 'global-content' },[
                        h('div', { class : 'chat-content', style: {'grid-template-columns':'25% 74%' }}, 
                        [
                            h(ChatList, 
                            { 
                                on : { showMessages : (data) => {
                                        // console.log("data catched on ChatList by emit: ", JSON.stringify(data, "null", 2)) // roomName + UserData
                                        this.updateState(data) // in this part all data emited is stored on stats  {this.state.roomName = data.roomName .....}
                                }}
                                // ChatListData: this.ChatListData,
                                // socket: this.socket,
                                // room: null
                            }),
                            
                            h(MessageList , 
                                { on : 
                                    {
                                        newMessage : async(data)=>
                                        {
                                            // console.log("real time msg data ", JSON.stringify(data, null, 2))
                                            // console.log("room in msg list ", data[0].roomName, typeof data[0].roomName)
                                            const result = await this.state.socket.send(JSON.stringify(
                                                { 
                                                    content : data[0].content, 
                                                    room : data[0].roomName, 
                                                    sender: data[0].sender, 
                                                    receiver : data[0].receiver
                                                }
                                            ));

                                            const messageData = await waitForMessage(this.state.socket);
                                            if (messageData.status_code != "404")
                                            {
                                                // this.state.realTimeMsg.push(messageData)

                                                this.updateState({realTimeMsg: messageData, isNewMsgReceived: true})
                                            }
                                            // console.log("data ", JSON.stringify(this.state.realTimeMsg, null, 2))
                                        }
                                    }
                                    ,roomName, UserTarget:UserTarget, socket : this.state.socket, realTimeMsg: this.state.realTimeMsg
                                }
                            )
                        ])
                    ])
                ])
            ])
            
        },
        onMounted()
        {
            this.state.socket = new WebSocket(this.state.wsUrl);
            this.state.socket.onopen = () => {
                console.log("WebSocket connection established with :"+ this.state.socket.url);
            };
    
            this.state.socket.onerror = (error) => {
                console.error("WebSocket error:", error);
            };
    
            this.state.socket.onclose = () => {
                console.log("WebSocket connection closed");
            };
        }
    }
)