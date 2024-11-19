import{createApp, defineComponent, DOM_TYPES, h,
     hFragment, hSlot, hString} from '../package/index.js'
import { header } from './header.js'
import { sidebarLeft } from './sidebar-left.js'

const Comp = defineComponent({
    state(){
        return {
            isLoading : true,
            isBlur : false,
            data : [],
            activateSection:'friends',
            viewAll: {
              // MatchHistory : false,
              // friends : false,
              // requests: false,
              // pending : false
            }
            }
    },
    render(){
        return h('div', {id:'global'}, [h(header, {}),h('div', {class:'content'}, 
            [h(sidebarLeft, {}), h('div', {class:'global-content'
              
            },
                [h('div', {class:'profile-content', style : (this.state.viewAll.MatchHistory || this.state.viewAll.SocialCard) ? { filter : 'blur(4px)'}: {} 
                },[h('div', {class:'profile-info'}, 
                [
                    h('div', {class:'infos'}, [h(UserCard, {}), h(UserWinRate, {})]),
                    h('div', {class:'other-cards'}, [h(UserAchievementsCard, {}), 
                      h(SocialCard,{
                        on : 
                        { blurProfile : this.blurProfile}
                      }), h(GameHistoryCard, {
                        on : { blurProfile : this.blurProfile}
                      })])
                ]

                )])])
                ,
                (this.state.viewAll.MatchHistory ?  h(GameHistoryCard, {viewAll : true, on : {
                  removeBlurProfile: this.removeBlurProfile
                }}) : null)
                ,
                (this.state.viewAll.SocialCard ? h(SocialCard, {viewAll : true, on : {
                  removeBlurProfile: this.removeBlurProfile
                },
                activateSection:this.state.activateSection
              }) : null)

              ]) 
            ])
    },
    blurProfile(viewAll, activateSection)
    {
      // console.log("----------------------------> {...this.state.viewAll, MatchHistory:true}", {...this.state.viewAll, MatchHistory:true})
      // const viewAll = { MatchHistory:true}
      this.updateState({viewAll},activateSection)
      console.log("===========================>> this.state : ", this.state)
      // console.log(">>>>>>>>>>>>>>>>>>> data after blur : ", data)
      // createApp(compMatchHistory).mount(document.body)
    },
    removeBlurProfile(viewAll)
    {
      // const viewAll = { MatchHistory:false}
      this.updateState({viewAll})
      // console.log(">>>>>>>>>>>>>>>>")
    }
})

const UserCard = defineComponent({
    state(){
        return {
            isLoading : false,
            data : {},
            // username : 'shicham',
            // image : {src : '../../assets/images/kel-baam.png'},
            // firstName : 'souad',
            // lastName : 'hicham',
            // score : '8',
            // Rank : '8' ,
            // level : '8.88',
            // achievement : {src : '../../assets/images/ach.png', name : 'Silver'}

        }
    },

    render(){
        // const {data, isLoading} = this.state
        // const {username , image, firstName, lastName, score, level, achievement} = data
        return  h('div', { class: 'infos-user-container' },
            [h('div', {},
            [ h('img', { src: '../assets/images/kel-baam.png' }),
                h('i', { class: 'fa-solid fa-camera', style: {color: '#5293CB'}  })]
            ),
            h('div', {},
            [ h('div', {},
                    [h('span', {},
                    [ h('h1', {}, ['souad' + ' '+ 'hicham'])]
                    )]
                ),
                h('div', {},
                [ h('form', {action :'/'}, 
                        [h('input', { type: 'text', value: 'shicham' })] )]
                
                ),
                h('div', {},
                    [h('div', {},
                        [h('span', {},[ '8.88' + '%']),
                        h('div', {},
                            [h('span', {}, ['level']),
                            h('progress', { max: '100', value: '80', style: {width: '593px' }, id: 'progress-level' })]
                        )]
                    ),
                    h('div', {},
                        [
                            h('div', {},
                                [
                                    h('span', {}, ['Rank : ']),
                                    h('span', { style: {color: '#0B42AF'} }, ['8'])
                                ]
                            ),
                            h('div', {},
                                [
                                    h('span', {}, ['Score : ']),
                                    h('span', { style: {color: '#0B42AF' }}, ['9'])
                                ]
                            ),
                            h('div', { style: {color: '#FBCA35',fontSize: '16px' }, class: 'achievement-item' },
                                [
                                    h('img', { src: '../assets/images/ach.png' }),
                                    h('span', {}, ['Silver'])
                                ]
                            )
                        ]
                    )
                ]
                )]
            )]
        )
    }
})

