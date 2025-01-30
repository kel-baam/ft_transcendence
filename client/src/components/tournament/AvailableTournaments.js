import { createApp, defineComponent, h } from '../../package/index.js';

export const AvailableTournaments = defineComponent({
    state() {
        return {
        };
    },

  render() {
      return h('div', { class: 'availableTournament' }, [
          h('div', { class: 'title' }, [h('h1', {}, ['Available Tournaments'])]),
          h('div', { class: 'tournaments' },
                (this.props.tournaments !== undefined && this.props.tournaments.length > 0) ? this.props.tournaments.map((tournament) =>
                  h('div', { class: 'available' }, [
                      h('img', { src:  `http://10.14.3.3:8002${tournament.participants.find(participant => participant.role === 'creator').avatar}`}),
                      h('a', {}, [tournament.name]),
                      h('i', {
                        class: "fa-solid fa-circle-plus icon",
                        on : {
                            click : () => {
                                this.emit('join', tournament.id)
                            }
                        }
                    })
                  ])
              ) : [h('p', {}, ['No tournaments created'])]
          )
      ]);
  }
});
