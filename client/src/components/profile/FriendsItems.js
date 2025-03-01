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
  
      const {isExpanded, key, searchedUser} = this.props
      console.log(">>>>>>>>>>>>>>>>>>>> searchedUser here : ", searchedUser)
      // console.log('>>>>>>>>>>>>>>> this state of friends : ', this.state)
      const data = isExpanded ? this.props.data : this.props.data.slice(0,4)
      console.log("------------------------------------> data : ", data)
      return h('div', {class : 'friends-scope-item',
          style: isExpanded ? { 'row-gap': '0%','grid-auto-rows' : '14.5%'
            ,justifyContent : 'center'} : {}
        }, data.map((user) =>
        {

          if ((searchedUser != "" && user.username.startsWith(searchedUser)) 
            || searchedUser == "")
            return h(FriendItem, {
              user,
              isExpanded : isExpanded,
              key,
            })
        }
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
      console.log("------------------>props here : ", this.props)
      const {user, isExpanded, key} = this.props
      // console.log("---------------------------> user : ", user)
      return  h('div', { class: 'friend-item', style : isExpanded ? 
        {
          backgroundColor : '#CBCBCB', 'border-radius' : '15px',
          width:'700px', height:'65px'
        } : key ? {display : 'flex', justifyContent:'center'} : {}},
        [
          h('div', { class: 'picture-item' },
            [
              h('img', { src: `https://${window.env.IP}:3000${user.picture}`, alt:'profile picture', class: 'picture-item',
                style : {'object-fit': 'cover'}
              })
            ]
          ),
          h('div', { class: 'data-user' },
            [
              h('span', {style: {fontFamily : 'myFont'}}, [user.first_name + ' ' + user.last_name]),
              h('span', { style: { color: '#A7A4A4', fontFamily : 'myFont'} }, ['@' + user.username])
            ]
          ),
          h('div', { class: 'chat-icon' },!key ?
            [
              h('img', { src: 'images/tabler_message (1).png', alt: 'chat icon', on :
                {
                  click : ()=>this.appContext.router.navigateTo(`/chat/${user.username}`)
                }
               })
            ]:
            []
          )
        ]
      )
    }
  })