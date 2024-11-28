import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../../package/index.js'

import {Hierarchy} from './Hierarchy.js'

export const Match = defineComponent({
    state(){
        return {
            gameState:"playable"
        }
    },
    render()
    {
        console.log(">>>>>>>>>>>>>>>>>>>>here in game ")
        // this.state.gameState = "completed"
        // const {type, matchPlayable}=  this.props
        // if (this.state.gameState==="completed" && type==="local_tournament")
        //     return h(Hierarchy,{[matchPlayable]:'completed'})
        // this.emit('firstMatch-start', 'completed')
        return h('div', { }, ["our GAMEEEEE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"])
    }         
})
