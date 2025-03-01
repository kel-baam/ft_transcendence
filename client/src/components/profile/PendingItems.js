import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js' 
// import { customFetch } from '../../package/fetch.js'

export 

const PendingItems = defineComponent({
    // state()
    // {
    //   return {
    //   }
    // },
    render()
    {
        const {isExpanded, searchedUser} = this.props
        const data = isExpanded ? this.props.data : this.props.data.slice(0,4)
        return h('div', {class : 'pending-friends-items',
            style: isExpanded ? { 'row-gap': '0%','grid-auto-rows' : '14.5%',justifyContent : 'center'} : {}
            }, data.map((user, i)=>
            {
              
              if ((searchedUser != "" && user.username.startsWith(searchedUser)) || 
                searchedUser == "")
                return h(PendingItem, {
                  isExpanded : isExpanded,
                  id : user.request_id,
                  user,
                  i,
                  on : {remove : (id) => this.emit('remove', {id, i})}
                })
            }
            ))
    }
})

const PendingItem = defineComponent({
    // state()
    // {
    //   return {
    //   }
    // },
    render()
    {
     
      const {id, user, isExpanded} = this.props 
      console.log("---------------------------------> user kkkkkkkkkkkkkkkkk: ",this.props   )
      return h('div', { class: 'pending-friend-item' , 
          style : isExpanded ? 
          { backgroundColor : '#CBCBCB', 'border-radius' : '15px',
            width:'700px', height:'65px'
          } : {}
          }, [
            h('div', { class: 'picture-item' }, [
              h('img', { src: `https://${window.env.IP}:3000${user.picture}`, alt: 'profile picture', class : 'picture-item', style : {'object-fit': 'cover'} })
            ]),
            h('div', { class: 'data-user' }, [
              h('span', {style: {fontFamily : 'myFont'}}, [user.first_name + ' ' + user.last_name]),
              h('span', { style:{ color: '#A7A4A4',fontFamily : 'myFont'} }, ['@' + user.username])
            ]),
            h('div', { class: 'cancel-icon' }, [
                h('i', { class: 'fa fa-close', style: { fontSize: '24px', color: '#D44444'} ,
                on : {click : () => this.emit('remove', id)}})
            ])
          ])
    }
})