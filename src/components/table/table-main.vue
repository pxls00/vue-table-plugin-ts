<template>
  <div class="table-main">
    <div
      ref="tableMainDiv"
      class="table__wrapper table--theme-dark table--theme-border-x table--theme-border-y table--theme-stripe"
      :style="{
        'max-width': tableMaxWidthSize,
      }"
    >
      <table 
        ref="tableMain"
        class="table__content"
      >
        <TableHeadGroupedComponent 
          v-if="showHeader && hasChildren"
          :fixed-header="fixedHeader"
          :resize="resize"
          :table-head-data="tableColumnDataHead"
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
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'TableComponent'
})
</script>

<script lang="ts" setup>
import { withDefaults, ref, computed, onMounted, onUnmounted } from 'vue'

import TableHeadGroupedComponent from '@/components/table/table-head-grouped.vue'
import TableHeadSimpleComponent from '@/components/table/table-head-simple.vue'
import TableBodyComponent from '@/components/table/table-body.vue'
import GenerateHeadColWidths from '@/helpers/generate-head-col-widths'

import type ITableHeadColumnItem from '@/interfaces/table/column-item'
import type ColumnItemGroupedRowItem from '@/types/table/column-grouped-row'
import type ColumnItemWidthType from '@/types/table/column-item-width'

interface IProps {
  tableColumns: ITableHeadColumnItem[],
  tableData: any,
  maxWidth?: number |string,
  borderAround?: boolean,
  borderX?: boolean,
  borderY?: boolean,
  showHeader?: boolean,
  fixedHeader?: boolean,
  resize?: boolean
}

interface IResizeData {
  index: number,
  key: string
}

const props = withDefaults(defineProps<IProps>(), {
  maxWidth: '',
  borderAround: false,
  borderX: true,
  borderY: true,
  showHeader: true,
  fixedHeader: false,
  resize: true
})

const resizing = ref<boolean>(false),
  resizeIndex = ref<number>(0),
  startX = ref<number>(0),
  columnsData = ref<ITableHeadColumnItem[]>(props.tableColumns),
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
    
const tableMaxWidth = computed<number | undefined>(() => {
  if(props.maxWidth) {
    return props.maxWidth
  } else {
    return tableWidth.value
  }
}) 

const hasChildren = computed<boolean>(() => {
  return columnsData.value.some(item => item.children && item.children.length)
}) 

const tableColumnDataHead = computed<ColumnItemGroupedRowItem[] | ITableHeadColumnItem[]>(() => {
  if(hasChildren.value) {
    return columnsRowGrouped.value
  }else {
    return columnsData.value
  }
})

const tableColumnDataBody = computed<ITableHeadColumnItem[]>(() => {
  if(hasChildren.value) {
    return columnsRowSpreated.value
  } else {
    return columnsData.value
  }
})

function setTableWidth () {
  tableWidth.value = tableMainDiv.value?.offsetWidth as number
}

function startResize ({index}: IResizeData) {
  const eventTarget = event as Event

  resizing.value = true
  resizeIndex.value = index
  startX.value = eventTarget.pageX
}

function stopResize () {
  resizing.value = false
  resizeIndex.value = 0
  startX.value = 0
}

function handleMouseMove (event: Event) {
  if (resizing.value) {
    const deltaX:number = event.pageX - startX.value
    const currentColumn: ITableHeadColumnItem= columnsData.value[resizeIndex.value]
    const currentParallelColumn = columnsData.value[resizeIndex.value + 1]
    const newColumnWidth: number = currentColumn.width as number + deltaX
    const newParralelColumnWidth = currentParallelColumn.width as number + deltaX * -1

    if (
      newColumnWidth >= currentColumn.minWidth &&
      newParralelColumnWidth >= currentParallelColumn.minWidth
    ) {
      currentColumn.width = newColumnWidth
      currentParallelColumn.width = newParralelColumnWidth
    }
    startX.value = event.pageX
  }
}

document.addEventListener('mousemove', handleMouseMove)
document.addEventListener('mouseup', stopResize)

onMounted(() => {
  setTableWidth()
  const generateWidth = new GenerateHeadColWidths(tableWidth.value as number)

  generateWidth.setHeadColsWidth(columnsData.value, tableWidth.value as number)

  if(hasChildren.value) {
    generateWidth.setHeadColsSpread(columnsData.value, columnsRowSpreated.value)
    generateWidth.setHeadColsGrouping(columnsData.value, 0, columnsRowGrouped.value)
  }

})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', stopResize)
})

</script>

<style lang="scss" scoped>
</style>
