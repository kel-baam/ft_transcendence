import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../package/index.js'
import { sidebarLeft } from './sidebar-left.js'

// let socket = new WebSocket(`wss://${window.env.IP}:3000/ws/friends-status/`);
let socket = null;
export const sidebarRight = defineComponent(
    {
        state()
        {
            return {
                friends : [],
            }
        },
        render()
        {
       
            const {friends} = this.state
            return h('div', {class:'friends-right-sidebar'}, [
                h('ul', {class:"friends-list"}, friends.map((friend)=>(
                    h('li', {class : 'friend', style : {'list-style-type': 'none'}},
                        [
                            h('div', { style :{
                                position : "relative"
                            }}, 
                                [
                                    h('img', {class:'friend-img', src:`https://${window.env.IP}:3000${friend.picture}`, 
                                    alt:'', style : {'object-fit': 'cover'}}),
                                    h('div', {class : `status-indicator ${friend.status ? 'onlineFriend' : 'offlineFriend'}`, style :{
                                        position :'absolute',
                                        right:'80%'

                                    } })
        
                                ]
                            )

                        ]
                    )
                    
                )
            ))
            ])
        },
        onMounted()
        {
            socket = new WebSocket(`wss://${window.env.IP}:3000/ws/friends-status/`);
            socket.onopen =  () => {
                console.log("-----------------> WebSocket connected");
            };
        
            socket.onmessage =  (event) =>{
            const oldFriends = this.state.friends; 
            const newFriends = JSON.parse(event.data); 
            const friendsMap = new Map();

            oldFriends.forEach(friend => {
                friendsMap.set(friend.id, { ...friend });  
            });
            
            newFriends.forEach(newFriend => {
                const existingFriend = friendsMap.get(newFriend.id);
            
                if (existingFriend) {
                    if (existingFriend.status !== newFriend.status) {
                        existingFriend.status = newFriend.status;
                    }
                } else {
                    friendsMap.set(newFriend.id, { ...newFriend });
                }
            });
            
            const updatedFriends = Array.from(friendsMap.values());
            this.updateState({
                friends: updatedFriends
            });
            };
        
           socket.onclose = ()=> {
            };
        },
        onUnmounted()
        {
            socket.close()
        }
    }
)