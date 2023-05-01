<template>
  <div class="table-main">
    <div
      ref="table"
      class="table__wrapper table--theme-dark table--theme-border-x table--theme-border-y table--theme-stripe"
      :style="{
        'max-width': tableMaxWidthSize,
      }"
    >
      <table 
        ref="tableMain"
        class="table__content"
      >
        <thead
          v-if="showHeader && hasChildren"
          :class="['table__head', {'table__head-fixed': fixedHeader}]"
        >
          <tr
            v-for="rowItem in tableColumnDataHead"
            :key="rowItem"
            :class="['table__head-row table__row', Array.isArray(rowItem.class) ? rowItem.class.join(' ') : rowItem.class]"
          >
            <th
              v-for="(column, index) in rowItem"
              :key="index"
              :style="{ width: `${getWidthByKeyCols(column.key) || column.width}px`}"
              :colspan="column.colspan"
              :rowspan="column.rowspan"
              :class="['table__head-col', Array.isArray(column.class) ? column.class.join(' ') : column.class]"
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
        <thead
          v-else-if="showHeader && !hasChildren"
          :class="['table__head', {'table__head-fixed': fixedHeader}]"
        >
          <th
            v-for="(column, index) in tableColumnDataHead"
            :key="index"
            :style="{ width: `${getWidthByKeyCols(column.key) || column.width}px`}"
            :colspan="column.colspan"
            :class="['table__head-col', Array.isArray(column.class) ? column.class.join(' ') : column.class]"
          >
            <slot
              :name="`cell-head(${column.key})`"
              :value="column.lable"
              :item="column"
            >
              {{ column.label }}
              <span
                v-if="
                  index !== columnsData.length - 1 &&
                    column.resizable !== false && resize
                "
                class="resize-handle table__head-col-resize"
                @mousedown="startResize(index, column.key)"
              />
            </slot>
          </th>
        </thead>
        <draggable
          v-model="myList"
          class="dragArea list-group w-full table__body"
          tag="tbody"
          v-bind="dragOptions"
          handle=".handle"
          :move="checkMove"
          @start="drag = true"
          @end="drag = false"
          @change="log"
        >
          <template #item="{ element }">
            <div
              class="list-group-item table__drag-future"
              :class="{ 'not-draggable': !enabled }"
            >
              {{ element.name }}
            </div>
          </template>
          <transition-group>
            <tr 
              v-for="(row, rowIndex) in myList"
              :key="rowIndex" 
              :class="['table__body-row', rowClass]"
            >
              <td 
                v-for="(column, colIndex) in tableColumnDataBody"
                :key="colIndex"
                :class="['table__body-data', Array.isArray(row[column.key].class) ? row[column.key].class.join(' ') : row[column.key].class]"
              >
                <slot
                  :name="`cell(${column.key})`"
                  :value="row[column.key]"
                  :item="row"
                >
                  {{ row[column.key] }}
                </slot>
              </td>
            </tr>
          </transition-group>
          <!-- <div
            v-for="element in myList"
            :key="element.name"
            class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center"
          >
            {{ element.name }}
          </div> -->
        </draggable>
      </table>
    </div>
  </div>
</template>

<script>
import { VueDraggableNext } from 'vue-draggable-next'

