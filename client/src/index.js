import {RouterOutlet,h,createApp,defineComponent,HashRouter} from './package/index.js'
// import { Profile } from './components/profile.js'
import { Login } from './pages/login.js'
import { LandingPage } from './pages/landingPage.js'
import { TwoFactor } from './components/login/twoFactor.js';
import { customFetch } from './package/fetch.js';
// import { InformationsForm } from './components/login/form.js';
import { Register } from './pages/register.js';
import { Home } from './pages/home.js';

import { settings } from './pages/settings.js';
import { Profile } from './pages/profile.js';
import { Chat } from './pages/chat.js';
import { ResetPassword } from './pages/resetPassword.js';

import { Tournament } from './pages/tournaments/tournament.js';
import { LocalTournament } from './pages/tournaments/local/LocalTournament.js'
import { OnlineTournament } from './pages/tournaments/online/OnlineTournament.js';
import { LocalHierarchy } from './pages/tournaments/local/LocalHierarchy.js';
import { Game } from './pages/game.js';
// import { NotFound } from './pages/utils/404.js';
import { PlayerVsPlayer } from './pages/pvp/playerVSplayer.js';
import { OnlinePvp } from './pages/pvp/online.js';
import {OnlineHierarchy} from './pages/tournaments/online/OnlineHierarchy.js'

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

const NotFound = defineComponent({
      render() {
        return h('div',{},[h('div',{},["404 THIS PAGE NotFound "])]) 
      }
})


async function isAuthenticated()
{
      const result = await customFetch("http://localhost:3000/auth/islogged/",{})
      if(result)
      {
        if(!result.ok)
          { 
            if(result.status == 401)
              return '/login'
          }
      }    
}

const router = new HashRouter([

    { path: '/', component: LandingPage },
    { path: '/2FA', component: TwoFactor },
    { path: '/login', component: Login },
    { path:'/home', component: Home, 
      beforeEnter:isAuthenticated},
      {path:'/profile', component: Profile,
        beforeEnter:isAuthenticated
      },
    { path: '/401',  component: NotFound },
    { path: '/register',  component: Register },
    {path : '/settings', component: settings,
      beforeEnter:isAuthenticated
    },
    { path: '/password/reset',  component: ResetPassword },
    {path:'/chat', component: Chat,
      beforeEnter:isAuthenticated
    },

    {path:'/tournament',component: Tournament,
      beforeEnter:isAuthenticated
    },
    {path:'/tournament/local', component: LocalTournament,
      beforeEnter:isAuthenticated
    },
    { path:'/game', component: Game},
    { path:'/tournament/local/local_hierachy/:id', component:  LocalHierarchy,
      beforeEnter:isAuthenticated
    },
    { path:'/tournament/online', component: OnlineTournament,
      beforeEnter:isAuthenticated

    },
    { path:'/tournament/online/online_hierachy/:id', component: OnlineHierarchy},
    { path: '/playerVSplayer', component: PlayerVsPlayer},
    { path: '/pvp_online', component: OnlinePvp},
    
    { path: '*',  component: NotFound },

  ])


const RootComponent = defineComponent({
    render() {
      return h(RouterOutlet,{}) 
    }
  })


export const app = createApp(RootComponent,{}, { router })

app.mount(document.body,{})
