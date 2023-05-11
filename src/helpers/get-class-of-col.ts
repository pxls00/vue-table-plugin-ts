import type ItemClassType from '@/types/table/item-class'

function getClassOfCol (item: any): ItemClassType {
  // eslint-disable-next-line no-prototype-builtins
  if (item.hasOwnProperty('class')) {
    if (Array.isArray(item.class)) {
      return item.class.join(' ')
    }

    return item.class
  }

  return ''
}

export default getClassOfCol