const UserWinRate =  defineComponent({
    state(){
      return {
        data : {
          totalMatches: '150',
          loseMatches: '22',
          winMatches : '40',
        },
        activateSection : 'win'
      }
    },
    render(){

        return h('div', { class: 'wining-rate-container' }, [
            h('div', { class: 'title' }, [
              h('span', {}, [
                h('h1', {}, ['Wining rate'])
              ])
            ]),
            h('div', { class: 'circle-and-buttons' }, [
            h('div', {class:'circular-container'}, 
                    [h('div', {class: 'circular_progress', style: {                        
                        background: this.state.activateSection === 'win' ? 
                        `conic-gradient(#0AA989  calc(${ Math.round((this.state.data.winMatches/ this.state.data.totalMatches)* 100)} * 3.6deg), #CBCBCB 0deg)` :
                        `conic-gradient(#D44444 calc(${ Math.round((this.state.data.loseMatches/ this.state.data.totalMatches)* 100)} * 3.6deg), #CBCBCB 0deg)`
                      }}, [h('span', { style : {color: this.state.activateSection === 'win'? '#0AA989':'#D44444', fontSize : '22px'}}, 
                        [this.state.activateSection === 'win' ? `${ Math.round((this.state.data.winMatches / this.state.data.totalMatches) * 100)}`+ '%':
                         ` ${ Math.round((this.state.data.loseMatches/ this.state.data.totalMatches)* 100)}` + '%'])])])
                ,
              h('div', { class: 'buttons' }, [
                h('button', { class: 'win-button', style : {color:' #0AA989', 
                  backgroundColor : this.state.activateSection === 'win'? '#ddd':'#CBCBCB'}, 
                on : {click : () => {
                  this.updateState({activateSection:'win'})
                }}}, [
                  'Win',
                  h('br'),
                  `${this.state.data.winMatches}` + '/' + `${this.state.data.totalMatches}`
                ]),
                h('button', { class: 'lose-button', style: {color: '#D44444',
                  backgroundColor : this.state.activateSection === 'lose'? '#ddd':'#CBCBCB'
                } ,
                on : {click : ()=> {
                  this.updateState({activateSection:'lose'})
                }}
                }, [
                  'Loss',
                  h('br'),
                  `${this.state.data.loseMatches}` + '/' + `${this.state.data.totalMatches}`
                ])
              ])
            ])
          ])
          
}})

const UserAchievementsCard = defineComponent({
    state(){

    },
    render()
    {
        return h('div', { className: 'achievements-container' }, [
            h('div', { className: 'achievements-title-elt' }, [
              h('h1', {}, ['Achievements'])
            ]),
            h('div', { className: 'badges-container' }, [
              h('div', { className: 'badge-item' }, [
                h('img', { 
                  src: '../assets/images/lock.png', 
                  alt: 'lock icon' 
                })
              ]),
              h('div', { className: 'badge-item' }, [
                h('img', { 
                  src: '../assets/images/lock.png', 
                  alt: 'lock icon' 
                })
              ])
            ]),
            h('div', { className: 'badges-container' }, [
              h('div', { className: 'badge-item' }, [
                h('img', { 
                  src: '../assets/images/lock.png', 
                  alt: 'lock icon' 
                })
              ]),
              h('div', { className: 'badge-item' }, [
                h('img', { 
                  src: '../assets/images/lock.png', 
                  alt: 'lock icon' 
                })
              ])
            ])
          ]);          
    }
})

