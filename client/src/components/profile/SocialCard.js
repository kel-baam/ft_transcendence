import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js' 
import { customFetch } from '../../package/fetch.js'

export const SocialCard = defineComponent({
    state()
    {
        return {
          activateSection : null,
          // viewAll:false,
          isLoading:true,
          // isExpanded:false,
          data:[
           
          ],
          isOwn : true
        }
    },
    render()
    {
        const {isExpanded} = this.props
        // console.log(">>>>>>>>>>>>>>>>>> this params ====> : ", this.appContext.router.params)
        if (!this.state.activateSection)
          this.state.activateSection = this.props.activateSection
        // if (JSON.stringify(this.appContext.router.params) !== '{}')
        // {
        //   console.log(">>>>>>>>>>>>>>>> here in false ")
        //   this.state.isOwn = false
        // }
        const {activateSection, isLoading, isOwn} = this.state
        // console.log(">>>>>>>>>>>>>>>>>>>> here activate section : ", activateSection)
        console.log(">>>>>>>>>>>>>>>>> isOwn ? ", isOwn)
        return h('div', { class: 'friends-and-requetes-container',
          style : isExpanded ? {
            position :  'absolute', top : '17%', left: '30%',
            backgroundColor: '#161C40', width:'800px', height : '700px',
            'grid-template-rows' : '18% 76% '
          } : {}
         }, [
          
          h('div', { class: 'friends-and-req-buttons', 
            style : isExpanded || !isOwn ? {display :'flex', justifyContent:'center'} : {} }, 
            !isExpanded ? [

            h('div', {}, [
              h('button', { class: 'friends-button', style: {backgroundColor:  
                activateSection === 'friends' && isOwn ?'rgba(95, 114, 125, 0.08)' : 'transparent'},
              on : { click : () => 
                this.fetch('http://localhost:3000/api/user/friendships?status=accepted','friends')
              } }, [
                h('h1', {}, ['Friends'])
              ])
            ]),

            h('div', { style : !isOwn ? {display : 'none'}:{}}, [
              h('button', { class: 'request-button', style: {backgroundColor:  
                activateSection === 'requests' ?'rgba(95, 114, 125, 0.08)' : 'transparent'},
                on : {
                  click : () => {
                    this.fetch('http://localhost:3000/api/user/friendships?status=recieved','requests' )
                    }
              } }, [
                h('h1', {}, ['Requests'])
              ])
            ]),

            h('div', { style : !isOwn ? {display : 'none'}:{}}, [
              h('button', { class: 'pending-button' , style: {
                backgroundColor:
                activateSection === 'pending' ?'rgba(95, 114, 125, 0.08)' : 'transparent'
                },
                on : {
                  click : ()=> 
                  {
                    this.fetch('http://localhost:3000/api/user/friendships?status=sent','pending' )
                  }
                }}, [h('h1', {}, ['Pending'])
              ])
            ])
          ] : [h('div', { class: 'header'}, [
            h('div', { class: 'search' }, [
                h('a', { href: '#' }, [
                    h('i', { class: 'fa-solid fa-magnifying-glass icon' })
                ]),
                h('input', { type: 'text', placeholder: 'Search...', on :{
                  input : (target) => {
                  console.log("********************> target : ", target)
                }} }), 
            ]),
            h('div', { class: 'close-icon' }, [
                h('i', { 
                  class: 'fa fa-close', 
                  style: {fontSize:'34px', color:'#D44444', 'border-radius':'5px', marginLeft:'410px'},
                  on : { click : () => 
                    {
                      this.emit('removeBlurProfile', {activateSection : activateSection, 
                        isBlured:false, Expanded:null})
                    }
                  }
                })
            ])
        ])])
          ,
          (activateSection === 'friends' && h(FriendsItems, {data: this.state.data, isExpanded: isExpanded})) ||
          (activateSection === 'requests' && h(RequestsItems, {data: this.state.data, isExpanded: isExpanded,
            on : {
              remove : this.removeRequest,
              accept : this.acceptRequest
            },
          })) ||
          (this.state.activateSection === 'pending' && h(PendingItems, {data: this.state.data, isExpanded: isExpanded,
            on : {
              remove : this.removeRequest
            },
          })),

          h('div', { class: 'view-all-link-fr', style : {color : '#14397C'} },
            this.state.data.length >= 4  && !isExpanded ? 
            [
              h('a', { on : {
                  click : () => 
                  {
                    this.emit('blurProfile', {activateSection : activateSection, 
                      isBlured:true, Expanded:'socialCard'})
                    // this.updateState({isExpanded:true, activateSection : activateSection})
                  }
              }}, ['View all'])
            ]: [])
        ])
    },
    removeRequest({id, i})
    {
        customFetch(`http://localhost:3000/api/user/friendships/?id=${id}`, {
          method : 'DELETE'
        }).then((res)=>
        {
          // console.log(">>>>>>>>>>>>>>>>>> after cancel the pending request  : ", res)
          if (res.status == 204)
          {
            const newData = [...this.state.data]
            newData.splice(i, 1)
            this.updateState({data : newData})
          }
        })
    },
    acceptRequest({id, i})
    {
      customFetch(`http://localhost:3000/api/user/friendships/`, {
        method : 'PUT',
        headers: {
          'Content-Type': 'application/json', // Explicitly set content type
        },
        body : JSON.stringify({
            id : id,
            status : 'accepted'
      })
      }).then((res)=>
      {
        // console.log(">>>>>>>>>>>>>>>>>> after cancel the pending request  : ", res)
        if (res.status == 200)
        {
          const newData = [...this.state.data]
          // console.log(">>>>>>>>>>>>>>>>>>>------------------------------------------->>>> newData : ", newData)
          newData.splice(i, 1)
          this.updateState({data : newData})
        }
      })
    },
    onMounted()
    {
      // console.log(">>>>>>>>>>>>> here on onmouted social card ")
      var  endPoint  = 'http://localhost:3000/api/user/friendships?status=accepted'
      if(JSON.stringify(this.appContext.router.params) !== '{}')
      {
        endPoint = `http://localhost:3000/api/user/friendships?username=${this.appContext.router.params.username}&status=accepted`
        // console.log('>>>>>>>>>>>>>>>>>>>>>>>> here enpoint changed , ', endPoint)
      }
      customFetch(endPoint)
        .then(result =>{

            if (!result.ok)
            {
                // console.log("res isn't okey ," , " | ", this)
                
                this.appContext.router.navigateTo('/login')
            }

            return result.json()
        })
        .then(res => {
            // console.log(">>>>>>>>>>>>>>> in social card heeeeeeeeeeeeeeeeeeeeeeeeeere res : ", res,"|")
            // console.log("res is okey")
            this.updateState({
                    isLoading: false,  
                    data : res,
                    error: null   
            });

        })
        .catch(error => {
            // console.log(">>>>>>>>>>>> error in win  : ", error)
        })
    },
    
    fetch(endPoint, activateSection)
    {
      // if(JSON.stringify(this.appContext.router.params) !== '{}')
      //     endPoint = endPoint + '&username=' +`${this.appContext.router.params.username}`
      // console.log("---------------------------------------============================> endpoint : ", endPoint)
      customFetch(endPoint)
        .then(result =>{

            if (!result.ok)
            {
                // console.log("res isn't okey ," , " | ", this)
                
                this.appContext.router.navigateTo('/login')
            }

            return result.json()
        })
        .then(res => {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> in social card  res : ", res,"|", res.status)
            // console.log("res is okey")
            this.updateState({
                    isLoading: false,  
                    data: res,   
                    error: null ,
                    activateSection: activateSection
            });

        })
        .catch(error => {
            // console.log(">>>>>>>>>>>> error in win  : ", error)
        })
    }
})

