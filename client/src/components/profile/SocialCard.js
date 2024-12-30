import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js' 

export const SocialCard = defineComponent({
    state()
    {
        return {
          activateSection : 'friends',
          viewAll:false,
          data:[
            {
              id:'1',
              user :{username: 'kjarmoum', image: {src : './images/kjarmoum.png'},
              FirstName: 'karima', LastName: 'jarmoumi'}
            },
            {
              id:'2',
              user :{username: 'niboukha', image: {src : './images/kjarmoum.png'},
              FirstName: 'karima', LastName: 'jarmoumi'}
            },
            {
              id:'3',
              user :{username: 'shicham', image: {src : './images/kjarmoum.png'},
              FirstName: 'karima', LastName: 'jarmoumi'}
            },
            {
              id:'4',
              user :{username: 'kel-baam', image: {src : './images/kjarmoum.png'},
              FirstName: 'karima', LastName: 'jarmoumi'}
            },
            {
              id:'4',
              user :{username: 'kel-baam', image: {src : './images/kjarmoum.png'},
              FirstName: 'karima', LastName: 'jarmoumi'}
            },
            {
              id:'4',
              user :{username: 'kel-baam', image: {src : './images/kjarmoum.png'},
              FirstName: 'karima', LastName: 'jarmoumi'}
            },
            {
              id:'4',
              user :{username: 'kel-baam', image: {src : './images/kjarmoum.png'},
              FirstName: 'karima', LastName: 'jarmoumi'}
            },
            // {
            //   id:'4',
            //   user :{username: 'kel-baam', image: {src : 'images/kjarmoum.png'},
            //   FirstName: 'karima', LastName: 'jarmoumi'}
            // },
            // {
            //   id:'4',
            //   user :{username: 'kel-baam', image: {src : '../assets/images/kjarmoum.png'},
            //   FirstName: 'karima', LastName: 'jarmoumi'}
            // },
            // {
            //   id:'4',
            //   user :{username: 'kel-baam', image: {src : '../assets/images/kjarmoum.png'},
            //   FirstName: 'karima', LastName: 'jarmoumi'}
            // },
            
          ]
        }
    },
    render()
    {
      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>+++++++++>>> curent section : ", this.state.activateSection)
      // console.log(">>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<>>>>>>. props : ", this.props.activateSection)
        if(this.props.viewAll && this.props.activateSection)
        {
          // console.log(">>>>>>>>>>>>>>>>>>>>>>>> here  view all true")
          this.state.viewAll = this.props.viewAll
          this.state.activateSection = this.props.activateSection
        }
        return h('div', { class: 'friends-and-requetes-container',
          style : this.state.viewAll ? {position :  'absolute', top : '17%', left: '30%',
            backgroundColor: '#161C40', width:'800px', height : '700px',
            'grid-template-rows' : '18% 76% '
          } : {}
         }, [
          
          h('div', { class: 'friends-and-req-buttons', 
            style : this.state.viewAll ? {display :'flex', justifyContent:'center'} : {} }, 
            !this.state.viewAll ? [
            h('div', {}, [
              h('button', { class: 'friends-button', style: {backgroundColor:  
                this.state.activateSection === 'friends' ?'rgba(95, 114, 125, 0.08)' : 'transparent'},
              on : {click : () => this.updateState({activateSection:'friends'})} }, [
                h('h1', {}, ['Friends'])
              ])
            ]),
            h('div', {}, [
              h('button', { class: 'request-button', style: {backgroundColor:  
                this.state.activateSection === 'requests' ?'rgba(95, 114, 125, 0.08)' : 'transparent'},
                on : {click : () => this.updateState({activateSection:'requests'})} }, [
                h('h1', {}, ['Requests'])
              ])
            ]),
            h('div', {}, [
              h('button', { class: 'pending-button' , style: {backgroundColor:  
                this.state.activateSection === 'pending' ?'rgba(95, 114, 125, 0.08)' : 'transparent'},
                on : {click : ()=> this.updateState({activateSection:'pending'})}}, [
                h('h1', {}, ['Pending'])
              ])
            ])
          ] : [h('div', { class: 'header'}, [
            h('div', { class: 'search' }, [
                h('a', { href: '#' }, [
                    h('i', { class: 'fa-solid fa-magnifying-glass icon' })
                ]),
                h('input', { type: 'text', placeholder: 'Search...', on :{input : (target) => {
                  console.log("********************> target : ", target)
                }} }), 
            ]),
            h('div', { class: 'close-icon' }, [
                // h('a', { href: '#', class: 'close-click' }, [
                //     h('i', { class: 'fa-sharp fa-solid fa-rectangle-xmark' })
                // ])
                h('i', { 
                  class: 'fa fa-close', 
                  style: {fontSize:'34px', color:'#D44444', 'border-radius':'5px', marginLeft:'410px'},
                  on : { click : () => this.emit('removeBlurProfile', {SocialCard:false})}
                })
            ])
        ])])
          ,
          (this.state.activateSection === 'friends' && h(FriendsItems, {data:this.state.data, viewAll:this.state.viewAll})) ||
          (this.state.activateSection === 'requests' && h(RequestsItems, {data:this.state.data,viewAll:this.state.viewAll,
            on : {
              remove : this.removeRequest,
              accept : this.acceptRequest
            },
            viewAll:this.state.viewAll
          }))||
          (this.state.activateSection === 'pending' && h(PendingItems, {data:this.state.data,
            on : {
              remove : this.removeRequest
            },
            viewAll:this.state.viewAll
          })),

          h('div', { class: 'view-all-link-fr', style : {color : '#14397C'} },
            this.state.data.length >= 4  && !this.state.viewAll ? 
            [
              h('a', { href: '#' , on : {click : () => this.emit('blurProfile', {SocialCard:true, 
                activateSection:this.state.activateSection})}}, ['View all'])
            ]: [])
        //   h('div', { class: 'view-all-link-fr', style : {color : '#14397C'}, 

        //     on : {click : ()=> this.emit('blurProfile', {SocialCard:true})} }, this.state.data.length >= 4 ? ['View all']: [])
        ])
    },
    removeRequest({id, i})
    {
      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> here ", id, "|", i)
      const newData = [...this.state.data]
            newData.splice(i, 1)
            // console.log(">>>>>>>>>>>>> here new Data : ", newData)
      this.updateState({data:newData})
    },
    acceptRequest({id, i})
    {
      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> here ", id, "|", i)
      const newData = [...this.state.data]
            newData.splice(i, 1)
            // console.log(">>>>>>>>>>>>> here new Data : ", newData)
      this.updateState({data:newData})
    },
    updateActivateSection({test}){
      // console.log("-----------> test")
      // this.emit('changeActivateState', targetSection)
      // console.log(">>>>>>>>>>>>>>>>>>>>> here target section : ", targetSection)
      this.updateState({activateSection : 'requests'})
      // console.log("")
    }
    // removePendingRequest({id, i})
    // {

    // },
    // onMounted()
    // {

    // }
})