const SocialCard = defineComponent({
    state()
    {
        return {
          activateSection : 'friends',
          viewAll:false,
          data:[
            {
              id:'1',
              user :{username: 'kjarmoum', image: {src : '../assets/images/kjarmoum.png'},
              FirstName: 'karima', LastName: 'jarmoumi'}
            },
            {
              id:'2',
              user :{username: 'niboukha', image: {src : '../assets/images/kjarmoum.png'},
              FirstName: 'karima', LastName: 'jarmoumi'}
            },
            {
              id:'3',
              user :{username: 'shicham', image: {src : '../assets/images/kjarmoum.png'},
              FirstName: 'karima', LastName: 'jarmoumi'}
            },
            {
              id:'4',
              user :{username: 'kel-baam', image: {src : '../assets/images/kjarmoum.png'},
              FirstName: 'karima', LastName: 'jarmoumi'}
            },
            {
              id:'4',
              user :{username: 'kel-baam', image: {src : '../assets/images/kjarmoum.png'},
              FirstName: 'karima', LastName: 'jarmoumi'}
            },
            {
              id:'4',
              user :{username: 'kel-baam', image: {src : '../assets/images/kjarmoum.png'},
              FirstName: 'karima', LastName: 'jarmoumi'}
            },
            {
              id:'4',
              user :{username: 'kel-baam', image: {src : '../assets/images/kjarmoum.png'},
              FirstName: 'karima', LastName: 'jarmoumi'}
            },
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
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>+++++++++>>> curent section : ", this.state.activateSection)
      console.log(">>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<>>>>>>. props : ", this.props.activateSection)
        if(this.props.viewAll && this.props.activateSection)
        {
          console.log(">>>>>>>>>>>>>>>>>>>>>>>> here  view all true")
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
            style : this.state.viewAll ? { display: 'flex', alignItems:'center',
             justifyContent : 'center'} : {} }, 
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
                h('input', { type: 'text', placeholder: 'Search...' }), 
            ]),
            h('div', { class: 'close-icon' }, [
                // h('a', { href: '#', class: 'close-click' }, [
                //     h('i', { class: 'fa-sharp fa-solid fa-rectangle-xmark' })
                // ])
                h('i', { 
                  class: 'fa fa-close', 
                  style: {fontSize:'34px', color:'#D44444', 'border-radius':'5px'},
                  on : { click : () => this.emit('removeBlurProfile', {SocialCard:false})}
                })
            ])
        ])])
          ,
          (this.state.activateSection === 'friends' && h(FriendsItems, {data:this.state.data, viewAll:this.state.viewAll})) ||
          (this.state.activateSection === 'requests' && h(RequestsItems, {data:this.state.data,
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
      console.log("-----------> test")
      // this.emit('changeActivateState', targetSection)
      // console.log(">>>>>>>>>>>>>>>>>>>>> here target section : ", targetSection)
      this.updateState({activateSection : 'requests'})
      console.log("")
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
    console.log(">>>>>>>>>>>>>>>>>>>>> this.state.viewAll : ", this.state.viewAll)
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
    console.log(">>>>>>>>>>>>>>>>>>>>> this.state.viewAll : ", this.state.viewAll)
    const data = this.state.viewAll ? this.props.data : this.props.data.slice(0,4)
    // console.log("-----------------------> data : ", userRequests)
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> state data : ", this.state.data)
    return h('div', {class : 'requestes-items'}, data.slice(0,4).map((userRequest, i) =>
      // console.log(">>>>>>>>>> here  ", userRequest)
      h(RequestItem, {
        id : userRequest.id,
        user : userRequest.user,
        i,
        on : { remove: (id) => this.emit('remove', {id, i }),
                accept : (id)  => this.emit('accept', {id, i}),
        viewAll:this.viewAll      
      }
      })
    ))
  }

})

