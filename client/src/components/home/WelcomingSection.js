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
        const grades = new Map([
            ['Newbie',  '#808080'],
            ['Bronze' , '#CD7F32'],
            ['Silver', '#C0C0C0'],
            ['Master', '#0000FF'],
            ['Legend', '#FF0000']
        ])
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
                    h('h1', {style : {color : grades.get(data.grade)}}, [`${data.grade}`])
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
        customFetch(`https://${window.env.IP}:3000/api/user?fields=score,rank,grade`)
        .then(result =>{

            if (!result.ok)
            {
                
                this.appContext.router.navigateTo('/login')
            }

            return result.json()
        })
        .then(res =>{
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

