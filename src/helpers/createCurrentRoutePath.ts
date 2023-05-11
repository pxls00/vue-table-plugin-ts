import type Args from '@/types/routes/route-addition-args'

export default function (
  str: string,
  paramsOrder: string[],
  args?: Args
): string {
  let _route = str

  if (args?.length) {
    args.forEach((arg) => (_route += `/${arg}`))
  } else {
    paramsOrder.forEach((arg) => (_route += `/:${arg}`))
  }

  return _route
}
