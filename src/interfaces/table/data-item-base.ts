import type TableDataItemWithClass from '@/interfaces/table/data-item-with-class'
import type TableDataChildren from '@/interfaces/table/table-data-children'


interface TableData {
  [key:string]: TableDataItemWithClass | string
}

interface TableDataItemBase {
  id: string | number
  data: TableData,
  children?: TableDataChildren,
  isOpenAccordion?: boolean | unknown,
}

export default TableDataItemBase