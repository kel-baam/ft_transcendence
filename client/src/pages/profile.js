import{createApp, defineComponent, DOM_TYPES, h,
     hFragment, hSlot, hString} from '../package/index.js'

import { header } from '../components/header.js'
import { sidebarLeft } from '../components/sidebar-left.js'
import { UserCard } from '../components/profile/UserCard.js'
import { UserWinRate } from '../components/profile/UserWinRate.js'
import { UserAchievementsCard } from '../components/profile/UserAchievementsCard.js'
import { GameHistoryCard } from '../components/profile/GameHistoryCard.js'
import { SocialCard } from '../components/profile/SocialCard.js'
import { JoinTournamentForm } from '../components/JoinTournamentForm.js'
import { showErrorNotification } from './utils/errorNotification.js'
import { customFetch } from '../package/fetch.js'

export const Profile = defineComponent({
    state()
    {
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
          },

          notificationActive: false,
          notif_blur:false,
          notification_data: null
      }
    },


  async submitForm(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append('tournament_id', JSON.stringify(this.state.id));
        formData.append('status', 'accepted');

        try {
            const response = await customFetch("http://localhost:3000/tournament/api/online/tournaments/", {
                method: 'PUT',
                body: formData,
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 401) this.appContext.router.navigateTo('/login');
                const errorText = await response.json();
                throw new Error(Object.values(errorText)[0]);
            }

            const successData = await response.json();
            console.log("Player added:", successData.message);
            this.updateState({ isBlur: false });
        } catch (error) {
            showErrorNotification(error);
        }
    },

    render(){
      return h('div', {id:'global'}, [h(header, {
          icon_notif: this.state.notificationActive,
          on          : {
              iconClick :()=>{ //should be in every part that has a header
                  this.updateState({ notificationActive: !this.state.notificationActive }); 
              },
              blur :(notification_data)=> {
                  this.updateState({
                      notif_blur            : !this.state.notif_blur,
                      notification_data : notification_data
                  })
              }
          }
        }),h('div', {class:'content'}, 
          [h(sidebarLeft, {}), h('div', {
            class:'global-content',
            style : this.state.notif_blur ? { filter : 'blur(4px)'} : {}
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

            ]),
            this.state.notif_blur ? 
            h('div', { class: 'join-player-form' }, [
                h('i', {
                    class   : 'fa-regular fa-circle-xmark icon',
                    on      : {
                        click : () => {
                            this.updateState({
                                notif_blur: false,
                            })
                        }
                    }
                }),
                h('form', {
                    class   : 'form1',
                    on      : {submit: this.submitForm.bind(this) }
                }, [
                    h('div', { class: 'avatar' }, [
                        h('img', { 
                            class   : 'createAvatar', 
                            src     : './images/people_14024721.png', 
                            alt     : 'Avatar' 
                        }),
                        h('div', { 
                            class   : 'editIcon', 
                            on      : {
                                click: () => { document.getElementById(`file-upload1`).click(); }
                            }
                        }, [
                            h('input', {
                                type    : 'file',
                                id      : 'file-upload1',
                                name    : 'player_avatar',
                                accept  : 'image/*',
                                style   :{
                                    display         : 'none',
                                    pointerEvents   : 'none'
                                },
                                on      : { change: (event) => {
                                    const file = event.target.files[0];
                                    if (file) {
                                        const reader    = new FileReader();
                                        reader.onload   = (e) => {
                                            document.querySelector(`.createAvatar`).src = e.target.result;
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            }),
                            h('i', { class: 'fas fa-edit icon' })
                        ])
                    ]),
                    h('div', { class: 'createInput' }, [
                        h('label', { htmlFor: 'playerNickname' }, ['Nickname:']),
                        h('br'),
                        h('input', { 
                            type        : 'text', 
                            name        : 'nickname', 
                            placeholder : 'Enter Nickname...' 
                        })
                    ]),
                    h('button', { type: 'submit' }, ['Submit'])
                ])
            ]) : null
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

