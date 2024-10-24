import createElement from "../framework/createElement.js";
class FriendsCard {
      constructor(props)
      {        
          this.props = props
         
          Object.keys(this.props).map(key =>{
            this.props[key]['user'].picture = {
                    imgSrc: '../../assets/images/kjarmoum.png',
                alt: 'profile picture'
            }
          })
      }
        
      handlePendingClick = ()=>
      {
      // console.log("-------> contentTYpe", event.target)
      const eventName = new CustomEvent('any')
      document.getElementsByClassName('pending-button')[0].dispatchEvent(eventName)
      // console.log(">>>>>>>>>>>> event.target", eventName.target)
      }
      handleRequestsClick = ()=>
      {
        // console.log("-------> contentTYpe", event.target)
        const eventName = new CustomEvent('any')
        document.getElementsByClassName('request-button')[0].dispatchEvent(eventName)
        // console.log(">>>>>>>>>>>> event.target", eventName.target)
      }
      handleFriendsClick = ()=>
      {
        // console.log("-------> contentTYpe", event.target)
        const eventName = new CustomEvent('any')
        document.getElementsByClassName('friends-button')[0].dispatchEvent(eventName)
        // console.log(">>>>>>>>>>>> event.target", eventName.target)
      }
      
      FriendsFriendItem({id, user})
      {
        return  createElement('div', { className: 'friend-item' },
          createElement('div', { className: 'picture-item' },
            createElement('img', { src: user.picture.imgSrc, alt: user.picture.alt, className: 'picture-item' })
          ),
          createElement('div', { className: 'data-user' },
            createElement('span', {}, user.first_name + ' '+ user.last_name),
            createElement('span', { style: 'color: #A7A4A4;' }, '@' + user.username)
          ),
          createElement('div', { className: 'chat-icon' },
            createElement('a', { href: '#' },
              createElement('img', { src: '../../assets/images/tabler_message (1).png', alt: '' })
            )
          )
        )
        
      }   
      render(){
          return createElement('div', { className: 'friends-and-requetes-container' },
            createElement('div', { className: 'friends-and-req-buttons' },
              createElement('div',{},
                createElement('button', { className: 'friends-button', style: 'background-color:rgba(95, 114, 125, 0.08);' , onclick:this.handleFriendsClick},
                  createElement('h1', null, 'Friends')
                )
              ),
              createElement('div',{},
                createElement('button', { className: 'request-button', onclick:this.handleRequestsClick},
                  createElement('h1', {}, 'Requests')
                )
            ),
            createElement('div',{},
                createElement('button', { className: 'pending-button' , onclick:this.handlePendingClick},
                    createElement('h1', {}, 'Pending')
                )
            )
        ),
        createElement('div', { className: 'friends-scope-item' },
          ...Object.keys(this.props).slice(0, 4).map(key =>{
              const item = this.FriendsFriendItem(this.props[key])
              return item
          }
        )
        )
        ,
        (Object.keys(this.props).length  >= 4) ?
        createElement('div', { className: 'view-all-link-fr' },
            createElement('a', { href: '#' }, 'View all')
        ) : {}
        )
    
    }
}
export default FriendsCard;