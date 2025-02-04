import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../package/index.js'

import { header } from '../components/header.js'
import { sidebarLeft } from '../components/sidebar-left.js'
import { ChatList } from '../components/chat/ChatList.js'
import { MessageList } from '../components/chat/MessageList.js'
import { customFetch } from '../package/fetch.js'
import { showErrorNotification } from './utils/errorNotification.js'

export const Chat = defineComponent(
{  
    state()
    {
        return {
            roomName : '',
            UserTarget: {},
            socket : {},
            newMessageRecievied:false,
            
            // wsUrl: `ws://localhost:8080/ws/chat/chat/`

            notificationActive: false,
            isBlur:false,
            notification_data: null
        }
    },

    async submitForm(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append('tournament_id', JSON.stringify(this.state.id));
        formData.append('status', 'accepted');

        try {
            const response = await customFetch("http://localhost:3000/tournament/api/online/tournaments/", {
                method: 'PUT',
                body: formData,
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 401) this.appContext.router.navigateTo('/login');
                const errorText = await response.json();
                throw new Error(Object.values(errorText)[0]);
            }

            const successData = await response.json();
            console.log("Player added:", successData.message);
            this.updateState({ isBlur: false });
        } catch (error) {
            showErrorNotification(error);
        }
    },

    render()
    {
        const {roomName, UserTarget} = this.state
        return h('div', { id: 'global' }, [
            h(header, {
                icon_notif: this.state.notificationActive,
                on          : {
                    iconClick :()=>{
                        this.updateState({ notificationActive: !this.state.notificationActive }); 
                    },
                    blur :(notification_data)=> {
                        this.updateState({
                            isBlur            : true,
                            notification_data : notification_data
                        })
                    }
                }
        }),
            h('div', { class : 'content' }, [
                h(sidebarLeft, {}),
                h('div', { class : 'global-content' }, [
                    h('div', { class : 'chat-content',
                        style: {'grid-template-columns':'25% 74%'},
                        style : this.state.isBlur ? { filter : 'blur(4px)',  pointerEvents: 'none'} : {}
                    }, [
                        h(ChatList, 
                            { 
                            on : { showMessages : (data) => {
                                this.updateState(data)
                            } }
                        }),
                        h(MessageList , {on : {
                            newMessage : (message)=>{
                                this.state.socket
                                this.updateState({})
                            }
                        },roomName, UserTarget:UserTarget, sokcet : this.state.socket})
                    ])
                ])
            ]),
            this.state.isBlur ? 
                h('div', { class: 'join-player-form' }, [
                    h('i', {
                        class   : 'fa-regular fa-circle-xmark icon',
                        on      : {
                            click : () => {
                                this.updateState({
                                    isBlur: false,
                                })
                            }
                        }
                    }),
                    h('form', {
                        class   : 'form1',
                        on      : {submit: this.submitForm.bind(this) }
                    }, [
                        h('div', { class: 'avatar' }, [
                            h('img', { 
                                class   : 'createAvatar', 
                                src     : './images/people_14024721.png', 
                                alt     : 'Avatar' 
                            }),
                            h('div', { 
                                class   : 'editIcon', 
                                on      : {
                                    click: () => { document.getElementById(`file-upload1`).click(); }
                                }
                            }, [
                                h('input', {
                                    type    : 'file',
                                    id      : 'file-upload1',
                                    name    : 'player_avatar',
                                    accept  : 'image/*',
                                    style   :{
                                        display         : 'none',
                                        pointerEvents   : 'none'
                                    },
                                    on      : { change: (event) => {
                                        const file = event.target.files[0];
                                        if (file) {
                                            const reader    = new FileReader();
                                            reader.onload   = (e) => {
                                                document.querySelector(`.createAvatar`).src = e.target.result;
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                }),
                                h('i', { class: 'fas fa-edit icon' })
                            ])
                        ]),
                        h('div', { class: 'createInput' }, [
                            h('label', { htmlFor: 'playerNickname' }, ['Nickname:']),
                            h('br'),
                            h('input', { 
                                type        : 'text', 
                                name        : 'nickname', 
                                placeholder : 'Enter Nickname...' 
                            })
                        ]),
                        h('button', { type: 'submit' }, ['Submit'])
                    ])
                ]) : null
        ])
        
    },
    onMounted()
    {
        // this.state.socket = new WebSocket(this.state.wsUrl);
        
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