export default {
  name: 'TableComponent',
  components: {
    draggable: VueDraggableNext,
  },
  props: {
    tableColumns: {
      type: Array,
      required: true,
      default: () => [],
    },
    tableData: {
      type: Array,
      required: true,
      default: () => [],
    },
    maxWidth: {
      required: false,
      type: [Number, String],
      default: '',
    },
    borderAround: {
      required: false,
      type: Boolean,
      default: true,
    },
    borderX: {
      required: false,
      type: Boolean,
      default: true,
    },
    borderY: {
      required: false,
      type: Boolean,
      default: false,
    },
    showHeader: {
      required: false,
      type: Boolean,
      default: true
    },
    rowClass: {
      required: false,
      type: String,
      default: ''
    },
    fixedHeader: {
      required: false,
      type: Boolean,
      default: false
    },
    resize: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      resizing: false,
      resizeIndex: null,
      startX: null,
      columnsData: this.tableColumns,
      rowsData: this.tableData,
      tableWidth: null,
      tableHeight: null,
      columnsRowGrouped: [],
      columnsRowSpreated: []
    }
  },
  computed: {
    myList: {
      get () {
        return this.rowsData
      },
      set (value) {
        this.rowsData = value
      },
    },
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      }
    },

    tableMaxWidthSize () {
      if (this.maxWidth && typeof this.maxWidth === 'number') {
        return `${this.maxWidth}px`
      } else if (this.maxWidth && typeof this.maxWidth === 'string') {
        return this.maxWidth
      } else {
        return `${this.tableMaxWidth}px`
      }
    },
    
    tableMaxWidth () {
      if(this.maxWidth) {
        return this.maxWidth
      } else {
        return this.tableWidth
      }
    },

    hasChildren () {
      return this.columnsData.some(item => item.children && item.children.length)
    },

    tableColumnDataHead () {
      if(this.hasChildren) {
        return this.columnsRowGrouped
      }else {
        return this.columnsData
      }
    },

    tableColumnDataBody () {
      if(this.hasChildren) {
        return this.columnsRowSpreated
      } else {
        return this.columnsData
      }
    }

  },
  created () {
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.stopResize)
  },
  mounted () {
    this.setTableWidth()
    this.setHeadColsWidth(this.columnsData, this.tableWidth)

    if(this.hasChildren) {
      this.setHeadColsSpread(this.columnsData)
      this.setHeadColsGrouping(this.columnsData)
    }
  },
  unmounted () {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.stopResize)
  },
  methods: {
    setHeadColsGrouping (data, index=null) {
      const indexColumnRow = index ? index : this.columnsRowGrouped.length

      if(!this.columnsRowGrouped[indexColumnRow] || !this.columnsRowGrouped[indexColumnRow].length) {
        this.columnsRowGrouped[indexColumnRow] = []
      } 

      data.forEach(item => {
        const _ = JSON.parse(JSON.stringify(item))

        delete _.children
        this.columnsRowGrouped[indexColumnRow].push(_)

        if(item.children && item.children.length) {
          this.setHeadColsGrouping(item.children, indexColumnRow + 1)
        }
      })
    },

    setHeadColsSpread (data) {
      data.forEach(item => {
        if(item.children && item.children.length) {
          this.setHeadColsSpread(item.children)
        }else if(!item.children) {
          this.columnsRowSpreated.push(item)
        }
      })
    },

    setTableWidth () {
      const table = this.$refs.table

      this.tableWidth = table.offsetWidth
    },
    
    setHeadColsWidth (data, maxWidth) {
      const columnsWithoutWidth = []
      let overWidth = maxWidth
      
      this.setHeadColsWidthIfTheyExists(data, columnsWithoutWidth, maxWidth)

      if (columnsWithoutWidth.length) {
        this.setHeadColsWidthIfTheyNotExists(data, overWidth, columnsWithoutWidth)
      }
    },

    getHeadColWidth (width, minWidth, maxWidth) {

      if(typeof width === 'string') {
        if (Number(width)) {
          return this.getHeadColWidth(Number(width), Number(minWidth))
        } else if (width.includes('%')) {
          const percentNumber = Number(width.replace('%', ''))
          const colWidthNumber = (maxWidth / 100) * percentNumber
                    
          return this.getHeadColWidth(Number(colWidthNumber), minWidth, maxWidth)
        } else if (width.includes('/')) {
          const percentNumber =
            (100 / Number(width.split('/')[1])) *
            Number(width.split('/')[0])
          const colWidthNumber = (maxWidth / 100) * percentNumber
      
          return this.getHeadColWidth(Number(colWidthNumber), minWidth, maxWidth)
        }
      } else {
        
        if(width < Number(minWidth)) {
          return minWidth
        } else {
          return width
        }
      }
    },

    setHeadColsWidthIfTheyExists (data, columnsWithoutWidth, maxWidth) {
      data.forEach((item) => {
        if(!item.width) {
          columnsWithoutWidth.push(item)
        } else {
          item.width = this.getHeadColWidth(item.width, item.minWidth, maxWidth)
        }
      })
    },

    setHeadColsWidthIfTheyNotExists (data, overWidth, columnsWithoutWidth) {
      data.forEach((item) => {
        if (item.width && typeof item.width === 'number') {
          overWidth -= item.width
        }
      })
      
      if (overWidth > 0) {
        data.forEach((item) => {
          if (!item.width) {
            item.width = (overWidth - 10) / columnsWithoutWidth.length
          } 
          
          if (item.children && item.children.length) {
            this.setHeadColsWidth(item.children, item.width)
          }
        })
      }
    },

    getWidthByKeyCols (key, data=this.columnsData) {
      data.forEach(item => {
        if(item.key === key) {
          return item.width || null
        } else if (item.children && item.children.length) {
          return this.getWidthByKeyCols(key, item.children)
        }
      })
    },

    startResize (index) {
      this.resizing = true
      this.resizeIndex = index
      this.startX = event.pageX
    },

    stopResize () {
      this.resizing = false
      this.resizeIndex = null
      this.startX = null
    },

    handleMouseMove (event) {
      if (this.resizing) {
        const deltaX = event.pageX - this.startX
        const currentColumn = this.columnsData[this.resizeIndex]
        const currentParallelColumn = this.columnsData[this.resizeIndex + 1]
        const newColumnWidth = currentColumn.width + deltaX
        const newParralelColumnWidth = currentParallelColumn.width + deltaX * -1

        if (
          newColumnWidth >= currentColumn.minWidth &&
          newParralelColumnWidth >= currentParallelColumn.minWidth
        ) {
          currentColumn.width = newColumnWidth
          currentParallelColumn.width = newParralelColumnWidth
        }

        this.startX = event.pageX
      }
    },

    checkMove: function (e) {
      window.console.log('Future index: ' + e.draggedContext.futureIndex)
    },

    log (event) {
      console.log(event)
    },
  },
}
</script>