const FriendsItems = defineComponent({
  state()
  {
    return{
      viewAll:false
      // data : []
    }
  },
  render()
  {
    if (this.props.viewAll)
      this.state.viewAll = this.props.viewAll
    // console.log(">>>>>>>>>>>>>>>>>>>>> this.state.viewAll : ", this.state.viewAll)
    const data = this.state.viewAll ? this.props.data : this.props.data.slice(0,4)
    // console.log("-----------------------> here friends items ")
    return h('div', {class : 'friends-scope-item',
      style: this.state.viewAll ? { 'row-gap': '0%','grid-auto-rows' : '14.5%'
    ,justifyContent : 'center'} : {}
    }, data.map((userFriend) =>
      h(FriendItem, {
        friend : userFriend,
        viewAll:this.state.viewAll
      })
    )
  )
  }

})

const FriendItem = defineComponent({
  state()
  {
    return {
      viewAll : false,
    }
  },
  render()
  {
    const {user} = this.props.friend
    if (this.props.viewAll)
      this.state.viewAll = this.props.viewAll
    return  h('div', { class: 'friend-item', style : this.state.viewAll ? 
      {backgroundColor : '#CBCBCB', 'border-radius' : '15px',
        width:'700px', height:'65px'
      } : {} },
      [
        h('div', { class: 'picture-item' },
          [
            h('img', { src: user.image.src, alt:'profile picture', class: 'picture-item' })
          ]
        ),
        h('div', { class: 'data-user' },
          [
            h('span', {}, [user.FirstName + ' ' + user.LastName]),
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
      viewAll:false
    }
  },
  render()
  {
    if (this.props.viewAll)
      this.state.viewAll = this.props.viewAll
    // console.log(">>>>>>>>>>>>>>>>>>>>> this.state.viewAll : ", this.state.viewAll)
    const data = this.state.viewAll ? this.props.data : this.props.data.slice(0,4)
    // console.log("-----------------------> data : ", userRequests)
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> state data : ", this.state.data)
    return h('div', {class : 'requestes-items', 
      style: this.state.viewAll ? { 'row-gap': '0%','grid-auto-rows' : '14.5%',justifyContent : 'center'} : {}
    }, data.map((userRequest, i) =>
      // console.log(">>>>>>>>>> here  ", userRequest)
      h(RequestItem, {
        viewAll : this.state.viewAll,
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
      viewAll:false
    }
  },
  render()
  {
    if (this.props.viewAll)
    {
      this.state.viewAll = this.props.viewAll
    }
    // console.log("===========================> ", this.props)
    const {id, user} = this.props
    // console.log(">>>>>>>>>>>>>>>>>>> id , user ", id , "| ", user)
    return h('div', { class: 'request-item',
      style : this.state.viewAll ? 
      { backgroundColor : '#CBCBCB', 'border-radius' : '15px',
        width:'700px', height:'65px'
      } : {}
     }, [
      h('div', { class: 'picture-item' }, [
        h('img', { src: user.image.src, alt: 'profile picture', class: 'picture-item' })
      ]),
      h('div', { class: 'data-user' }, [
        h('span', {}, [user.FirstName + ' ' + user.LastName]),
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
  state()
  {
    return {
      viewAll:false
    }
  },
  render()
  {
    if (this.props.viewAll)
    {
      this.state.viewAll = this.props.viewAll
    }
    const data = this.state.viewAll ? this.props.data : this.props.data.slice(0,4)
    return h('div', {class : 'pending-friends-items',
      style: this.state.viewAll ? { 'row-gap': '0%','grid-auto-rows' : '14.5%',justifyContent : 'center'} : {}
    }, data.map((userPendingrequest, i)=>
    h(PendingItem, {
      viewAll : this.state.viewAll,
      id : userPendingrequest.id,
      user : userPendingrequest.user,
      i,
      on : {remove : (id) => this.emit('remove', {id, i})}
    })
    ))
  }
})

const PendingItem = defineComponent({
    state()
    {
      return {
        viewAll:false
      }
    },
    render()
    {
      if (this.props.viewAll)
        {
          this.state.viewAll = this.props.viewAll
        }
      const {id, user} = this.props 
      // console.log("----------------> id : ", id , " | user : ", user)
      return h('div', { class: 'pending-friend-item' , 
        style : this.state.viewAll ? 
      { backgroundColor : '#CBCBCB', 'border-radius' : '15px',
        width:'700px', height:'65px'
      } : {}
      }, [
        h('div', { class: 'picture-item' }, [
          h('img', { src: user.image.src, alt: 'profile picture', class : 'picture-item' })
        ]),
        h('div', { class: 'data-user' }, [
          h('span', {}, [user.FirstName + ' ' + user.LastName]),
          h('span', { style:{ color: '#A7A4A4'} }, ['@' + user.username])
        ]),
        h('div', { class: 'cancel-icon' }, [
            h('i', { class: 'fa fa-close', style: { fontSize: '24px', color: '#D44444'} ,
            on : {click : () => this.emit('remove', id)}})
        ])
      ])
    }
})