import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue'

// components and modules
import MouseMoveResizer from '../../helpers/mouse-move-resizer'
import GenerateHeadColWidths from '../../helpers/get-head-col-width'
import TableHeadGroupedComponent from '../table-head/grouped/index.vue'
import TableHeadSimpleComponent from '../table-head/simple/index.vue'
import TableBodyComponent from '../table-body/index.vue'

// types
import type { PropType, Ref } from 'vue'
import type {
  IHeadItemBase,
  IHeadItemGrouped,
  IBodyItemBase,
  TTableHeadGroupedRow,
  ITableThemeOptions,
  IResizeData,
  TTableHeadItemWidth,
} from '../../index.types'

export default defineComponent({
  name: 'TableComponent',
  components: {
    TableHeadGroupedComponent,
    TableHeadSimpleComponent,
    TableBodyComponent,
  },
  props: {
    tableHead: {
      required: true,
      type: Array as PropType<IHeadItemBase[]>,
    },
    tableBody: {
      required: true,
      type: Array as PropType<IBodyItemBase[]>,
    },
    maxWidth: {
      requred: false,
      default: '',
      type: [Number, String],
    },
    resize: {
      required: false,
      default: true,
      type: Boolean,
    },
    childrenNestedLength: {
      required: false,
      default: 1,
      type: Number,
    },
    dragndrop: {
      required: false,
      default: false,
      type: Boolean,
    },
    theme: {
      required: false,
      default: undefined,
      type: Object as PropType<ITableThemeOptions>,
    },
  },
  emits: {
    dragndropChanged: (_data: IBodyItemBase[]) => _data as IBodyItemBase[],
  },
  setup(props, context) {
    const tableHead = ref<IHeadItemBase[] | IHeadItemGrouped[]>(
        props.tableHead
      ),
      tableTheme = ref<ITableThemeOptions>({} as ITableThemeOptions),
      tableWidth = ref<number>(),
      tableHeadGrouped = ref<TTableHeadGroupedRow[]>([]),
      tableHeadSpreated = ref<IHeadItemBase[]>([]),
      tableMainDiv = ref<InstanceType<typeof HTMLDivElement> | null>(null)

    const tableMaxWidthSize = computed<TTableHeadItemWidth>(() => {
      if (props.maxWidth && typeof props.maxWidth === 'number') {
        return `${props.maxWidth}px`
      } else if (props.maxWidth && typeof props.maxWidth === 'string') {
        return props.maxWidth
      } else {
        return `${tableMaxWidth.value}px`
      }
    })

    const tableMaxWidth = computed<number | undefined | string>(() => {
      if (props.maxWidth) {
        if (typeof props.maxWidth === 'string')
          return props.maxWidth.replace('px', '')

        return props.maxWidth
      }
      // console.log(tableWidth.value)
      return tableWidth.value || 990
    })
    const hasChildren = computed<boolean>(() => {
      if (
        tableHead.value.some(
          (item: IHeadItemGrouped | IHeadItemBase) =>
            item.children && !!item.children.length
        )
      ) {
        return true
      }

      return false
    })

    const tableColumnDataHead: Ref<IHeadItemBase[] | IHeadItemGrouped[]> =
      computed(() =>
        hasChildren.value ? tableHeadGrouped.value : tableHead.value
      ) as Ref<IHeadItemBase[] | IHeadItemGrouped[]>

    const tableColumnDataBody = computed<IHeadItemBase[]>(() => {
      if (hasChildren.value) {
        return tableHeadSpreated.value
      } else {
        return tableHead.value
      }
    })

    const moveResizer = new MouseMoveResizer(tableHead.value)

    function setTableTheme() {
      // console.log('hello')

      // debugger
      tableTheme.value = {
        mode: props.theme?.mode || 'dark',
        // eslint-disable-next-line no-prototype-builtins
        borderAround: props.theme?.hasOwnProperty('borderAround')
          ? props.theme?.borderAround
          : true,
        // eslint-disable-next-line no-prototype-builtins
        borderX: props.theme?.hasOwnProperty('borderX')
          ? props.theme?.borderX
          : true,
        // eslint-disable-next-line no-prototype-builtins
        borderY: props.theme?.hasOwnProperty('borderY')
          ? props.theme?.borderY
          : true,
        // eslint-disable-next-line no-prototype-builtins
        fixedHeader: props.theme?.hasOwnProperty('fixedHeader')
          ? props.theme?.fixedHeader
          : false,
        // eslint-disable-next-line no-prototype-builtins
        showHeader: props.theme?.hasOwnProperty('showHeader')
          ? props.theme?.showHeader
          : true,
        // eslint-disable-next-line no-prototype-builtins
        showAccordionIcon: props.theme?.hasOwnProperty('showAccordionIcon')
          ? props.theme?.showAccordionIcon
          : true,
        transition: props.theme?.transition || 'all .2s',
      }
    }

    function setTableWidth() {
      tableWidth.value = tableMainDiv.value?.offsetWidth as number
    }

    function startResize({ index, key, el }: IResizeData) {
      moveResizer.startResize({ index, key, el })
    }

    function dragndropChanged(data: IBodyItemBase[], id?: number | string) {
      if (id) {
        const _ = props.tableBody.map((item: IBodyItemBase) => {
          if (item.id === id && item.children) {
            item.children.bodyData = data

            return item
          }

          return item
        })

        context.emit('dragndropChanged', _)
      } else {
        context.emit('dragndropChanged', data)
      }
    }

    setTableTheme()

    document.addEventListener('mousemove', (event) =>
      moveResizer.handleMouseMove(event)
    )
    document.addEventListener('mouseup', () => {
      moveResizer.stopResize()
    })

    onMounted(() => {
      setTableWidth()

      const generateWidth = new GenerateHeadColWidths(
        tableMaxWidth.value as number,
        tableHead.value as IHeadItemBase[],
        tableHeadSpreated.value as IHeadItemBase[],
        tableHeadGrouped.value as TTableHeadGroupedRow[]
      )

      generateWidth.setHeadColsWidth()
      if (hasChildren.value) {
        generateWidth.setHeadColsSpread()
        generateWidth.setHeadColsGrouping()
      }
    })

    onUnmounted(() => {
      document.removeEventListener('mousemove', moveResizer.handleMouseMove)
      document.removeEventListener('mouseup', moveResizer.stopResize)
    })

    return {
      tableTheme,
      tableMaxWidthSize,
      hasChildren,
      tableColumnDataHead,
      tableColumnDataBody,
      startResize,
      dragndropChanged,
    }
  },
})
