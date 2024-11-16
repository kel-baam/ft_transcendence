// import createElement from "../framework/createElement.js";

// class User_joined_tournaments {
//     constructor(props) {
//         this.props = props;
//         this.state = {
//             tournaments: [],
//             creators: {}
//         };

//         this.socket = null;
//         this.connectWebSocket();
//     }

//     setState(newState) {
//         this.state = { ...this.state, ...newState };
//         this.render();
//     }

// connectWebSocket() {
//     this.socket = new WebSocket('wss://petrifying-hex-vw4x4vg966g3695j-8000.app.github.dev/ws/tournaments/');
//     console.log("WebSocket connected");

//     this.socket.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         console.log("data -----> : ", data);

//         if (data && Array.isArray(data.joined_tournaments))
//         {
//             console.log('data.joined_tournaments ---> ', data.joined_tournaments);

//             this.setState({
//                 tournaments: data.joined_tournaments,
//             });
//         }
//         else 
//         {
//             console.log('No valid tournaments data found');
//         }
//     };

//     this.socket.onerror = (error) => { console.error("WebSocket error:", error); };
//     this.socket.onclose = () => { console.log("WebSocket connection closed"); };
// }

//     render() {
//         const { tournaments, creators } = this.state;

//         const joinedTournamentList = tournaments && creators ? tournaments.map(tournament => {
//             const creator = creators[tournament.creator_id];
//             const creatorImage = creator ? creator.image : 'default-image.jpg';
        
//             return createElement('div', { className: 'available' },
//                 createElement('img', { src: creatorImage, alt: tournament.tournament_name }),
//                 createElement('a', { href: '#' }, tournament.tournament_name)
//             );
//         }) : [];

//         console.log("Tournament List:", joinedTournamentList);

//         const virtualDom = createElement('div', { className: 'joinedTournament' },
//             createElement('div', { className: 'title' },
//                 createElement('h1', {}, 'Joined Tournaments')),
//             createElement('div', { className: 'tournaments' }, ...joinedTournamentList)
//         );

//         console.log("-----> ", virtualDom);

//         return virtualDom;
//     }
// }

// export default User_joined_tournaments;


import createElement from "../framework/createElement.js";
import Header from "./header.js";
import Sidebar from "./sidebar.js";
import { diff, patch } from "../framework/diff.js";
import { handleRouting } from "../framework/routing.js";
import { showErrorNotification } from "./alertNotification.js";
import { playerForm } from "./playerForm.js";

class UserJoinedTournaments
{
    constructor(props)
    {
        this.props = props;
        this.state = {
            joined_tournaments: [],
            available_tournaments: [],
            isModalVisible:false,
        };

        this.socket = null;
        this.connectWebSocket();
    }

