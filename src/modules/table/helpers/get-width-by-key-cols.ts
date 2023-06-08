import type IColumnItem from '@/interfaces/table/column-item'
import type IColumnGroupedItem from '@/interfaces/table/column-grouped-item'
import type ColumnItemWidthType from '@/types/table/column-item-width'

function getWidthByKeyCols (
  key: string,
  data: IColumnGroupedItem[] | IColumnItem[]
): ColumnItemWidthType | void | null {
  for(let i = 0; i < data.length; i++) {
    const item: any = data[i] 
    if (item.key === key) {
      return item.width || null
    } else if (item.children && item.children.length) {
      return getWidthByKeyCols(key, item.children)
    }
  }
}

export default getWidthByKeyCols
