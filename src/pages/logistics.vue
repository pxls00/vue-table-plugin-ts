<template>
  <TableMain
    :table-head="tableColumns"
    :table-body="tableData"
  >
    <template #cell(actions)>
      <span class="drag-btn">|||</span>
    </template>
  </TableMain>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LogisticsPage',
})
</script>

<script lang="ts" setup>
import { ref } from 'vue'

import TableMain from '@/components/table/table-main.vue'

import type ITableHead from '@/interfaces/table/column-item'
import type IDataItem from '@/interfaces/table/data-item-base'

const tableColumns = ref<ITableHead[]>([
  {
    label: '',
    key: 'actions',
    width: 50,
    minWidth: 30,
  },
  {
    label: 'ID',
    key: 'id',
    width: 50,
    minWidth: 50,
  },
  {
    label: 'Info',
    key: 'info',
    minWidth: 20,
  },
  {
    label: 'Full Name',
    key: 'full_name',
    width: 200,
    minWidth: 50,
  },
])

const tableData = ref<IDataItem[]>([
  {
    id: 1,
    data: {
      name_a: 'Foo',
      full_name: 'FOO_FULL_BAR',
      date_created: '01',
    }
  },
  {
    id: 2,
    data: {
      name_a: 'Bar',
      full_name: 'BAR_FULL_BAR',
      date_created: '02',
    },
    children: {
      bodyData: [
        {
          id: 8,
          data: {
            name_a: {
              value: 'bar',
              class: ['test test_!']
            },
            full_name: 'bar_full_bar',
            date_created: '08',
          },
          children: {
            bodyData: [
              {
                id: 10,
                data: {
                  name_a: 'bar',
                  full_name: 'bar_full_bar',
                  date_created: '08',
                }
              }
            ]
          }
        },
        {
          id: 8,
          data: {
            name_a: 'bar',
            full_name: 'bar_full_bar',
            date_created: '08'
          }
        },
        {
          id: 8,
          data: {
            name_a: 'bar',
            full_name: 'bar_full_bar',
            date_created: '08'
          }
        }
      ]
    }
  },
  {
    id: 3,
    data: {
      name_a: 'Cat',
      full_name: 'CAT_FULL_BAR',
      date_created: '03',
    }
  },
  {
    id: 4,
    data: {
      name_a: 'dog',
      full_name: 'DOG_FULL_BAR',
      date_created: '04',
    }
  },
  {
    id: 4,
    data: {
      name_a: 'dog',
      full_name: 'DOG_FULL_BAR',
      date_created_c1: '04',
    },
    children: {
      bodyData: [
        {
          id: 8,
          data: {
            name_a: 'bar',
            full_name: 'bar_full_bar',
            date_created: '08'
          }
        }
      ]
    }
  },
  {
    id: 4,
    data: {
      name_a: 'dog',
      info: 'DOG_FULL_BAR_DOG_FULL_BAR_DOG_FULL_BAR',
      date_created: 'date_created',
      date_created_a: '04',
      date_created_b: '04',
      date_created_c: '04',
      date_created_c1: '05',
      date_created_c2: '04',
    }
  },
])
</script>
