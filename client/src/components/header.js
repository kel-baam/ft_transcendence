import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../package/index.js'

    const promise = new Promise((resolve, reject)=>{
        resolve("hello world!")
    })

export const header = defineComponent({

    state() {
        return {
            socket: null,
            notif : false,
        };
    },


  onMounted() {
      this.initWebSocket();
  },

  initWebSocket() {
      console.log(!this.state.socket);
      if (!this.state.socket || this.state.socket.readyState !== WebSocket.OPEN) {

          this.state.socket = new WebSocket('ws://localhost:8001/ws/notification/');
          console.log(!this.state.socket);
  
          this.state.socket.onopen = () => {
              console.log('WebSocket connection established');
  
          };
  
          this.state.socket.onmessage = async (event) => {

              console.log('Message received in notif : ');
              
              const data = JSON.parse(event.data);
              this.updateState({
                  notificationActive : true,
              })
              console.log("--------------> ", data)
          };
  
          this.state.socket.onerror = (error) => {
              console.error('WebSocket error:', error);
          };
  
          this.state.socket.onclose = () => {
              console.log('WebSocket connection closed');
          };
      }
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
                                className: `fa-regular fa-bell ${this.props.icon_notif ? 'icon_notif' : 'icon'}`,
                                on: {
                                    click: () => {
                                        this.updateState({
                                            notif: !this.state.notif
                                        }),
                                        this.emit("iconClick")
                                    }
                                }
                            })
                        ]),
                        h('a', { href: '#/settings' }, [
                            h('i', { class: 'fa-solid fa-sliders icon'})
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

            this.state.notif ? h(
                "div", { class: "notification-content" },
                [
                  h("div", { class: "title" }, [
                    h("h1", {}, ["Notification"]),
                  ]),
                  h(
                    "div",
                    { class: "notifications-container" },
                    [
                      h("div", { class: "notification" }, [
                        h("p", {}, [
                          h("strong", {}, ["Update Available:"]),
                          " A new version of the app is available. Please update to enjoy the latest features!",
                        ]),
                      ]),
                      h("div", { class: "notification" }, [
                        h("p", {}, [
                          h("strong", {}, ["Invitation Received!"]),
                          " Niboukha has invited you to join their tournament.",
                        ]),
                        h("a", { href: "#" }, ["[Join]"]),
                      ]),
                      h("div", { class: "notification" }, [
                        h("p", {}, [
                          h("strong", {}, ["Invitation Received!"]),
                          " Niboukha has invited you to join their tournament.",
                        ]),
                        h("a", { href: "#" }, ["[Accept]"]),
                        h("a", { href: "#", class: "decline" }, ["[Decline]"]),
                      ]),
                      h("div", { class: "notification" }, [
                        h("p", {}, [
                          "⚠️ You have a new message: \"Hey, are you available for a quick call?\"",
                        ]),
                        h("a", { href: "#" }, ["[Reply]"]),
                        h("a", { href: "#" }, ["[Dismiss]"]),
                      ]),
                      h("div", { class: "notification" }, [
                        h("p", {}, [
                          "⚠️ Failed: The file upload was unsuccessful. Ensure the file size is within the limit.",
                        ]),
                      ]),
                    ]
                  ),
                ]
              ) : null
        ]);
    }
})

