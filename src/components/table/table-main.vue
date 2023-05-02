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
        <TableHeadGroupedComponent 
          v-if="showHeader && hasChildren"
          :fixed-header="fixedHeader"
          :resize="resize"
          :table-head-data="tableColumnDataHead"
          :columns-data="columnsData"
        >
          <template v-for="(_, slot) in $slots" #[slot]>
            <slot :name="slot" />
          </template>
        </TableHeadGroupedComponent>
        <TableHeadSimpleComponent 
          v-else-if="showHeader && !hasChildren"
          :fixed-header="fixedHeader"
          :resize="resize"
          :columns-data="columnsData"
          @start-resize="startResize"
        >
          <template v-for="(_, slot) in $slots" #[slot]>
            <slot :name="slot" />
          </template>
        </TableHeadSimpleComponent>
        <TableBodyComponent 
          :body-data="tableData"
          :table-column-data="tableColumnDataBody"
          :row-class="rowClass"
        >
          <template v-for="(_, slot) in $slots" #[slot]>
            <slot :name="slot" />
          </template>
        </TableBodyComponent>
      </table>
    </div>
  </div>
</template>

<script>
import TableHeadGroupedComponent from '@/components/table/table-head-grouped.vue'
import TableHeadSimpleComponent from '@/components/table/table-head-simple.vue'
import TableBodyComponent from '@/components/table/table-body.vue'

export default {
  name: 'TableComponent',
  components: {
    TableHeadGroupedComponent,
    TableHeadSimpleComponent,
    TableBodyComponent
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
    },
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

    getClassOfCol (item) {
      if(item.hasOwnProperty('class')) {
        if(Array.isArray(item.class)) {
          return item.class.join(' ')
        }
        
        return item.class
      } 

      return ''
    },

    startResize ({index}) {
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
  },
}
</script>

<style lang="scss" scoped>
</style>
