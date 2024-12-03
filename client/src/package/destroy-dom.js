import { removeEventListeners } from './events.js'
import { DOM_TYPES } from './h.js'
// import { enqueueJob } from './scheduler.js'
import { assert } from './utils/assert.js'

export async function destroyDOM(vdom) {
    const { type } = vdom
  
    switch (type) {
      case DOM_TYPES.TEXT: {
        removeTextNode(vdom)
        break
      }
  
      case DOM_TYPES.ELEMENT: {
        removeElementNode(vdom)
        break
      }
  
      case DOM_TYPES.FRAGMENT: {
        removeFragmentNodes(vdom)
        break
      }
  
      case DOM_TYPES.COMPONENT: {
        vdom.component.unmount()
        // enqueueJob(() => vdom.component.onUnmounted())
        await vdom.component.onUnmounted()
        break
      }
  
      default: {
        throw new Error(`Can't destroy DOM of type: ${type}`)
      }
    }
  
    delete vdom.el
}
  
function removeTextNode(vdom) {
    const { el } = vdom
  
    assert(el instanceof Text)
  
    el.remove()
}

function removeElementNode(vdom) {
    const { el, children, listeners } = vdom
  
    assert(el instanceof HTMLElement)
  
    el.remove()
    children.forEach(destroyDOM)
  
    if (listeners) {
      removeEventListeners(listeners, el)
      delete vdom.listeners
    }
}

function removeFragmentNodes(vdom) {
    const { children } = vdom
    children.forEach(destroyDOM)
}