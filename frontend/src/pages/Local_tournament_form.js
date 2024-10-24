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
        const response = await fetch('https://urban-winner-6w6j6grq5jgh4rxv-8000.app.github.dev/api/csrf-token/');
        const data = await response.json();
        return data.csrfToken;
    }

    // validateForm() {
    //     const form = document.querySelector('.tournament-form form');
    //     const inputs = form.querySelectorAll('input');
    //     let isValid = true;

    //     inputs.forEach(input => {
    //         if (!input.value.trim()) {
    //             isValid = false;
    //         }
    //     });

    //     return isValid;
    // }

    // async checkServerValidation(input) {
    //     const response = await fetch('http://localhost:8000/api/validate-input?value=${input.value}');
    //     const data = await response.json();
    //     return data.isValid;
    // }

    // handleButtonClick = () => {
        // const link = event.target.closest('a');
        
        // if (link) {
        //     event.preventDefault();
        //     const path = link.getAttribute('href');
        //     handleRouting(path);
        //     window.history.pushState(null, '', path);
        // }
    // }

    handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            tournament_name: event.target.tournament_name.value,
            players: [
                event.target.player1.value,
                event.target.player2.value,
                event.target.player3.value,
                event.target.player4.value,
            ],
        };
        console.log("-----> enter in handle submit");
        const submitBtn = event.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;

        try {
            const csrfToken = await this.fetchCsrfToken();
        
            const response = await fetch("https://urban-winner-6w6j6grq5jgh4rxv-8000.app.github.dev/api/local-tournament/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify(formData),
            });

            console.log("Response status:", response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error("An error occurred");
            }
            const successData = await response.json();
            console.log(successData.message);
        } catch (error) {
            console.log("Error:", error.message);
        } finally {
            submitBtn.disabled = false;
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
                    createElement('div', { className: 'form' },
                        createElement('form', {
                            onSubmit: this.handleSubmit
                        }, 
                            createElement('div', { className: 'tournament-name' },
                                createElement('label', { htmlFor: 'fname' }, 'Tournament Name:'),
                                createElement('input', { type: 'text', id: 'fname', name: 'tournament_name', value: 'tournament' })
                            ),
                            createElement('div', { className: 'players-name' },
                                createElement('label', { htmlFor: 'players' }, 'Player Names:'),
                                createElement('input', { type: 'text', name: 'player1', value: 'player1', className: 'player1' }),
                                createElement('input', { type: 'text', name: 'player2', value: 'player2', className: 'player2' }),
                                createElement('input', { type: 'text', name: 'player3', value: 'player3', className: 'player3' }),
                                createElement('input', { type: 'text', name: 'player4', value: 'player4', className: 'player4' })
                            ),
                            createElement('div', { className: 'submit' },
                                // createElement('a', { href: '/hierarchy'},
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

        // Enable real-time input validation
        // this.setupInputValidation();
    }

    // setupInputValidation() {
    //     const inputs = document.querySelectorAll('.tournament-form input[type="text"]');
    //     inputs.forEach(input => {
    //         input.addEventListener('input', () => {
    //             const isValid = this.validateForm();
    //             const submitBtn = document.querySelector('button[type="submit"]');
    //             submitBtn.disabled = !isValid; // Enable/disable based on validation
    //         });

    //         // Optional server-side validation on blur
    //         input.addEventListener('blur', async () => {
    //             const isValid = await this.checkServerValidation(input);
    //             const submitBtn = document.querySelector('button[type="submit"]');
    //             if (!isValid) {
    //                 console.log('${input.name} is not valid!');
    //                 submitBtn.disabled = true; // Disable if invalid
    //             } else {
    //                 const isFormValid = this.validateForm();
    //                 submitBtn.disabled = !isFormValid; // Re-validate the form
    //             }
    //         });
    //     });
    // }
}

export default Local_tournament_form;