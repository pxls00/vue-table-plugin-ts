import type ITableHeadColumnItem from '@/interfaces/table/column-item'
import type ColumnItemWidthType from '@/types/table/column-item-width'
import type ColumnItemGroupedRowItem from '@/types/table/column-grouped-row'

class HeadColsWidth {
  private columnsWithoutWidth: ITableHeadColumnItem[] = []
  private overWidth:number
  constructor (overWidth:number) {
    this.overWidth = overWidth
  }

  setHeadColsWidth (data: ITableHeadColumnItem[], maxWidth: number) {   
    this.setHeadColsWidthIfTheyExists(data, maxWidth)

    if (this.columnsWithoutWidth.length) {
      this.setHeadColsWidthIfTheyNotExists(data)
    }
  }

  setHeadColsWidthIfTheyExists (data: ITableHeadColumnItem[], maxWidth: number):void {
    data.forEach((item) => {
      if(!item.width) {
        this.columnsWithoutWidth.push(item)
      } else {
        item.width = this.getHeadColWidth(item.width, item.minWidth, maxWidth)
      }
    })
  }

  setHeadColsWidthIfTheyNotExists (data: ITableHeadColumnItem[]):void {
    data.forEach((item) => {
      if (item.width && typeof item.width === 'number') {
        this.overWidth -= item.width
      }
    })
    
    if (this.overWidth > 0) {
      data.forEach((item) => {
        if (!item.width) {
          item.width = (this.overWidth - 10) / this.columnsWithoutWidth.length
        } 
        
        if (item.children && item.children.length) {
          this.setHeadColsWidth(item.children, item.width as number)
        }
      })
    }
  }

  setHeadColsGrouping (data: ITableHeadColumnItem[], index:number, columnsRowGrouped: ColumnItemGroupedRowItem[]):void {
    const indexColumnRow:number = index ? index : columnsRowGrouped.length

    if(!columnsRowGrouped[indexColumnRow] || !columnsRowGrouped[indexColumnRow].length) {
      columnsRowGrouped[indexColumnRow] = []
    } 

    data.forEach(item => {
      const _ = JSON.parse(JSON.stringify(item))

      delete _.children
      columnsRowGrouped[indexColumnRow].push(_)

      if(item.children && item.children.length) {
        this.setHeadColsGrouping(item.children, indexColumnRow + 1, columnsRowGrouped)
      }
    })
  }

  setHeadColsSpread (data: ITableHeadColumnItem[], columnsRowSpreated: ITableHeadColumnItem[]):void {
    data.forEach(item => {
      if(item.children && item.children.length) {
        this.setHeadColsSpread(item.children, columnsRowSpreated)
      }else if(!item.children) {
        columnsRowSpreated.push(item)
      }
    })
  }
  
  getHeadColWidth (width: ColumnItemWidthType, minWidth: number, maxWidth: number): number | undefined {
    if(typeof width === 'string') {
      if (Number(width)) {
        return this.getHeadColWidth(Number(width), Number(minWidth), Number(maxWidth))
      } else if (width.includes('%')) {
        const percentNumber: number = Number(width.replace('%', ''))
        const colWidthNumber: number = (maxWidth / 100) * percentNumber
                  
        return this.getHeadColWidth(Number(colWidthNumber), Number(minWidth), Number(maxWidth))
      } else if (width.includes('/')) {
        const percentNumber: number =
          (100 / Number(width.split('/')[1])) *
          Number(width.split('/')[0])
        const colWidthNumber: number = (maxWidth / 100) * percentNumber
    
        return this.getHeadColWidth(Number(colWidthNumber), minWidth, maxWidth)
      }
    } else {
      if(width < Number(minWidth)) {
        return minWidth
      } else {
        return width
      }
    }
  }
}

export default HeadColsWidth