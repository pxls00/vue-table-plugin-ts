import type IColumnItemBase from '@/interfaces/table/column-item-base'

interface IColumnChildrenItem extends IColumnItemBase {
  colspan: number
  rowspan: number
  children?: IColumnChildrenItem[]
}

export default IColumnChildrenItem
