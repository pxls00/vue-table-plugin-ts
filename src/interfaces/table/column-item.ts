import type IColumnItemBase from '@/interfaces/table/column-item-base'

interface IColumnItem extends IColumnItemBase{
  resizable?: boolean,
  children?: IColumnItem[],
}

export default IColumnItem