import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../package/index.js'

import { header } from '../components/header.js'
import { sidebarLeft } from '../components/sidebar-left.js'
import { ChatList } from '../components/chat/ChatList.js'
import { MessageList } from '../components/chat/MessageList.js'

export const Chat = defineComponent(
  {  
        state()
        {
            return {
                roomName : ''
            }
        },
        render()
        {
            const {roomName} = this.state
            return h('div', { id: 'global' }, [
                h(header, {}),
                h('div', { class : 'content' }, [
                    h(sidebarLeft, {}),
                    h('div', { class : 'global-content' }, [
                        h('div', { class : 'chat-content', style: {'grid-template-columns':'25% 74%' }}, [
                            h(ChatList, 
                                { 
                                on : { showMessages : (roomName) => {
                                    this.updateState({roomName:roomName})
                                    console.log(">>>>>>>>>>>>>>>>> rom : ", roomName)
                                } }
                                // ChatListData: this.ChatListData,
                                // socket: this.socket,
                                // room: null
                            }),
                            h(MessageList , {roomName : roomName})
                        ])
                    ])
                ])
            ])
            
        }
    }
)

// createElement('div', { id: 'global' },
//     createElement(Header, {}),
//     createElement('div', { className: 'content' },
//         createElement(Sidebar, {}),
//         createElement('div', { className: 'global-content' },
//             createElement('div', { className: 'chat-content', style: 'grid-template-columns:25% 74%;'},
//                 createElement(ChatList, {
//                     ChatListData : this.ChatListData,
//                     socket: this.socket,
//                     room: null
//                 }),
//                 createElement(MessageListOverview, {})
//             )
//         ) 
//     )
// )