import type Args from '@/types/routes/route-addition-args'
import type RouteName from '@/types/routes/route-name'

type GetRoutePath = (
  routeName: RouteName | string,
  additionArgs?: Args
) => string

export default GetRoutePath
