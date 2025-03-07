import{defineComponent, h} from '../package/index.js'
import { header } from '../components/header.js'
import { sidebarLeft } from '../components/sidebar-left.js'
import { sidebarRight } from '../components/sidebar-right.js'
import { customFetch } from '../package/fetch.js'

  export const Leaderboard = defineComponent({
    state(){
        return {
            socket : null,
            errors :{},
            data :[],
            isloading : true,

            notificationActive: false,
            isBlur:false,
            notification_data: null,

        }
    },

    async submitForm(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        formData.append('tournament_id', JSON.stringify(this.state.notification_data.object_id));
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

            this.updateState({ isBlur: false });
        } catch (error) {
            showErrorNotification(error);
            
            this.updateState({
                isBlur: false,
            })
        }
    },
    
    onMounted()
    {
        const userIcon = document.getElementById('leaderboard-icon');
  
        if (userIcon) {
          userIcon.style.color = "#F45250";
          userIcon.style.transform = "scale(1.1)";
          userIcon.style.webkitTransform = "scale(1.1)";
          userIcon.style.filter = "blur(0.5px)";
          userIcon.style.transition = "0.5s";
        }
        customFetch(`https://${window.env.IP}:3000/api/user/ranking`)
        .then(res=>
            {
                if (res.status == 401)
                    this.appContext.router.navigateTo('/login')
                return res.json()
            }
        )
        .then(result=>
        {
            this.updateState({
                data     : result,
                isloading:false

            })
        }
        )

    },
    createPlayerEntry(rank, name, score, level, badgeSrc) {
        name = name.substring(0, 10)
        return h("div", { class: "space" },
            [
                h("div", {}, [h("p", {}, [rank])]),
                h("div", {}, [h("p", {}, [name])]),
                h("div", {}, [h("p", {}, [score])]),
                h("div", {}, [h("p", {}, [level])]),
            ]
        );
        },
    render(){
        const {data, isloading} = this.state
        const playersLen = Object.keys(data).length

        return(
                h('div',{id:'global'},[
                    h(header, {
                        icon_notif: this.state.notificationActive,
                            on        : {
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
                    h('div', {class:'content',style:{'overflow-y': 'hidden'} }, 
                        [h(sidebarLeft, {}),
                            h('div',{
                                class :'home-content',
                                style : this.state.isBlur ? { filter : 'blur(4px)',  pointerEvents: 'none'} : {}
                            }, playersLen > 0 ?[
                                
                                h('div',{class:'leaderboard-title'},[
                                    h('h1',{},['Leaderboard'])
                                ]),
                                h('div',{class: 'pics-rank'},[
                                    h('div',{class:'first-place'}, playersLen >= 1  ?[
                                        h('img',{class:'crown-pic', src:'./images/crown-removebg-preview.png'}),
                                        h('img',{class:'first-pic', src:`${data[0].picture}`}),
                                        h('h4',{},[`${data[0].username.substring(0, 10)}`])
                                    ]:[h('img',{class:'crown-pic', src:'./images/crown-removebg-preview.png'}),
                                        h('img',{class:'first-pic',src:'./images/accountUser.png',alt:'third player picture'}),
                                        h('h1',{},['?'])
                                    ]),
                                    h('div',{class:'second-third-place'},[
                                        h('div',{class:'second-place'},playersLen >= 2 ?[
                                            h('img',{class:'second-symbol',src:"./images/second_1021187.png"}),
                                            h('img',{class:'second-pic',src:`${data[1].picture}`,alt:'second player picture'}),
                                            h('h4',{},[`${data[1].username.substring(0, 10)}`])
                                        ]:[h('img',{class:'second-symbol',src:"./images/second_1021187.png"}),
                                            h('img',{class:'second-pic',src:'./images/accountUser.png',alt:'third player picture'}),
                                            h('h1',{style:{fontSize:'20px',color:"#BBB7B3"}},['?'])]
                                        ),
                                        h('div',{class:'third-place'},playersLen >= 3 ?[
                                            h('img',{class:'third-symbol',src:'./images/third.png'}),
                                            h('img',{class:'third-pic',src:`${data[2].picture}`,alt:'third player picture'}),
                                            h('h4',{},[`${data[2].username.substring(0, 10)}`])
                                        ]:[h('img',{class:'third-symbol',src:'./images/third.png'}),
                                            h('img',{class:'third-pic unknown',src:'./images/accountUser.png',alt:'third player picture'}),
                                            h('h1',{style:{fontSize:'20px',color:"#BBB7B3"}},['?'])
                                        ])
                                    ])
                                ]),
                                h('div',{class:'rank-info'},[
                                    h('div',{class:'players-info'},[
                                        h('div',{class:'space first-row'},[
                                            h('div',{},[
                                                h('p',{},['Rank']),
                                            ]),
                                            h('div',{},[
                                                h('p',{},['UserName']),
                                            ]),
                                            h('div',{},[
                                                h('p',{},['Score']),
                                            ]),
                                            h('div',{},[
                                                h('p',{},['Level']),
                                            ]),
                                        ]),
                                        h('div',{class:'info'},
                                                data.map((player, index) => {
                                                    
                                                    return this.createPlayerEntry(index + 1, player.username,player.score,player.level,"./images/diamond.png")

                                                }),
                                            )                                        
                                    ])
                                ])
                            ] : !isloading ?[
                                h('div',{class:'empty'},[
                                    h('div',{class:'leaderboard-title'},[
                                        h('h1',{},['Leaderboard'])
                                    ]),
                                    h('img',{class:'trophy-pic', src:'./images/gold-cup-removebg-preview.png'}),
                                    h('h1',{},['No matches played yet'])

                                ])
                            ] : []),
                            h('div', { class: 'friends-bar' }, [
                                h(sidebarRight, {})
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
                    ]),
            ])
          
        )}

})