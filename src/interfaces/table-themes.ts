import type TableThemeMode from '@/types/table/table-theme-mode'
import type TableThemeTransition from '@/types/table/table-theme-transition'

interface TableTheme {
  mode: TableThemeMode,
  borderX?: boolean
  borderY?: boolean
  borderAround?: boolean
  transition?: TableThemeTransition
  showAccordionIcon?: boolean
  showHeader?: boolean,
  fixedHeader?: boolean
}

export default TableTheme