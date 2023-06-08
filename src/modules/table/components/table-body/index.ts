import {
  ref,
  computed,
  defineComponent
} from 'vue';
import { VueDraggableNext } from 'vue-draggable-next'
import getClassOfCol from '../../helpers/get-class-of-col'
import getSlotName from '../../helpers/get-slot-name'
// Types
import type {
  PropType,
  Ref
} from 'vue'

import type {IHeadItemBase, IBodyItemBase} from '../../index.types'

// import type ITableDataItemData from '@/interfaces/table/data-item-data'


export default defineComponent({
  name: 'TableBody',
  props: {
    tableBody: {
      required: true,
      type: Array as PropType<IBodyItemBase[]>
    },
    tableHead: {
      required: true,
      type: Array as PropType<IHeadItemBase[]>
    },
    childrenNestedLength: {
      default: 1,
      type: Number
    },
    showAccordionArrow: {
      default: true,
      type: Boolean
    }
  },
  emits: {
    dragndropChanged: (_data: IBodyItemBase[]) => _data as IBodyItemBase[]
  },
  setup(props, context) {
    const tableBodyData: Ref<IBodyItemBase[]> = ref(props.tableBody) as Ref<IBodyItemBase[]>

    const dragOptions = {
      animation: 200,
      group: 'description',
      disabled: false,
      ghostClass: 'ghost',
    }
    const tableDataListForDragNDrop = computed<IBodyItemBase[]>({
      get () {
        return tableBodyData.value
      },
      set (value: IBodyItemBase[]) {
        tableBodyData.value = value
      },
    })
    
    function generateTableData (): IBodyItemBase[] {
      return tableBodyData.value.map((item: IBodyItemBase) => {
        if (item.children && !!item.children.bodyData.length) {
          if(item.isOpenAccordion) {
            item.isOpenAccordion = ref<boolean>(false)
          }
        }
        return item
      }) as IBodyItemBase[]
    }

    function dataRowClicked (row: IBodyItemBase) {
      if (row.children && row.isOpenAccordion) {
        row.isOpenAccordion.value = !row.isOpenAccordion?.value
      }
    }

    function changed (): void {
      context.emit('dragndropChanged', tableDataListForDragNDrop.value)
    }

    generateTableData()
    return {
      //components
      VueDraggableNext,

      // refs
      tableBodyData,
      dragOptions,

      // computed
      tableDataListForDragNDrop,

      // methods
      generateTableData, 
      dataRowClicked,
      changed,
      getClassOfCol,
      getSlotName
    }
  },
})