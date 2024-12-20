import { createApp, defineComponent, h } from '../../package/index.js';

export const AvailableTournaments = defineComponent({
    state() {
        return {
        };
    },

    // async fetchcsrftoken() {
    //     const response = await fetch('http://localhost:8000/online/api/csrf-token/');
    //     const data = await response.json();
    //     return data.csrftoken;
    // },

    // async joinTournament(id)
    // {
    //     console.log("id ----> ", id)

    //     try {
    //         const csrftoken = await this.fetchcsrftoken();

    //         const response = await fetch(`http://localhost:8000/online/api/tournaments/join/${id}/`, {
    //             method      : 'POST',
    //             headers     : {
    //                 'X-CSRFToken' : csrftoken,
    //                 'Content-Type': 'application/json' 
    //             },
    //             credentials : 'include'
    //         });

    //         if (response.ok) {
    //             console.log('jOIN successfully!');
    //             this.emit("backToParent")
    //         } else {
    //             console.error('Failed to join tournament');
    //         }
    //     } catch (error) {
    //         console.log('Error while joining tournament:', error);
    //     }
    // },

  render() {
      return h('div', { class: 'availableTournament' }, [
          h('div', { class: 'title' }, [h('h1', {}, ['Available Tournaments'])]),
          h('div', { class: 'tournaments' },
              (this.props.tournaments !== undefined || this.props.tournaments > 0 ) ? this.props.tournaments.map((tournament) =>
                  h('div', { class: 'available' }, [
                      h('img', { src: './images/ping-pong-equipment-.png', alt: 'Ping Pong Equipment' }),
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
