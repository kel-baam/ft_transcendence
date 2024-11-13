import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../package/index.js'

export const header = defineComponent({render(){
    return h('header', { class: 'container' }, [
        h('nav', {}, [
            h('a', { href: 'home' }, [
                h('img', { src: './images/logo.png', class: 'logo' })
            ]),
            h('div', { class: 'search' }, [
                h('a', { href: '#' }, [
                    h('i', { class: 'fa-solid fa-magnifying-glass icon', 'aria-hidden': 'false' })
                ]),
                h('input', { type: 'text', placeholder: 'Search...' })
            ]),
            h('div', { class: 'left-side' }, [
                h(notifComponent, {}),
                h('a', { href: 'settings' }, [
                    h('i', { class: 'fa-solid fa-sliders icon', 'aria-hidden': 'false' })
                ]),
                h('a', { href: 'login' }, [
                    h('i', { class: 'fa-solid fa-arrow-right-from-bracket icon', 'aria-hidden': 'false' })
                ])
            ])
        ])
    ])
}})

const notifComponent = defineComponent({
    render() {
    return h('a', { href: 'notification' }, [
        h('i', { className: 'fa-regular fa-bell icon', 'aria-hidden': 'false' })
    ])
}})

