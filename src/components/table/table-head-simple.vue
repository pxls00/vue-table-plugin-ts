<template>
  <thead
    :class="['table__head', { 'table__head-fixed': fixedHeader }]"
  >
    <th
      v-for="(column, index) in columnsData"
      :key="index"
      :style="{ width: `${column.width}px` }"
      :colspan="column.colspan"
      :class="['table__head-col', getClassOfCol(column)]"
    >
      <slot
        :name="`cell-head(${column.key})`"
        :value="column.lable"
        :item="column"
      >
        {{ column.label }}
        <span
          v-if="isCanResizeCol(index, column)"
          class="resize-handle table__head-col-resize"
          @mousedown="startResize(index, column.key)"
        />
      </slot>
    </th>
  </thead>
</template>

<script>
export default {
  name: 'TableHeadSimpleComponent',
  props: {
    fixedHeader: {
      required: false,
      type: Boolean,
      default: false
    },
    resize: {
      required: false,
      type: Boolean,
      default: true
    },
    columnsData: {
      required: true,
      type: Array
    }
  },
  emits: ['startResize'],
  methods: {
    getClassOfCol (item) {
      if(item.hasOwnProperty('class')) {
        if(Array.isArray(item.class)) {
          return item.class.join(' ')
        }
        
        return item.class
      } 

      return ''
    },

    startResize (index, key) {
      this.$emit('startResize', {index, key})
    },

    isCanResizeCol (index, column) {
      if(index !== this.columnsData.length - 1 && column.resizable !== false && this.resize) {        
        return true
      }
     
      return false
    }
  }
}
</script>
