<template>
  <TableMain
    :table-columns="columns"
    :table-data="rows"
  >
    <template #cell(fukkname)="{ value, item }">
      {{ value + 'test' }}
    </template>
    <template #cell(actions)>
      <span class="handle">|||</span>
    </template>
  </TableMain>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TableMain from '@/components/table/table-main.vue'

export default defineComponent({
  name: 'LogisticsPage',
  components: {
    TableMain,
  },
  data () {
    return {
      columns: [
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
          minWidth: 100,
        },
        {
          label: 'Full Name',
          key: 'full_name',
          width: 200,
          minWidth: 50,
        },
        
      ],

      rows: [
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
          full_name: 'DOG_FULL_BAR',
          date_created: 'date_created',
          date_created_a: '04',
          date_created_b: '04',
          date_created_c: '04',
          date_created_c1: '05',
          date_created_c2: '04',
        }
      ],
    }
  },
})
</script>
