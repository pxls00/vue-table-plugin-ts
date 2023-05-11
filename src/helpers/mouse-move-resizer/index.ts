import type ITableHeadColumnItem from '@/interfaces/table/column-item'
import type IResizerDataEmit from '@/interfaces/resizer-data-emit'

class MouseMoveResizer {
  private _resizing: boolean = false
  private _resizeIndex: number = 0
  private _startX: number = 0
  private _columnsData: ITableHeadColumnItem[] = []

  get resizing (): boolean {
    return this._resizing
  }

  get resizeIndex (): number {
    return this._resizeIndex
  }

  get startX (): number {
    return this._startX
  }

  get columnsData (): ITableHeadColumnItem[] {
    return this._columnsData
  }

  constructor (columnsData: ITableHeadColumnItem[]) {
    this._columnsData = columnsData
  }

  startResize ({ index }: IResizerDataEmit) {
    const eventTarget = event as Event | any

    this._resizing = true
    this._resizeIndex = index
    this._startX = eventTarget.pageX
  }

  stopResize () {
    this._resizing = false
    this._resizeIndex = 0
    this._startX = 0
  }

  handleMouseMove (event: Event | any) {
    if (this._resizing) {
      const deltaX: number = event.pageX - this.startX
      const currentColumn: ITableHeadColumnItem =
        this._columnsData[this._resizeIndex]
      const currentParallelColumn = this._columnsData[this._resizeIndex + 1]
      const newColumnWidth: number = (currentColumn.width as number) + deltaX
      const newParralelColumnWidth =
        (currentParallelColumn.width as number) + deltaX * -1

      if (
        newColumnWidth >= currentColumn.minWidth &&
        newParralelColumnWidth >= currentParallelColumn.minWidth
      ) {
        currentColumn.width = newColumnWidth
        currentParallelColumn.width = newParralelColumnWidth
      }
      this._startX = event.pageX
    }
  }
}

export default MouseMoveResizer
