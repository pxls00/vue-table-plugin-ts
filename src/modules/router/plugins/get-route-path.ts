import getRoutePath from '../helpers/get-route-path'

export default {
  install: (app: any) => {
    app.provide('getRoutePath', getRoutePath)

    app.config.globalProperties.$getRoutePath = getRoutePath
  },
}
