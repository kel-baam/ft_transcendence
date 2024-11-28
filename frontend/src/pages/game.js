import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../package/index.js'
// import { Match } from './match.js'
// import { header } from '../../../components/header.js'
// import { sidebarLeft } from '../../../components/sidebar-left.js'

export const Game = defineComponent(
    {
        state()
        {

        },
        render()
        {

            return h('div', {style:{color:'red'}}, ["hello we are on  the game"])
        }
    }
)