import type ColumnItemWidthType from '@/types/table/column-item-width'
import type ColumnItemClassType from '@/types/table/item-class'
import type ColumnItemTextAlignType from '@/types/table/item-text-aligns'

interface IColumnItemBase {
  label: string,
  key: string,
  minWidth: number,
  width?: ColumnItemWidthType,
  class?: ColumnItemClassType,
  textAlign?: ColumnItemTextAlignType,
}

export default IColumnItemBase