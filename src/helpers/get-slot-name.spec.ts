import getSlotName from './get-slot-name'

describe('Helper: getSlotName', () => {
  it('check slotname with nested length', () => {
    const slotName:string = 'test_slot_name'
    const nestedLength:number = 2
    const result = getSlotName(slotName, nestedLength)

    expect(result).toBe(`${nestedLength}_${slotName}`)
  })
  
  it('check slotname without nested length', () => {
    const slotName:string = 'test_slot_name'
    const result = getSlotName(slotName, 1)

    expect(result).toBe(slotName)
  })
})      