import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'
import { showErrorNotification, highlightInvalidInput } from '../../pages/utils/errorNotification.js';
import { customFetch } from '../../package/fetch.js';


export const JoinedTournaments = defineComponent({
    state() {
        return {
        };
    },

    async startTournament(id)
    {
        try
        {
            const response  = await customFetch(`https://${window.env.IP}:3000/api/tournament/online/tournaments/?tournamentId=${id}`, {
                method    : 'GET',
                headers   : { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorText = await response.json();

                if(response.status === 401)
                    this.appContext.router.navigateTo('/login')
                
                throw new Error(errorText.error);   
            }

            const successData = await response.json();

            this.emit("start_the_tournament", id)
        }
        catch (error)
        {
            showErrorNotification(error);
        }
    },

    async delete_tournament(id) {
    
        try {
            const response = await customFetch(`https://${window.env.IP}:3000/api/tournament/online/tournaments/?tournamentId=${id}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                console.error(`Failed to delete tournament. HTTP status: ${response.status}`);
    
                let errorText;
                try
                {
                    errorText = await response.json();
                    console.error('Error response:', errorText);
                }
                catch (jsonError)
                {
                    const textResponse = await response.text();
                    console.error('Error response (not JSON):', textResponse);
                }
    
                if (response.status === 401) {
                    this.appContext.router.navigateTo('/login');
                }
    
                return;
            }
        } catch (error) {
            console.error('Error while deleting tournament:', error);
        }
    },
    
    render() {
        const {isloading} = this.props
        
        return h('div', { class: 'joinedTournament' }, [
            h('div', { class: 'title' }, [h('h1', {}, ['Joined Tournaments'])]),
            h('div', { class: 'tournaments' },
                (this.props.tournaments && this.props.tournaments.length > 0 && !isloading)
                    ? this.props.tournaments.map((tournament) => {
                        const creator = tournament.participants.find(participant => participant.role === 'creator');
                        const avatar = creator && creator.avatar 
                            ? `https://${window.env.IP}:3000${creator.avatar}` 
                            : './images/people_14024721.png';
    
                        return h('div', { class: 'available' }, [
                            h('img', { src: avatar }),
                            h('a', {
                                on: { click: () => this.startTournament(tournament.id) }
                            }, [tournament.name]),
                            h('i', {
                                class: "fa-regular fa-circle-xmark icon", 
                                style: { color: '#D44444' },
                                on: {
                                    click: () => this.delete_tournament(tournament.id)
                                }
                            })
                        ]);
                    })
                    : !isloading ? [h('p', {}, ['No joined tournaments'])] : []
            )
        ]);
    },
    onMounted()
    {
        this.updateState({
            isloading : false
        })
    }
    
});
