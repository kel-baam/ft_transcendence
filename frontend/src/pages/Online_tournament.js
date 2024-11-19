import createElement from "../framework/createElement.js";
import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";
import { diff, patch } from "../framework/diff.js";
import UserJoinedTournaments from "../components/user_joined_tournaments.js";
import { handleRouting } from "../framework/routing.js";
import { showErrorNotification } from "../components/alertNotification.js";
// import User_available_tournaments from "../components/user_available_tournaments.js"

class OnlineTournament {
    constructor(props) {
        this.props = props;
        this.render();
    }

    async fetchCsrfToken() {
        try {
            const response = await fetch('http://localhost:8000/tournament/api/csrf-token/');
            if (!response.ok) {
                throw new Error("Failed to fetch CSRF token.");
            }
            const data = await response.json();
            return data.csrfToken;
        } catch (error) {
            console.error("Error fetching CSRF token:", error);
            throw error;
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const formElement = event.target;
        const formData = new FormData(formElement);

        console.log("-------------> , ", formData)
        formData.append('user', 'niboukha');
        
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
                const errorText = await response.json();
                console.error("Error response:", errorText);
                showErrorNotification(errorText.message);
                this.highlightInvalidInput(formElement);
                throw new Error("An error occurred");
            }

            const successData = await response.json();
            console.log("Success:", successData);

        } catch (error) {
            console.log("Submission Error:", error.message);
        }
    };

    handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgElement = document.querySelector('.creator_avatar');
                imgElement.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    highlightInvalidInput(formElement) {
        const inputs = formElement.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.borderColor = '';
            input.style.backgroundColor = '';
            
            if (input.value === '') {
                input.style.borderColor = 'red';
                input.style.backgroundColor = '#ffe6e6';
                input.focus();
            }
        });
    }
    render() {
        const newVdom = createElement('div', { id: 'global' }, 
            createElement(Header, {}),
            createElement('div', { className: 'content' }, 
                createElement(Sidebar, {}),
                createElement('div', { className: 'online-tournament' },
                    createElement('div', {}, createElement(UserJoinedTournaments, {})),
                    createElement('div', {}, createElement('div', {})),
                    createElement('div', {}, this.renderCreateTournamentForm())
                ),
                createElement('div', { className: 'friends' })
            )
        );

        console.log("Rendering virtual DOM...");
        const container = document.body;
        const patches = diff(container.__vdom, newVdom, container);
        patch(document.body, patches);
        container.__vdom = newVdom;
    }

    renderCreateTournamentForm() {
        return createElement('div', { className: 'createTournament' },
            createElement('div', { className: 'title' },
                createElement('h1', {}, 'Create one')
            ),
            createElement('form', { onSubmit: this.handleSubmit },
                this.renderImageUploadSection(),
                this.renderTournamentInputFields(),
                this.renderVisibilityOptions(),
                createElement('button', {}, 'Create')
            )
        );
    }

    renderImageUploadSection() {
        return createElement('div', { className: 'image' },
            createElement('img', {
                src: './images/people_14024721.png',
                alt: 'avatar',
                className: 'creator_avatar'
            }),
            createElement('div', { 
                className: 'edit_icon', 
                onClick: () => document.getElementById('file-upload-1').click()
            },
                createElement('input', {
                    type: 'file',
                    id: 'file-upload-1',
                    name: 'creator_avatar',
                    accept: 'image/*',
                    onChange: this.handleImageChange
                }),
                createElement('i', { className: 'fas fa-edit icon' })
            )
        );
    }

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
    }

    renderTournamentInputFields() {
        return createElement('div', { className: 'createInput' },
            this.createInputField('Tournament name:', 'tournament_name', 'Enter Tournament name...'),
            this.createInputField('Nickname:', 'nickname', 'Enter Nickname...'),
            this.createInputField('Add Players:', 'Add Players', 'Enter Add Players...')
        );
    }

    createInputField(label, name, placeholder) {
        return createElement('div', {},
            createElement('label', {}, label),
            createElement('br'),
            createElement('input', { type: 'text', name, placeholder }),
            createElement('br')
        );
    }

    renderVisibilityOptions() {
        return createElement('div', { className: 'game-visibility-options' },
            this.renderRadioOption('visibility', 'public', true, 'Public'),
            this.renderRadioOption('visibility', 'private', false, 'Private')
        );
    }

    renderRadioOption(name, value, checked, label) {
        return createElement('label', { className: 'radio-option' },
            createElement('input', { type: 'radio', name, value, checked }),
            createElement('span', {}, label)
        );
    }
}

export default OnlineTournament;
