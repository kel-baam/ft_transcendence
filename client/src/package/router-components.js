import { defineComponent } from './component.js'
import { h, hSlot } from './h.js'

export const RouterLink = defineComponent({
  render() {
    const { to } = this.props
    return h(
      'a',
      {
        href: to,
        on: {
          click: (e) => {
            e.preventDefault()
            this.appContext.router.navigateTo(to)
          },
        },
      },
      [hSlot()]
    )
  },
})

export const RouterOutlet = defineComponent({
    state() {
      return {
        matchedRoute: null,
        subscription: null,
        isLoading : true,
      }
    },
  
    onMounted() {
      const subscription = this.appContext.router.subscribe(({ to }) => {
        this.handleRouteChange(to)
      })
    },
  
    onUnmounted() {

      const { subscription } = this.state
      this.appContext.router.unsubscribe(subscription)
    },
  
    handleRouteChange(matchedRoute) {
      this.updateState({ matchedRoute, isLoading:false})

    },
  
    render() {
      const { matchedRoute, isLoading } = this.state
      if (isLoading)
        return h('div', {id : 'global'}, [''])
     
      if (matchedRoute.path === '/user/:username')
        return h(matchedRoute.component, {key: this.appContext.router.params.username})
      return h(matchedRoute.component, {})
    },
  })