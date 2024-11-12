import createElement from "../framework/createElement.js";
import Header from "../components/header.js";
import Sidebar from "../components/sidebar.js";
import { diff, patch } from "../framework/diff.js";
import { handleRouting } from "../framework/routing.js";

class Local_tournament_form {
    constructor(props) {
        this.props = props;
        this.render();
    }

    async fetchCsrfToken() {
        const response = await fetch('https://petrifying-hex-vw4x4vg966g3695j-8000.app.github.dev/tournament/api/csrf-token/');
        const data = await response.json();
        return data.csrfToken;
    }

    handleButtonClick = () => {
        const path = '/hierarchy'
        handleRouting(path);
        window.history.pushState(null, '', path);
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const formElement = document.querySelector('form');
        const formData = new FormData(formElement);

        const dataFormData = new FormData();

        dataFormData.append('tournament_name', formData.get('tournament_name'));
        for (let i = 1; i <= 4; i++) {
            const playerName = formData.get(`player${i}`);
            const playerImage = formData.get(`player${i}_image`);

            if (playerName) {
                dataFormData.append(`players[${i - 1}][name]`, playerName);
                dataFormData.append(`players[${i - 1}][image]`, playerImage);
            }
        }

        try {
            const csrfToken = await this.fetchCsrfToken();

            const response = await fetch("https://petrifying-hex-vw4x4vg966g3695j-8000.app.github.dev/tournament/api/local-tournament/", {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                body: dataFormData,
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error("An error occurred");
            }

            const successData = await response.json();
            console.log(successData);
            localStorage.setItem("tournamentData", JSON.stringify({
                tournament_id: successData.tournament_id,
                matches: successData.matches
            }));
            this.handleButtonClick();
        } catch (error) {
            console.log("Error:", error.message);
        }
        
    };

    render() {
        const newVdom = createElement('div', { id: 'global' }, 
            createElement(Header, {}), 
            createElement('div', { className: 'content' }, 
                createElement(Sidebar, {}), 
                createElement('div', { className: 'tournament-form' },
                    createElement('div', { className: 'game-title' },
                        createElement('h1', {}, "Create Your Local Ping Pong Tournament")
                    ),
                    createElement('form', { onSubmit: this.handleSubmit },
                        createElement('div', { className: 'form' },
                            createElement('div', { className: 'tournament-name' },
                                createElement('label', { htmlFor: 'fname' }, 'Tournament Name:'),
                                createElement('input', { type: 'text', name: 'tournament_name', placeholder: "Enter tournament name..."})
                            ),
                            createElement('div', { className: 'players-name' },
                                createElement('label', { htmlFor: 'players' }, 'Player Names:'),
                                createElement('div', { className: 'players' },
                                    createElement('div', { className: 'line1' },
                                        createElement('input', { type: 'text', name: 'player1', className: 'player1', placeholder: "Enter player name..."}),
                                        createElement('div', { className: 'image' },
                                            createElement('img', {
                                                src: './images/girlplay-removebg-preview.png',
                                                alt: 'Player 1 Image',
                                                className: 'player1-image'
                                            }),
                                            createElement('div', { className: 'edit_icon', onClick: () => document.getElementById('file-upload-1').click()},
                                                createElement('input', {
                                                type: 'file',
                                                id: 'file-upload-1',
                                                name: 'player1_image',
                                                accept: 'image/*',
                                                onChange: (event) => {
                                                    const file = event.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (e) => {
                                                            const imgElement = document.querySelector('.player1-image');
                                                            imgElement.src = e.target.result;
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }
                                            }),
                                            createElement('i', { className: 'fas fa-edit' })
                                        )                                                                                                                 
                                        )
                                    ),                                                                  
                                    createElement('div', { className: 'line2' },
                                        createElement('input', { type: 'text', name: 'player2', className: 'player2', placeholder: "Enter player name..." }),
                                        createElement('div', { className: 'image' },
                                            createElement('img', {
                                                src: './images/girlplay-removebg-preview.png',
                                                alt: 'Player 2 Image',
                                                className: 'player2-image'
                                            }),
                                            createElement('div', { className: 'edit_icon', onClick: () => document.getElementById('file-upload-2').click()},
                                                createElement('input', {
                                                type: 'file',
                                                id: 'file-upload-2',
                                                name: 'player2_image',
                                                accept: 'image/*',
                                                onChange: (event) => {
                                                    const file = event.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (e) => {
                                                            const imgElement = document.querySelector('.player2-image');
                                                            imgElement.src = e.target.result;
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }
                                            }),
                                            createElement('i', { className: 'fas fa-edit' }))    
                                        )
                                    ),
                                    createElement('div', { className: 'line3' },
                                        createElement('input', { type: 'text', name: 'player3', className: 'player3', placeholder: "Enter player name..." }),
                                        createElement('div', { className: 'image' },
                                            createElement('img', {
                                                src: './images/girlplay-removebg-preview.png',
                                                alt: 'Player 3 Image',
                                                className: 'player3-image'
                                            }),
                                            createElement('div', { className: 'edit_icon', onClick: () => document.getElementById('file-upload-3').click()},
                                                createElement('input', {
                                                type: 'file',
                                                id: 'file-upload-3',
                                                name: 'player3_image',
                                                accept: 'image/*',
                                                onChange: (event) => {
                                                    const file = event.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (e) => {
                                                            const imgElement = document.querySelector('.player3-image');
                                                            imgElement.src = e.target.result;
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }
                                            }),
                                            createElement('i', { className: 'fas fa-edit' }))    
                                        )
                                    ),
                                    createElement('div', { className: 'line4' },
                                        createElement('input', { type: 'text', name: 'player4', className: 'player4', placeholder: "Enter player name..."}),
                                        createElement('div', { className: 'image' },
                                            createElement('img', {
                                                src: './images/girlplay-removebg-preview.png',
                                                alt: 'Player 4 Image',
                                                className: 'player4-image'
                                            }),
                                            createElement('div', { className: 'edit_icon', onClick: () => document.getElementById('file-upload-4').click()},
                                                createElement('input', {
                                                type: 'file',
                                                id: 'file-upload-4',
                                                name: 'player4_image',
                                                accept: 'image/*',
                                                onChange: (event) => {
                                                    const file = event.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (e) => {
                                                            const imgElement = document.querySelector('.player4-image');
                                                            imgElement.src = e.target.result;
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }
                                            }),
                                            createElement('i', { className: 'fas fa-edit' }))    
                                        )
                                    )
                                )
                            )
                        ),
                        createElement('div', { className: 'submit' },
                            createElement('a', { href: '/hierarchy' },
                                createElement('button', { type: 'submit', id: 'submitbtn', disabled: false }, 'SUBMIT')
                            )
                        )
                    ),
                    createElement('div', { className: 'friends' })
                )
            )
        );

        const container = document.body;
        const patches = diff(container.__vdom, newVdom, container);
        patch(document.body, patches);
        container.__vdom = newVdom;
    }
}

export default Local_tournament_form;