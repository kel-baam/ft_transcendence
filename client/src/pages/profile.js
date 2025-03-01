import{ defineComponent, h,} from '../package/index.js'

import { header } from '../components/header.js'
import { sidebarLeft } from '../components/sidebar-left.js'
import { UserCard } from '../components/profile/UserCard.js'
import { UserWinRate } from '../components/profile/UserWinRate.js'
import {UserAchievementsCard} from '../components/profile/UserAchievementsCard.js'
import { GameHistoryCard } from '../components/profile/GameHistoryCard.js'
import { SocialCard } from '../components/profile/SocialCard.js'
import {sidebarRight} from '../components/sidebar-right.js'
import { customFetch } from '../package/fetch.js'
import { NotFound } from '../components/errorPages/404.js'



export const Profile = defineComponent({
  state() {
    return {
      isBlured: false,
      activateSection: 'friends',
      Expanded: null,
      isLoading: true,
      userExists: true,
      error: null,

      notificationActive: false,
      notif_blur: false,
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
      });
    } catch (error) {
      showErrorNotification(error);
      this.updateState({
        notif_blur: false,
      });
    }
  },

   async onMounted() {

    // const userIcon = document.getElementById('user-icon');
    // console.log("on mounted i hommme==>",document); // Check if the element is selected

    // if (userIcon) {
    //     userIcon.style.color = "#F45250";
    //     userIcon.style.transform = "scale(1.1)";
    //     userIcon.style.webkitTransform = "scale(1.1)";
    //     userIcon.style.filter = "blur(0.5px)";
    //     userIcon.style.transition = "0.5s";
    // }
  // var storedLanguage = localStorage.getItem('language');
  // if (!storedLanguage)
  //   storedLanguage = 'en'
  // document.querySelectorAll("data-translate").forEach(element => {
  //     const key = element.getAttribute("data-translate");
  //     element.textContent = translations[storedLanguage][key];
  //     })
  const {key} = this.props
    if (key) {
      try {
        const result = await customFetch(`https://${window.env.IP}:3000/api/user?username=${key}`);

        if (result.status === 404) 
          this.updateState({ userExists: false,isLoading: false });
  
        else
          this.updateState({ isLoading: false });
        }
      catch (error) {
        console.error("Error fetching user:", error);
        // this.updateState({ error: 'Failed to fetch user data', userExists: false });
      }
    }
    else
      this.updateState({ isLoading: false })

  },

  render() {
    const { userExists, isBlured, Expanded, activateSection, isLoading, error } = this.state;
    const {key} = this.props;
    if (isLoading) {
      return h('div', { class: 'global' }, ['is Loading...']);
    }

    else if (!userExists) 
        return h(NotFound, {})

    return h('div', { id: 'global' }, [
      h(header, {
        icon_notif: this.state.notificationActive,
        on: {
          iconClick: () => {
            this.updateState({ notificationActive: !this.state.notificationActive });
          },
          blur: (notification_data) => {
            this.updateState({
              notif_blur: !this.state.notif_blur,
              notification_data: notification_data,
            });
          },
        },
        key:'header'
      },
    ),
      h('div', { class: 'content' }, [
        h(sidebarLeft, { key: 'left-bar' }),
        h('div', { class: 'global-content' }, [
          h('div', {
            class: 'profile-container',
            style: isBlured || this.state.notif_blur ? { filter: 'blur(4px)', 'pointer-events': 'none' } : {}
          }, [
            h('div', { class: 'profile-details' }, [
              h(UserCard, { key }),
              h(UserWinRate, { key }),
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
                isExpanded: false,
                on: { blurProfile: this.blurProfile },
              }),
            ]),
          ])
        ]),
        h('div', { class: 'friends-bar' }, [
          h(sidebarRight, {})
        ]),
        (Expanded === 'MatchesHistory' ? h(GameHistoryCard, {
          isExpanded: true,
          key,
          on: {
            removeBlurProfile: this.removeBlurProfile,
          }
        }) : null),
        (Expanded === 'socialCard' ? h(SocialCard, {
          isExpanded: true,
          key,
          activateSection: activateSection,
          on: {
            removeBlurProfile: this.removeBlurProfile
          },
        }) : null),
      ]),
      this.state.notif_blur ? h('div', { class: 'join-player-form' }, [
        h('i', {
          class: 'fa-regular fa-circle-xmark icon',
          on: {
            click: () => {
              this.updateState({
                notif_blur: false,
              });
            }
          }
        }),
        h('form', {
          class: 'form1',
          on: { submit: (event) => this.submitForm(event) }
        }, [
          h('div', { class: 'avatar' }, [
            h('img', {
              class: 'createAvatar',
              src: './images/people_14024721.png',
              alt: 'Avatar'
            }),
            h('div', {
              class: 'editIcon',
              on: {
                click: () => { document.getElementById(`file-upload1`).click(); }
              }
            }, [
              h('input', {
                type: 'file',
                id: 'file-upload1',
                name: 'player_avatar',
                accept: 'image/*',
                style: { display: 'none', pointerEvents: 'none' },
                on: { change: (event) => {
                  const file = event.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
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
              type: 'text',
              name: 'nickname',
              placeholder: 'Enter Nickname...'
            })
          ]),
          h('button', { type: 'submit' }, ['Submit'])
        ])
      ]) : null
    ]);
  },

  blurProfile(obj) {
    this.updateState({
      Expanded: obj.Expanded,
      isBlured: true,
    });
  },

  removeBlurProfile(ob) {
    this.updateState({
      Expanded: ob.Expanded,
      isBlured: false,
    });
  }
});
