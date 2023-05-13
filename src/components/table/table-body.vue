<template>
  <VueDraggableNext
    v-model="myList"
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
        v-for="(row, rowIndex) in myList"
        :key="rowIndex"
        :class="['table__body-row']"
      >
        <tbody @click="dataRowClicked(row, rowIndex)">
          <td
            v-for="(column, colIndex) in tableColumnData"
            :key="colIndex"
            :class="[
              'table__body-data',
              row[column.key]?.class ? getClassOfCol(row[column.key].class) : '',
            ]"
            :style="{ width: `${column.width}px` }"
          >
            <slot
              :name="`cell(${column.key})`"
              :value="row[column.key]"
              :item="row"
            >
              {{ row[column.key]?.value || row[column.key] || `&nbsp;` }}
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

import type ITableHeadColumnItem from '@/interfaces/table/column-item'

interface IProps {
  bodyData: any[]
  tableColumnData: ITableHeadColumnItem[]
}

const props = defineProps<IProps>()

const rowsData = ref<any[]>(props.bodyData)

const dragOptions = ref<Object>({
  animation: 200,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost',
})

const myList = computed<any[]>({
  get () {
    return rowsData.value
  },
  set (value: any[]) {
    rowsData.value = value
  },
})

function generateTableData () {
  return rowsData.value.map(item => {
    if(item.children) {
      item.isOpenAccordion = ref<boolean>(false)
    } 
  })
}

function dataRowClicked (row: any, rowIndex: number) {
  if(row.children) {
    console.log(row.isOpenAccordion)
    row.isOpenAccordion = !row.isOpenAccordion
  }
}

function log (event: Event): void {
  console.log(event)
}

generateTableData()
</script>
