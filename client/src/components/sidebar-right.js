import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../package/index.js'
// import { sidebarLeft } from './sidebar-left.js'

// let onLineFriendsSocket = new WebSocket("ws://10.14.3.1:8001/ws/test?username=shicham");

export const sidebarRight = defineComponent(
    {
        state()
        {

        },
        render()
        {
            // console.log('>>>>>>>>>>>>>>> here where is the problem ')
            return h('h1', {style : {color : 'red'}}, ['here online friends '])
        },
        onMounted()
        {
            // onLineFriendsSocket.onopen = function () {
            //     // console.log("-----------------> WebSocket connected");
            //     onLineFriendsSocket.send(JSON.stringify({ message: "Hello, Server!" }));
            // };
        
            // onLineFriendsSocket.onmessage = function (event) {
            //     // console.log(">>>>>>>>>>>>>>>>>>> event from server : ", event)
            //     // console.log("----------------------> Message from server: ", event.data);
            // };
        
            // onLineFriendsSocket.onclose = function () {
            //     console.log("WebSocket closed");
            // };
        }
    }
)