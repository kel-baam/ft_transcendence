import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'

export const TrainingBoot = defineComponent({
    state(){
        return {
        }
    },

    render(){
        return h('div', { class: 'training-boot' }, [
            h('h1', {}, ['Training']),
            h('img', { src: './images/paddles-removebg-preview.png' }),
            h('a', { href: '/waitPlayerJoin' }, [
                h('button', { type: 'button', class: 'btn' }, ['PLAY'])
            ])
        ]);   
    }
})