import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString}                          from '../../package/index.js'
import { showErrorNotification, highlightInvalidInput } from '../../pages/utils/errorNotification.js';
import { customFetch } from '../../package/fetch.js';


export const CreateTournament = defineComponent({
    state(){
        return {
            friendsList : [],
            players     : [],
        }
    },

    async submitForm(event){
        event.preventDefault();

        const formElement = event.target;
        const formData    = new FormData(formElement);
        
        formData.append('invited-players', JSON.stringify(this.state.players));

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const response = await customFetch("http://localhost:3000/tournament/api/online/tournaments/", {
                method      : 'POST',
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
            
            const data = await response.json();

            console.log("Tournament created:", data.message);

            formElement.reset();

            this.resetImagePreviews();
            this.updateState ({ players: [] })

        } catch (error) {
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
            const searchQuery   = event.target.value;
            const playersLength = this.state.players.length;
            
            const response      = await customFetch(`http://localhost:3000/tournament/api/online/tournaments/friends-list?search=${encodeURIComponent(searchQuery)}&playersLength=${playersLength}`,
            {
                method      : 'GET',
                credentials : 'include',
            });
    
            if (!response.ok) {
                const errorText = await response.json();

                if(errorText = 401)
                    this.appContext.router.navigateTo('/login')

                console.error("Error response:", errorText.error);
                
                throw new Error(errorText.error);
            }
    
            const friendsList = await response.json();

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
                            type    : 'file',
                            id      : 'file-upload',
                            name    : 'creator_Avatar',
                            accept  : 'image/*',
                            on      : { change: (event) => {
                                const file = event.target.files[0];
                                if (file) {
                                    
                                    const reader  = new FileReader();
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
                        h('input', { type: 'radio', name: 'visibility', value: 'public', checked: 'true'}),
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
