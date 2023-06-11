import getWidthByKeyCols from './get-width-by-key-cols'
import type ITableHead from '@/interfaces/table/column-item'

const tableColumns: ITableHead[] = [
  {
    label: '',
    key: 'actions',
    width: 50,
    minWidth: 30,
  },
  {
    label: 'ID',
    key: 'id',
    width: 50,
    minWidth: 50,
  },
  {
    label: 'Info',
    key: 'info',
    minWidth: 20,
  },
  {
    label: 'Full Name',
    key: 'full_name',
    width: 200,
    minWidth: 50,
  },
]

describe('Helper: getWidthByKeyCols', () => {
  it('find item by with', () => {
    const item: ITableHead = {
      label: '',
      key: 'actions',
      width: 50,
      minWidth: 30,
    }

    const result = getWidthByKeyCols(item.key, tableColumns)

    expect(result).toBe(50)
  })
})
