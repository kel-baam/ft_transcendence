import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'

export const JoinedTournaments = defineComponent({
    state() {
        return {
        };
    },

    async fetchcsrftoken() {
        const response = await fetch('http://localhost:8000/online/api/csrf-token/');
        const data = await response.json();
        return data.csrftoken;
    },

    async deleteTournament(id)
    {
        console.log("id ----> ", id)

        try {
            const csrftoken = await this.fetchcsrftoken();

            const response = await fetch(`http://localhost:8000/online/api/tournaments/`, {
                method              : 'DELETE',
                body                : JSON.stringify({
                    tournamentId    : id
                }),
                headers             : {
                    'X-CSRFToken'   : csrftoken,
                    'Content-Type'  : 'application/json' 
                },
                credentials         : 'include'
            });

            if (response.ok) {
                console.log('Tournament deleted successfully!');
                this.emit("backToParent")
                // this.updateState({
                    // this.props.tournaments= this.props.tournaments.filter(tournament => tournament.id !== id)
                // });
            } else {
                console.error('Failed to delete tournament');
            }
        } catch (error) {
            console.log('Error while deleting tournament:', error);
        }
    },

    render() {
        return h('div', { class: 'joinedTournament' }, [
            h('div', { class: 'title' }, [h('h1', {}, ['Joined Tournaments'])]),
            h('div', { class: 'tournaments' },
                (this.props.tournaments !== undefined || this.props.tournaments > 0) ? this.props.tournaments.map((tournament) =>
                    h('div', { class: 'available' }, [
                        h('img', { src: `http://localhost:8000${tournament.participants.find(participant => participant.role === 'creator').avatar}` }),
                        h('a', {}, [tournament.name]),
                        h('i', {
                            class: "fa-regular fa-circle-xmark icon", 
                            style: { color:'#D44444' },
                            on : {
                                click : () => this.deleteTournament(tournament.id)
                            }
                        })
                    ])
                ) : [h('p', {}, ['No joined tournaments'])]
            )
        ]);
    }
});
