import { defineComponent, ref } from 'vue'
import getClassOfCol from '../../../helpers/get-class-of-col'
import getWidthByKeyCols from '../../../helpers/get-width-by-key-cols'
import getSlotName from '../../../helpers/get-slot-name'

// types
import type { PropType } from 'vue'
import type { IHeadItemBase, IResizeData} from '../../../index.types' 

export default defineComponent({
  name: 'TableHeadSimpleComponent',
  props: {
    fixedHeader: {
      required: true,
      type: Boolean
    },
    columnsData: {
      required: true,
      type: Array as PropType<IHeadItemBase[]>,
    },
    childrenNestedLength: {
      required: false,
      default: 1,
      type: Number
    },
    resize: {
      requred: true,
      type: Boolean
    }
  },
  emits: {
    startResize: (_data: IResizeData) => _data as IResizeData
  },
  setup (props, context) {
    const resizer = ref<HTMLSpanElement[]>([])

    function startResize (index: number, key: string): void {
      context.emit('startResize', { index, key, el: resizer.value[index] })
    }

    function isCanResizeCol (index: number, column: IHeadItemBase): boolean {
      if (
        index !== props.columnsData.length - 1 &&
        column.resizable !== false &&
        props.resize
      ) {
        return true
      }
    
      return false
    }
    return {
      // refs
      resizer,

      // methods
      getClassOfCol,
      getWidthByKeyCols,
      getSlotName,
      startResize,
      isCanResizeCol
    }
  }
})