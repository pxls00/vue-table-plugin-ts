import type IColumnItem from '@/interfaces/table/column-item'
import type ColumnItemWidthType from '@/types/table/column-item-width'

function getWidthByKeyCols (
  key: string,
  data: IColumnItem[]
): ColumnItemWidthType | void | null {
  data.forEach((item: IColumnItem) => {
    if (item.key === key) {
      return item.width || null
    } else if (item.children && item.children.length) {
      return getWidthByKeyCols(key, item.children)
    }
  })
}

export default getWidthByKeyCols
