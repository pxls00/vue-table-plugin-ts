import type ColumnItemWidthType from '@/types/table/column-item-width'

function generateHeadWidth (
  width: ColumnItemWidthType,
  minWidth: number,
  maxWidth: number
): number | undefined {
  
  if (typeof width === 'string') {
    if (Number(width)) {
      return generateHeadWidth(
        Number(width),
        Number(minWidth),
        Number(maxWidth)
      )
    } else if (width.includes('%')) {
      const percentNumber: number = Number(width.replace('%', ''))
      const colWidthNumber: number = (maxWidth / 100) * percentNumber

      return generateHeadWidth(
        Number(colWidthNumber),
        Number(minWidth),
        Number(maxWidth)
      )
    } else if (width.includes('/')) {
      const percentNumber: number =
        (100 / Number(width.split('/')[1])) * Number(width.split('/')[0])
      const colWidthNumber: number = (maxWidth / 100) * percentNumber

      return generateHeadWidth(Number(colWidthNumber), minWidth, maxWidth)
    }
  } else {
    if (width < Number(minWidth)) {
      return minWidth
    } else {
      return width
    }
  }
}

export default generateHeadWidth
