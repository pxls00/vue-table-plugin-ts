// import createCurrentRoutePath from '@/helpers/createCurrentRoutePath'
/* createCurrentRoutePath creates router that has params */

import type Routes from '@/interfaces/routes'
import type GetRoutePath from '@/types/routes/get-route-path'

const routes: Routes = {
  logistics: '/logistics',
  carriers: '/carriers/',
  carriersDirectory: '/carriers/directory',
  carriersBase: '/carriers/base',
  settings: '/settings',
  signOut: '/sign-out',
}

const getRoutePath: GetRoutePath = function (routeName, additionArgs?) {
  const route = routes[routeName as keyof Routes]

  if (typeof route === 'function') {
    return additionArgs ? route.apply(null, [...additionArgs]) : route()
  }

  return route
}

export default getRoutePath
