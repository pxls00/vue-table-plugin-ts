<template>
  <draggable
    v-model="myList"
    class="dragArea list-group w-full table__body"
    tag="tbody"
    v-bind="dragOptions"
    handle=".drag-btn"
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
          v-for="(column, colIndex) in tableColumnData"
          :key="colIndex"
          :class="[
            'table__body-data',
            row[column.key]?.class ? getClassOfCol(row[column.key].class) : '',
          ]"
        >
          <slot
            :name="`cell(${column.key})`"
            :value="row[column.key]"
            :item="row"
          >
            {{ row[column.key]?.value || row[column.key] }}
          </slot>
        </td>
      </tr>
    </transition-group>
  </draggable>
</template>

<script>
import { VueDraggableNext } from 'vue-draggable-next'


export default {
  name: 'TableBodyComponent',

  components: {
    draggable: VueDraggableNext
  },

  props: {
    bodyData: {
      type: Array,
      required: true
    },
    tableColumnData: {
      type: Array,
      required: true
    },
    rowClass: {
      required: false,
      type: String,
      default: ''
    },
  },

  data () {
    return {
      rowsData: this.bodyData
    }
  },

  computed: {
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      }
    },
    myList: {
      get () {
        return this.rowsData
      },
      set (value) {
        this.rowsData = value
      },
    },
  },
  methods: {
    checkMove: function (e) {
      window.console.log('Future index: ' + e.draggedContext.futureIndex)
    },

    log (event) {
      console.log(event)
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
