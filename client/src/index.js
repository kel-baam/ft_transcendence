import {RouterOutlet,h,createApp,defineComponent,HashRouter} from './package/index.js'
import { Profile } from './components/profile.js'
import { Login } from './components/login.js'
import { LandingPage } from './components/landingPage.js'
import { TwoFactor } from './components/twoFactor.js';
// import { Form } from './components/form.js';

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

    // Define a reactive variable to store data
    // const data = ref(null);
    state(){
      return {
          isLoading : false,
          data:{}

  }
  },
    // Fetch data when the component is mounted
  onMounted(){
      console.log("-----------> here update state ")
      this.updateState({ isLoading: true })
      console.log("onmouunted-------------->",this.state.isLoading)
      fetch('http://localhost:3000/home/',{
        
        credentials: 'include',
      }
      )
        .then(response => response.json())
        .then(dataFromBackend => {
          console.log(dataFromBackend)
          this.updateState({ data: dataFromBackend})
          console.log("-----------> here update state ")
          console.log(this.state.data,"||",this.state.isLoading)
          // data.value = dataFromBackend;  // Store the response data
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },

    // Return data to the template
  
  // },
  render() {
    console.log(">>>>>>>> in render ")
    return h('div',{},[
      h('div',{},["heeeeelo in ur hooome"]),
      this.state.isLoading ? h('h1', {style:{color:'red'}}, ["Data from backend"]) : h('h1', {style:{color:'red'}}, ['Loading...']),

    ]) 
  },
  
})

// console.log("thiiiiiiis")
const router = new HashRouter([

    { path: '/2FA', component: TwoFactor },
    { path: '/', component: LandingPage },
    { path: '/login', component: Login },

    { path: '/login/:id', component: Login },


    { path: '/landing',component:LandingPage},
    { path:'/home', component: test},
    { path: '/401',  component: NotFound },

    { path: '/',  component: NotFound },
  ])


const RootComponent = defineComponent({
    render() {
      return h(RouterOutlet,{}) 
    }
  })


export const app = createApp(RootComponent,{}, { router })
// window.addEventListener('popstate', ()=>{
//   console.log("i'm listiiiing===========================")
// })
app.mount(document.body,{})
