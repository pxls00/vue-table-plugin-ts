const tableSlotNames = function (
  slotName: string | number,
  childrenNestedLength: number
): string | number {
  if (childrenNestedLength !== 1) {
    return `${childrenNestedLength}_${slotName}`
  }

  return slotName
}

export default tableSlotNames
