import createElement from "../framework/createElement.js";

class User_joined_tournaments {
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
        console.log("WebSocket connected");

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("data -----> : ", data);

            if (data && Array.isArray(data.joined_tournaments)) {
                console.log('data.joined_tournaments ---> ', data.joined_tournaments);
                
                const creators = {};
                data.joined_tournaments.forEach(tournament => {
                    const creator = tournament.creator_id;
                    creators[creator] = { image: 'creator_image_url_here' };
                });

                this.setState({
                    tournaments: data.joined_tournaments,
                    creators: creators
                });
            } else {
                console.log('No valid tournaments data found');
            }
        };

        this.socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        this.socket.onclose = () => {
            console.log("WebSocket connection closed");
        };
    }

    render() {
        const { tournaments, creators } = this.state;

        const tournamentList = tournaments && creators ? tournaments.map(tournament => {
            const creator = creators[tournament.creator_id];
            const creatorImage = creator ? creator.image : 'default-image.jpg';
        
            return createElement('div', { className: 'available' },
                createElement('img', { src: creatorImage, alt: tournament.tournament_name }),
                createElement('a', { href: '#' }, tournament.tournament_name)
            );
        }) : [];

        console.log("Tournament List:", tournamentList);

        const virtualDom = createElement('div', { className: 'joinedTournament' },
            createElement('div', { className: 'title' },
                createElement('h1', {}, 'Joined Tournaments')),
            createElement('div', { className: 'tournaments' }, ...tournamentList)
        );

        console.log("-----> ", virtualDom);

        return virtualDom;
    }
}

export default User_joined_tournaments;