import{createApp, defineComponent, DOM_TYPES, h,
     hFragment, hSlot, hString} from '../package/index.js'

import { header } from '../components/header.js'
import { sidebarLeft } from '../components/sidebar-left.js'
import { UserCard } from '../components/profile/UserCard.js'
import { UserWinRate } from '../components/profile/UserWinRate.js'
import {UserAchievementsCard} from '../components/profile/UserAchievementsCard.js'
import { GameHistoryCard } from '../components/profile/GameHistoryCard.js'
import { SocialCard } from '../components/profile/SocialCard.js'

export const Profile = defineComponent({
    state(){
      
        return {
            isLoading : true,
            isBlur : false,
            data : [],
            // activateSection:'friends',
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
                (this.state.viewAll.SocialCard ? h(SocialCard, {viewAll : true,on : {
                  removeBlurProfile: this.removeBlurProfile
                },
                activateSection:this.state.viewAll.activateSection
              }) : null)

              ]) 
            ])
    },
    blurProfile(viewAll)
    {
      // console.log("----------------------------> {...this.state.viewAll, MatchHistory:true}", {...this.state.viewAll, MatchHistory:true})
      // const viewAll = { MatchHistory:true}
      // console.log("----------------------------------------> viewALL , activateSEction ", viewAll," | ")
      this.updateState({viewAll})
      // console.log("===========================>> this.state : ", this.state)
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

