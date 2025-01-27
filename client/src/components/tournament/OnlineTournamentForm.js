import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'

export const OnlineTournamentForm = defineComponent({
    state(){
        return {
           
        }
    },

    render()
    {
        return h('div', { class: 'createTournament' }, [
            h('div', { class: 'title' }, [
                h('h1', {}, ['Create one'])
            ]),
            h('form', {  }, [
                h('div', { class: 'image' }, [
                    h('img', {
                        src: './images/people_14024721.png',
                        alt: 'avatar',
                        class: 'creator_avatar'
                    }),
                    h('div', { 
                        class: 'edit_icon', 
                        onClick: () => document.getElementById('file-upload-1').click()
                    }, [
                        h('input', {
                            type: 'file',
                            id: 'file-upload-1',
                            name: 'creator_avatar',
                            accept: 'image/*',
                            // onChange: this.handleImageChange
                        }),
                        h('i', { class: 'fas fa-edit icon' })
                    ])
                ]),

                h('div', { class: 'createInput' }, [
                    h('div', {}, [
                        h('label', {}, ['Tournament name:']),
                        h('br'),
                        h('input', { type: 'text', name: 'tournament_name', placeholder: 'Enter Tournament name...' }),
                        h('br')
                    ]),
                    h('div', {}, [
                        h('label', {}, ['Nickname:']),
                        h('br'),
                        h('input', { type: 'text', name: 'nickname', placeholder: 'Enter Nickname...' }),
                        h('br')
                    ]),
                    h('div', {}, [
                        h('label', {}, ['Add Players:']),
                        h('br'),
                        h('input', { type: 'text', name: 'Add Players', placeholder: 'Enter Add Players...' }),
                        h('br')
                    ])
                ]),
                h('div', { class: 'game-visibility-options' }, [
                    h('label', { class: 'radio-option' }, [
                        h('input', { type: 'radio', name: 'visibility', value: 'public', checked: 'true' }),
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

    handleImageChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgElement = document.querySelector('.creator_avatar');
                imgElement.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    },
})


// handleSubmit = async (event) => {
//     event.preventDefault();

//     const formElement = document.querySelector('form');
//     const formData = new FormData(formElement);

//     const dataFormData = new FormData();

//     dataFormData.append('tournament_name', formData.get('tournament_name'));
//     for (let i = 1; i <= 4; i++) {
//         const playerName = formData.get(`player${i}`);
//         const playerImage = formData.get(`player${i}_image`);

//         if (playerName) {
//             dataFormData.append(`players[${i - 1}][name]`, playerName);
//             dataFormData.append(`players[${i - 1}][image]`, playerImage);
//         }
//     }

//     try
//     {
//         const csrfToken = await this.fetchCsrfToken();

//         const response = await fetch("http://localhost:8000/tournament/api/local-tournament/", {
//             method: 'POST',
//             headers: { 'X-CSRFToken': csrfToken, },
//             body: dataFormData,
//         });
        
//         if (!response.ok) {
//             const errorText = await response.json();
//             console.error("Error response:", errorText.error);
//             throw new Error(errorText.error);
//         }

//         const successData = await response.json();

//         console.log(successData);

//         localStorage.setItem("tournamentData", JSON.stringify({
//             tournament_id: successData.tournament_id,
//             matches: successData.matches
//         }));
//         this.handleButtonClick();
//     }
//     catch (error)
//     {
//         showErrorNotification(error);
//         console.log(error);
//     }
    
// };

