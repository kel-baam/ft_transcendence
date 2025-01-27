import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js' 
// import { customFetch } from '../../package/fetch.js'

export const RequestsItems = defineComponent({
    state()
    {
      return{
      }
    },
    render()
    {
      const {isExpanded} = this.props
      const data = isExpanded ? this.props.data : this.props.data.slice(0,4)
      return h('div', {class : 'requestes-items', 
        style: isExpanded ? { 'row-gap': '0%','grid-auto-rows' : '14.5%',justifyContent : 'center'} : {}
      }, data.map((userRequest, i) =>
        h(RequestItem, {
          isExpanded : isExpanded,
          id : userRequest.id,
          user : userRequest.user,
          i,
          on : { remove: (id) => this.emit('remove', {id, i }),
                  accept : (id)  => this.emit('accept', {id, i})
        }
        })
      ))
    }

})

const RequestItem =  defineComponent({
    state()
    {
      return {
      }
    },
    render()
    {
        const {id, user, isExpanded} = this.props

        return h('div', { class: 'request-item',
            style : isExpanded ? 
            { backgroundColor : '#CBCBCB', 'border-radius' : '15px',
              width:'700px', height:'65px'
            } : {}
            }, [
            h('div', { class: 'picture-item' }, [
              h('img', { src: `http://localhost:3000${user.picture}`, alt: 'profile picture', class: 'picture-item', 
                style : {'object-fit': 'cover'} })
            ]),
            h('div', { class: 'data-user' }, [
              h('span', {}, [user.first_name + ' ' + user.last_name]),
              h('span', { style: {color: '#A7A4A4'} }, ['@' + user.username])
            ]),
            h('div', { class: 'accept-and-refuse-icons' }, [
              
                h('i', { 
                  class: 'fa fa-close', 
                  style: {fontSize:'24px', color:'#D44444'},
                  on : { click : () => this.emit('remove', id)}
                })
              ,
                h('i', { 
                  class: 'fa-solid fa-check',
                  style: { fontSize:'24px', color: '#0AA989'},
                  on : {click : () => this.emit('accept', id)} })
              
            ])
          ])
    },
    

})
