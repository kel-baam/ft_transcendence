import createElement from "../framework/createElement.js";

class RequestsCard{

    constructor(props)
    {
        
        this.props = props
        // console.log("========================> this friends props : ", Object.keys(this.props))
        Object.keys(this.props).map(key =>{
          this.props[key]['user'].picture = {
            imgSrc: '../../assets/images/kjarmoum.png',
            alt: 'profile picture'
          }
            // console.log("---------------------> this.props[key] ", this.props[key]['id'])
          })
    }

    handleRequestRefuse = (id) =>{
      const socket = new WebSocket('ws://127.0.0.1:8000/requests/' )
      socket.onopen = function(event) {
        console.log('----------------> Connected to WebSocket server');
      };
    
    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        console.log('Message from server:', data.message);
      };
    
    socket.onclose = function(event) {
        console.log('Disconnected from WebSocket server');
      };
    }

    RequestFriendItem({id, user})
    {
      return createElement('div', { className: 'request-item' },
        createElement('div', { className: 'picture-item' },
          createElement('img', { src: user.picture.imgSrc, alt: user.picture.alt, className: 'picture-item' })
        ),
        createElement('div', { className: 'data-user' },
          createElement('span', {}, user.first_name +' ' + user.last_name),
          createElement('span', { style: 'color: #A7A4A4;' }, '@' + user.username)
        ),
        createElement('div', { className: 'accept-and-refuse-icons' },
          createElement('a', { href: '#' },
            createElement('i', { className: 'fa fa-close' , style: "font-size:24px; color:#D44444;", onclick:this.handleRequestRefuse(id) })
          ),
          createElement('a', { href: '#' },
            createElement('i', { className: 'fa-solid fa-check', style: "font-size:24px; color: #0AA989;" })
          )
        )
      )
    }
    render()
    {
      // <i class="fa fa-close"></i>
      return createElement('div', { className: 'friends-and-requetes-container' },
            createElement('div', { className: 'friends-and-req-buttons' },
            createElement('div',{},
                createElement('button', { className: 'friends-button'},
                    createElement('h1', null, 'Friends')
                )
            ),
            createElement('div',{},
                createElement('button', { className: 'request-button', style: 'background-color:rgba(95, 114, 125, 0.08);'},
                    createElement('h1', {}, 'Requests')
                )
            ),
            createElement('div',{},
                createElement('button', { className: 'pending-button'},
                    createElement('h1', {}, 'Pending')
                )
            )
        ),
        createElement('div', { className: 'requestes-items' },
          ...Object.keys(this.props).slice(0, 4).map(key =>{
            console.log("-----------------------> here ; ")
              const item = this.RequestFriendItem(this.props[key])
              return item;
          })
        )
        ,
        (Object.keys(this.props).length  >= 4) ?
        createElement('div', { className: 'view-all-link-fr' },
            createElement('a', { href: '#' }, 'View all')
        ) : {}
        )
        
    }
}
export default RequestsCard;