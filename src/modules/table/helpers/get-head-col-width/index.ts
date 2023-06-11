import generateHeadWidth from './get-head-col-width'
import type { IHeadItemBase, TTableHeadGroupedRow } from '../../index.types'

class HeadColsWidth {
  private _columnsWithoutWidth: IHeadItemBase[] = []
  private _overWidth: number
  private _columnsData: IHeadItemBase[] = []
  private _tableWidth: number
  private _columnsRowSpreated: IHeadItemBase[] = []
  private _columnsRowGrouped: TTableHeadGroupedRow[] = []

  get columnsWithoutWidth() {
    return this._columnsWithoutWidth
  }

  get overWidth() {
    return this._overWidth
  }

  get columnsData() {
    return this._columnsData
  }

  get tableWidth() {
    return this._tableWidth
  }

  get columnsRowSpreated() {
    return this._columnsRowSpreated
  }

  get columnsRowGrouped() {
    return this._columnsRowGrouped
  }

  constructor(
    overWidth: number,
    columnsData: IHeadItemBase[],
    columnsRowSpreated: IHeadItemBase[],
    columnsRowGrouped: TTableHeadGroupedRow[]
  ) {
    this._tableWidth = overWidth
    this._overWidth = this._tableWidth
    this._columnsData = columnsData
    this._columnsRowSpreated = columnsRowSpreated
    this._columnsRowGrouped = columnsRowGrouped
  }

  setHeadColsWidth(
    data: IHeadItemBase[] = this._columnsData,
    maxWidth: number = this._tableWidth
  ) {
    this.setHeadColsWidthIfTheyExists(data, maxWidth)

    if (this._columnsWithoutWidth.length) {
      this.setHeadColsWidthIfTheyNotExists(data)
    }
  }

  setHeadColsWidthIfTheyExists(data: IHeadItemBase[], maxWidth: number): void {
    data.forEach((item) => {
      if (!item.width) {
        this._columnsWithoutWidth.push(item)
      } else {
        item.width = this.getHeadColWidth(item.width, item.minWidth, maxWidth)
      }
    })
  }

  setHeadColsWidthIfTheyNotExists(data: IHeadItemBase[]): void {
    data.forEach((item) => {
      if (item.width && typeof item.width === 'number') {
        this._overWidth -= item.width
      }
    })

    if (this._overWidth > 0) {
      data.forEach((item: IHeadItemBase) => {
        if (!item.width) {
          item.width = (this._overWidth - 10) / this._columnsWithoutWidth.length
        }

        if (item.children && item.children.length) {
          this.setHeadColsWidth(item.children, item.width as number)
        }
      })
    }
  }

  setHeadColsGrouping(
    data: IHeadItemBase[] = this._columnsData,
    index: number = 0
  ): void {
    const indexColumnRow: number = index
      ? index
      : this._columnsRowGrouped.length

    if (
      !this._columnsRowGrouped[indexColumnRow] ||
      !this._columnsRowGrouped[indexColumnRow].length
    ) {
      this._columnsRowGrouped[indexColumnRow] = []
    }

    data.forEach((item: IHeadItemBase) => {
      const _ = JSON.parse(JSON.stringify(item))

      delete _.children
      this._columnsRowGrouped[indexColumnRow].push(_)

      if (item.children && item.children.length) {
        this.setHeadColsGrouping(item.children, indexColumnRow + 1)
      }
    })
  }

  setHeadColsSpread(data: IHeadItemBase[] = this._columnsData): void {
    data.forEach((item: IHeadItemBase) => {
      if (item.children && item.children.length) {
        this.setHeadColsSpread(item.children)
      } else if (!item.children) {
        this._columnsRowSpreated.push(item)
      }
    })
  }

  getHeadColWidth = generateHeadWidth
}

export default HeadColsWidth
