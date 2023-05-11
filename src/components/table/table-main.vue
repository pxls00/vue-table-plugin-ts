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
          :table-head-data="(tableColumnDataHead as ColumnItemGroupedRowItem[])"
          :columns-data="columnsData"
        >
          <template v-for="(_, slot) in $slots" #[slot]>
            <slot :name="slot" />
          </template>
        </TableHeadGroupedComponent>
        <TableHeadSimpleComponent
          v-else-if="showHeader && !hasChildren"
          :fixed-header="fixedHeader"
          :resize="resize"
          :columns-data="columnsData"
          @start-resize="startResize"
        >
          <template v-for="(_, slot) in $slots" #[slot]>
            <slot :name="slot" />
          </template>
        </TableHeadSimpleComponent>
        <TableBodyComponent
          :body-data="tableData"
          :table-column-data="tableColumnDataBody"
        >
          <template v-for="(_, slot) in $slots" #[slot]>
            <slot :name="slot" />
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

import type ITableHeadColumnItem from '@/interfaces/table/column-item'
import type ColumnItemGroupedRowItem from '@/types/table/column-grouped-row'
import type ColumnItemWidthType from '@/types/table/column-item-width'
import type IResizerDataEmit from '@/interfaces/resizer-data-emit'

interface IProps {
  tableColumns: ITableHeadColumnItem[]
  tableData: any
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

const columnsData = ref<ITableHeadColumnItem[]>(props.tableColumns),
  tableWidth = ref<number>(),
  columnsRowGrouped = ref<ColumnItemGroupedRowItem[]>([]),
  columnsRowSpreated = ref<ITableHeadColumnItem[]>([]),
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
    return props.maxWidth
  }

  return tableWidth.value
})

const hasChildren = computed<boolean>(() => {
  return columnsData.value.some((item) => item.children && item.children.length)
})

const tableColumnDataHead = computed<
  ColumnItemGroupedRowItem[] | ITableHeadColumnItem[]
>(() => {
  if (hasChildren.value) {
    return columnsRowGrouped.value
  } else {
    return columnsData.value
  }
})

const tableColumnDataBody = computed<ITableHeadColumnItem[]>(() => {
  if (hasChildren.value) {
    return columnsRowSpreated.value
  } else {
    return columnsData.value
  }
})

function setTableWidth () {
  tableWidth.value = tableMainDiv.value?.offsetWidth as number
}

function startResize ({ index, key, el }: IResizerDataEmit) {
  moveResizer.startResize({ index, key, el })
}

const moveResizer = new MouseMoveResizer(columnsData.value)

document.addEventListener('mousemove', (event) =>
  moveResizer.handleMouseMove(event)
)
document.addEventListener('mouseup', (event) => {
  moveResizer.stopResize()
})

onMounted(() => {
  setTableWidth()

  const generateWidth = new GenerateHeadColWidths(
    tableWidth.value as number,
    columnsData.value as ITableHeadColumnItem[],
    columnsRowSpreated.value as ITableHeadColumnItem[],
    columnsRowGrouped.value as ColumnItemGroupedRowItem[]
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
