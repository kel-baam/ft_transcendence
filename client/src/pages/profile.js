import{createApp, defineComponent, DOM_TYPES, h,
     hFragment, hSlot, hString} from '../package/index.js'

import { header } from '../components/header.js'
import { sidebarLeft } from '../components/sidebar-left.js'
import { UserCard } from '../components/profile/UserCard.js'
import { UserWinRate } from '../components/profile/UserWinRate.js'
import {UserAchievementsCard} from '../components/profile/UserAchievementsCard.js'
import { GameHistoryCard } from '../components/profile/GameHistoryCard.js'
import { SocialCard } from '../components/profile/SocialCard.js'
import {sidebarRight} from '../components/sidebar-right.js'

export const Profile = defineComponent({
  state(){
    
      return {
          isLoading : true,
          isBlured : false,
          data : [],
          activateSection:'friends',
          Expanded: null,
          }
  },
  render(){
    const key =  this.appContext.router.params.username
    const {isBlured, Expanded, activateSection, isLoading} = this.state
    if (isLoading)
      return h('div', {id:'global'}, ["is loading............"])
    return h('div', {id:'global'}, [
      h(header, {}),h('div', {class:'content'}, 
          [
            h(sidebarLeft, {}), h('div', {class:'global-content'},
              [
                // h('div', {class:'profile-content', style : isBlured ? { filter : 'blur(4px)'}: {}},
                //   [
                //       h('div', {class:'profile-info'}, 
                //     [
                //       h('div', {class:'infos'}, [
                //         h(UserCard, {'key' : key}), h(UserWinRate, {})]),
                //       h('div', {class:'other-cards'}, 
                //         [
                //           h(UserAchievementsCard, {}), 
                //           h(SocialCard,{
                //             'key' : key,
                //             activateSection : activateSection,
                //             on : 
                //             { blurProfile : this.blurProfile,
                //               // removeBlurProfile: this.removeBlurProfile
                //             },
                //             isExpanded:false
                //           }), h(GameHistoryCard, {
                //             on : { blurProfile : this.blurProfile,
                //               // removeBlurProfile: this.removeBlurProfile
                //             }
                //           }), 
                //       ]
                //       )
                //     ]
                //     )

                //     ]
                //   ),
                h('div', { class: 'profile-container', style: isBlured ? { filter: 'blur(4px)' } : {} }, [
                  h('div', { class: 'profile-details' }, [
                    h(UserCard, { key }),
                    h(UserWinRate, {key}),
                  ]),
                  h('div', { class: 'profile-extras' }, [
                    h(UserAchievementsCard, {}),
                    h(SocialCard, {
                      key,
                      activateSection,
                      on: { blurProfile: this.blurProfile },
                      isExpanded: false,
                    }),
                    h(GameHistoryCard, {
                      key,
                      on: { blurProfile: this.blurProfile },
                    }),
                  ]),
                ])
                
                 
              ]),
              h('div', { class: 'friends-bar' }, [
                h(sidebarRight, {})
              ]
              ),
              (Expanded === 'MatchesHistory' ?  h(GameHistoryCard, {
                isExpanded : true,
                on : {
                removeBlurProfile: this.removeBlurProfile,

              }}) : null)
              ,
              (Expanded === 'socialCard' ? h(SocialCard, {isExpanded : true,
                activateSection : activateSection, on : {
                removeBlurProfile: this.removeBlurProfile
              },
            }) : null),
            // [
            //   Expanded === 'MatchesHistory' &&
            //     h(GameHistoryCard, {
            //       isExpanded: true,
            //       on: { removeBlurProfile: this.toggleBlurProfile },
            //     }),
            //   Expanded === 'socialCard' &&
            //     h(SocialCard, {
            //       isExpanded: true,
            //       activateSection,
            //       on: { removeBlurProfile: this.toggleBlurProfile },
            //     }),
            // ].filter(Boolean),
            ]) 
          ])
  },
  blurProfile(obj)
  {
    // const viewAll = { MatchHistory:true}
    // console.log("----------------------------------------> viewALL , activateSEction ", viewAll," | ")
    console.log("--------------------> obj : ", obj)
    this.updateState(obj)
   
  },
  removeBlurProfile(ob)
  {
    // const viewAll = { MatchHistory:false}
    this.updateState(ob)
    // console.log(">>>>>>>>>>>>>>>>")
  },
  onMounted()
  {
    this.updateState({
      isLoading:false
    })
  }
})

// createElement('div', {id:'global'}, 
//   createElement(Header, {}), createElement('div', { className: 'content' },
//       createElement(Sidebar, {}), createElement('div', {className:'global-content'},
//           createElement('div', {className:'profile-content'},
//               createElement('div', {className:'profile-info'}, 
//               createElement('div', {className:'infos'}, createElement(UserProfile, {user : this.items.user.user, 
//                   level : this.items.user.level, score:this.items.user.score, Rank:this.items.user.Rank}), 
//               createElement(WinningRate, {total_matches : this.items.total_matches, wins:this.items.wins, 
//                   losses:this.items.losses, draws:this.items.draws})), 
//               createElement('div', {className:'other-cards'}, createElement(Achievement, {}), 
//               this.currentViewCard(), createElement(MatchHistory, {...this.items.matches_history}))))
//               ,createElement('div', { className: 'friends-bar' }))
//   ))