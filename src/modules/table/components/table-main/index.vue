<template>
  <div class="table-main">
    <div
      ref="tableMainDiv"
      :class="[
        'table__wrapper',
        {
          'table--theme-dark': tableTheme.mode === 'dark',
          'table--theme-light': tableTheme.mode === 'light',
          'table--theme-border-x': tableTheme.borderX,
          'table--theme-border-y': tableTheme.borderY,
          'table--theme-border-around': tableTheme.borderAround,
        },
      ]"
      :style="{
        'max-width': tableMaxWidthSize,
      }"
    >
      <table
        ref="tableMain"
        class="table__content"
      >
        <TableHeadGroupedComponent
          v-if="tableTheme.showHeader && hasChildren"
          :fixed-header="!!tableTheme.fixedHeader"
          :resize="resize"
          :table-head-data="tableColumnDataHead"
          :columns-data="tableHead"
          :children-nested-length="childrenNestedLength"
        >
          <template
            v-for="(_, slot) in $slots"
            #[slot]
          >
            <slot :name="slot"></slot>
          </template>
        </TableHeadGroupedComponent>
        <TableHeadSimpleComponent
          :fixed-header="!!tableTheme.fixedHeader"
          :resize="resize"
          :columns-data="tableHead"
          :children-nested-length="childrenNestedLength"
          @start-resize="startResize"
        >
          <template
            v-for="(_, slot) in $slots"
            #[slot]
          >
            <slot :name="slot"></slot>
          </template>
        </TableHeadSimpleComponent>
        <TableBodyComponent
          :table-body="tableBody"
          :table-head="tableColumnDataBody"
          :children-nested-length="childrenNestedLength"
          :show-accordion-arrow="tableTheme.showAccordionIcon"
          :dragndrop="dragndrop"
          @dragndrop-changed="dragndropChanged"
        >
          <template
            v-for="(_, slot) in $slots"
            #[slot]="data"
          >
            <slot
              :name="slot"
              :data="{ ...data }"
            ></slot>
          </template>
          <template #table__item-accordion="{ row }">
            <TableComponent
              :table-head="
                row.children &&
                  row.children.headData &&
                  row.children.headData.length
                  ? row.children.headData
                  : JSON.parse(JSON.stringify(tableHead))
              "
              :table-body="row.children ? row.children.bodyData : []"
              :max-width="tableMaxWidthSize"
              :children-nested-length="childrenNestedLength + 1"
              :resize="resize"
              :theme="theme"
            >
              <template
                v-for="(_, slot) in $slots"
                #[slot]="data"
              >
                <slot
                  :name="slot"
                  :data="{ ...data }"
                ></slot>
              </template>
            </TableComponent>
          </template>
        </TableBodyComponent>
      </table>
    </div>
  </div>
</template>

<script src="./index.ts" lang="ts"></script>

<style src='./index.scss' lang='scss'></style>
