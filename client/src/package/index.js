export { createApp } from './app.js'
export { defineComponent } from './component.js'
export { DOM_TYPES, h, hFragment, hSlot, hString } from './h.js'
export { RouterLink, RouterOutlet } from './router-components.js'
export { HashRouter } from './router.js'
// export { nextTick } from './scheduler.js'


// // console.log("inde.js injit")
// export function HomeComponent() {
//     return `<div><h1>Home Page</h1></div>`;
//   }
  
//   // AboutComponent.js
//   export function AboutComponent() {
//     return `<div><h1>About Page</h1></div>`;
//   }


// const routes = [

//     { path: '/home', component: HomeComponent },
//     { path: '/about', component: AboutComponent },
//     // { path: '/users/:id', component: User },
//   ]

// const router = new HashRouter(routes)
// await router.init()


// const App = defineComponent({
//     render() {
//       return h('div', [
//         // Use RouterOutlet to display the matched route's component
//         h(RouterOutlet),
//       ]);
//     },
//   });
  
  // Mount the app with the router context
//   createApp(App)
//     .provide('appContext', { router })  // Provide the router context to the app
//     .mount('#app');
// // Define the root component
// const App = defineComponent({
//   render() {
//     return h('div', [
//       // Use RouterOutlet to display the matched route
//       h(RouterOutlet),
//     ]);
//   },
// });

// // Mount the app
// createApp(App)
//   .provide('appContext', { router })  // Provide the router to the app context
//   .mount('#app');
