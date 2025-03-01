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
      // console.log("************************** this.appContext.router ", this.appContext.router)
      // this.updateState({ subscription , isLoading:false })
    },
  
    onUnmounted() {

      const { subscription } = this.state
      this.appContext.router.unsubscribe(subscription)
    },
  
    handleRouteChange(matchedRoute) {
      this.updateState({ matchedRoute, isLoading:false})

    },
  
    render() {
      if (this.state.isLoading)
        return h('h1', {}, ['is loading..........'])
      const { matchedRoute } = this.state
      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>> ")
      // return h('div', { id: 'global' }, [
      //   matchedRoute ? h(matchedRoute.component) : null,
      // ])

      // console.log("----------------****************-----------------------> this.appContext.router.params ", this.appContext.router.params)
      if (matchedRoute.path === '/user/:username')
        return h(matchedRoute.component, {key: this.appContext.router.params.username})
      return h(matchedRoute.component, {})
    },
  })