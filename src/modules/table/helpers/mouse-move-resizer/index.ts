import type { IHeadItemBase, IResizeData } from '../../index.types'

class MouseMoveResizer {
  private _resizing: boolean = false
  private _resizeIndex: number = 0
  private _resizeEL: HTMLSpanElement | undefined
  private _resizeNum: number = 0
  private _startX: number = 0
  private _columnsData: IHeadItemBase[] = []

  get resizing(): boolean {
    return this._resizing
  }

  get resizeIndex(): number {
    return this._resizeIndex
  }

  get startX(): number {
    return this._startX
  }

  get columnsData(): IHeadItemBase[] {
    return this._columnsData
  }

  constructor(columnsData: IHeadItemBase[]) {
    this._columnsData = columnsData
  }

  startResize({ index, el }: IResizeData) {
    const eventTarget = event as MouseEvent

    this._resizeEL = el
    this._resizing = true
    this._resizeIndex = index
    this._startX = eventTarget.pageX
  }

  stopResize() {
    this.resizeColumns(this._resizeNum)

    if (this._resizeEL) {
      this._resizeEL.style.right = '0px'
    }

    this._resizing = false
    this._resizeIndex = 0
    this._startX = 0
  }

  handleMouseMove(event: Event | any): void {
    if (this._resizing) {
      const deltaX: number = event.pageX - this.startX

      if (this._resizeEL) {
        const buttonRight = this._resizeEL.style.right

        this._resizeNum = +buttonRight.replace('px', '') + deltaX * -1
        this._resizeEL.style.right = `${this._resizeNum}px`
      }
      // const currentParallelColumn = this._columnsData[this._resizeIndex + 1]
      // const newColumnWidth: number = (currentColumn.width as number) + deltaX
      // const newParralelColumnWidth =
      //   (currentParallelColumn.width as number) + deltaX * -1

      // if (
      //   newColumnWidth >= currentColumn.minWidth &&
      //   newParralelColumnWidth >= currentParallelColumn.minWidth
      // ) {
      //   currentColumn.width = newColumnWidth
      //   currentParallelColumn.width = newParralelColumnWidth
      // }
      // this.resizeColumns(deltaX)
      this._startX = event.pageX
    }
  }

  resizeColumns(widthNumber: number): void {
    const currentColumn: IHeadItemBase = this._columnsData[this._resizeIndex]
    const currentParallelColumn = this._columnsData[this._resizeIndex + 1]
    const newColumnWidth: number =
      (currentColumn.width as number) + widthNumber * -1
    const newParralelColumnWidth =
      (currentParallelColumn.width as number) + widthNumber
    const canGetWidth =
      (currentParallelColumn.width as number) - currentParallelColumn.minWidth
    const newColumnWidthWithCanGetWidth =
      (currentColumn.width as number) + canGetWidth

    if (
      newColumnWidth >= currentColumn.minWidth &&
      newParralelColumnWidth >= currentParallelColumn.minWidth &&
      newColumnWidth < newColumnWidthWithCanGetWidth
    ) {
      currentParallelColumn.width = newParralelColumnWidth
      currentColumn.width = newColumnWidth
    }

    if (newColumnWidth > newColumnWidthWithCanGetWidth) {
      currentParallelColumn.width = currentParallelColumn.minWidth
      currentColumn.width = newColumnWidthWithCanGetWidth
    }
  }
}

export default MouseMoveResizer