const RequestItem =  defineComponent({
  state()
  {
    return {viewAll:false}
  },
  render()
  {
    if (this.props.viewAll)
      this.state.viewAll = this.props.viewAll
    // console.log("===========================> ", this.props)
    const {id, user} = this.props
    // console.log(">>>>>>>>>>>>>>>>>>> id , user ", id , "| ", user)
    return h('div', { class: 'request-item' }, [
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
    return{
      // data : []
    }
  },
  render()
  {
    return h('div', {class : 'pending-friends-items'}, this.props.data.slice(0,4).map((userPendingrequest, i)=>
    h(PendingItem, {
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

    },
    render()
    {
      const {id, user} = this.props 
      // console.log("----------------> id : ", id , " | user : ", user)
      return h('div', { class: 'pending-friend-item' }, [
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

const GameHistoryCard = defineComponent({
  state()
  {
    return {
      shownOnviewAll : false,
      data : [
        {
          player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : '../assets/images/kjarmoum.png'}},
          player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : '../assets/images/kjarmoum.png'}},
          player1_points:'1',
          player2_points:'2',
          date : '10-11-2024'
        },
        {
          player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : '../assets/images/kjarmoum.png'}},
          player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : '../assets/images/kjarmoum.png'}},
          player1_points:'1',
          player2_points:'2',
          date : '10-11-2024'
        },
        {
          player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : '../assets/images/kjarmoum.png'}},
          player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : '../assets/images/kjarmoum.png'}},
          player1_points:'1',
          player2_points:'2',
          date : '10-11-2024'
        },
        {
          player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : '../assets/images/kjarmoum.png'}},
          player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : '../assets/images/kjarmoum.png'}},
          player1_points:'1',
          player2_points:'2',
          date : '10-11-2024'
        },
        {
          player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : '../assets/images/kjarmoum.png'}},
          player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : '../assets/images/kjarmoum.png'}},
          player1_points:'1',
          player2_points:'2',
          date : '10-11-2024'
        },
        {
          player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : '../assets/images/kjarmoum.png'}},
          player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : '../assets/images/kjarmoum.png'}},
          player1_points:'1',
          player2_points:'2',
          date : '10-11-2024'
        },
        ,
        {
          player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : '../assets/images/kjarmoum.png'}},
          player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : '../assets/images/kjarmoum.png'}},
          player1_points:'1',
          player2_points:'2',
          date : '10-11-2024'
        },
        ,
        {
          player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : '../assets/images/kjarmoum.png'}},
          player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : '../assets/images/kjarmoum.png'}},
          player1_points:'1',
          player2_points:'2',
          date : '10-11-2024'
        },
        ,
        {
          player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : '../assets/images/kjarmoum.png'}},
          player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : '../assets/images/kjarmoum.png'}},
          player1_points:'1',
          player2_points:'2',
          date : '10-11-2024'
        },
        ,
        {
          player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : '../assets/images/kjarmoum.png'}},
          player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : '../assets/images/kjarmoum.png'}},
          player1_points:'1',
          player2_points:'2',
          date : '10-11-2024'
        },
        ,
        {
          player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : '../assets/images/kjarmoum.png'}},
          player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : '../assets/images/kjarmoum.png'}},
          player1_points:'1',
          player2_points:'2',
          date : '10-11-2024'
        },
        ,
        {
          player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : '../assets/images/kjarmoum.png'}},
          player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : '../assets/images/kjarmoum.png'}},
          player1_points:'1',
          player2_points:'2',
          date : '10-11-2024'
        },
        ,
        {
          player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : '../assets/images/kjarmoum.png'}},
          player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : '../assets/images/kjarmoum.png'}},
          player1_points:'1',
          player2_points:'2',
          date : '10-11-2024'
        },
        ,
        {
          player1: {FirstName : 'souad' , LastName :'hicham', username: 'shicham', image: {src : '../assets/images/kjarmoum.png'}},
          player2: {FirstName : 'karima' , LastName :'jarmoumi',username: 'kjarmoum', image: {src : '../assets/images/kjarmoum.png'}},
          player1_points:'1',
          player2_points:'2',
          date : '10-11-2024'
        },
        
      ]
    }
  },
  render()
  {
    if (this.props.viewAll)
    {
      // console.log(">>>>>>>>>>>>>>>>>> this.props.viewAll ", this.props.viewAll)
      this.state.shownOnviewAll = this.props.viewAll
    }
    return h('div', { class: 'match-history-container' , 
      style : this.state.shownOnviewAll ? {position :  'absolute', top : '17%', left: '30%',
        backgroundColor: '#161C40', width:'800px', height : '700px', 'grid-template-rows': '10% 80% 10%'
      } : {}},
      [
         h('div', { class: 'title-item', style : this.state.shownOnviewAll ? {justifyContent: 'space-between',paddingTop:'50px'}: {}},
          [
             h('span', {}, 
              [
                h('h1', {style : this.state.shownOnviewAll ? {color : '#FFEEBF', paddingLeft:'300px'} : {}}, ['Match history'])
              ]
            ),this.state.shownOnviewAll ?
            h('i', { 
              class: 'fa fa-close', 
              style: {fontSize:'34px', color:'#D44444', 'border-radius':'5px', paddingRight:'50px'},
              on : { click : () => this.emit('removeBlurProfile', {MatchHistory:false})}
            }): null
          ]
        ),
        h(GameHistoryItems, {data : this.state.data, shownOnviewAll : this.state.shownOnviewAll ? true : false})
        ,
          h('div', { class: 'view-all-match' },
          this.state.data.length >= 4  && !this.state.shownOnviewAll ? 
          [
            h('a', { href: '#' , on : {click : () => this.emit('blurProfile', {MatchHistory:true})}}, ['View all'])
          ]: []
        )
      ]
    )    
  }
})
const GameHistoryItems = defineComponent({
  state()
  {
    return {
     shownOnviewAll : false
    }
  },
  render()
  {
    // console.log( "----------------------------------> data in game history : ", this.props.data)
    this.state.shownOnviewAll = this.props.shownOnviewAll
    const data = this.state.shownOnviewAll ? this.props.data : this.props.data.slice(0,4)
    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> this.state.shownOnviewAll  : ', this.state.shownOnviewAll )
    return h('div', {class:'center-div', 
      style : this.state.shownOnviewAll ?  {'row-gap' :'0%', 'grid-auto-rows': '16.7%'} : {}},
      data.map((item)=> h('div', { class: 'match-result-item',
         style : this.state.shownOnviewAll ?  { width :'700px' , height: '75px'} : {}},
        [
          h('div', { class: 'picture-item' },
            [
              h('img', { src: item.player1.image.src, alt: 'profile picture' }),
              this.state.shownOnviewAll ? h('span', {style : {color : '#A7A4A4', fontSize:'18px'}},
               [ `${item.player1.username}`]) : null
            ]
          ),
          h('div', { class: 'match-result' },
            [
              this.state.shownOnviewAll ? hFragment([h('span', {style: {color: '#0B42AF', fontSize:'20px'}}, [`${item.date}`]), 
              h('br')]): null,
              h('span', { class: 'user-score', style: {color: `${item.player1_points < item.player2_points ? '#D44444' : '#0AA989'}`} },
                 [`${item.player1_points}`]),
              h('span', { style: {color: '#0B42AF'} }, ['-']),
              h('span', { class: 'opponent-score', style:{ color: `${item.player1_points < item.player2_points ? '#0AA989' : '#D44444'}`} },
                 [`${item.player2_points}`])
            ]
          ),
          h('div', { class: 'picture-item' },
            [
              this.state.shownOnviewAll ? h('span', {style : {color : '#A7A4A4', fontSize:'18px'}}, [`${item.player2.username}`]) : null,
              h('img', { src: item.player2.image.src, alt: 'profile picture' })

            ]
          )
        ]
      ))
    )
  }
}) 

export const app = createApp(Comp).mount(document.body)