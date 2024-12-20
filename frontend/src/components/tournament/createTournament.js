import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString}                          from '../../package/index.js'
import { showErrorNotification, highlightInvalidInput } from '../../pages/tournaments/errorNotification.js';

export const CreateTournament = defineComponent({
    state(){
        return {
            friendsList: [],
            players: [],
        }
    },

    async fetchcsrftoken() {
        console.log("after");
        const response = await fetch('http://localhost:8000/online/api/csrf-token/');

        const data = await response.json();
        return data.csrftoken;
    },

    async submitForm(event){
        event.preventDefault();
        const formElement = event.target;
        const formData = new FormData(formElement);
        formData.append('invited-players', JSON.stringify(this.state.players));

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const csrftoken = await this.fetchcsrftoken();
            const response = await fetch("http://localhost:8000/online/api/tournaments/", {
                method      : 'POST',
                body        : formData,
                headers     : { 'X-CSRFToken': csrftoken },
                credentials : 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Error response:", data);
                throw new Error(data);
            }

            console.log("Tournament created:", data.message);

            formElement.reset();

            this.resetImagePreviews();
            this.updateState ({ players: [] })
            this.emit("backToParent")

        } catch (error) {
            // const jsonString            = error.replace('Error response: ', '');
            // const jsonStringFormatted   = jsonString.replace(/'/g, '"');
            // const parsedResponse        = JSON.parse(jsonStringFormatted);

            // const errorName = parsedResponse.name[0].string;

            // console.log(errorName);
            showErrorNotification(error);
            console.log(error);
        }
    },

    resetImagePreviews() {
        const playerImageElement = document.querySelector(`.creator_avatar`);
        if (playerImageElement) {
            playerImageElement.src = './images/people_14024721.png'
        }
    },

    async friends_list(event) {
        event.preventDefault();
    
        try {
            const searchQuery = event.target.value;
            const csrftoken = await this.fetchcsrftoken();
            const playersLength = this.state.players.length;
            
            const response = await fetch(`http://localhost:8000/online/api/tournaments/friends-list?search=${encodeURIComponent(searchQuery)}&playersLength=${playersLength}`, {
                method: 'GET',
                headers: { 'X-CSRFToken': csrftoken },
                credentials: 'include',
            });
    
            if (!response.ok) {
                const errorText = await response.json();
                console.error("Error response:", errorText.error);
                throw new Error(errorText.error);
            }
    
            const friendsList = await response.json();
            // console.log("Friends List: ", friendsList);
            this.updateState ({ friendsList: friendsList })
        } catch (error) {
            showErrorNotification(error);
            highlightInvalidInput(formElement)
            console.error("Error fetching friends list:", error);
        }
    },    

    render()
    {
        return h('div', { class: 'createTournament' }, [
            h('div', { class: 'title' }, [
                h('h1', {}, ['Create one'])
            ]),
            h('form', { on : {submit: this.submitForm.bind(this) }}, [
                h('div', { class: 'image' }, [
                    h('img', {
                        src: './images/people_14024721.png',
                        alt: 'avatar',
                        class: 'creator_avatar'
                    }),
                    h('div', { 
                        class: 'edit_icon', 
                        on: {
                            click: () => { document.getElementById(`file-upload`).click(); }
                        }
                    }, [
                        h('input', {
                            type: 'file',
                            id: 'file-upload',
                            name: 'creator_Avatar',
                            accept: 'image/*',
                            on: { change: (event) => {
                                const file = event.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        document.querySelector(`.creator_avatar`).src = e.target.result;
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        }),
                        h('i', { class: 'fas fa-edit icon' })
                    ])
                ]),
                h('div', { class: 'createInput' }, [
                    h('div', {}, [
                        h('label', {}, ['Tournament name:']),
                        h('br'),
                        h('input', { type: 'text', name: 'name', placeholder: 'Enter Tournament name...' }),
                        h('br')
                    ]),
                    h('div', {}, [
                        h('label', {}, ['Nickname:']),
                        h('br'),
                        h('input', { type: 'text', name: 'nickname', placeholder: 'Enter Nickname...' }),
                        h('br')
                    ]),
                    h('div', { class: 'add-friends'}, [
                        h('label', {}, ['Add Players:']),
                        h('br'),
                        h('input',  {
                            type: 'text',
                            class: 'search-box',
                            placeholder: 'Enter players...',
                            value: this.state.searchQuery,
                            on: { input: () => this.friends_list(event) }
                        }),
                        h('br'),
                        h('div',{}, this.state.friendsList.length > 0 ? 
                            [h('div', { class: 'list-of-friends'}, 
                                [h('ul', {}, this.state.friendsList.map(friend => 
                                    h('li', { }, [
                                        h('span', {
                                            on: { 
                                                click: () => {
                                                    this.updateState({
                                                        players     : [...this.state.players, friend],
                                                        friendsList : []
                                                     });
                                                }
                                            }                                            
                                        }, [friend.username]),
                                    ])
                                ))])
                            ] : []
                        ),
                        h('div', {}, this.state.players.length > 0 ? 
                            [
                                h('p', { class: 'selected-header' }, ['Selected Players:']),
                                h('div', { class: 'selected-players-container' }, 
                                    this.state.players.map((player) =>
                                        h('div', { class: 'player-card' },
                                            [
                                                h('h3', {}, [player.username]),
                                                h('i', {
                                                    class: 'fa-regular fa-circle-xmark',
                                                    on: {
                                                        click: () => {
                                                            const indexToRemove = this.state.players.findIndex(p => p.id === player.id);
                                                            if (indexToRemove !== -1) {
                                                                this.state.players.splice(indexToRemove, 1)
                                                            }
                                                            this.updateState({
                                                                players: this.state.players
                                                            });
                                                        }
                                                    }
                                                })
                                            ]
                                        )
                                    )
                                )
                            ] : []
                        )
                    ])
                ]),
                h('div', { class: 'game-visibility-options' }, [
                    h('label', { class: 'radio-option' }, [
                        h('input', { type: 'radio', name: 'visibility', checked: 'true' }),
                        h('span', {}, ['Public'])
                    ]),
                    h('label', { class: 'radio-option' }, [
                        h('input', { type: 'radio', name: 'visibility', value: 'private', checked: 'false' }),
                        h('span', {}, ['Private'])
                    ])
                ]),
                h('button', {}, ['Create'])
            ])
        ]);
    },
})