const FriendsItems = defineComponent({
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
            h('img', { src: 'images/kel-baam.png', alt:'profile picture', class: 'picture-item' })
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

const RequestsItems = defineComponent({
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
              h('img', { src: 'images/kel-baam.png', alt: 'profile picture', class: 'picture-item' })
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

const PendingItems = defineComponent({
    // state()
    // {
    //   return {
    //   }
    // },
    render()
    {
        const {isExpanded} = this.props
        const data = isExpanded ? this.props.data : this.props.data.slice(0,4)
        return h('div', {class : 'pending-friends-items',
            style: isExpanded ? { 'row-gap': '0%','grid-auto-rows' : '14.5%',justifyContent : 'center'} : {}
            }, data.map((userPendingrequest, i)=>
            h(PendingItem, {
              isExpanded : isExpanded,
              id : userPendingrequest.id,
              user : userPendingrequest.user,
              i,
              on : {remove : (id) => this.emit('remove', {id, i})}
            })
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
      return h('div', { class: 'pending-friend-item' , 
          style : isExpanded ? 
          { backgroundColor : '#CBCBCB', 'border-radius' : '15px',
            width:'700px', height:'65px'
          } : {}
          }, [
            h('div', { class: 'picture-item' }, [
              h('img', { src: 'images/kel-baam.png', alt: 'profile picture', class : 'picture-item' })
            ]),
            h('div', { class: 'data-user' }, [
              h('span', {}, [user.first_name + ' ' + user.last_name]),
              h('span', { style:{ color: '#A7A4A4'} }, ['@' + user.username])
            ]),
            h('div', { class: 'cancel-icon' }, [
                h('i', { class: 'fa fa-close', style: { fontSize: '24px', color: '#D44444'} ,
                on : {click : () => this.emit('remove', id)}})
            ])
          ])
    }
})