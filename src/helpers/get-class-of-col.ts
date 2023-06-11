import type ItemClassType from '@/types/table/item-class'

export default function getClassOfCol(classList: any): ItemClassType {
  if (Array.isArray(classList)) {
    return classList.join(' ')
  }

  return classList
}
