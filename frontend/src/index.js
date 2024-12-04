import { Tournament } from './pages/tournaments/tournament.js';
import { HashRouter,   RouterOutlet,h,createApp,defineComponent} from './package/index.js';
import { LocalTournament } from './pages/tournaments/local/LocalTournament.js'
import { OnlineTournament } from './pages/tournaments/online/OnlineTournament.js';
import { Hierarchy } from './pages/tournaments/local/Hierarchy.js';
import { Game } from './pages/game.js';
import {NotFound} from './pages/404.js';
import {Home} from './pages/home.js';
import {Profile} from './pages/profile.js';

document.addEventListener('DOMContentLoaded', function() {
  const links = document.querySelectorAll('.scroll-link');

  links.forEach(link => {
      link.addEventListener('click', function(event) {
          event.preventDefault();

          const targetId = link.getAttribute('href').substring(1);

          const targetElement = document.getElementById(targetId);

          if (targetElement) {
              targetElement.scrollIntoView({
                  behavior: 'smooth',  
                  block: 'start',      
              });
          }
      });
  });
});
function beforeNavigate(from, to)
{}
// const NotFound = defineComponent({
//       render() {
//         return h('div',{},[h('div',{},["404 THIS PAGE NotFound "])]) 
//       }
// })

const router = new HashRouter([

    // { path: '/2FA', component: TwoFactor },
    // { path: '/', component: LandingPage },
    // { path: '/login', component: Login },
    // { path: '/landing',component:LandingPage},
    // { path:'/profile', component: Profile},

    {path:'/', component: Home},

    {path:'/home', component: Home},

    {path:'/profile', component: Profile},

    {path:'/tournament',component: Tournament},

    {path:'/tournament/local', component: LocalTournament,

      // beforeEnter: (from) =>{
        //   console.log("====================================> from : ", from)
        //   if  (from !=='/tournament')
        //     return '/tournament'
        // }
    },
    {path:'/game', component: Game},
    {path:'/tournament/local/hierachy/:id', component:  Hierarchy,
      // beforeEnter: (from) =>{

      //   // console.log("------------------------------------> this.params", to.appContext)
      //   console.log("====================================> from : ", from)
      //   if  (from !=='/tournament/local/form')
      //     return '/tournament'
      // }
     },
     {path:'/tournament/online', component: OnlineTournament},
     

    // {path:'/tournament/online/hierachy/:id', component:  Hierarchy,
    //   // beforeEnter: (from) =>{

    //   //   // console.log("------------------------------------> this.params", to.appContext)
    //   //   console.log("====================================> from : ", from)
    //   //   if  (from !=='/tournament/local/form')
    //   //     return '/tournament'
    //   // }
    //  },

    { path: '*',  component: NotFound },

  ])




const RootComponent = defineComponent({
    render() {  return h(RouterOutlet,{})  }
  })

export const app = createApp(RootComponent,{}, { router })
app.mount(document.body,{})
