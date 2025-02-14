import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'
import { customFetch } from '../../package/fetch.js'

export const WelcomingSection = defineComponent({
    state(){
        return {
            isLoading : true,
            data: {}
        }
    },

    render(){
        const {isLoading, data} = this.state
        if (isLoading)
            return h('div', { class: 'welcoming-section' })
        return (h('div', { class: 'welcoming-section' }, [
            h('div', { class: 'left-side' }),
            h('div', { class: 'info' }, [
                h('div', { class: 'rank' }, [
                    h('h1', {}, [
                        'Rank ',
                        h('span', {}, [`${data.rank}`])
                    ])
                ]),
                h('div', { class: 'score' }, [
                    h('h1', {}, [
                        'Score ',
                        h('span', {}, [`${data.score}`])
                    ]),
                    h('img', { src: './images/star_12921513.png' })
                ]),
                h('div', { class: 'acheivement' }, [
                    h('img', { src: './images/ach.png' }),
                    h('h1', {}, ['Silver'])
                ])
            ]),
            h('img', {
                src: './images/girlplayer-removebg-preview.png',
                class: 'girl'
            })
        ]));
    },
    onMounted()
    {
        customFetch(`https://${window.env.IP}:3000/api/user?fields=score,rank`)
        .then(result =>{

            if (!result.ok)
            {
                // console.log("res isn't okey ," , " | ", this)
                
                this.appContext.router.navigateTo('/login')
            }

            return result.json()
        })
        .then(res =>{
            console.log("res is okey")
            console.log(">>>>>>>>>>>>>>>> here the data----> comes from backend : ", res)
            this.updateState({
                    isLoading: false,  
                    data: res,   
                    error: null   
            });

        })
        .catch(error => {
            // console.log(">>>>>>>>>>>> error : ", error)
        })
    }
})

