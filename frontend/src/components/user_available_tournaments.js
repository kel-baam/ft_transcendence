import createElement from "../framework/createElement.js";

class User_available_tournaments {
    constructor(props) {
        this.props = props;
        this.state = {
            tournaments: [],
            creators: {}
        };

        this.socket = null;
        this.connectWebSocket();
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    connectWebSocket() {
        this.socket = new WebSocket('wss://petrifying-hex-vw4x4vg966g3695j-8000.app.github.dev/ws/tournaments/');
        console.log("available -> WebSocket connected");

        this.socket.onopen = (event) => {
            console.log("WebSocket is open now.");
    
            this.socket.send(JSON.stringify({
                action: 'get_joined_tournaments',
            }));
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("available -> data -----> : ", data);

            if (data && Array.isArray(data.available_tournaments))
            {
                console.log('available -> data.available_tournaments ---> ', data.available_tournaments);

                this.setState({
                    tournaments: data.available_tournaments,
                });
            }
            else 
            {
                console.log('available -> No valid tournaments data found');
            }
        };

        this.socket.onerror = (error) => { console.error("available -> WebSocket error:", error); };
        this.socket.onclose = () => { console.log("available -> WebSocket connection closed"); };
    }

    render() {
        const { tournaments } = this.state;

        const availableTournamentList = tournaments ? tournaments.map(tournament => {
            return createElement('div', { className: 'available' },
                createElement('img', { src: creatorImage, alt: tournament.tournament_name }),
                createElement('a', { href: '#' }, tournament.tournament_name),
                createElement('i', { className: 'fa-solid fa-user-plus icon' })
            );
        }) : [];

        console.log("Tournament List:", availableTournamentList);

        const virtualDom = createElement('div', { className: 'availableTournament' },
            createElement('div', { className: 'title' },
                createElement('h1', {}, 'Available tournaments')),
            createElement('div', { className: 'tournaments' }, ...availableTournamentList)
        );

        console.log("available -> -----> ", virtualDom);

        return virtualDom;
    }
}

export default User_available_tournaments;

