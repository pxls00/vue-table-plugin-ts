<template>
  <thead :class="['table__head', { 'table__head-fixed': props.fixedHeader }]">
    <th
      v-for="(column, index) in props.columnsData"
      :key="index"
      :style="{ width: `${column.width}px` }"
      :class="['table__head-col', getClassOfCol(column)]"
    >
      <slot
        :name="`cell-head(${column.key})`"
        :value="column.label"
        :item="column"
      >
        <p class="table__head-col-content">{{ column.label }} &nbsp; </p>
        <span
          v-if="isCanResizeCol(index, column)"
          :ref="(el:HTMLSpanElement) => {resizer[index] = el}"
          :class="['resize-handle table__head-col-resize']"
          @mousedown="startResize(index, column.key)"
        />
      </slot>
    </th>
  </thead>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TableHeadSimpleComponent',
})
</script>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import getClassOfCol from '@/helpers/get-class-of-col'

import type ITableHeadColumnItem from '@/interfaces/table/column-item'
import type IResizerDataEmit from '@/interfaces/resizer-data-emit'

interface IProps {
  fixedHeader: boolean
  resize: boolean
  columnsData: ITableHeadColumnItem[]
}

const resizer = ref<HTMLSpanElement[]>([])

const props = defineProps<IProps>()
const emits = defineEmits<{
  (e: 'startResize', data: IResizerDataEmit): IResizerDataEmit
}>()

function startResize (index: number, key: string): void {
  emits('startResize', { index, key, el:(resizer.value[index])})
}

function isCanResizeCol (index: number, column: ITableHeadColumnItem): boolean {
  if (
    index !== props.columnsData.length - 1 &&
    column.resizable !== false &&
    props.resize
  ) {
    return true
  }

  return false
}

onMounted(() => {
  console.log(resizer)
})
</script>
