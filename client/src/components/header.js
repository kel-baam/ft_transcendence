import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../package/index.js'

    const promise = new Promise((resolve, reject)=>{
        resolve("hello world!")
    })
import { customFetch } from '../package/fetch.js';
import { showErrorNotification } from '../pages/utils/errorNotification.js';

let socket = null;

export const header = defineComponent({

    state() {
        return {
            notif       : false,
            notification: null,
            icon_notif : false
        };
    },

    onMounted() {
        this.initWebSocket();
    },

    initWebSocket() {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            socket = new WebSocket('ws://localhost:8001/ws/notification/');
            socket.onopen = () => {console.log('WebSocket connection established'); };
            socket.onmessage = async (event) => {

                console.log('Message received in notif : ');
                
                const data = JSON.parse(event.data);
                this.updateState({
                    icon_notif : true,
                })
            };
    
            socket.onerror = (error) => { console.error('WebSocket error:', error); };
            socket.onclose = () => { console.log('WebSocket connection closed'); };
        }
    },

    async get_notifications()
    {
        try
        {
            const response = await customFetch("http://localhost:3000/api/user/notifications/", {
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
            
            console.log("notifications :", notifications);

            this.updateState({
                notif        : !this.state.notif,
                notification : notifications,
                icon_notif   : false,
            }),
            
            this.emit("iconClick")
        }
        catch (error) {  console.log(error);  }
    },


    async handleInvitationAction(objectId, action)
    {
        const formData = new FormData();

        formData.append("tournament_id", objectId);
        formData.append("status", action);
        try
        {
            const response = await customFetch("http://localhost:3000/tournament/api/online/tournaments/", {
                method      : 'PUT',
                body        : formData,
                credentials : 'include'
            });

            if (!response.ok) {
                const errorText = await response.json();

                if(response.status === 401)
                    this.appContext.router.navigateTo('/login')
                
                console.error("Error response:", errorText);

                const firstError = Object.values(errorText)[0];
                throw new Error(firstError);
            }
            const successData = await response.json();
            console.log("player added :", successData.message);
        }
        catch (error)
        {
            showErrorNotification(error);
            console.log(error);
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

    render() {
        return h('div', {}, [
            h('header', { class: 'container' }, [
                h('nav', {}, [
                    h('a', { href: 'home' }, [
                        h('img', { src: './images/logo.png', class: 'logo' })
                    ]),
                    h('div', { class: 'search' }, [
                        h('a', { href: '#' }, [
                            h('i', { class: 'fa-solid fa-magnifying-glass icon'})
                        ]),
                        h('input', { type: 'text', placeholder: 'Search...' })
                    ]),
                    h('div', { class: 'left-side' }, [
                        h('a', {}, [
                            h('i', {
                                className: `fa-regular fa-bell ${this.props.icon_notif || this.state.icon_notif ? 'icon_notif' : 'icon'}`,
                                on: {
                                    click:()=> this.get_notifications(),
                                }
                            })
                        ]),
                        h('a', { href: '#/settings' }, [
                            h('i', {
                                class: `fa-solid fa-sliders icon`,
                            })
                        ]),
                        h('a', {
                            on: {
                                click: async (event) => {
                                    event.preventDefault();
                                    fetch("http://localhost:3000/auth/logout/", {
                                        method: 'POST',
                                        credentials: 'include',
                                    }).then(async (res) => {
                                        if (res.ok) {
                                            this.appContext.router.navigateTo('/login');
                                        }
                                    })
                                },
                            }
                        }, [
                            h('i', {
                                class: 'fa-solid fa-arrow-right-from-bracket icon'
                            })
                        ])
                    ])
                ])
            ]),
            this.state.notif ? h("div", { class: "notification-content" }, [
                h("div", { class: "title" }, [
                    h("h1", {}, ["Notification"]),
                ]),
                this.renderNotifications(),
            ]) : null
        ]);
    },


})

