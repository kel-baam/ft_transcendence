


// for checking if the router has an id or something like that
export function makeRouteMatcher(route) {
  // console.log(">>>>>>>>>>>>>>> router : ", route)
    return routeHasParams(route)
      ? makeMatcherWithParams(route)
      : makeMatcherWithoutParams(route)
  }
  
  function routeHasParams({ path }) {
    return path.includes(':')
  }




const CATCH_ALL_ROUTE = '*'

function makeRouteWithoutParamsRegex({ path }) {
  // console.log(path)
  if (path === CATCH_ALL_ROUTE) {
    return new RegExp('^.*$')
  }
  
  return new RegExp(`^${path}$`)
}



function makeMatcherWithoutParams(route) {

    const regex = makeRouteWithoutParamsRegex(route)
    const isRedirect = typeof route.redirect === 'string'

    // console.log("route=>",regex)
    return {
      route,
      isRedirect,
      checkMatch(path) {
        // console.log('testttt',regex,'=>',path)
        
        const index = path.indexOf('?')
        if(index != - 1)
        {
          const  tmpPath= path.slice(0,index);
          // console.log("result",tmpPath)
          // console.log("ooooook",path)
          return regex.test(tmpPath)

        }
          
        return regex.test(path)
      },
      extractParams() {
        return {}
      },
      extractQuery,
    }
  }


  function extractQuery(path) {
    // console.log("test==>",path)
    const queryIndex = path.indexOf('?')
  
    if (queryIndex === -1) {
      return {}
    }
  
    const search = new URLSearchParams(path.slice(queryIndex + 1))
  
    return Object.fromEntries(search.entries())
  }


// for url that have : like this  /user/:id/orders/:orderId to transfer it like that 
// \^/user/(?<id>)/orders/(?<orderId>[^/])$



  function makeRouteWithParamsRegex({ path }) {
    console.log("path=",path)
    const regex = path.replace(
      /:([^/]+)/g,
      (_, paramName) => `(?<${paramName}>[^/]+)`
    )
  
    return new RegExp(`^${regex}$`)
  }





  function makeMatcherWithParams(route) {
    const regex = makeRouteWithParamsRegex(route)
    const isRedirect = typeof route.redirect === 'string'
  
    return {
      route,
      isRedirect,
      checkMatch(path) {
        // console.log("route=>",route)
        return regex.test(path)
      },
      extractParams(path) {
        const { groups } = regex.exec(path)
        return groups
      },
      extractQuery,
    }
  }