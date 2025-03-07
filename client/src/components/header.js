import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../package/index.js'

import { customFetch } from '../package/fetch.js'
import { translations } from './languages.js';
import { showErrorNotification } from '../package/utils.js';

let socket = null;

export const header = defineComponent({
    state()
    {
        return {
            suggestions : [],
            username    :"",
            language    : 'en',

            notif       : false,
            notification: null,
            icon_notif  : false
        }
    },
    
    onMounted() {
        this.initWebSocket();
    },

    onUnmounted(){
        if (socket)
        {
            socket.close();
            socket = null;
        }

    },

    initWebSocket() {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            socket = new WebSocket(`wss://${window.env.IP}:3000/ws/notification/`);
            socket.onopen = () => {};
            socket.onmessage = async (event) => {
                
                const data = JSON.parse(event.data);
                this.updateState({
                    icon_notif : true,
                })
            };
    
            socket.onerror = (error) => { console.error('WebSocket error:', error); };
            socket.onclose = () => {};
        }
    },

    async get_notifications()
    {
        try
        {
            const response = await customFetch(`https://${window.env.IP}:3000/api/user/notifications/`, {
                method      : 'GET',
                credentials : 'include'
            });
            if (!response.ok) {
                const errorText = await response.json();
                if(response.status === 401)
                    this.appContext.router.navigateTo('/login')

                console.error("Error response:", errorText);

                throw new Error(firstError);
            }

            const notifications = await response.json();

            this.updateState({
                notif        : !this.state.notif,
                notification : notifications,
                icon_notif   : false,
            }),
            
            this.emit("iconClick")
        }
        catch (error) {}
    },


    async handleInvitationAction(objectId, action)
    {
        const formData = new FormData();

        formData.append("tournament_id", objectId);
        formData.append("status", action);
        try
        {
            const response = await customFetch(`https://${window.env.IP}:3000/api/tournament/online/tournaments/`, {
                method      : 'PUT',
                body        : formData,
                credentials : 'include'
            });

            if (!response.ok) {
                const errorText = await response.json();

                if(response.status === 401)
                    this.appContext.router.navigateTo('/login')

                const firstError = Object.values(errorText)[0];
                throw new Error(firstError);
            }
            const successData = await response.json();
            showErrorNotification("You decline this invitation!");
        }
        catch (error)
        {
            showErrorNotification(error);
        }
    },

    async enterTournament(tournamentId)
    {
        try {
            const response = await customFetch(`https://${window.env.IP}:3000/api/tournament/online/tournaments/tournament-existence/${tournamentId}/`, {
                method      : 'GET',
                credentials : 'include'
            });
        
            if (!response.ok) {
                const errorData = await response.json();
        
                if(response.status === 401)
                    this.appContext.router.navigateTo('/login');
                
                console.error("Error response:", errorData.error);
                throw new Error(errorData.error);
            }
        
            const successData = await response.json();
            this.appContext.router.navigateTo(`/tournament/online/online_hierachy/${tournamentId}`);
        }
        catch (error) {
            showErrorNotification(error);
        }  
    },

    renderNotifications() {
        if (!this.state.notification || this.state.notification.length === 0) {
            return h("div", { class: "notifications-container" }, [
                h("p", {}, ["No new notifications"]),
            ]);
        }
    
        return h("div", { class: "notifications-container" },
            this.state.notification.slice().reverse().map((notification) => {
                let actions = [];
                let content = "";
    
                switch (notification.type) {
                    case "tournament":
                        content = `${notification.message}`;
                        actions =
                        [
                            h( "a", { on: {
                                        click: () => {
                                            this.updateState({
                                                notif: false,
                                            });
                                            this.emit('blur', notification);
                                        },
                                    }, },
                                    ["[Accept]"]),
                            h( "a", { class: "decline",  onclick: () =>
                                        this.handleInvitationAction(
                                            notification.object_id,
                                            "declined"
                                        ),  },
                                        ["[Decline]"] ),
                                    ];
                        break;
                    case "enter_tournament":
                        content = `${notification.message}`;
                        actions =
                        [
                            h( "a", { 
                                on : {
                                    click: () => this.enterTournament(notification.object_id)
                                }
                            }
                            , ["[Enter]"] ),
                        ]
                        break;
                    default:
                        content = `⚠️ ${notification.message}`;
                        break;
                }
                return h("div", { class: "notification" }, [
                    h("p", {}, [content]),
                    ...actions,
                ]);
            })
        );
    },

    render(){
        const {suggestions, username, language} = this.state

        return h('header', { class: 'container' }, [
            h('nav', {}, [
                h('a', {
                    on :{ click:(event)=>{
                        event.preventDefault();

                        this.appContext.router.navigateTo('/home')}
                    }
                }, [
                    h('img', { src: './images/logo.png', class: 'logo' })
                ]),
                h('div', { class: 'search' , style :{ 'z-index' : 100}}, [
                    h('a', {  }, [
                        h('i', { class: 'fa-solid fa-magnifying-glass icon', 'aria-hidden': 'false' })
                    ]),
                    h('input', { type: 'text', placeholder: 'Search...', id:'searchBox', value : `${username}`,on : {
                        input : (e)=>
                        {
                            const username = e.target.value
                            const suggestions = document.getElementById('suggestions')
                            if (searchBox.value.trim() !== '') {
                                suggestions.style.display = 'block';
                            } else {
                                suggestions.style.display = 'none';
                            }
                            
                            customFetch(`https://${window.env.IP}:3000/api/user/search?q=${searchBox.value}`)
                            .then((result)=>
                            {
                                switch(result.status)
                                {
                                    case 401:
                                        this.appContext.router.navigateTo('/login')
                                        break;
                                }
                                return result.json()
                            })
                            .then((res)=>{
                                this.updateState({
                                    suggestions:res,
                                    username: username
                                })

                            })

                        }
                    } }),
                    h('div', {class : 'suggestions', id : 'suggestions'},  suggestions.length > 0 ? suggestions.map(suggestion => 
                        h('div', { class: 'suggestion-item', on : {
                            click : ()=>
                            {
                                this.appContext.router.navigateTo(`/user/${suggestion.username}`)
                                const suggestions = document.getElementById('suggestions')
                                suggestions.style.display = 'none';
                                this.updateState({
                                    username:""
                                })
                            }
                                
                        }}, [
                            h('img', { src: `https://${window.env.IP}:3000${suggestion.picture}`, alt: 'User picture', style : {'object-fit': 'cover' }}),
                            ` ${suggestion.username}`
                        ]) 

                ) : 
                [
                    h('div' , {class: 'suggestion-item'}, ['No suggestions available...'])
                ]
            )
                ]),
         
        
                h('div', { class: 'left-side' }, [
                    h('select', { id : "language-selector" ,on : {
                        change : (e)=>
                        {
                            const language = e.target.value
                            document.getElementById('language-selector').value  = language
                            localStorage.setItem('language', language);
                            document.querySelectorAll("[data-translate]").forEach(element => {
                            const key = element.getAttribute("data-translate");
                                element.textContent = translations[language][key];
                                // this.updateState({
                                //     language:language
                                // })
                            })
                        }
                    }}, [
                        h('option', {value : 'en'}, ['EN']),
                        h('option', {value:'fr'}, ['FR']),
                        h('option', {value:'ar'}, ['AR'])
                    ])
                    ,
                    h('a', {}, [
                        h('i', {
                            className: `fa-regular fa-bell ${this.props.icon_notif || this.state.icon_notif ? 'icon_notif' : 'icon'}`,
                            on: {
                                click:()=> this.get_notifications(),
                            }
                        })
                    ]),
                    h('a', { href: '#/settings' }, [
                        h('i', {id:'settings-icon', class: 'fa-solid fa-sliders icon', 'aria-hidden': 'false', 
                            on : {
                                click :(e)=>
                                {
                                    e.preventDefault()

                                    const target = e.currentTarget;
                                    target.style.color = '#F45250';
                                    this.appContext.router.navigateTo('/settings/edit-info')
                                    
                                }
                            }
                         })
                    ]),
                    h('a', {on :{click: async (event)=> {
                        event.preventDefault()
                        fetch(`https://${window.env.IP}:3000/auth/logout/`,{
                            method:'POST',
                            credentials: 'include',
                        }).then(async (res)=>{
                            if(res.ok)
                            {
                                this.appContext.router.navigateTo('/login')
                            }
                        })
                    
                    }, }}, [
                        h('i', { class: 'fa-solid fa-arrow-right-from-bracket icon', 'aria-hidden': 'false' })
                    ])
                ])
            ]),
            this.state.notif ? h("div", { class: "notification-content" }, [
                h("div", { class: "title" }, [
                    h("h1", {}, ["Notification"]),
                ]),
                this.renderNotifications(),
            ]) : null
        ])
}})

