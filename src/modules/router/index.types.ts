// Enums
export enum ERoutes {
  logistics = '/logistics',
  carriers = '/carriers/',
  carriersDirectory = '/carriers/directory',
  carriersBase = '/carriers/base',
  settings = '/settings',
  signOut = '/sign-out',
}

// Types
export type TRoute = string | Function
export type TRouteNames = keyof typeof ERoutes
export type TArgs = (string | number)[]
export type TGetRoutePath = (
  routeName: TRouteNames | string,
  additionArgs?: TArgs
) => string


// Interfaces

// export interface Routes {
//   logistics: Route
//   carriers: Route
//   carriersDirectory: Route
//   carriersBase: Route
//   settings: Route
//   signOut: Route
// }
