import { createApp, defineComponent, h }    from '../../../package/index.js'
import { header }                           from '../../../components/header.js'
import { sidebarLeft }                      from '../../../components/sidebar-left.js'
import { showErrorNotification, highlightInvalidInput } from '../../utils/errorNotification.js';

export const LocalTournament = defineComponent({
    state() {
        return {
            tournaments: []
        };
    },

    async fetchcsrftoken() {
        const response = await fetch('http://localhost:8000/local/api/csrf-token/');
        const data = await response.json();
        return data.csrftoken;
    },

    async submitForm(event) {
        event.preventDefault();

        const formElement   = document.querySelector('form');
        const formData      = new FormData(formElement);
        const dataFormData  = new FormData();

        dataFormData.append('name', formData.get('tournament_name'));

        for (let i = 1; i <= 4; i++) {
            const playerName = formData.get(`player${i}`);
            const playerImage = formData.get(`player${i}_image`);
        
            if (playerName && playerImage) {
                dataFormData.append(`players[${i - 1}][nickname]`, playerName);
                dataFormData.append(`players[${i - 1}][avatar]`, playerImage);
            }
        }
        
        // console.log("---------->", dataFormData);
        try {
            const csrftoken = await this.fetchcsrftoken();
            const response  = await fetch("http://localhost:8000/local/api/tournaments/", {
                method      : 'POST',
                body        : dataFormData,
                headers     : { 'X-CSRFToken': csrftoken },
                credentials : 'include'
            });

            if (!response.ok) {
                const errorText = await response.json();
                console.error("Error response:", errorText.errors);
                throw new Error(errorText.errors);
            }

            const successData = await response.json();
            console.log("Tournament created:", successData.message);
            formElement.reset();
            this.resetImagePreviews();
            this.fetchTournaments();

        } catch (error) {
            showErrorNotification(error);
            highlightInvalidInput(formElement)
            console.log(error);
        }
    },

    async fetchTournaments() {
        console.log("Fetching tournaments through HTTP request...");
    
        try {
            const csrftoken = await this.fetchcsrftoken();
            
            const response = await fetch("http://localhost:8000/local/api/tournaments/", {
                method: 'GET',
                headers: { 
                    'X-CSRFToken'   : csrftoken,
                    'Content-Type'  : 'application/json'
                },
                credentials: 'include'
            });
    
            if (!response.ok) {
                const errorText = await response.json();
                console.error("Error response:", errorText.errors);
                throw new Error(errorText.errors);
            }
    
            const tournamentData = await response.json();
            console.log("Tournament data >>>> ", tournamentData);
    
            if (tournamentData && tournamentData.tournaments) {
                const tournamentsArray = Object.values(tournamentData.tournaments);
                this.updateState({ tournaments: tournamentsArray });
            } else {
                console.error('Tournaments data is undefined or missing:', tournamentData);
            }
    
        } catch (error) {
            console.error('Error fetching tournaments:', error);
        }
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
        console.log("initWebSocket function is being called");

        this.fetchTournaments();
    },

    async deleteATournament(id)
    {
        console.log("id ----> ", id)

        try {
            const csrftoken = await this.fetchcsrftoken();

            const response = await fetch(`http://localhost:8000/local/api/tournaments/`, {
                method              : 'DELETE',
                body                : JSON.stringify({
                    tournamentId    : id
                }),
                headers             : { 
                    'X-CSRFToken'   : csrftoken,
                    'Content-Type'  : 'application/json' 
                },
                credentials         : 'include'
            });

            if (response.ok) {
                console.log('Tournament deleted successfully!');
                this.updateState({
                    tournaments: this.state.tournaments.filter(tournament => tournament.id !== id)
                });
            } else {
                console.error('Failed to delete tournament');
            }
        } catch (error) {
            console.log('Error while deleting tournament:', error);
        }
    },

    render() {
        console.log("hna", this.state.tournaments.length)
        return h('div', { id: 'global' }, [
            h(header, {}),
            h('div', { class: 'content' }, [
                h(sidebarLeft, {}),
                h('div', { class: 'local-tournament' }, [
                    h('div', { class: 'create' }, [
                        h('div', { class: 'title' }, [
                            h('h1', {}, ['Created Tournaments'])
                        ]),
                        h('div', { class: 'tournaments' },
                            (this.state.tournaments.length > 0
                                ? this.state.tournaments.map((tournament) =>
                                    h('div', { class: 'created' }, [
                                        h('img', { src: './images/ping-pong-equipment-.png' }),
                                        h('a', {
                                            on: {
                                                click: () => {
                                                    const tournamentId = tournament.id;
                                                    
                                                    this.appContext.router.navigateTo(`/tournament/local/local_hierachy/${tournamentId}`);
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
                        h('form', { onsubmit: this.submitForm.bind(this) }, [
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
                                                    name: `player${i}`,
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
                ])
            ])
        ]);
    },
});
