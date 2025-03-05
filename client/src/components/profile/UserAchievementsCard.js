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
            h('h1', {'data-translate' : 'Achievements'}, ['Achievements'])
          ]),
          h('div', { class : 'badges-container' }, [
            h('div', { class : 'badge-item' }, [
              !data[0].unlocked ? h('img', { 
                src: './images/lock.png', 
                alt: 'lock icon' 
              }) : null,
              h('div', { }, [
                 h('img', {src : `https://${window.env.IP}:3000${data[0].icon}`, style : !data[0].unlocked ? 
              {
                filter : 'grayscale(50%) brightness(0.5)', 
                opacity: '0.5'} : {filter : 'none', opacity : 1}})
              ])
             
          

            ]),
            h('div', { class : 'badge-item' }, [
              !data[1].unlocked ? h('img', { 
                src: './images/lock.png', 
                alt: 'lock icon' 
              }) : null,
              h('div', { }, [
                h('img', {src : `https://${window.env.IP}:3000${data[1].icon}`, style : !data[1].unlocked ? 
             {
               filter : 'grayscale(50%) brightness(0.5)', 
               opacity: '0.5'} : {filter : 'none', opacity : 1}})
             ])
            ])
          ]),
          h('div', { class : 'badges-container' }, [
            h('div', { class : 'badge-item' }, [
              !data[2].unlocked ? h('img', { 
                src: './images/lock.png', 
                alt: 'lock icon' 
              }) : null,
              h('div', { }, [
                h('img', {src : `https://${window.env.IP}:3000${data[2].icon}`, style : !data[2].unlocked ? 
             {
               filter : 'grayscale(50%) brightness(0.5)', 
               opacity: '0.5', } : {filter : 'none', opacity : 1},
              })
             ])
            ]),
            h('div', { class : 'badge-item' }, [
              ! data[3].unlocked ? h('img', { 
                src: './images/lock.png', 
                alt: 'lock icon'
              }) : null,
              h('div', { }, [
                h('img', {src : `https://${window.env.IP}:3000${data[3].icon}`, style : !data[3].unlocked ? 
             {
               filter : 'grayscale(50%) brightness(0.5)', 
               opacity: '0.5'} : {filter : 'none', opacity : 1}})
             ])
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
                console.log("---------------------> achievements : ", res)
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