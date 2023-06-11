<template>
  <VueDraggableNext
    v-model="tableDataListForDragNDrop"
    class="dragArea list-group w-full table__body"
    tag="tbody"
    v-bind="dragOptions"
    :handle="
      childrenNestedLength === 1
        ? '.drag-btn'
        : `.drag-btn_${childrenNestedLength}`
    "
    @change="changed"
  >
    <transition-group>
      <tr
        v-for="(row, rowIndex) in tableDataListForDragNDrop"
        :key="rowIndex"
        :class="['table__body-row']"
      >
        <tbody @click="dataRowClicked(row)">
          <td
            v-for="(column, colIndex) in tableHead"
            :key="colIndex"
            :class="['table__body-data']"
            :style="{
              width: `${column.width}px`,
            }"
          >
            <slot
              :name="getSlotName(`cell(${column.key})`, childrenNestedLength)"
              :value="
                typeof row.data[column.key] === 'object'
                  ? row.data[column.key]
                  : row.data[column.key]
              "
              :item="row"
            >
              {{
                typeof row.data[column.key] === 'object'
                  ? row.data[column.key]
                  : row.data[column.key] || `&nbsp;`
              }}
            </slot>
            <span
              v-if="
                showAccordionArrow &&
                  colIndex === tableHead.length - 1 &&
                  row.children &&
                  row.children.bodyData.length
              "
              :class="[
                'table__body-data-accordion-icon',
                { opened: row.isOpenAccordion },
              ]"
            ></span>
          </td>
        </tbody>
        <tbody v-if="row.isOpenAccordion">
          <slot
            v-if="!!row.children"
            name="table__item-accordion"
            :row="row"
          >
            {{ row }}
          </slot>
        </tbody>
      </tr>
    </transition-group>
  </VueDraggableNext>
</template>

<script lang="ts" src="./index.ts"></script>

<style src="./index.scss" lang="scss" scoped></style>
