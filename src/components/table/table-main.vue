<template>
  <div class="table-main">
    <div
      ref="table"
      class="table-wrapper"
      :style="{
        'max-width': tableMaxWidthSize,
        'max-height': !!maxHeight ? `${maxHeight}px`: 'max-content'
      }"
    >
      <table 
        ref="tableMain"
        class="table-content table-border-around table-border-x table-border-y"
      >
        <thead
          v-if="showHeader"
          :class="{'table-fixed-header': fixedHeader}"
        >
          <tr
            v-for="rowItem in columnsRowGrouped"
            :key="rowItem"
          >
            <th
              v-for="(column, index) in rowItem"
              :key="index"
              :style="{ width: `${getWidthByKeyCols(column.key) || column.width}px`}"
              :colspan="column.colspan"
              :rowspan="column.rowspan"
            >
              {{ column.label }}
              <span
                v-if="
                  index !== columnsData.length - 1 &&
                    column.resizable !== false
                "
                class="resize-handle"
                @mousedown="startResize(index, column.key)"
              />
            </th>
          </tr>
        </thead>
        <draggable
          v-model="myList"
          class="dragArea list-group w-full"
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
              class="list-group-item"
              :class="{ 'not-draggable': !enabled }"
            >
              {{ element.name }}
            </div>
          </template>
          <transition-group>
            <tr v-for="(row, rowIndex) in myList" :key="rowIndex" :class="rowClass">
              <td v-for="(column, colIndex) in columnsRowSpreated" :key="colIndex">
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
    maxHeight: {
      required: false,
      type: [Number, String],
      default: 'auto',
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
      default: false
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
    }

  },
  created () {
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.stopResize)
  },
  mounted () {
    this.setTableWidth()
    this.setHeadColsSpread(this.columnsData)
    this.setHeadColsWidth(this.columnsData, this.tableWidth)
    this.setHeadColsGrouping(this.columnsData)
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

        if(item.children) {
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
      console.log(data, maxWidth)
      const columnsWithoutWidth = []
      let overWidth = maxWidth
      
      this.setHeadColsWidthIfTheyExists(data, columnsWithoutWidth, maxWidth)

      if (columnsWithoutWidth.length) {
        this.setHeadColsWidthIfTheyNotExists(data, overWidth, columnsWithoutWidth)
      }
    },

    getHeadColWidth (width, minWidth, maxWidth) {
      console.log(maxWidth)

      if(typeof width === 'string') {
        if (Number(width)) {
          return this.getHeadColWidth(Number(width), Number(minWidth))
        } else if (width.includes('%')) {
          const percentNumber = Number(width.replace('%', ''))
          console.log(percentNumber, maxWidth)
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
            item.width = overWidth / columnsWithoutWidth.length
          } 
          
          if (item.children && item.children.length) {
            console.log(item.children, item.width)
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
table thead th,
table tbody td {
  border: .5px solid #000000;
}
table thead tr:first-child th:first-child {
  border-left: none;
}

table thead tr:first-child th:first-child,
table td:first-child {
  border-left: none;
}

table td:last-child,
table th:last-child {
  border-right: none;
}
.table {
  &-border-x {
    td,
    th {
      padding: 1rem;
    }
  }
  &-border-x {
    td,
    th {
      padding: 1rem;
    }
  }
  &-wrapper {
    position: relative;
    overflow: auto;
    width: 100%;
    height: 100%;
    user-select: text;
  }
  &-content {
    border-collapse: separate;
    border-spacing: 0;
    border-style: hidden;
    width: max-content;
    th {
      position: relative;
    }
    td {
      overflow: hidden;
    }
  }
  &-fixed-header {
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
</style>
