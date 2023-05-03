<template>
  <TableMain
    :table-columns="tableColumns"
    :table-data="tableData"
    :fixed-header="true"
  >
    <template #cell(fukkname)="{ value }">
      {{ value + 'test' }}
    </template>
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

import type ITableHeadColumnItem from '@/interfaces/table/column-item'
import type IColumnGroupedItem from '@/interfaces/table/column-grouped-item'

const tableColumns = ref<ITableHeadColumnItem[] | IColumnGroupedItem[]>([
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

const tableData = ref<any[]>([
  {
    id: 1,
    name_a: 'Foo',
    full_name: 'FOO_FULL_BAR',
    date_created: '01',
  },
  {
    id: 2,
    name_a: 'Bar',
    full_name: 'BAR_FULL_BAR',
    date_created: '02',
  },
  {
    id: 3,
    name_a: 'Cat',
    full_name: 'CAT_FULL_BAR',
    date_created: '03',
  },
  {
    id: 4,
    name_a: 'dog',
    full_name: 'DOG_FULL_BAR',
    date_created: '04',
  },
  {
    id: 4,
    name_a: 'dog',
    full_name: 'DOG_FULL_BAR',
    date_created_c1: '04',
  },
  {
    id: 4,
    name_a: 'dog',
    info: 'DOG_FULL_BAR_DOG_FULL_BAR_DOG_FULL_BAR',
    date_created: 'date_created',
    date_created_a: '04',
    date_created_b: '04',
    date_created_c: '04',
    date_created_c1: '05',
    date_created_c2: '04',
  }
])

</script>