<style lang="scss" scoped>
.table {
  &-main {
    padding: 40px;
    background: aqua;
  }

  &__wrapper {
    position: relative;
    overflow: auto;
    width: 100%;
    height: 100%;
    user-select: text;
    &::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: #f1f1f1; 
    }
    
    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: #888; 
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #555; 
    }

    table {
      border-left: none;
      border-right: none;
      border-top: none;
      border-bottom: none;
    }
  }
  
  &__content {
    border-collapse: separate;
    border-spacing: 0;
    border-style: hidden;
    width: max-content;
    th, td {
      position: relative;
      white-space: pre-wrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  &__head {
    &-row {}
    &-col {
      padding: 1rem;
      font-size: 1.6rem;
      font-weight: 600;
    }
  }

  &--theme {
    &-light {
      table {
        background: white;
        td, th {
          color: black
        }
      }
    }
    &-light.table--theme-border-x {
      table {
        border-bottom: 1px solid #c0c0c0;
        td, th {
          border-top: 1px solid #c0c0c0;
        }
      }
    }
    &-light.table--theme-border-y {
      table {
        border-left: 1px solid #c0c0c0;
        td, th {
          border-right: 1px solid #c0c0c0;
        }
      }
    }
    &-light.table--theme-stripe {
      .table__content .table__body .table__body-row {
        &:nth-child(odd) {
          background: #f2f2f2;
        }
        &:hover {
          background: #ececec;
        }
      }
    }
    &-dark {
      table {
        background: rgb(10, 10, 10);
        td, th {
          color: white
        }
      }
    }
    &-dark.table--theme-border-x {
      table {
        border-bottom: 1px solid #000000;
        td, th {
          border-top: 1px solid #000000;
        }
      }
    }
    &-dark.table--theme-border-y {
      table {
        border-left: 1px solid #000000;
        td, th {
          border-right: 1px solid #000000;
        }
      }
    }
    &-dark.table--theme-stripe {
      .table__content .table__body .table__body-row {
        background: #1f1f1f;
        &:hover {
          background: #131313;
        }
      }
    }
  }

  &__body {
    &-data {
      padding: .8rem 1rem;
      font-size: 1.4rem;
    }
  }
  &__head--fixed {
    position: sticky;
    top: 0;
    right: 0;
    left: 0;
    background: white;
    z-index: 4;
  }
}
.resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 100%;
  cursor: col-resize;
}

// table thead tr:first-child th {
//   border-top: none;
// }

// table tbody tr:last-child td {
//   border-bottom: none;
// }

// table td:first-child {
//   border-left: none;
// }

// table td:last-child,
// table th:last-child {
//   border-right: none;
// }
</style>
