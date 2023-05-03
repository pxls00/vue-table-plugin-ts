<template>
  <thead
    :class="['table__head', { 'table__head-fixed': fixedHeader }]"
  >
    <tr
      v-for="rowItem in props.tableHeadData"
      :key="rowItem"
      class="table__head-row table__row"
    >
      <th
        v-for="(column, index) in rowItem"
        :key="index"
        :style="{ width: `${getWidthByKeyCols(column.key, props.columnsData) || column.width}px` }"
        :colspan="column.colspan"
        :rowspan="column.rowspan"
        :class="['table__head-col', getClassOfCol(column)]"
      >
        <slot
          :name="`cell-head(${column.key})`"
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
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'TableHeadGroupedComponent'
})
</script>

<script lang="ts" setup>
import getClassOfCol from '@/helpers/get-class-of-col'
import getWidthByKeyCols from '@/helpers/get-width-by-key-cols'


import type ITableHeadColumnItem from '@/interfaces/table/column-item'
import type ColumnGroupedRow from '@/types/table/column-grouped-row'

interface IProps {
  fixedHeader: boolean,
  tableHeadData: ColumnGroupedRow[],
  columnsData: ITableHeadColumnItem[]
}

const props = defineProps<IProps>()

</script>
