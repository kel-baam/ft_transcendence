import {RouterOutlet,h,createApp,defineComponent,HashRouter} from './package/index.js'
// import { Profile } from './components/profile.js'
import { Login } from './pages/login.js'
import { LandingPage } from './pages/landingPage.js'
// import { TwoFactor } from './components/twoFactor.js';
import { customFetch } from './package/fetch.js';
// import { InformationsForm } from './components/login/form.js';
import { Register } from './pages/register.js';
import { Home } from './pages/home.js';

import { settings } from './pages/settings.js';
import { Profile } from './pages/profile.js';

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



const test = defineComponent({

   
    state(){
      return {
          isLoading : false,
          data:{}

  }
  },

  onMounted(){
      console.log("-----------> here update state ")
      this.updateState({ isLoading: true })
      console.log("onmouunted-------------->",this.state.isLoading)
      customFetch('http://localhost:3000/home/',{})
      .then((data)=>{
        console.log("data fetcheed",data)
        if(!data.ok)
        {
          this.appContext.router.navigateTo('/401')

        }
      })
  
    },

   
  render() {
    return h('div',{},[
      h('div',{},["heeeeelo in ur hooome"]),

    ]) 
  },
  
})

const router = new HashRouter([

    { path: '/', component: LandingPage },
    // { path: '/form', component: InformationsForm },
    // { path: '/2FA', component: TwoFactor },
    { path: '/login', component: Login },
    { path:'/home', component: Home},

    { path:'/home', component: test},
    { path: '/test',component: Home},
    { path: '/401',  component: NotFound },
    { path: '/register',  component: Register },
    {path : '/settings', component: settings},
    {path:'/profile', component: Profile}


  ])


const RootComponent = defineComponent({
    render() {
      return h(RouterOutlet,{}) 
    }
  })


export const app = createApp(RootComponent,{}, { router })

app.mount(document.body,{})
