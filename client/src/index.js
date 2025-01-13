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
      const result = await customFetch("http://localhost:3000/isAuthenticated",{})
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
      beforeEnter:isAuthenticated
    },
    {path:'/profile', component: Profile,
      beforeEnter:isAuthenticated
    },
    { path: '/401',  component: NotFound },
    { path: '/register',  component: Register },
    {path : '/settings', component: settings},
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
