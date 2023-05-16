import type ItemClassType from '@/types/table/item-class'

function getClassOfCol (classList: any): ItemClassType {
  // eslint-disable-next-line no-prototype-builtins
  if (Array.isArray(classList) && !!classList.length) {
    return classList.join(' ')

    return classList
  }

  return ''
}

export default getClassOfCol
