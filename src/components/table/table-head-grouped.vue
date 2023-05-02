<template>
  <thead
    :class="['table__head', { 'table__head-fixed': fixedHeader }]"
  >
    <tr
      v-for="rowItem in tableHeadData"
      :key="rowItem"
      class="table__head-row table__row"
    >
      <th
        v-for="(column, index) in rowItem"
        :key="index"
        :style="{ width: `${getWidthByKeyCols(column.key) || column.width}px` }"
        :colspan="column.colspan"
        :rowspan="column.rowspan"
        :class="['table__head-col', getClassOfCol(column)]"
      >
        <slot
          :name="`cell-head(${column.key})`"
          :value="column.lable"
          :item="column"
        >
          {{ column.label }}
        </slot>
      </th>
    </tr>
  </thead>
</template>

<script>
export default {
  name: 'TableHeadGroupedComponent',
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
    tableHeadData: {
      required: true,
      type: Array
    },
    columnsData: {
      required: true,
      type: Array
    }
  },
  emits: ['startResize'],
  methods: {
    getWidthByKeyCols (key, data=this.columnsData) {
      data.forEach(item => {
        if(item.key === key) {
          return item.width || null
        } else if (item.children && item.children.length) {
          return this.getWidthByKeyCols(key, item.children)
        }
      })
    },

    getClassOfCol (item) {
      if(item.hasOwnProperty('class')) {
        if(Array.isArray(item.class)) {
          return item.class.join(' ')
        }
        
        return item.class
      } 

      return ''
    },
  }
}
</script>
