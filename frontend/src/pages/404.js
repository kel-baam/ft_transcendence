import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString} from '../package/index.js'

export const NotFound = defineComponent({
    render() {
      return h('div',{},[h('div',{},["404 THIS PAGE NotFound "])]) 
    }
})