import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString,RouterOutlet} from '../package/index.js'
import { Footer } from '../components/landing/Footer.js'
import { Team } from '../components/landing/Team.js'
import { AboutUs } from '../components/landing/AboutUs.js'
import { LandingPageHeader } from '../components/landing/LandingHeader.js'



    export const LandingPage = defineComponent({

        state(){
            return {
                isLoading : true,
        }
        },
        render(){
            return h('div',{id:"all"},
                [
                    h(LandingPageHeader,{}),
                    h(AboutUs,{}),
                    h(Team,{}),
                    h(Footer,{})                   
                ]
            )
        }
    })

