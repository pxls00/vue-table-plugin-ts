<template>
  <div class="table-main">
    <div
      ref="tableMainDiv"
      :class="[
        'table__wrapper',
        {
          'table--theme-dark': tableTheme.mode === 'dark',
          'table--theme-light': tableTheme.mode === 'light',
          'table--theme-border-x': tableTheme.borderX,
          'table--theme-border-y': tableTheme.borderY,
          'table--theme-border-around': tableTheme.borderAround,
        },
      ]"
      :style="{
        'max-width': tableMaxWidthSize,
      }"
    >
      <table ref="tableMain" class="table__content">
        <TableHeadGroupedComponent
          v-if="tableTheme.showHeader && hasChildren"
          :fixed-header="!!tableTheme.fixedHeader"
          :resize="resize"
          :table-head-data="(tableColumnDataHead as ColumnGroupedRowItem[])"
          :columns-data="tableHead"
          :children-nested-length="props.childrenNestedLength"
        >
          <template v-for="(_, slot) in $slots" #[slot]>
            <slot :name="slot" />
          </template>
        </TableHeadGroupedComponent>
        <TableHeadSimpleComponent
          v-else-if="tableTheme.showHeader && !hasChildren"
          :fixed-header="!!tableTheme.fixedHeader"
          :resize="resize"
          :columns-data="tableHead"
          :children-nested-length="props.childrenNestedLength"
          @start-resize="startResize"
        >
          <template v-for="(_, slot) in $slots" #[slot]>
            <slot :name="slot" />
          </template>
        </TableHeadSimpleComponent>
        <TableBodyComponent
          :table-body="tableBody"
          :table-head="tableColumnDataBody"
          :children-nested-length="props.childrenNestedLength"
          :show-accordion-arrow="tableTheme.showAccordionIcon"
          :dragndrop="props.dragndrop"
          @dragndrop-changed="dragndropChanged"
        >
          <template v-for="(_, slot) in $slots" #[slot]="data">
            <slot :name="slot" :data="{ ...data }" />
          </template>
          <template #table__item-accordion="{ row }">
            <TableComponent
              :table-head="
                row.children &&
                  row.children.headData &&
                  row.children.headData.length
                  ? row.children.headData
                  : JSON.parse(JSON.stringify(tableHead))
              "
              :table-body="row.children ? row.children.bodyData : []"
              :max-width="tableMaxWidthSize"
              :children-nested-length="props.childrenNestedLength + 1"
              :resize="props.resize"
              :theme="props.theme"
              @dragndrop-changed="(data: TableDataItem[]) => dragndropChanged(data, row.id as number | string)"
            >
              <template v-for="(_, slot) in $slots" #[slot]="data: any">
                <slot :name="slot" :data="{ ...data }" />
              </template>
            </TableComponent>
          </template>
        </TableBodyComponent>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TableComponent',
})
</script>

<script lang="ts" setup>
import { withDefaults, ref, computed, onMounted, onUnmounted } from 'vue'

import TableHeadGroupedComponent from '@/components/table/table-head-grouped.vue'
import TableHeadSimpleComponent from '@/components/table/table-head-simple.vue'
import TableBodyComponent from '@/components/table/table-body.vue'
import GenerateHeadColWidths from '@/helpers/get-head-col-width'
import MouseMoveResizer from '@/helpers/mouse-move-resizer'

import type ColumnItem from '@/interfaces/table/column-item'
import type ColumnGroupedItem from '@/interfaces/table/column-grouped-item'
import type TableDataItem from '@/interfaces/table/data-item-base'
import type ColumnGroupedRowItem from '@/types/table/column-grouped-row'
import type ColumnItemWidthType from '@/types/table/column-item-width'
import type IResizerDataEmit from '@/interfaces/resizer-data-emit'
import type TableTheme from '@/interfaces/table-themes'

interface IProps {
  tableHead: ColumnItem[] | ColumnGroupedItem[]
  tableBody: TableDataItem[]
  maxWidth?: number | string
  resize?: boolean
  childrenNestedLength?: number
  dragndrop?: boolean
  theme?: TableTheme
}

const emits = defineEmits<{
  (e: 'dragndropChanged', data: TableDataItem[]): TableDataItem[]
}>()

const props = withDefaults(defineProps<IProps>(), {
  maxWidth: '',
  resize: true,
  childrenNestedLength: 1,
  dragndrop: true,
  theme: undefined,
})

