import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../package/index.js'
// import { Match } from './match.js'
// import { header } from '../../../components/header.js'
// import { sidebarLeft } from '../../../components/sidebar-left.js'
import { NotFound } from './404.js'

export const Game = defineComponent(
    {
        state()
        {

        },
        render()
        {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> here match : ", this.appContext.router.query)
            if (this.appContext.router.query.matchId == 2)
            {
                return h(NotFound, {})
            }
                // this.appContext.router.navigateTo('/*')
            return h('div', {style:{color:'red'}}, ["hello we are on  the game"])
        }
    }
)