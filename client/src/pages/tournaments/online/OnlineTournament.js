import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../../package/index.js'
// import { JoinedTournaments } from './JoinedTournaments.js'
import { header } from '../../../components/header.js'
import { sidebarLeft } from '../../../components/sidebar-left.js'
import { CreateTournament } from '../../../components/tournament/createTournament.js'
import { JoinedTournaments } from '../../../components/tournament/JoinedTournaments.js'
import { AvailableTournaments } from '../../../components/tournament/AvailableTournaments.js'
import { showErrorNotification, highlightInvalidInput } from '../../utils/errorNotification.js';
import { customFetch } from '../../../package/fetch.js';

export const OnlineTournament = defineComponent({
    state() {
        return {
            socket  : null,
            data    : {
                joinedTournaments   : [],
                availableTournaments: [],
            },
            isBlur  : false,
            id      : null,
        };
    },

    onMounted() {
        this.initWebSocket();
    },

    initWebSocket() {
        if (!this.state.socket || this.state.socket.readyState !== WebSocket.OPEN) {

            this.state.socket = new WebSocket('ws://localhost:8002/ws/online/');
    
            this.state.socket.onopen = () => {
                console.log('WebSocket connection established');
    
                this.state.socket.send(JSON.stringify({ action: 'get_joined_tournaments' }));
                this.state.socket.send(JSON.stringify({ action: 'get_available_tournaments' }));
            };
    
            this.state.socket.onmessage = async (event) => {

                console.log('Message received:');

                const data = JSON.parse(event.data);
                
                console.log('Parsed WebSocket Data:', data);
                if(data.error == "token expired")
                {
                    const refreshAccessToken= await fetch('http://localhost:3000/auth/refreshToken',{
                        method:'GET',
                        credentials: 'include',});
                    
                    console.log("thiiiiis the sulotion",refreshAccessToken)

                }

    
                if (data.joined_tournaments) {
                    this.updateState({ joinedTournaments: data.joined_tournaments });
                }
                
                if (data.available_tournaments) {
                    this.updateState({ availableTournaments: data.available_tournaments });
                }

                if (data.message) {
                    console.log(data.message);
                }
            };
    
            this.state.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
    
            this.state.socket.onclose = () => {
                console.log('WebSocket connection closed');
            };
        }
    },

    async submitForm(event){
        event.preventDefault();

        const formElement   = event.target;
        const formData      = new FormData(formElement);
        
        formData.append('tournament_id', JSON.stringify(this.state.id));
        formData.append('status', 'accepted');

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        
        console.log("-----> " , formData)
        try {
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

            this.updateState({
                isBlur: false
            })

        } catch (error) {
            showErrorNotification(error);
            console.log(error);
        }
    },

    render()
    {
        return h('div', {id:'global'}, [h(header, {}),h('div', {class:'content'}, 
            [h(sidebarLeft, {}), h('div', { 
                class   : 'online-tournament',
                style       : this.state.isBlur ? { filter : 'blur(4px)'} : {}
                },
                [
                    h('div', {}, [h(AvailableTournaments, {
                        tournaments : this.state.availableTournaments,
                        on          :{
                            join:(id)=>{
                                this.state.id = id;
                                this.updateState({isBlur:true})
                            }
                        }
                        
                    })]),
                    h('div', {}, [h(JoinedTournaments, {
                        tournaments : this.state.joinedTournaments,
                        on          : {
                            start_the_tournament:(id)=>{
                                this.appContext.router.navigateTo(`/tournament/online/online_hierachy/${id}`);
                            }
                        }
                    })]),
                    h('div', {}, [h(CreateTournament, {})]),
                ]),
                this.state.isBlur ? 
                h('div', { class: 'join-player-form' }, [
                    h('i', {
                        class   : 'fa-regular fa-circle-xmark icon',
                        on      : {
                            click : () => { this.updateState({ isBlur: false }) }
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
        ])
    },
})

