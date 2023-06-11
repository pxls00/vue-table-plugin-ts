import getClassOfCol from './get-class-of-col'

describe('Helper: getClassOfCol', () => {
  it('check getClassOfCol with array and he should return us their join string with " "', () => {
    const classList = ['test test_2']
    const result = getClassOfCol(classList)
    expect(result).toBe(classList.join(' '))
  })
  it('check getClassOfCol with default class name and he should return just class name', () => {
    const className = 'test test_2'
    const result = getClassOfCol(className)
    expect(result).toBe(className)
  })
})
