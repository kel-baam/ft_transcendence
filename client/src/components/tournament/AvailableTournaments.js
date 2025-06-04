import { createApp, defineComponent, h } from '../../package/index.js';

export const AvailableTournaments = defineComponent({
    state() {
        return {
        };
    },

    render() {
        const { isloading } = this.props;
        return h('div', { class: 'availableTournament' }, [
            h('div', { class: 'title' }, [h('h1', {}, ['Available Tournaments'])]),
            h('div', { class: 'tournaments' },
                (this.props.tournaments !== undefined && this.props.tournaments.length > 0 && !isloading) 
                    ? this.props.tournaments.map((tournament) => {
                        const creator = tournament.participants.find(participant => participant.role === 'creator');
                        const avatar  = creator && creator.avatar 
                            ? `https://${window.env.IP}:3000${creator.avatar}` 
                            : './images/people_14024721.png';
    
                        return h('div', { class: 'available' }, [
                            h('img', { src: avatar }),
                            h('a', {}, [tournament.name]),
                            h('i', {
                                class: "fa-solid fa-circle-plus icon",
                                on: {
                                    click: () => {
                                        this.emit('join', tournament.id);
                                    }
                                }
                            })
                        ]);
                    })
                    : !isloading 
                        ? [h('p', {}, ['No tournaments created'])] 
                        : []
            )
        ]);
    }
    
});
