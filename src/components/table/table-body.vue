<template>
  <VueDraggableNext
    v-model="tableDataListForDragNDrop"
    class="dragArea list-group w-full table__body"
    tag="tbody"
    v-bind="dragOptions"
    handle=".drag-btn"
    @change="log"
  >
    <template #item="{ element }">
      <div class="list-group-item table__drag-future">
        {{ element.name }}
      </div>
    </template>
    <transition-group>
      <tr
        v-for="(row, rowIndex) in tableDataListForDragNDrop"
        :key="rowIndex"
        :class="['table__body-row']"
      >
        <tbody @click="dataRowClicked(row, rowIndex)">
          <td
            v-for="(column, colIndex) in tableHead"
            :key="colIndex"
            :class="[
              'table__body-data',
              typeof row.data[column.key] === 'object' ? getClassOfCol(row.data[column.key].class) : '',
            ]"
            :style="{ width: `${column.width}px` }"
          >
            <slot
              :name="`cell(${column.key})`"
              :value="
                typeof row.data[column.key] === 'object' ? row.data[column.key].value : row.data[column.key]
              "
              :item="row"
            >
              {{ typeof row.data[column.key] === 'object' ? row.data[column.key as string].value : row.data[column.key] || `&nbsp;` }}
            </slot>
          </td>
        </tbody>
        <tbody 
          v-if="row.isOpenAccordion"
        >
          <slot 
            v-if="!!row.children"
            name="table__item-accordion"
            :row="row"
          >
            {{ row }}
          </slot>
        </tbody>
      </tr>
    </transition-group>
  </VueDraggableNext>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TableBodyComponent',
})
</script>

<script lang="ts" setup>
import { ref, computed } from 'vue'

import { VueDraggableNext } from 'vue-draggable-next'
import getClassOfCol from '@/helpers/get-class-of-col'

import type ITableHeadItem from '@/interfaces/table/column-item'
import type ITableBodyItem from '@/interfaces/table/data-item-base'

interface IProps {
  tableBody: ITableBodyItem[]
  tableHead: ITableHeadItem[]
}

const props = defineProps<IProps>()

const rowsData = ref<ITableBodyItem[]>(props.tableBody)

const dragOptions = ref<Object>({
  animation: 200,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost',
})

const tableDataListForDragNDrop = computed<ITableBodyItem[]>({
  get () {
    return rowsData.value
  },
  set (value: ITableBodyItem[]) {
    rowsData.value = value
  },
})

function generateTableData () {
  return rowsData.value.map(item => {

    if(item.children && !!item.children.bodyData.length) {
      item.isOpenAccordion = ref<boolean>(false)
    } 
  })
}

function dataRowClicked (row: any, rowIndex: number) {
  if(row.children) {
    row.isOpenAccordion = !row.isOpenAccordion
  }
}

function log (event: Event): void {
  console.log(event)
}

generateTableData()
</script>
