import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'
import { customFetch } from '../../package/fetch.js';

export const UserAchievementsCard = defineComponent({
    state(){
      return {
        data : [],
        isLoading: true
      }
    },
    render()
    {
      const {isLoading, data } = this.state
      if (isLoading)
        return  h('div', { class : 'achievements-container' })
      return h('div', { class : 'achievements-container' }, [
          h('div', { class : 'achievements-title-elt' }, [
            h('h1', {}, ['Achievements'])
          ]),
          h('div', { class : 'badges-container' }, [
            h('div', { class : 'badge-item' }, [
              h('img', { 
                src: './images/lock.png', 
                alt: 'lock icon' 
              }),
              // h('div', {width:'60%', height:"auto"}, [
              //    h('img', {src : `https://${window.env.IP}:3000${data[0].icon}`, style : !data[0].unlocked ? 
              // {
              //   filter : 'grayscale(100%) brightness(0.5) blur(1px)', 
              //   opacity: '0.5'} : {filter : 'none', opacity : 1}})
              // ])
             
          

            ]),
            h('div', { class : 'badge-item' }, [
              h('img', { 
                src: './images/lock.png', 
                alt: 'lock icon' 
              })
            ])
          ]),
          h('div', { class : 'badges-container' }, [
            h('div', { class : 'badge-item' }, [
              h('img', { 
                src: './images/lock.png', 
                alt: 'lock icon' 
              })
            ]),
            h('div', { class : 'badge-item' }, [
              h('img', { 
                src: './images/lock.png', 
                alt: 'lock icon'
              })
            ])
          ])
        ]);          
    },

    onMounted()
    {
        customFetch(`https://${window.env.IP}:3000/api/user/badges`)
              .then(result =>{
      
                  // if (!result.ok)
                  // {
                  //     // console.log("res isn't okey ," , " | ", this)
                      
                  //     this.appContext.router.navigateTo('/login')
                  // }
                  switch(result.status)
                  {
                      case 401:
                          console.log(">>>>>>>>>>>>> here ")
                          this.appContext.router.navigateTo('/login')
                          break;
                      // case 404:
                      //     console.log(">>>>>>>----------- 404 >>>>>> here ")
                      //     h('h1', {}, ['404 not found'])
                      //     break;
                  }
                  return result.json()
              })
              .then(res =>{
                  this.updateState({
                          isLoading: false,  
                          data: res,   
                          // error: null   
                  });
      
              })
              // .catch(error => {
              //     // console.log(">>>>>>>>>>>> error : ", error)
              // })
    }

})