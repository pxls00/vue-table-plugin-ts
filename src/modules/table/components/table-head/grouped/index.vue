<template>
  <thead :class="['table__head', { 'table__head--fixed': fixedHeader }]">
    <tr
      v-for="(rowItem, i) in tableHeadData"
      :key="i"
      class="table__head-row table__row"
    >
      <th
        v-for="(column, index) in rowItem"
        :key="index"
        :style="{
          width: `${
            getWidthByKeyCols(column.key, columnsData) || column.width
          }px`,
        }"
        :colspan="column.colspan"
        :rowspan="column.rowspan"
        :class="['table__head-col', getClassOfCol(column)]"
      >
        <slot
          :name="getSlotName(`cell-head(${column.key})`, childrenNestedLength)"
          :value="column.label"
          :item="column"
        >
          {{ column.label }}
        </slot>
      </th>
    </tr>
  </thead>
</template>

<script src="./index.ts" lang="ts"></script>
