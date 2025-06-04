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
              h('div', { class : 'sys_badge0' }, [
                 h('img', {src : `https://${window.env.IP}:3000${data[0].icon}`, style : !data[0].unlocked ? 
              {
                filter : 'grayscale(50%) brightness(0.5)', 
                opacity: '0.5'} : {filter : 'none', opacity : 1}})
              ])
             

            ]),
            h('div', { class : 'badge-item' }, [
              h('div', { class : 'sys_badge1' }, [
                h('img', {src : `https://${window.env.IP}:3000${data[1].icon}`, style : !data[1].unlocked ? 
                {
                filter : 'grayscale(50%) brightness(0.5)', 
                opacity: '0.5'} : {filter : 'none', opacity : 1}})
             ])
            ])
          ]),
          h('div', { class : 'badges-container' }, [
            h('div', { class : 'badge-item' }, [
              h('div', { class : 'sys_badge2' }, [
                h('img', {src : `https://${window.env.IP}:3000${data[2].icon}`, style : !data[2].unlocked ? 
             {
               filter : 'grayscale(50%) brightness(0.5)', 
               opacity: '0.5', } : {filter : 'none', opacity : 1},
              })
             ])
            ]),
            h('div', { class : 'badge-item' }, [
              h('div', {class : 'sys_badge3' }, [
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
      
                  switch(result.status)
                  {
                      case 401:
                          this.appContext.router.navigateTo('/login')
                          break;
                  }
                  return result.json()
              })
              .then(res =>{
                  this.updateState({
                          isLoading: false,  
                          data: res,   
                  });
      
              })
    }

})