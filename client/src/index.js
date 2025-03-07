import {RouterOutlet,h,createApp,defineComponent,HashRouter} from './package/index.js'
// import { Profile } from './components/profile.js'
import { Login } from './pages/login.js'
import { LandingPage } from './pages/landingPage.js'
import { TwoFactor } from './components/login/twoFactor.js';
import { customFetch } from './package/fetch.js';
import { Register } from './pages/register.js';
import { Home } from './pages/home.js';
import { Leaderboard } from './pages/leaderboard.js';
import { Profile } from './pages/profile.js';
import { ResetPassword } from './pages/resetPassword.js';
import { Game } from './pages/game.js';


import { Tournament } from './pages/tournaments/tournament.js';
import { LocalTournament } from './pages/tournaments/local/LocalTournament.js'
import { OnlineTournament } from './pages/tournaments/online/OnlineTournament.js';
import { LocalHierarchy } from './pages/tournaments/local/LocalHierarchy.js';
import { PlayerVsPlayer } from './pages/pvp/playerVSplayer.js';
import { OnlinePvp } from './pages/pvp/online.js';
import {OnlineHierarchy} from './pages/tournaments/online/OnlineHierarchy.js'
import { EditInfoForm } from './pages/EditInfoForm.js';
import { SecuritySettings } from './pages/SecuritySettings.js';
import { BlockedFriendsList } from './pages/BlockedFriendsList.js';

import { NotFound } from './components/errorPages/404.js';
import { Unauthorized } from './components/errorPages/401.js';
import { ComingSoon } from './components/errorPages/coming_soon.js';



window.env = {
  IP: "10.14.2.1",
}

document.addEventListener('DOMContentLoaded', function() {
  // console.clear()
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
  
 

async function isAuthenticated(currentLocation)
{

      let query = false
      if(currentLocation.route.path == '/2FA')
        query = true
      const result = await customFetch(`https://${window.env.IP}:3000/isAuthenticated?2fa=${query}`)
      if(result)
      {
        if(!result.ok)
        { 

          if(result.status == 401)
              return '/login'
        }
        else
        {
          const data = await result.json()
          if(result.status == 200)
          {
            if(data['redirect'] && data['redirect'] == "home")
              return '/home'

          }
        }
    }
}



const router = new HashRouter([

    { path: '/', component: LandingPage },
    { path: '/login', component: Login },
    { path: '/register',  component: Register },
    { path:'/home', component: Home,beforeEnter:isAuthenticated},
    { path: '/2FA', component: TwoFactor,beforeEnter:isAuthenticated},
    
    { path: '/leaderboard',component: Leaderboard, beforeEnter:isAuthenticated },

    // { path: '/404',  component: NotFound },
    // { path: '/coming_soom', component: ComingSoon },
    // { path: '/401',  component: Unauthorized },
    { path:'/user', component: Profile, beforeEnter:isAuthenticated},
    { path:'/user/:username', component: Profile,  beforeEnter:isAuthenticated},
    { path: '/password/reset',  component: ResetPassword },

    { path:'/tournament',component: Tournament, beforeEnter:isAuthenticated},
    { path:'/tournament/local', component: LocalTournament, beforeEnter:isAuthenticated},
    { path:'/tournament/local/local_hierachy/:id', component:  LocalHierarchy, beforeEnter:isAuthenticated},
    { path:'/tournament/online', component: OnlineTournament, beforeEnter:isAuthenticated },
    { path:'/tournament/online/online_hierachy/:id', component: OnlineHierarchy, beforeEnter:isAuthenticated},
    { path: '/pvp', component: PlayerVsPlayer, beforeEnter:isAuthenticated},
    { path: '/pvp_online', component: OnlinePvp, beforeEnter:isAuthenticated},
    { path:'/game', component: Game, beforeEnter:isAuthenticated},
    
    {path : '/settings/edit-info', component : EditInfoForm, beforeEnter:isAuthenticated},
    {path : '/settings/security', component : SecuritySettings,beforeEnter:isAuthenticated},
    {path: '/settings/blocked-friends', component: BlockedFriendsList,beforeEnter:isAuthenticated},
    {path :  '*', component : NotFound}

  ])


const RootComponent = defineComponent({
    render() {
      return h(RouterOutlet,{}) 
    }
  })


export const app = createApp(RootComponent,{}, { router })

app.mount(document.body,{})
