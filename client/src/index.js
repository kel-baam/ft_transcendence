import {RouterOutlet,h,createApp,defineComponent,HashRouter} from './package/index.js'
// import { Profile } from './components/profile.js'
import { Login } from './pages/login.js'
import { LandingPage } from './pages/landingPage.js'
import { TwoFactor } from './components/login/twoFactor.js';
import { customFetch } from './package/fetch.js';
import { Register } from './pages/register.js';
import { Home } from './pages/home.js';
import { Leaderboard } from './pages/leaderboard.js';
import { settings } from './pages/settings.js';
import { Profile } from './pages/profile.js';
import { Chat } from './pages/chat.js';
import { ResetPassword } from './pages/resetPassword.js';
import { Game } from './pages/game.js';

window.env = {
  DOMAIN: "http://localhost:3000",
}

document.addEventListener('DOMContentLoaded', function() {
  const links = document.querySelectorAll('.scroll-link');
  console.log("------------------> Domain:",  window.ENV);
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




async function isAuthenticated(currentLocation)
{
      let query = false
      if(currentLocation == '/2FA')
        query = true
      const result = await customFetch(`${window.env.DOMAIN}/isAuthenticated?2fa=${query}`)
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

    { path: '/', component: LandingPage 
    },
    { path: '/login', component: Login },
    { path: '/register',  component: Register },
    { path:'/home', component: Home,
      // beforeEnter:isAuthenticated

    },
    { path:'/game', component: Game},

    
    // { path:'/home', component: test},
    { path: '/2FA', component: TwoFactor,
      beforeEnter:isAuthenticated

    },
    { path: '/leaderboard',component: Leaderboard,
      beforeEnter:isAuthenticated

    },

    { path: '/401',  component: NotFound },
    {path : '/settings', component: settings,
      beforeEnter:isAuthenticated

    },
    {path:'/user', component: Profile,
      beforeEnter:isAuthenticated

    },
    {path:'/user/:username', component: Profile,
      beforeEnter:isAuthenticated

    },

    { path: '/password/reset',  component: ResetPassword },
    {path:'/chat', component: Chat}



  ])


const RootComponent = defineComponent({
    render() {
      return h(RouterOutlet,{}) 
    }
  })


export const app = createApp(RootComponent,{}, { router })

app.mount(document.body,{})
