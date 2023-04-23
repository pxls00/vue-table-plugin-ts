export const SIDEBAR_ROUTES = [
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
        href: 'carriersDirectory'
      },
      {
        linkName: 'База',
        href: 'carriersBase'
      },
    ],
  },
]