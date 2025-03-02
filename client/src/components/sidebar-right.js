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
            // console.log('>>>>>>>>>>>>>>> here where is the problem ')
            // return h('h1', {style : {color : 'red'}}, ['here online friends '])
        //     <div class="friends-right-sidebar">
        //     <ul id="friends-list">
        //         <!-- Friends will be added dynamically here -->
        //     </ul>
        // </div>
            const {friends} = this.state
            // console.log("-------------------------> friends : ", friends )
            return h('div', {class:'friends-right-sidebar'}, [
                h('ul', {class:"friends-list"}, friends.map(friend=>(
                    h('li', {class : 'friend', style : {'list-style-type': 'none'}},
                        [
                            h('div', {style :{
                                position : "relative"
                            }}, 
                                [
                                    h('img', {class:'friend-img', src:`https://${window.env.IP}:3000${friend.picture}`, alt:'', style : {'object-fit': 'cover'}}),
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
               
                const mergedFriends = [...this.state.friends, ...JSON.parse(event.data)];
                // console.log("----------------------> JSON.parse(event.data): ", JSON.parse(event.data))
                // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> mergedFRiends : ", mergedFriends)
                this.updateState({
                    friends : Array.from(new Map(mergedFriends.map(friend => [friend.id, friend])).values())// sometimes error raised here
                })
            };
        
           socket.onclose = ()=> {
                console.log("-----------------------> WebSocket closed");
            };
        },
        onUnmounted()
        {
            socket.close()
        }
    }
)