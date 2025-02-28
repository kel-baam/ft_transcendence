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

            notificationActive: false,
            notif_blur:false,
            notification_data: null
          }
  },
 
  async submitForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append('tournament_id', JSON.stringify(this.state.notification_data.object_id));

    console.log("submit form ", this.state.notification_data.object_id);
    formData.append('status', 'accepted');

    try {
        const response = await customFetch(`https://${window.env.IP}:3000/api/tournament/online/tournaments/`, {
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
        this.updateState({
            notif_blur: false,
        })
    } catch (error) { 
        showErrorNotification(error);
        this.updateState({
            notif_blur: false,
        })
    }
  },

  render(){
    const key =  this.appContext.router.params.username
    const {isBlured, Expanded, activateSection, isLoading} = this.state

    return h('div', {id:'global'}, [
      h(header, {
        icon_notif: this.state.notificationActive,
        on          : {
            iconClick :()=>{ //should be in every part that has a header
                this.updateState({ notificationActive: !this.state.notificationActive }); 
            },
            blur :(notification_data)=> {
                this.updateState({
                    notif_blur            : !this.state.notif_blur,
                    notification_data     : notification_data
                })
            }
        }
      }),h('div', {class:'content'}, 
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
                h('div', {
                  class: 'profile-container',
                  style: isBlured || this.state.notif_blur ? { filter: 'blur(4px)' } : {}
                  
                }, [
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
                    on      : { submit: (event) => this.submitForm(event) }
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
                              click : () => { document.getElementById(`file-upload1`).click(); }
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
    const userIcon = document.getElementById('user-icon');
    console.log("on mounted i hommme==>",userIcon); // Check if the element is selected

    if (userIcon) {
        userIcon.style.color = "#F45250";
        userIcon.style.transform = "scale(1.1)";
        userIcon.style.webkitTransform = "scale(1.1)";
        userIcon.style.filter = "blur(0.5px)";
        userIcon.style.transition = "0.5s";
    }
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