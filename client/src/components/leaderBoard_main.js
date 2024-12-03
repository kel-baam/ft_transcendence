// import{createApp, defineComponent, DOM_TYPES, h,
//     hFragment, hSlot, hString,RouterOutlet} from '../package/index.js'
// import { header } from './header.js'
// import { sidebarLeft } from './sidebar-left.js'

// export const Leaderboard = defineComponent({
//     state(){
//         return {
//             isLoading : true,
//     }
//     },
//     render(){
//         return h('div',{id:'global'},[
//             h(header,{}),
//             h('div',{ class: 'content' },[
//                 h(sidebarLeft,{}),
//                 h('div',{class:'global-content'},[
//                     h('div',{ class: "leaderboard-title" },[
//                         h('h1',{},['Leaderboard'])
//                     ]),
//                     h('div',{class: "pics-rank" },[
//                         h('div',{ class: "first-place"},[
//                             h('img',{ class: "crown-pic", src: "./images/crown-removebg-preview.png" }),
//                             h('img',{ class: "first-pic", src: "./images/kel-baam.png"}),
//                             h('h4',{},['kel-baam'])
//                         ]),
//                     h('div',{ class: "second-third-place" },[
//                         h('div',{ class: "second-place"},[
//                             h('img',{ class: "second-symbol", src: "./images/second_1021187.png" }),
//                             h('img',{ class: "second-pic", src: "./images/kel-baam.png"}),
//                             h('h4',{},['niboukha'])
//                         ]),
//                         h('div',{ class: "third-place"},[
//                             h('img',{ class: "third-symbol", src: "./images/crown-removebg-preview.png" }),
//                             h('img',{ class: "third-pic", src: "./images/kel-baam.png"}),
//                             h('h4',{},['niboukha'])
//                         ]),
//                     ])
                
//                     ])
                
//                 ]) 
//             ])
//         ])
        
//     }
// })





// // h('div',{class:"home-content"},[
// //     h('div',{ class: "leaderboard-title" },[
// //         h('h1',{},['Leaderboard'])
// //     ]),
// //     h('div',{class: "pics-rank" },[
// //         h('div',{ class: "first-place"},[
// //             h('img',{ class: "crown-pic", src: "./images/crown-removebg-preview.png" }),
// //             h('img',{ class: "first-pic", src: "./images/kel-baam.png"}),
// //             h('h4',{},['kel-baam'])
// //         ]),
// //     // h('div',{ class: "second-third-place" },[
// //     //     h('div',{ class: "second-place"},[
// //     //         h('img',{ class: "second-symbol", src: "./images/second_1021187.png" }),
// //     //         h('img',{ class: "second-pic", src: "./images/kel-baam.png"}),
// //     //         h('h4',{},['niboukha'])
// //     //     ]),
// //     //     h('div',{ class: "third-place"},[
// //     //         h('img',{ class: "third-symbol", src: "./images/crown-removebg-preview.png" }),
// //     //         h('img',{ class: "third-pic", src: "./images/kel-baam.png"}),
// //     //         h('h4',{},['niboukha'])
// //     //     ]),
// //     // ])

// //     ])

// // ])