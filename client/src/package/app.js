import { mountDOM } from './mount-dom.js'
import { destroyDOM } from './destroy-dom.js'
import { h } from './h.js'

export function createApp(RootComponent, props = {}, options = {}) {
    let parentEl = null
    let isMounted = false
    let vdom = null
  
    function reset() {
      parentEl = null
      isMounted = false
      vdom = null
    }
    
    const context = {
    router: options.router || new NoopRouter(),
    }
    return {
      mount(_parentEl) {
        if (isMounted) {
          throw new Error('The application is already mounted')
        }
     
        parentEl = _parentEl
        vdom = h(RootComponent, props)
        mountDOM(vdom, parentEl, null, { appContext: context })
        context.router.init()
  
        isMounted = true
      },
  
      unmount() {
        if (!isMounted) {
          throw new Error('The application is not mounted')
        }
  
        destroyDOM(vdom)
        context.router.destroy()

        reset()
      },
    }
  }
  

// export function createApp(RootComponent, props = {}) {