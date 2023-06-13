import { ERoutes } from '../index.types'
import type { 
  TGetRoutePath,
  TRouteNames
} from '../index.types'

const routes = ERoutes

const getRoutePath: TGetRoutePath = function (routeName, additionArgs?) {

  const route = routes[routeName as TRouteNames] as Object

  if (typeof route === 'function') {
    return additionArgs ? route.apply(null, [...additionArgs]) : route()
  }

  return route
}

export default getRoutePath
