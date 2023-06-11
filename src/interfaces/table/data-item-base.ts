import type TableDataChildren from '@/interfaces/table/table-data-children'
import type TableDataItemData from '@/interfaces/table/data-item-data'

interface TableDataItemBase {
  id: string | number
  data: TableDataItemData
  children?: TableDataChildren
  isOpenAccordion?: boolean | unknown
}

export default TableDataItemBase
