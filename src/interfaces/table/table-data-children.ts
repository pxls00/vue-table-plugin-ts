import type ColumnItem from '@/interfaces/table/column-item'
import type ColumnGroupedItem from '@/interfaces/table/column-grouped-item'
import type TableDataItem from '@/interfaces/table/data-item-base'

interface TableDataChildren {
  headData?: ColumnItem[] | ColumnGroupedItem[]
  bodyData: TableDataItem[]
}

export default TableDataChildren
