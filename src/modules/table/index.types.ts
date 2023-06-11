import type { Ref } from 'vue'

// Enums
enum ETableThemeModes {
  'light',
  'dark',
}

enum ETableItemTextAlignValues {
  'left',
  'center',
  'right',
}

// Types
export type TTableThemeModes = keyof typeof ETableThemeModes
export type TTableThemeTransition = string | number
export type TTableHeadItemWidth = string | number
export type TTableHeadItemTextAligns = keyof typeof ETableItemTextAlignValues
export type TId = string | number
export type TTableItemClass = string | string[]
export type TTableItemField = IBodyItemDataField | string
export type TTableHeadGroupedRow = IHeadItemGrouped[]

// Interfaces
export interface IHeadItemBase {
  label: string
  key: string
  minWidth: number
  width?: TTableHeadItemWidth
  class?: TTableItemClass
  textAlign?: TTableHeadItemTextAligns
  resizable?: boolean
  children?: IHeadItemGrouped[]
}

export interface IHeadItemGrouped extends IHeadItemBase {
  colspan: number
  rowspan: number
  children: IHeadItemGrouped[]
}

export interface IBodyItemDataField {
  value: string
  class: TTableItemClass
}

export interface IBodyItemData {
  [key: string]: string
}

export interface ITableDataItemChildren {
  headData?: IHeadItemBase[] | IHeadItemGrouped[]
  bodyData: IBodyItemBase[]
}

export interface IBodyItemBase {
  id: TId
  data: IBodyItemData
  children: ITableDataItemChildren
  isOpenAccordion?: Ref<boolean>
}

export interface ITableOptions {
  maxWidth?: number | string
  borderAround?: boolean
  borderX?: boolean
  borderY?: boolean
  showHeader?: boolean
  fixedHeader?: boolean
  resize?: boolean
  accordionResize: boolean
}

export interface ITableThemeOptions {
  mode: TTableThemeModes
  borderX?: boolean
  borderY?: boolean
  borderAround?: boolean
  transition?: TTableThemeTransition
  showAccordionIcon?: boolean
  showHeader?: boolean
  fixedHeader?: boolean
}

export interface IResizeData {
  index: number
  key: string
  el: HTMLSpanElement | undefined
}
