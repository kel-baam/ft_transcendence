import { makeRouteMatcher } from './route-matchers.js'
import {Dispatcher} from './dispatcher.js'
import { assert } from './utils/assert.js'

export class NoopRouter {
  init() {}
  destroy() {}
  navigateTo() {}
  back() {}
  forward() {}
  subscribe() {}
  unsubscribe() {}
};

const ROUTER_EVENT = 'router-event'

export class HashRouter {
  #isInitialized = false
  #matchers = []
  #matchedRoute = null
  #dispatcher = new Dispatcher()
  #subscriptions = new WeakMap()
  #subscriberFns = new Set()

  get matchedRoute() {
    return this.#matchedRoute
  }

  #params = {}
  get params() {
    return this.#params
  }

  #query = {}
  get query() {
    return this.#query
  }

  get #currentRouteHash() {
    const hash = document.location.hash
    if (hash === '')
      { return '/' }

    return hash.slice(1)
  }

  #onPopState = (event) => {
    // this.back()
    // console.log('---------------------------Number of entries in the history stack:', history.length);

  console.log('Location changed:', window.location.href);
  console.log('State object:', event.state);

  this.#test()}

  constructor(routes = []) {
    assert(Array.isArray(routes), 'Routes must be an array')
    this.#matchers = routes.map(makeRouteMatcher)
  }

  async init() {
    if (this.#isInitialized) {
      return
    }

    if (document.location.hash === '') {
      window.history.replaceState({}, '', '#/')
    }
    window.addEventListener('popstate', this.#onPopState)
    await this.#matchCurrentRoute()

    this.#isInitialized = true
  }

  destroy() {
    if (!this.#isInitialized) {
      return
    }

    window.removeEventListener('popstate', this.#onPopState)
    Array.from(this.#subscriberFns).forEach(this.unsubscribe, this)
    this.#isInitialized = false
  }

  async nav(path) {
    // /user/:id
    // path = new URL(path, 'http://localhost:3000').pathname;  // '/login'
    // console.log("pathhhhhxx",path)

    const matcher = this.#matchers.find((matcher) =>
      
      matcher.checkMatch(path)
    )

    // console.log(matcher,"|||")
    if (matcher == null) {
      console.warn(`[Router] No route matches path "${path}"`)

      this.#matchedRoute = null
      this.#params = {}
      this.#query = {}

      return
    }

    if (matcher.isRedirect) {
      return this.navigateTo(matcher.route.redirect)
    }

    const from = this.#matchedRoute
    const to = matcher.route
    const { shouldNavigate, shouldRedirect, redirectPath } =
      await this.#canChangeRoute(from, to)

    if (shouldRedirect) {
      // this.#pushState(path)
      console.log("jsjsjsjjsjsjs")
      return this.nav(redirectPath)
    }

    if (shouldNavigate) {
      this.#matchedRoute = matcher.route
      this.#params = matcher.extractParams(path)

      // console.log("paraaaaaaaaaaaaaaaaaaaaaaam ",this.params)

      this.#query = matcher.extractQuery(path)

      // console.log("---------------------------->",this.#query)
      // this.#pushState(path)
      this.#dispatcher.dispatch(ROUTER_EVENT, {from, to, router: this })
    }
  }

  async navigateTo(path) {

    // /user/:id
    // path = new URL(path, 'http://localhost:3000').pathname;  // '/login'
    // console.log("pathhhhhxx",path)

    const matcher = this.#matchers.find((matcher) =>
      matcher.checkMatch(path)
    )

    // console.log(matcher,"|||")
    if (matcher == null) {
      console.warn(`[Router] No route matches path "${path}"`)

      this.#matchedRoute = null
      this.#params = {}
      this.#query = {}

      return
    }

    if (matcher.isRedirect) {
      return this.navigateTo(matcher.route.redirect)
    }

    const from = this.#matchedRoute
    const to = matcher.route
    const { shouldRedirect ,shouldNavigate,  redirectPath } = await this.#canChangeRoute(from, to)
    console.log("=====================> redirectPath : ", shouldRedirect ,shouldNavigate,  redirectPath  )

    if (shouldRedirect) {
      // this.#pushState(path)
      console.log("kooooooooooooooooooooooooooooooooki",redirectPath)
      return this.nav(redirectPath)
    }
    
    if (shouldNavigate) {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> here ")
      this.#matchedRoute = matcher.route
      this.#params = matcher.extractParams(path)

      // console.log("paraaaaaaaaaaaaaaaaaaaaaaam ",this.params)

      this.#query = matcher.extractQuery(path)

      // console.log("---------------------------->",this.#query)
      this.#pushState(path)
      this.#dispatcher.dispatch(ROUTER_EVENT, {from, to, router: this })
    }
  }

  back() {
    window.history.back() 
  }
 
  forward() {
    window.history.forward()
  }

  subscribe(handler) {
    const unsubscribe = this.#dispatcher.subscribe(ROUTER_EVENT, handler)
    
    this.#subscriptions.set(handler, unsubscribe)
    this.#subscriberFns.add(handler)
  }

  unsubscribe(handler) {
    const unsubscribe = this.#subscriptions.get(handler)
    
    if (unsubscribe)
    {
      unsubscribe()
      this.#subscriptions.delete(handler)
      this.#subscriberFns.delete(handler)
    }
  }

  #pushState(path) {
    window.history.pushState({}, '', `#${path}`)
  }
  #test()
  {
    return this.nav(this.#currentRouteHash)
  }
  #matchCurrentRoute() {
    return this.navigateTo(this.#currentRouteHash)
  }

  async #canChangeRoute(from, to) {
    const guard = to.beforeEnter

    if (typeof guard !== 'function') {
      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> here ")
      return {
        shouldRedirect: false,
        shouldNavigate: true,
        redirectPath: null,
      }
    }

    const result = await guard(from?.path, to?.path)
    if (result === false) {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>------>>>>> here ")
      return {

        shouldRedirect: false,
        shouldNavigate: false,
        redirectPath: null,
      }
    }

    if (typeof result === 'string') {
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>> result ", result)
      return {
        shouldRedirect: true,
        shouldNavigate: false,
        redirectPath: result,
        // console.log("dkdkdkkddkk")
      }
    }
    console.log("laaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    return {

      shouldRedirect: false,
      shouldNavigate: true,
      redirectPath: null,
    }
  }
}

