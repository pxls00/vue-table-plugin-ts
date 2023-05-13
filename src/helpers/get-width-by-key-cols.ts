import type IColumnItem from '@/interfaces/table/column-item'
import type IColumnGroupedItem from '@/interfaces/table/column-grouped-item'
import type ColumnItemWidthType from '@/types/table/column-item-width'

function getWidthByKeyCols (
  key: string,
  data: IColumnGroupedItem[] | IColumnItem[]
): ColumnItemWidthType | void | null {
  data.forEach((item: IColumnGroupedItem | any) => {
    if (item.key === key) {
      return item.width || null
    } else if (item.children && item.children.length) {
      return getWidthByKeyCols(key, item.children)
    }
  })
}

export default getWidthByKeyCols