const tableHead = ref<ColumnItem[] | ColumnGroupedItem[]>(props.tableHead),
  tableTheme = ref<TableTheme>({} as TableTheme),
  tableWidth = ref<number>(),
  tableHeadGrouped = ref<ColumnGroupedRowItem[]>([]),
  tableHeadSpreated = ref<ColumnItem[]>([]),
  tableMainDiv = ref<InstanceType<typeof HTMLDivElement> | undefined>(undefined)

const tableMaxWidthSize = computed<ColumnItemWidthType>(() => {
  if (props.maxWidth && typeof props.maxWidth === 'number') {
    return `${props.maxWidth}px`
  } else if (props.maxWidth && typeof props.maxWidth === 'string') {
    return props.maxWidth
  } else {
    return `${tableMaxWidth.value}px`
  }
})

const tableMaxWidth = computed<number | undefined | string>(() => {
  if (props.maxWidth) {
    if (typeof props.maxWidth === 'string')
      return props.maxWidth.replace('px', '')

    return props.maxWidth
  }

  return tableWidth.value
})

const hasChildren = computed<boolean>(() => {
  if (
    tableHead.value.some(
      (item: ColumnGroupedItem | any): boolean =>
        item.children && !!item.children.length
    )
  ) {
    return true
  }

  return false
})

const tableColumnDataHead = computed<ColumnGroupedRowItem[] | ColumnItem[]>(
  () => {
    if (hasChildren.value) {
      return tableHeadGrouped.value
    } else {
      return tableHead.value
    }
  }
)

const tableColumnDataBody = computed<ColumnItem[]>(() => {
  if (hasChildren.value) {
    return tableHeadSpreated.value
  } else {
    return tableHead.value
  }
})

function setTableTheme () {
  tableTheme.value = {
    mode: props.theme?.mode || 'dark',
    // eslint-disable-next-line no-prototype-builtins
    borderAround: props.theme?.hasOwnProperty('borderAround')
      ? props.theme?.borderAround
      : true,
    // eslint-disable-next-line no-prototype-builtins
    borderX: props.theme?.hasOwnProperty('borderX')
      ? props.theme?.borderX
      : true,
    // eslint-disable-next-line no-prototype-builtins
    borderY: props.theme?.hasOwnProperty('borderY')
      ? props.theme?.borderY
      : true,
    // eslint-disable-next-line no-prototype-builtins
    fixedHeader: props.theme?.hasOwnProperty('fixedHeader')
      ? props.theme?.fixedHeader
      : false,
    // eslint-disable-next-line no-prototype-builtins
    showHeader: props.theme?.hasOwnProperty('showHeader')
      ? props.theme?.showHeader
      : true,
    // eslint-disable-next-line no-prototype-builtins
    showAccordionIcon: props.theme?.hasOwnProperty('showAccordionIcon')
      ? props.theme?.showAccordionIcon
      : true,
    transition: props.theme?.transition || 'all .2s',
  }
}

function setTableWidth () {
  tableWidth.value = tableMainDiv.value?.offsetWidth as number
}

function startResize ({ index, key, el }: IResizerDataEmit) {
  moveResizer.startResize({ index, key, el })
}

function dragndropChanged (data: TableDataItem[], id?: number | string) {
  if (id) {
    const _ = props.tableBody.map((item) => {
      if (item.id === id && item.children) {
        item.children.bodyData = data

        return item
      }

      return item
    })

    emits('dragndropChanged', _)
  } else {
    emits('dragndropChanged', data)
  }
}

const moveResizer = new MouseMoveResizer(tableHead.value)

// Created

setTableTheme()

document.addEventListener('mousemove', (event) =>
  moveResizer.handleMouseMove(event)
)
document.addEventListener('mouseup', (event) => {
  moveResizer.stopResize()
})

onMounted(() => {
  setTableWidth()

  const generateWidth = new GenerateHeadColWidths(
    tableMaxWidth.value as number,
    tableHead.value as ColumnItem[],
    tableHeadSpreated.value as ColumnItem[],
    tableHeadGrouped.value as ColumnGroupedRowItem[]
  )

  generateWidth.setHeadColsWidth()

  if (hasChildren.value) {
    generateWidth.setHeadColsSpread()
    generateWidth.setHeadColsGrouping()
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', moveResizer.handleMouseMove)
  document.removeEventListener('mouseup', moveResizer.stopResize)
})
</script>

<style lang="scss" scoped></style>
