import{createApp, defineComponent, DOM_TYPES, h,
     hFragment, hSlot, hString} from '../package/index.js'

import { header } from '../components/header.js'
import { sidebarLeft } from '../components/sidebar-left.js'
import { UserCard } from '../components/profile/UserCard.js'
import { UserWinRate } from '../components/profile/UserWinRate.js'
import {UserAchievementsCard} from '../components/profile/UserAchievementsCard.js'
import { GameHistoryCard } from '../components/profile/GameHistoryCard.js'
import { SocialCard } from '../components/profile/SocialCard.js'

export const ProfileSelf = defineComponent({
    state(){
      
        return {
            isLoading : true,
            isBlured : false,
            data : [],
            activateSection:'friends',
            Expanded: null,
            isOwn : true
            }
    },
    render(){
      // this.test()
      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>> this.appContext.router : ", this.appContext.router.params)
      const {isBlured, Expanded, activateSection, isLoading, isOwn} = this.state
      if (isLoading)
        return h('div', {id:'global'}, ["is loading............"])
      return h('div', {id:'global'}, [h(header, {}),h('div', {class:'content'}, 
            [h(sidebarLeft, {}), h('div', {class:'global-content'
              
            },
                [h('div', {class:'profile-content', style : isBlured ? { filter : 'blur(4px)'}: {} 
                },[h('div', {class:'profile-info'}, 
                [
                    h('div', {class:'infos'}, [h(UserCard, {isOwn : isOwn}), h(UserWinRate, {})]),
                    h('div', {class:'other-cards'}, [h(UserAchievementsCard, {}), 
                      h(SocialCard,{
                        activateSection : activateSection,
                        on : 
                        { blurProfile : this.blurProfile,
                          // removeBlurProfile: this.removeBlurProfile
                        },
                        isExpanded:false
                      }), h(GameHistoryCard, {
                        on : { blurProfile : this.blurProfile,
                          // removeBlurProfile: this.removeBlurProfile
                        }
                      })])
                ]

                )])])
                ,
                (Expanded === 'MatchesHistory' ?  h(GameHistoryCard, {isExpanded : true,
                  on : {
                  removeBlurProfile: this.removeBlurProfile,

                }}) : null)
                ,
                (Expanded === 'socialCard' ? h(SocialCard, {isExpanded : true,
                  activateSection : activateSection, on : {
                  removeBlurProfile: this.removeBlurProfile
                },
              }) : null)

              ]) 
            ])
    },
    blurProfile(obj)
    {
      // const viewAll = { MatchHistory:true}
      // console.log("----------------------------------------> viewALL , activateSEction ", viewAll," | ")
      console.log("--------------------> obj : ", obj)
      this.updateState(obj)
      console.log("===========================>> this.state : ", this.state)
      // console.log(">>>>>>>>>>>>>>>>>>> data after blur : ", data)
      // createApp(compMatchHistory).mount(document.body)
    },
    removeBlurProfile(ob)
    {
      // const viewAll = { MatchHistory:false}
      this.updateState(ob)
      console.log("===========================>> this.state : ", this.state)
      // console.log(">>>>>>>>>>>>>>>>")
    },
    onMounted()
    {
      console.log(">>>>>>>>>>>>---------------------------->>>>>>> here on mouted profile //////////////////")
      this.updateState({isLoading:false})
    }
})


export const ProfileViewer = defineComponent({
  state(){
    
      return {
          isLoading : true,
          isBlured : false,
          data : [],
          activateSection:'friends',
          Expanded: null,
          isOwn : false
          }
  },
  render(){
    // this.test()
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>> this.appContext.router : ", this.appContext.router.params)
    const {isBlured, Expanded, activateSection, isLoading, isOwn} = this.state
    const username = this.appContext.router.params.username; 
    if (isLoading)
      return h('div', {id:'global'}, ["is loading............"])
    // if (JSON.stringify(this.appContext.router.params) !== '{}')
    //   this.updateState({isLoading:true})
      return h('div', {id:'global'}, [h(header, {}),h('div', {class:'content'}, 
          [h(sidebarLeft, {}), h('div', {class:'global-content'
            
          },
              [h('div', {class:'profile-content', style : isBlured ? { filter : 'blur(4px)'}: {} 
              },[h('div', {class:'profile-info'}, 
              [
                  h('div', {class:'infos'}, [h(UserCard, {isOwn:isOwn}), h(UserWinRate, {})]),
                  h('div', {class:'other-cards'}, [h(UserAchievementsCard, {}), 
                    h(SocialCard,{
                      activateSection : activateSection,
                      on : 
                      { blurProfile : this.blurProfile,
                        // removeBlurProfile: this.removeBlurProfile
                      },
                      isExpanded:false
                    }), h(GameHistoryCard, {
                      on : { blurProfile : this.blurProfile,
                        // removeBlurProfile: this.removeBlurProfile
                      }
                    })])
              ]

              )])])
              ,
              (Expanded === 'MatchesHistory' ?  h(GameHistoryCard, {isExpanded : true,
                on : {
                removeBlurProfile: this.removeBlurProfile,

              }}) : null)
              ,
              (Expanded === 'socialCard' ? h(SocialCard, {isExpanded : true,
                activateSection : activateSection, on : {
                removeBlurProfile: this.removeBlurProfile
              },
            }) : null)

            ]) 
          ])
  },
  blurProfile(obj)
  {
    // const viewAll = { MatchHistory:true}
    // console.log("----------------------------------------> viewALL , activateSEction ", viewAll," | ")
    console.log("--------------------> obj : ", obj)
    this.updateState(obj)
    console.log("===========================>> this.state : ", this.state)
    // console.log(">>>>>>>>>>>>>>>>>>> data after blur : ", data)
    // createApp(compMatchHistory).mount(document.body)
  },
  removeBlurProfile(ob)
  {
    // const viewAll = { MatchHistory:false}
    this.updateState(ob)
    console.log("===========================>> this.state : ", this.state)
    // console.log(">>>>>>>>>>>>>>>>")
  },
  onMounted()
  {
    console.log(">>>>>>>>>>>>---------------------------->>>>>>> here on mouted profile //////////////////")
    this.updateState({isLoading:false})
  }
})