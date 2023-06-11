import { defineComponent } from 'vue'
import getClassOfCol from '../../../helpers/get-class-of-col'
import getWidthByKeyCols from '../../../helpers/get-width-by-key-cols'
import getSlotName from '../../../helpers/get-slot-name'

// types
import type { PropType } from 'vue'
import type { TTableHeadGroupedRow, IHeadItemBase } from '../../../index.types'

export default defineComponent({
  name: 'TableHeadGroupedComponent',
  props: {
    fixedHeader: {
      required: true,
      type: Boolean,
    },
    tableHeadData: {
      required: true,
      type: Array as PropType<TTableHeadGroupedRow[]>,
    },
    columnsData: {
      required: true,
      type: Array as PropType<IHeadItemBase[]>,
    },
    childrenNestedLength: {
      required: false,
      default: 1,
      type: Number,
    },
  },
  setup() {
    return {
      //methods
      getClassOfCol,
      getWidthByKeyCols,
      getSlotName,
    }
  },
})
