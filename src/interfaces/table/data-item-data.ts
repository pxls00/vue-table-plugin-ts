import type TableDataItemWithClass from '@/interfaces/table/data-item-with-class'

interface TableData {
  [key: string]: TableDataItemWithClass | string | any
}

export default TableData