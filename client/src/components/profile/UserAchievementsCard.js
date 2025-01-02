import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'

export const UserAchievementsCard = defineComponent({
    state(){

    },
    render()
    {
        return h('div', { className: 'achievements-container' }, [
            h('div', { className: 'achievements-title-elt' }, [
              h('h1', {}, ['Achievements'])
            ]),
            h('div', { className: 'badges-container' }, [
              h('div', { className: 'badge-item' }, [
                h('img', { 
                  src: './images/lock.png', 
                  alt: 'lock icon' 
                })
              ]),
              h('div', { className: 'badge-item' }, [
                h('img', { 
                  src: './images/lock.png', 
                  alt: 'lock icon' 
                })
              ])
            ]),
            h('div', { className: 'badges-container' }, [
              h('div', { className: 'badge-item' }, [
                h('img', { 
                  src: './images/lock.png', 
                  alt: 'lock icon' 
                })
              ]),
              h('div', { className: 'badge-item' }, [
                h('img', { 
                  src: './images/lock.png', 
                  alt: 'lock icon' 
                })
              ])
            ])
          ]);          
    }
})