import { createApp, defineComponent, h }    from '../../../package/index.js'
import { header }                           from '../../../components/header.js'
import { sidebarLeft }                      from '../../../components/sidebar-left.js'
import { showErrorNotification, highlightInvalidInput } from '../../utils/errorNotification.js';
import { customFetch } from '../../../package/fetch.js';

export const LocalTournament = defineComponent({
    state() {
        return {
            tournaments: [],
            notificationActive: false,
            isBlur:false,
            notification_data: null,
        };
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

    async submitTournamentForm(event) {
        event.preventDefault();

        const formElement = event.target;
        const formData    = new FormData(formElement);
        try
        {
            const response  = await customFetch(`https://${window.env.IP}:3000/api/tournament/local/tournaments/`, {
                method      : 'POST',
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

            console.log("Tournament created:", successData.message);

            formElement.reset();
            this.resetImagePreviews();
            this.fetchTournaments();
        }
        catch (error)
        {
            showErrorNotification(error);
            highlightInvalidInput(formElement)
        }
    },

    async fetchTournaments() {
        try
        {
            const response = await customFetch(`https://${window.env.IP}:3000/api/tournament/local/tournaments/`, {
                method      : 'GET',
                headers     : { 'Content-Type' : 'application/json' },
                credentials : 'include'
            });
    
            if (!response.ok) {
                const errorText = await response.json();

                if(errorText = 401)
                    this.appContext.router.navigateTo('/login')

                throw new Error(errorText);
            }
    
            const tournamentData = await response.json();
    
            if (tournamentData && tournamentData.tournaments)
            {
                const tournamentsArray = Object.values(tournamentData.tournaments);
                this.updateState({ tournaments: tournamentsArray });
            
            }
            else
            {
                console.error('Tournaments data is undefined or missing:', tournamentData);
            }
    
        }
        catch (error)
        { console.error('Error fetching tournaments:', error); }
    },

    resetImagePreviews() {
        [1, 2, 3, 4].forEach(i => {
            const playerImageElement = document.querySelector(`.player${i}-image`);
            if (playerImageElement) {
                playerImageElement.src = './images/people_14024721.png'
            }
        });
    },

    onMounted() {
        this.fetchTournaments();
    },

    async deleteATournament(id)
    {
        try
        {
            const response = await customFetch(`https://${window.env.IP}:3000/api/tournament/local/tournaments/`, {
                method              : 'DELETE',
                body                : JSON.stringify({
                    tournamentId    : id
                }),
                headers             : {
                    'Content-Type'  : 'application/json' 
                },
                credentials         : 'include'
            });

            if (!response.ok)
            {
                const errorText = await response.json();
                
                if(errorText = 401)
                    this.appContext.router.navigateTo('/login')

                console.error('Failed to delete tournament');

                throw new Error(errorText);
            }
                
            console.log('Tournament deleted successfully!');
            this.updateState({
                tournaments: this.state.tournaments.filter(tournament => tournament.id !== id)
            });
            
        }
        catch (error) { console.log('Error while deleting tournament:', error); }
    },

    render() {
        console.log("hna", this.state.tournaments.length)
        return h('div', { id: 'global' }, [
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
            h('div', { class: 'content' }, [
                h(sidebarLeft, {}),
                h('div', {
                    class : 'local-tournament',
                    style : this.state.isBlur ? { filter : 'blur(4px)',  pointerEvents: 'none'} : {}
                }, [
                    h('div', { class: 'create' }, [
                        h('div', { class: 'title' }, [
                            h('h1', {}, ['Created Tournaments'])
                        ]),
                        h('div', { class: 'tournaments' },
                            (this.state.tournaments.length > 0
                                ? this.state.tournaments.map((tournament) =>
                                    h('div', { class: 'created' }, [
                                        h('img', { src: './images/gold-cup-removebg-preview.png' }),
                                        h('a', {
                                            on: {
                                                click: () => {
                                                    const id = tournament.id;
                                                    
                                                    this.appContext.router.navigateTo(`/tournament/local/local_hierachy/${id}`);
                                                }}
                                            }, [tournament.name]),
                                        h('i', {
                                            class   : 'fa-regular fa-circle-xmark icon',
                                            style   : { color : '#D44444' },
                                            on      : { click: () => this.deleteATournament(tournament.id) }
                                        })
                                    ]))
                                : [h('p', {}, ['No tournaments created'])]
                            )
                        )                                    
                    ]),
                    h('div', { class: 'create_one' }, [
                        h('div', { class: 'title' }, [
                            h('h2', {}, ['Create a Tournament'])
                        ]),
                        h('form', { onsubmit: this.submitTournamentForm.bind(this) }, [
                            h('div', { class: 'form' }, [
                                h('div', { class: 'tournament-name' }, [
                                    h('label', { htmlFor: 'fname' }, ['Tournament Name:']),
                                    h('input', { type: 'text', name: 'tournament_name', placeholder: 'Enter tournament name...' })
                                ]),
                                h('div', { class: 'players-name' }, [
                                    h('label', { htmlFor: 'players' }, ['Player Names:']),
                                    h('div', { class: 'players' }, [
                                        ...[1, 2, 3, 4].map(i =>
                                            h('div', { class: 'section' }, [
                                                h('input', {
                                                    type: 'text',
                                                    name: `player${i}_nickname`,
                                                    class: `player${i}`,
                                                    placeholder: 'Enter player name...'
                                                }),
                                                h('div', { class: 'image' }, [
                                                    h('img', {
                                                        src: './images/people_14024721.png',
                                                        alt: `Player ${i} Image`,
                                                        class: `player${i}-image`
                                                    }),
                                                    h('div', {
                                                        class: 'edit_icon',
                                                        on: {
                                                            click: () => { document.getElementById(`file-upload-${i}`).click(); }
                                                        }
                                                    }, [
                                                        h('input', {
                                                            type: 'file',
                                                            id: `file-upload-${i}`,
                                                            name: `player${i}_image`,
                                                            accept: 'image/*',
                                                            on: { change: (event) => {
                                                                const file = event.target.files[0];
                                                                if (file) {
                                                                    const reader = new FileReader();
                                                                    reader.onload = (e) => {
                                                                        document.querySelector(`.player${i}-image`).src = e.target.result;
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                }
                                                            }}
                                                        }),
                                                        h('i', { class: 'fas fa-edit' })
                                                    ])
                                                ])
                                            ])
                                        )
                                    ])
                                ]),
                                h('div', { class: 'submit' }, [
                                    h('button', {
                                        type: 'submit',
                                        disabled: false
                                    }, ['SUBMIT'])
                                ])
                            ])
                        ])
                    ])
                ]), this.state.isBlur ? 
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
        ]);
    },
});
