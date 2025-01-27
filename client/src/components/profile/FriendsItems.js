import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js' 
// import { customFetch } from '../../package/fetch.js'

 export const FriendsItems = defineComponent({
    // state()
    // {
    //   return{
    //   }
    // },
    render()
    {
  
      const {isExpanded} = this.props
      // console.log('>>>>>>>>>>>>>>> this state of friends : ', this.state)
      const data = isExpanded ? this.props.data : this.props.data.slice(0,4)
      return h('div', {class : 'friends-scope-item',
          style: isExpanded ? { 'row-gap': '0%','grid-auto-rows' : '14.5%'
            ,justifyContent : 'center'} : {}
        }, data.map((userFriend) =>
          h(FriendItem, {
            user : userFriend.user,
            isExpanded : isExpanded
          })
        )
    )
    }
  
  })
  
  const FriendItem = defineComponent({
    // state()
    // {
    //   return {
    //   }
    // },
    render()
    {
      const {user, isExpanded} = this.props
      return  h('div', { class: 'friend-item', style : isExpanded ? 
        {backgroundColor : '#CBCBCB', 'border-radius' : '15px',
          width:'700px', height:'65px'
        } : {} },
        [
          h('div', { class: 'picture-item' },
            [
              h('img', { src: `http://localhost:3000${user.picture}`, alt:'profile picture', class: 'picture-item',
                style : {'object-fit': 'cover'}
              })
            ]
          ),
          h('div', { class: 'data-user' },
            [
              h('span', {}, [user.first_name + ' ' + user.last_name]),
              h('span', { style: { color: '#A7A4A4'} }, ['@' + user.username])
            ]
          ),
          h('div', { class: 'chat-icon' },
            [
              h('img', { src: 'images/tabler_message (1).png', alt: 'chat icon' })
            ]
          )
        ]
      )
    }
  })