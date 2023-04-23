
interface INavRouteItem {
  linkName: string,
  href: string,
  nested?: INavRouteItem[] | any,
  currentPage?: boolean
}

export default INavRouteItem
