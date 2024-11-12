import createElement from "../framework/createElement.js";
import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";
import { diff, patch } from "../framework/diff.js";
import { handleRouting } from "../framework/routing.js";
import User_joined_tournaments from "../components/user_joined_tournaments.js";

class Online_tournament {
    constructor(props) {
        this.props = props;
        this.render();
    }

    async fetchCsrfToken() {
        const response = await fetch('https://petrifying-hex-vw4x4vg966g3695j-8000.app.github.dev/tournament/api/csrf-token/');
        const data = await response.json();
        return data.csrfToken;
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const formElement = document.querySelector('form');
        const formData = new FormData(formElement);

        console.log("formData : ", formData);
        // const dataFormData = new FormData();

        formData.append('user', 'niboukha');
        formData.append('player[0][name]', 'shicham');
        formData.append('player[1][name]', 'kaoutar');
        formData.append('player[2][name]', 'karima');
        
        // dataFormData.append('tournament_type', formData.get('visibility'));
        // console.log(dataFormData)
        try {
            const csrfToken = await this.fetchCsrfToken();

            const response = await fetch("https://petrifying-hex-vw4x4vg966g3695j-8000.app.github.dev/tournament/api/online-tournament/", {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                body: formData,
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error("An error occurred");
            }

            const successData = await response.json();
            console.log(successData);
        } catch (error) {
            console.log("Error:", error.message);
        }
        

    };

    render() {
        const newVdom = createElement('div', {id: 'global'}, createElement(Header, {}), 
        createElement('div', {className: 'content'}, 
            createElement(Sidebar, {}),createElement('div', { className: 'online-tournament' },
                createElement('div', { className: 'availableTournament' },
                    createElement('div', { className: 'title' },
                        createElement('h1', {}, 'Available tournaments')
                    ),
                    createElement('div', { className: 'tournaments' },
                            createElement('div', { className: 'available' },
                                createElement('img', { src: './images/niboukha.png' }),
                                createElement('a', { href: '#' }, 'Victory Arena'),
                                createElement('i', { className: 'fa-solid fa-user-plus icon' })
                            ))
                ),
                createElement(User_joined_tournaments, {}),
                createElement('div', { className: 'createTournament' },
                    createElement('div', { className: 'title' },
                        createElement('h1', {}, 'Create one')
                    ),
                    createElement('form', { onSubmit: this.handleSubmit },
                        createElement('div', { className: 'image' },
                            createElement('img', {
                                src: './images/niboukha.png',
                                alt: 'avatar',
                                className: 'creator_avatar'
                            }),
                            createElement('div', { className: 'edit_icon', onClick: () => document.getElementById('file-upload-1').click()},
                                createElement('input', {
                                type: 'file',
                                id: 'file-upload-1',
                                name: 'creator_avatar',
                                accept: 'image/*',
                                onChange: (event) => {
                                    const file = event.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                            const imgElement = document.querySelector('.creator_avatar');
                                            imgElement.src = e.target.result;
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }
                            }),
                            createElement('i', { className: 'fas fa-edit icon' })
                        )),
                        createElement('div', { className: 'createInput' },
                            createElement('label', {}, 'Tournament name:'),createElement('br'),
                            createElement('input', { type: 'text', name: 'tournament_name', placeholder: 'Enter Tournament name...' }),createElement('br'),
                            createElement('label', {}, 'Nickname:'),createElement('br'),
                            createElement('input', { type: 'text', name: 'nickname', placeholder: 'Enter Nickname...' }),createElement('br'),
                            createElement('label', {}, 'Add Players:'),createElement('br'),
                            createElement('input', { type: 'text', name: 'Add Players', placeholder: 'Enter Add Players...' }),createElement('br')
                        ),
                        createElement('div', { className: 'game-visibility-options' },
                            createElement('label', { className: 'radio-option' },
                                createElement('input', { type: 'radio', name: 'visibility', value: 'public', checked: true }),
                                createElement('span', {}, 'Public')
                            ),
                            createElement('label', { className: 'radio-option' },
                                createElement('input', { type: 'radio', name: 'visibility', value: 'private' }),
                                createElement('span', {}, 'Private')
                            )
                        ),
                        createElement('button', {}, 'Create')
                    )
                )
            ), createElement('div', {className: 'friends'})
        ));
        console.log("----------------------------------")
        const container = document.body;
        const patches = diff(container.__vdom, newVdom, container);
        patch(document.body, patches);
        container.__vdom = newVdom;
    }
}

export default Online_tournament;