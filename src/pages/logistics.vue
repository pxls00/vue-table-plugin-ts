<template>
  <TableMain
    :table-columns="columns"
    :table-data="rows"
    :max-height="200"
  >
    <template #cell(name)="{ value, item }">
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
          rowspan: 3,
          colspan: 1,
        },
        {
          label: 'ID',
          key: 'id',
          width: 50,
          minWidth: 50,
          rowspan: 3,
          colspan: 1,
        },
        {
          label: 'Info',
          key: 'info',
          minWidth: 100,
          rowspan: 1,
          colspan: 2,
          children: [
            {
              label: 'Info_a',
              key: 'info_a',
              minWidth: 50,
              rowspan: 2,
              colspan: 1,
            },
            {
              label: 'Info_b',
              key: 'info_b',
              minWidth: 50,
              rowspan: 2,
              colspan: 1,
            },
          ],
        },
        {
          label: 'Full Name',
          key: 'full_name',
          width: 200,
          minWidth: 50,
          rowspan: 3,
          colspan: 1,
        },
        {
          label: 'Created',
          key: 'date_created',
          width: 300,
          rowspan: 1,
          colspan: 4,
          children: [
            {
              label: 'Created_a',
              key: 'date_created_a',
              minWidth: 50,
              rowspan: 2,
              colspan: 1,
            },
            {
              label: 'Created_b',
              key: 'date_created_b',
              minWidth: 50,
              rowspan: 2,
              colspan: 1,
            },
            {
              label: 'Created_c',
              key: 'date_created_c',
              minWidth: 50,
              rowspan: 1,
              colspan: 2,
              children: [
                {
                  label: 'Created_c1',
                  key: 'date_created_c1',
                  minWidth: 50,
                  rowspan: 1,
                  colspan: 1,
                },
                {
                  label: 'Created_c2',
                  key: 'date_created_c2',
                  minWidth: 50,
                  rowspan: 1,
                  colspan: 1,
                },
              ],
            },
          ],
        },
      ],

      rows: [
        {
          id: 1,
          name_a: 'Foo',
          full_name: 'FOO_FULL_BAR',
          date_created: '01.01.2021',
        },
        {
          id: 2,
          name_a: 'Bar',
          full_name: 'BAR_FULL_BAR',
          date_created: '02.01.2021',
        },
        {
          id: 3,
          name_a: 'Cat',
          full_name: 'CAT_FULL_BAR',
          date_created: '03.01.2021',
        },
        {
          id: 4,
          name_a: 'dog',
          full_name: 'DOG_FULL_BAR',
          date_created: '04.01.2021',
        },
        {
          id: 4,
          name_a: 'dog',
          full_name: 'DOG_FULL_BAR',
          date_created_c1: '04.01.2021',
        },
        {
          id: 4,
          name_a: 'dog',
          full_name: 'DOG_FULL_BAR',
          date_created: 'date_created',
          date_created_a: '04.01.2021',
          date_created_b: '04.01.2021',
          date_created_c: '04.01.2021',
          date_created_c1: '05.01.2021',
          date_created_c2: '04.01.2021',
        },
      ],
    }
  },
})
</script>
