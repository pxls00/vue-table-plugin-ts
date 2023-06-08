<template>
  <thead :class="['table__head', { 'table__head--fixed': fixedHeader }]">
    <th
      v-for="(column, index) in columnsData"
      :key="index"
      :style="{ width: `${column.width}px` }"
      :class="['table__head-col', getClassOfCol(column.class || '')]"
    >
      <slot
        :name="
          getSlotName(`cell-head(${column.key})`, childrenNestedLength)
        "
        :value="column.label"
        :item="column"
      >
        <p class="table__head-col-content">
          {{ column.label || '&nbsp;' }}
        </p>
        <span
          v-if="isCanResizeCol(index, column)"
          :ref="(el: any):void => {resizer[index] = el}"
          :class="['resize-handle table__head-col-resize']"
          @mousedown="startResize(index, column.key)"
        ></span>
      </slot>
    </th>
  </thead>
</template>

<script src='./index.ts' lang='ts'></script>
