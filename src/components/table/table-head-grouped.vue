<template>
  <thead :class="['table__head', { 'table__head-fixed': fixedHeader }]">
    <tr
      v-for="(rowItem, i) in props.tableHeadData"
      :key="i"
      class="table__head-row table__row"
    >
      <th
        v-for="(column, index) in rowItem"
        :key="index"
        :style="{
          width: `${
            getWidthByKeyCols(column.key, props.columnsData) || column.width
          }px`,
        }"
        :colspan="column.colspan"
        :rowspan="column.rowspan"
        :class="['table__head-col', getClassOfCol(column)]"
      >
        <slot
          :name="getSlotName(`cell-head(${column.key})`, props.childrenNestedLength)"
          :value="column.label"
          :item="column"
        >
          {{ column.label }}
        </slot>
      </th>
    </tr>
  </thead>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TableHeadGroupedComponent',
})
</script>

<script lang="ts" setup>
import getClassOfCol from '@/helpers/get-class-of-col'
import getWidthByKeyCols from '@/helpers/get-width-by-key-cols'
import getSlotName from '@/helpers/get-slot-name'


import type ITableHeadColumnItem from '@/interfaces/table/column-item'
import type ColumnGroupedRow from '@/types/table/column-grouped-row'

interface IProps {
  fixedHeader: boolean
  tableHeadData: ColumnGroupedRow[]
  columnsData: ITableHeadColumnItem[],
  childrenNestedLength?: number
}

const props = withDefaults(defineProps<IProps>(), {
  childrenNestedLength: 1
})

</script>
