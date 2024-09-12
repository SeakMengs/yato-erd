<script setup lang="ts">
import { Ellipsis, Trash } from "lucide-vue-next";
import { DEFAULT_COLUMN } from "~/constants/table";
import { columnIndexTypeSchemaEnum } from "~/schemas/erd";
import type { TableNodeDataColumn } from "~/types/diagram/table_node";

const props = defineProps<{
  tableId: string;
  columnPosition: number;
  column: TableNodeDataColumn;
  removeColumn: () => void;
}>();

const indexTypes = columnIndexTypeSchemaEnum.options;
</script>

<template>
  <div class="flex flex-row items-center gap-2 m-1">
    <Input id="name" v-model="props.column.columnName" placeholder="Name" />
    <Input id="type" v-model="props.column.attribute.type" placeholder="Type" />
    <DropdownMenu>
      <DropdownMenuTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="outline"
                size="icon"
                class="flex-shrink-0 hover:ring-2 ring-ring"
              >
                <Ellipsis class="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Column attributes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="min-w-32 p-2 flex flex-col gap-4">
        <div class="flex items-center justify-center">
          <h1>Column attributes</h1>
        </div>
        <div class="flex flex-col gap-2">
          <!-- TODO: find a better label that suit with the checkboxes -->
          <label
            id="constraints"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Constraints
          </label>
          <div class="flex gap-2">
            <Checkbox id="nullable" v-model="props.column.attribute.nullable" />
            <label
              for="nullable"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Nullable
            </label>
          </div>
          <div class="flex space-x-2">
            <Checkbox
              id="autoIncrement"
              v-model="props.column.attribute.autoIncrement"
            />
            <label
              for="autoIncrement"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Auto increment
            </label>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label
            id="indexType"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Index type
          </label>
          <Select :default-value="props.column.attribute.indexType">
            <SelectTrigger id="indexType">
              <SelectValue placeholder="Select index type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <div v-for="(it, i) in indexTypes" :key="i">
                  <SelectItem :value="it"> {{ it }}</SelectItem>
                </div>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex flex-col gap-2">
            <label
              for="defaultValue"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Default value
            </label>
            <Input
              id="defaultValue"
              v-model="props.column.attribute.defaultValue"
              placeholder="Default value"
            />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex flex-col gap-2">
            <label
              for="userComment"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              User comment
            </label>
            <Textarea
              id="userComment"
              v-model="props.column.userComment"
              placeholder="User comment"
            />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label
            for="actions"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Actions
          </label>
          <Button
            @click="removeColumn"
            variant="outline"
            class="flex-shrink-0 text-center gap-2 hover:border-red-900 hover:text-red-900"
          >
            <Trash class="w-4 h-4" />
            Delete column
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
