import getRoutePath from '@/helpers/routes'

export default {
  install: (app: any) => {
    app.provide('getRoutePath', getRoutePath)

    app.config.globalProperties.$getRoutePath = getRoutePath
  },
}
