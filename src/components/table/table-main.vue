<template>
  <div class="table-main">
    <div
      ref="tableHead"
      class="table-wrapper table-scrollbar table-border-around table-border-x table-border-y"
      :style="{
        'max-width':
          !!maxWidth && maxWidth !== 'auto'
            ? maxWidth + 'px'
            : !!maxWidth && typeof maxWidth === 'number'
              ? maxWidth
              : tableWidth + 'px',
      }"
    >
      <table class="table-content" :style="{ width: '0px' }">
        <thead>
          <tr
            v-for="rowItem in columnsRowGrouped"
            :key="rowItem"
          >
            <th
              v-for="(column, index) in rowItem"
              :key="index"
              :style="{ width: column.width + 'px' }"
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
                @mousedown="startResize(index)"
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
            <tr v-for="(row, rowIndex) in myList" :key="rowIndex">
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
      default: 'auto',
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
  },
  created () {
    this.setHeadColsSpread(this.columnsData)
    this.setHeadColsGrouping(this.columnsData)
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.stopResize)
  },
  mounted () {
    this.setHeadColsWidth()
  },
  unmounted () {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.stopResize)
  },
  methods: {
    setHeadColsGrouping (data, index=null) {
      const indexColumnRow = index ? index : this.columnsRowGrouped.length

      this.columnsRowGrouped[indexColumnRow] = []

      data.forEach(item => {
        this.columnsRowGrouped[indexColumnRow].push(item)

        if(item.children) {
          this.setHeadColsGrouping(item.children, indexColumnRow + 1)
          delete item.children
        }
      })
    },

    setHeadColsSpread (data) {
      console.log(data)
      data.forEach(item => {
        if(item.children && item.children.length) {
          this.setHeadColsSpread(item.children)
        }else {
          this.columnsRowSpreated.push(item)
        }
      })
    },
    
    setHeadColsWidth () {
      const elementStyle = window.getComputedStyle(this.$refs.tableHead),
        width = parseFloat(elementStyle.width)

      this.tableWidth = width
      const columnsWithoutWidth = []

      this.columnsData.forEach((item) => {
        if (item.width < item.minWidth) {
          item.width = item.minWidth
        }

        if (!item.width) {
          columnsWithoutWidth.push(item)
        } else if (typeof item.width === 'string' && Number(item.width)) {
          item.width = Number(item.width)
        } else if (typeof item.width === 'string' && item.width.includes('%')) {
          const procentNumber = Number(item.width.replace('%', ''))

          console.log(procentNumber)
          item.width = (this.tableWidth / 100) * procentNumber
        } else if (typeof item.width === 'string' && item.width.includes('/')) {
          const procent =
            (100 / Number(item.width.split('/')[1])) *
            Number(item.width.split('/')[0])

          item.width = (this.tableWidth / 100) * procent
        }
      })

      let overWidth = this.tableWidth

      if (columnsWithoutWidth.length) {
        this.columnsData.forEach((item) => {
          if (item.width && typeof item.width === 'number') {
            overWidth -= item.width
          }
        })
        console.log(overWidth)

        if (overWidth > 0) {
          this.columnsData.forEach((item) => {
            if (!item.width) {
              item.width = overWidth / columnsWithoutWidth.length
            }
          })
        }
      }
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
  &-border-around {
    border: 1px solid #eee;
  }
  &-border-x {
    td,
    th {
      padding: 1rem;
      border-bottom: 1px solid black;
      border-top: 1px solid black;
    }
  }
  &-border-x {
    td,
    th {
      padding: 1rem;
      border-right: 1px solid black;
      border-left: 1px solid black;
    }
  }
  &-wrapper {
    position: relative;
    overflow-y: auto;
    width: 100%;
    height: 100%;
    user-select: text;
  }
  &-content {
    min-width: 100%;
    table-layout: fixed;
    // border-collapse: separate;
    border-spacing: 0;
    border-collapse: collapse;
    border-style: hidden;
    th {
      position: relative;
    }
    td {
      overflow: hidden;
    }
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
