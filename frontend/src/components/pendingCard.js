import createElement from "../framework/createElement.js";

class PendingCard {

    constructor(props)
    {
        this.props = props
         Object.keys(this.props).map(key =>{
            this.props[key]['user'].picture = {
                  imgSrc: '../../assets/images/kjarmoum.png',
                alt: 'profile picture'
            }
            // console.log("---------------------> this.props[key] ", this.props[key]['id'])
          })
    }
    PendingFriendItem ({ id, user }) {
        return (createElement('div', { className: 'pending-friend-item' },
          createElement('div', { className: 'picture-item' },
            createElement('img', { src: user.picture.imgSrc, alt: 'profile picture', className: 'picture-item' })
          ),
          createElement('div', { className: 'data-user' },
            createElement('span', {}, user.first_name + ' ' + user.last_name),
            createElement('span', { style: 'color: #A7A4A4;' },'@'+ user.username)
          ),
          createElement('div', { className: 'cancel-icon' },
            createElement('a', { href: '#' },
              createElement('i', { className: 'fa fa-close' , style: "font-size:24px; color:#D44444;" })
            )
          )
        ));
    }

    render()
    {
      return createElement('div', { className: 'friends-and-requetes-container' },
            createElement('div', { className: 'friends-and-req-buttons' },
            createElement('div',{},
                createElement('button', { className: 'friends-button' },
                    createElement('h1', null, 'Friends')
                )
            ),
            createElement('div',{},
                createElement('button', { className: 'request-button'},
                    createElement('h1', {}, 'Requests')
                )
            ),
            createElement('div',{},
                createElement('button', { className: 'pending-button' , style: 'background-color:rgba(95, 114, 125, 0.08);'},
                    createElement('h1', {}, 'Pending')
                )
            )
        ),
        createElement('div', { className: 'pending-friends-items' },
        ...Object.keys(this.props).slice(0, 4).map(key => {
            console.log("-----------------> key == " , key)
            const item = this.PendingFriendItem(this.props[key]);
            // console.log("-----> item : ", item);
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
export default PendingCard;