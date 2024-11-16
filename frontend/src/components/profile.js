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
            }
    },
    render(){
        return h('div', {id:'global'}, [h(header, {}),h('div', {class:'content'}, 
            [h(sidebarLeft, {}), h('div', {class:'global-content'
              
            },
                [h('div', {class:'profile-content', style : { filter : this.state.isBlur ? 'blur(4px)': ''} 
                },[h('div', {class:'profile-info'}, 
                [
                    h('div', {class:'infos'}, [h(UserCard, {}), h(UserWinRate, {})]),
                    h('div', {class:'other-cards'}, [h(UserAchievementsCard, {}), 
                      h(SocialCard,{}), h(GameHistoryCard, {
                        on : { blurProfile : this.blurProfile}
                      })])
                ]

                )])])
                ,
                (this.state.isBlur && h(GameHistoryCard, {viewAll : true}))
              ]) 
            ])
    },
    blurProfile()
    {
      this.updateState({isBlur:true})
      // console.log(">>>>>>>>>>>>>>>>>>> data after blur : ", data)
      // createApp(compMatchHistory).mount(document.body)
    }
})

const compMatchHistory = defineComponent(
  {   
      render()
      {
        return h('p1', {style : { position:'absolute', top : '500px', left : '900px'}}, ['hello match history !!!'])
      }
  }
)

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
                  'Lose',
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
            
          ]
        }
    },
    render()
    {
      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>. props : ", this.props)
        return h('div', { class: 'friends-and-requetes-container'
         }, [
          h('div', { class: 'friends-and-req-buttons' }, [
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
          ])
          ,
          (this.state.activateSection === 'friends' && h(FriendsItems, {data:this.state.data})) ||
          (this.state.activateSection === 'requests' && h(RequestsItems, {data:this.state.data,
            on : {
              remove : this.removeRequest,
              accept : this.acceptRequest
            }
          }))||
          (this.state.activateSection === 'pending' && h(PendingItems, {data:this.state.data,
            on : {
              remove : this.removeRequest
            }
          })),
          h('div', { class: 'view-all-link-fr', style : {color : '#14397C'} }, this.state.data.length >= 4 ? ['View all']: [])
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
      // data : []
    }
  },
  render()
  {
    const data = this.props.data 
    // console.log("-----------------------> here friends items ")
    return h('div', {class : 'friends-scope-item'}, this.props.data.slice(0,4).map((userFriend) =>
      h(FriendItem, {
        friend : userFriend
      })
    )
  )
  }

})

const FriendItem = defineComponent({
  render()
  {
    const {user} = this.props.friend
    return  h('div', { class: 'friend-item' },
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
      // data : []
    }
  },
  render()
  {

    // console.log("-----------------------> data : ", userRequests)
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> state data : ", this.state.data)
    return h('div', {class : 'requestes-items'}, this.props.data.slice(0,4).map((userRequest, i) =>
      // console.log(">>>>>>>>>> here  ", userRequest)
      h(RequestItem, {
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

  },
  render()
  {
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
          player1: {username: 'shicham', image: {src : '../assets/images/kjarmoum.png'}},
          player2: {username: 'kjarmoum', image: {src : '../assets/images/kjarmoum.png'}},
          player1_points:'1',
          player2_points:'2',
          date : '10-11-2024'
        },
        {
          player1: {username: 'shicham', image: {src : '../assets/images/kjarmoum.png'}},
          player2: {username: 'kjarmoum', image: {src : '../assets/images/kjarmoum.png'}},
          player1_points:'1',
          player2_points:'2',
          date : '10-11-2024'
        },
        {
          player1: {username: 'shicham', image: {src : '../assets/images/kjarmoum.png'}},
          player2: {username: 'kjarmoum', image: {src : '../assets/images/kjarmoum.png'}},
          player1_points:'1',
          player2_points:'2',
          date : '10-11-2024'
        },
        {
          player1: {username: 'shicham', image: {src : '../assets/images/kjarmoum.png'}},
          player2: {username: 'kjarmoum', image: {src : '../assets/images/kjarmoum.png'}},
          player1_points:'1',
          player2_points:'2',
          date : '10-11-2024'
        }
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
      style : this.state.shownOnviewAll ? {position :  'absolute', top : '30%', left: '40%'
    } : {}},
      [
         h('div', { class: 'title-item' },
          [
            !this.state.shownOnviewAll ? h('span', {}, 
              [
                h('h1', {}, ['Match history'])
              ]
            ) : 
            h('div', { class: 'search' }, [
              h('a', { href: '#' }, [
                  h('i', { class: 'fa-solid fa-magnifying-glass icon', 'aria-hidden': 'false' })
              ]),
              h('input', { type: 'text', placeholder: 'Search...' })
          ])
          ]
        ),
        h(GameHistoryItems, {data : this.state.data})
        ,
          h('div', { class: 'view-all-match' },
          this.state.data.length >= 4  && !this.state.shownOnviewAll ? 
          [
            h('a', { href: '#' , on : {click : () => this.emit('blurProfile', this.state.data)}}, ['View all'])
          ]: []
        )
      ]
    )    
  }
})
const GameHistoryItems = defineComponent({
  state()
  {
    // return {
    //  shownOnviewAll : false
    // }
  },
  render()
  {
    // console.log( "----------------------------------> data in game history : ", this.props.data)
    // if (this.props.viewAll)
    //     this.state.shownOnviewAll = this.props.viewAll
    return h('div', {class:'center-div'},
      this.props.data.slice(0,4).map((item)=> h('div', { class: 'match-result-item' },
        [
          h('div', { class: 'picture-item' },
            [
              h('img', { src: item.player1.image.src, alt: 'profile picture' })
            ]
          ),
          h('div', { class: 'match-result' },
            [
              h('span', { class: 'user-score', style: {color: `${item.player1_points < item.player2_points ? '#D44444' : '#0AA989'}`} },
                 [`${item.player1_points}`]),
              h('span', { style: {color: '#0B42AF'} }, ['-']),
              h('span', { class: 'opponent-score', style:{ color: `${item.player1_points < item.player2_points ? '#0AA989' : '#D44444'}`} },
                 [`${item.player2_points}`])
            ]
          ),
          h('div', { class: 'picture-item' },
            [
              h('img', { src: item.player2.image.src, alt: 'profile picture' })
            ]
          )
        ]
      ))
    )
  }
}) 

export const app = createApp(Comp).mount(document.body)