    setState(newState)
    {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    async fetchCsrfToken()
    {
        const response = await fetch('https://petrifying-hex-vw4x4vg966g3695j-8000.app.github.dev/tournament/api/csrf-token/');
        const data = await response.json();
        return data.csrfToken;
    }

    handleSubmit = async (event) =>
    {
        event.preventDefault();

        const formElement = document.querySelector('form');
        const formData = new FormData(formElement);

        console.log("formData : ", formData);

        formData.append('user', 'niboukha');
        formData.append('player[0][name]', 'shicham');
        formData.append('player[1][name]', 'kaoutar');
        formData.append('player[2][name]', 'karima');

        try {
            const csrfToken = await this.fetchCsrfToken();

            const response = await fetch("https://petrifying-hex-vw4x4vg966g3695j-8000.app.github.dev/tournament/api/online-tournament/", {
                method: 'POST',
                headers: { 'X-CSRFToken': csrfToken, },
                body: formData,
            });

            if (!response.ok)
            {
                const errorText = await response.json();

                console.error("Error response:", errorText);

                showErrorNotification(errorText.message);
                this.highlightInvalidInput(formElement);
                throw new Error("An error occurred");
            }

            const successData = await response.json();
            console.log(successData);
        }
        catch (error){ console.log("Error:", error.message); }
    }

    highlightInvalidInput(formElement)
    {
        const inputs = formElement.querySelectorAll('input, select, textarea');
        inputs.forEach(input =>
        {
            input.style.borderColor = '';
            input.style.backgroundColor = '';
            
            if (input.value === '')
            {
                input.style.borderColor = 'red';
                input.style.backgroundColor = '#ffe6e6';
                input.focus();
            }
        });
    }

    connectWebSocket()
    {
        this.socket = new WebSocket('wss://petrifying-hex-vw4x4vg966g3695j-8000.app.github.dev/ws/tournaments/');

        console.log("joined_tournaments WebSocket connected");

        this.socket.onmessage = (event) =>
        {
            const data = JSON.parse(event.data);

            console.log("Received data:", data);

            if (data && Array.isArray(data.joined_tournaments))
            {
                console.log('Received tournaments data:', data.joined_tournaments);

                this.setState(
                {
                    joined_tournaments: data.joined_tournaments,
                    available_tournaments: data.available_tournaments,
                });
            }
            else { console.log('No valid tournaments data found'); }
        };
        this.socket.onerror = (error) => { console.error("WebSocket error:", error); };
        this.socket.onclose = () => { console.log("WebSocket connection closed"); };
    }

    handleIconClick = (tournament, type) =>
    {
        if (type == 'leave')
        {
            const ws = new WebSocket("wss://petrifying-hex-vw4x4vg966g3695j-8000.app.github.dev/ws/tournaments/");
            console.log(type)
            ws.onopen = () => {
                console.log("click WebSocket connection opened");
                ws.send(JSON.stringify({
                    action: type,
                    tournamentId: tournament.id,
                    // userId: this.state.userId,
                }));
            };
        
            ws.onmessage = (event) =>
            {
                const data = JSON.parse(event.data);
                console.log("Received WebSocket message: ", data.message);
                console.log("--------- : ", tournament)
                if (data.message === "You have left the tournament" || data.message === "Tournament deleted successfully")
                {
                    alert(data.message);
                    console.log("data.message --------------> ", data.message)
                    this.setState
                    ({
                        joined_tournaments: this.state.joined_tournaments.filter(t => t.id !== tournament.id),
                    });
                }
                else { console.log('There was a problem with the tournament action'); }
            };
        
            ws.onerror = (error) => { console.error('WebSocket error: ', error); };
        
            ws.onclose = () => { console.log('WebSocket connection closed'); };
        }
        else if (type == 'join')
        {
            this.setState({
                isModalVisible: true
            })

            const a = playerForm();
            // this.setState({
            //     isModalVisible: false
            // })

            console.log("heeeee ----> ", a);
        }
        
    };

    render()
    {
        const { joined_tournaments, available_tournaments, isModalVisible } = this.state;
        const renderTournamentList = (tournaments, type) => {
            return tournaments ? tournaments.map(tournament => {
                return createElement('div', { className: 'available' },
                    createElement('img', { src: `https://petrifying-hex-vw4x4vg966g3695j-8000.app.github.dev${tournament.creator_image}` }),
                    createElement('a', { href: '#' }, tournament.name),
                    createElement('i', { 
                        className: type === 'leave' ? 'fa-regular fa-circle-xmark icon' : 'fa-solid fa-user-plus icon', 
                        onClick: () => this.handleIconClick(tournament, type)
                    })
                );
            }) : [];
        };

        const joinedTournamentList = renderTournamentList(joined_tournaments, 'leave');
        const availableTournamentList = renderTournamentList(available_tournaments, 'join');

        console.log(isModalVisible);
        const newVdom = createElement('div', { id: 'global' },
            createElement(Header, {}),
            createElement('div', { className: 'content' },
                createElement(Sidebar, {}),
                createElement('div', { className: isModalVisible ? 'online-tournament blur' : 'online-tournament' },
                    createElement('div', {},
                        createElement('div', { className: 'availableTournament' },
                            createElement('div', { className: 'title' },
                                createElement('h1', {}, 'Available Tournaments')),
                            createElement('div', { className: 'tournaments' }, ...availableTournamentList)
                        )
                    ),
                    createElement('div', { className: 'joinedTournament' },
                        createElement('div', { className: 'title' },
                            createElement('h1', {}, 'Joined Tournaments')),
                        createElement('div', { className: 'tournaments' }, ...joinedTournamentList)
                    ),
                    createElement('div', { className: 'createTournament' },
                        createElement('div', { className: 'title' },
                            createElement('h1', {}, 'Create one')
                        ),
                        createElement('form', { onSubmit: this.handleSubmit },
                            createElement('div', { className: 'image' },
                                createElement('img', {
                                    src: './images/people_14024721.png',
                                    alt: 'avatar',
                                    className: 'creator_avatar'
                                }),
                                createElement('div', { className: 'edit_icon', onClick: () => document.getElementById('file-upload-1').click() },
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
                                )
                            ),
                            createElement('div', { className: 'createInput' },
                                createElement('label', {}, 'Tournament name:'), createElement('br'),
                                createElement('input', { type: 'text', name: 'tournament_name', placeholder: 'Enter Tournament name...' }), createElement('br'),
                                createElement('label', {}, 'Nickname:'), createElement('br'),
                                createElement('input', { type: 'text', name: 'nickname', placeholder: 'Enter Nickname...' }), createElement('br'),
                                createElement('label', {}, 'Add Players:'), createElement('br'),
                                createElement('input', { type: 'text', name: 'Add Players', placeholder: 'Enter Add Players...' }), createElement('br')
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
                ),
                createElement('div', { className: 'friends' })
            ),
        );
        const container = document.body;
        const patches = diff(container.__vdom, newVdom, container);
        patch(document.body, patches);
        container.__vdom = newVdom;
    }
}

export default UserJoinedTournaments;
