import{ defineComponent, h} from '../../package/index.js' 

 export const FriendsItems = defineComponent({
   
    render()
    {
  
      const {isExpanded, key, searchedUser} = this.props
      // console.log("----------------> seatched user is " , searchedUser)

      const data = isExpanded ? this.props.data : this.props.data.slice(0,4)
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> data : ", data )
      return h('div', {class : 'friends-scope-item',
          style: isExpanded ? { 'row-gap': '0%','grid-auto-rows' : '14.5%'
            ,justifyContent : 'center'} : {}
        }, data.map((user) =>
        {

          if ((searchedUser != "" && user.username.startsWith(searchedUser)))
            return h(FriendItem, {
              user,
              isExpanded : isExpanded,
              key,
            })
          else if (searchedUser == "")
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
  
    render()
    {
      const {user, isExpanded, key} = this.props
      return  h('div', { class: 'friend-item', style : isExpanded ? 
        {
          backgroundColor : '#CBCBCB', 'border-radius' : '15px',
          width:'700px', height:'65px'
        } : key ? {display : 'grid', justifyContent:'center', 'grid-template-columns' : '42% 57%'} : {}},
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