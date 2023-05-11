import type IColumnItemBase from '@/interfaces/table/column-item-base'

interface IColumnGroupedItem extends IColumnItemBase {
  colspan: number
  rowspan: number
  children: IColumnGroupedItem
}

export default IColumnGroupedItem
