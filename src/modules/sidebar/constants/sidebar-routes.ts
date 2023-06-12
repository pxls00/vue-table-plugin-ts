import type { INavRouteItem } from '../index.types'
// import INavRouteItem from './../../../interfaces/nav-route-item';

export const SIDEBAR_ROUTES: INavRouteItem[] = [
  {
    linkName: 'Логистика',
    href: 'logistics',
  },
  {
    linkName: 'Перевозчики',
    href: 'carriers',
    nested: [
      {
        linkName: 'Справочник',
        href: 'carriersDirectory',
      },
      {
        linkName: 'База',
        href: 'carriersBase',
      },
    ],
  },
]
