<template>
  <div class="table-main">
    <div
      ref="tableMainDiv"
      class="table__wrapper table--theme-dark table--theme-border-x table--theme-border-y table--theme-stripe"
      :style="{
        'max-width': tableMaxWidthSize,
      }"
    >
      <table ref="tableMain" class="table__content">
        <TableHeadGroupedComponent
          v-if="showHeader && hasChildren"
          :fixed-header="fixedHeader"
          :resize="resize"
          :table-head-data="(tableColumnDataHead as ColumnGroupedRowItem[])"
          :columns-data="tableHead"
        >
          <template v-for="(_, slot) in $slots" #[slot]>
            <slot :name="slot" />
          </template>
        </TableHeadGroupedComponent>
        <TableHeadSimpleComponent
          v-else-if="showHeader && !hasChildren"
          :fixed-header="fixedHeader"
          :resize="resize"
          :columns-data="tableHead"
          @start-resize="startResize"
        >
          <template v-for="(_, slot) in $slots" #[slot]>
            <slot :name="slot" />
          </template>
        </TableHeadSimpleComponent>
        <TableBodyComponent
          :table-body="tableBody"
          :table-head="tableColumnDataBody"
        >
          <template v-for="(_, slot) in $slots" #[slot]="data">
            <slot :name="slot" :data="{ ...data }" />
          </template>
          <template #table__item-accordion="{ row }">
            <TableComponent
              :table-head="
                row.children ? row.children.headData : JSON.parse(JSON.stringify(tableHead))
              "
              :table-body="(row.children ? row.children.bodyData : [])"
              :max-width="tableMaxWidthSize"
            />
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

interface IProps {
  tableHead: ColumnItem[] | ColumnGroupedItem[]
  tableBody: TableDataItem[]
  maxWidth?: number | string
  borderAround?: boolean
  borderX?: boolean
  borderY?: boolean
  showHeader?: boolean
  fixedHeader?: boolean
  resize?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  maxWidth: '',
  borderAround: false,
  borderX: true,
  borderY: true,
  showHeader: true,
  fixedHeader: false,
  resize: true,
})

const tableHead = ref<ColumnItem[] | ColumnGroupedItem[]>(props.tableHead),
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

function setTableWidth () {
  tableWidth.value = tableMainDiv.value?.offsetWidth as number
}

function startResize ({ index, key, el }: IResizerDataEmit) {
  moveResizer.startResize({ index, key, el })
}

const moveResizer = new MouseMoveResizer(tableHead.value)

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
