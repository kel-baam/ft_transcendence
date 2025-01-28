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
  
      // this.updateState({ subscription , isLoading:false })
    },
  
    onUnmounted() {

      const { subscription } = this.state
      this.appContext.router.unsubscribe(subscription)
    },
  
    handleRouteChange(matchedRoute) {
      // console.log(">>>>>>>>>>>>>>>>> HERE CHANGE ROUTE")
      this.updateState({ matchedRoute, isLoading:false })

    },
  
    render() {
      if (this.state.isLoading)
        return h('div', { id: 'global' }, 
          ['is loading..........']
        )
      const { matchedRoute } = this.state
      return h( matchedRoute.component )
    },
  })