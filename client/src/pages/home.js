import{ defineComponent, h} from '../package/index.js'

import { header } from '../components/header.js'
import { sidebarLeft } from '../components/sidebar-left.js'
import { LeaderboardHome } from '../components/home/LeaderboardHome.js'
import { WelcomingSection } from '../components/home/WelcomingSection.js'
import { TrainingBoot } from '../components/home/TrainingBoot.js'
import { TournamentSection } from '../components/home/TournamentSection.js'
import { PlayerVsPlayer } from '../components/home/PlayerVsPlayer.js'
import { customFetch } from '../package/fetch.js'
import { showErrorNotification } from './utils/errorNotification.js'
import { sidebarRight } from '../components/sidebar-right.js'

export const Home = defineComponent({
    state(){
        return {
            notificationActive: false,
            isBlur:false,
            notification_data: null,
            homeActive :false
        }
    },
    
    onMounted()
    {
        const userIcon = document.getElementById('home-icon');

        if (userIcon) {
            userIcon.style.color = "#F45250";
            userIcon.style.transform = "scale(1.1)";
            userIcon.style.webkitTransform = "scale(1.1)";
            userIcon.style.filter = "blur(0.5px)";
            userIcon.style.transition = "0.5s";
        }

    },

    async submitForm(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append('tournament_id', JSON.stringify(this.state.notification_data.object_id));
        formData.append('status', 'accepted');
        
        // print("--------------------> submit form ", formData)
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
            this.updateState({ isBlur: false });
        } catch (error) {
            showErrorNotification(error);
            this.updateState({
                isBlur: false,
            })
        }
    },

    render()
    {
        return h('div', {id:'global'}, [
            h(header, {
                icon_notif: this.state.notificationActive,
                on          : {
                    iconClick :()=>{
                        this.updateState({ notificationActive: !this.state.notificationActive }); 
                    },
                    blur :(notification_data)=> {
                        this.updateState({
                            isBlur            : !this.state.isBlur,
                            notification_data : notification_data
                        })
                    },
                },
                key : 'header'
            }),
            h('div', {class:'content'},[
                h(sidebarLeft, {key: 'left-bar'}), h('div', 
                    {
                        class :'home-content' ,
                        style : this.state.isBlur ? { filter : 'blur(4px)',  pointerEvents: 'none'} : {}
                    },
                    [
                        h('div', { class: 'home-top' },
                            [h(LeaderboardHome, {}), h(WelcomingSection, {})]
                        ),
                        h('div', { class: 'home-down'},
                            [h(TrainingBoot, {}), h(TournamentSection, {}), h(PlayerVsPlayer, {}) ]
                        )
                    ]),
                    h('div', { class: 'friends-bar' }, [
                              h(sidebarRight, {})
                    ]),
            ]),
            this.state.isBlur ? 
            h('div', { class: 'join-player-form' }, [
                h('i', {
                    class   : 'fa-regular fa-circle-xmark icon',
                    on      : {
                        click : () => {
                            this.updateState({
                                isBlur: false,
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
    }                    
})

