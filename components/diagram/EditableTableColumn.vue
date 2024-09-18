<script setup lang="ts">
import { Ellipsis, Trash } from "lucide-vue-next";
import {
  columnIndexTypeSchemaEnum,
  tableNodeDataColumnSchema,
} from "~/schemas/erd";
import { configure, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import type { TableNodeDataColumn } from "~/types/diagram/table_node";
import { toast } from "~/components/ui/toast";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { PopoverClose } from "radix-vue";

const props = defineProps<{
  tableId: string;
  columnPosition: number;
  column: TableNodeDataColumn;
  removeColumn: () => void;
}>();

const indexTypes = columnIndexTypeSchemaEnum.options;

const formSchema = toTypedSchema(tableNodeDataColumnSchema);
const form = useForm({
  validationSchema: formSchema,
  initialValues: props.column,
});

configure({
  validateOnInput: true,
});

const formHasError = (): boolean => {
  return Object.keys(form.errors.value).length > 0;
};

watch(
  () => props.column,
  () => {
    // If there there is an error don't reset form initialValues
    if (formHasError()) {
      return;
    }

    form.resetForm({
      values: props.column,
    });
  },
);

watch(
  () => form.errors.value,
  () => {
    const fieldKeys = Object.keys(form.errors.value) as Array<
      keyof typeof form.errors.value
    >;

    if (Array.isArray(fieldKeys) && fieldKeys.length === 0) {
      return;
    }

    fieldKeys.forEach((fk) => {
      toast({
        title: "Update column fail",
        description: form.errors.value[fk],
        variant: "destructive",
      });
    });
  },
);

watch(
  () => form.controlledValues.value,
  async () => {
    const { valid } = await form.validate();

    if (!valid) {
      return;
    }

    updateTableNodeColumn(props.tableId, {
      ...props.column,
      ...form.controlledValues.value,
      attribute: {
        ...props.column.attribute,
        ...form.controlledValues.value.attribute,
      },
    } as TableNodeDataColumn);
  },
);
</script>

<template>
  <form @submit.prevent class="flex flex-row items-center gap-1 m-1 w-full">
    <FormField v-slot="{ componentField }" name="columnName">
      <FormItem v-auto-animate class="w-full">
        <FormControl>
          <Input placeholder="Name" v-bind="componentField" />
        </FormControl>
        <!-- <FormMessage /> -->
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="attribute.type">
      <FormItem v-auto-animate class="w-full">
        <FormControl>
          <Input placeholder="type" v-bind="componentField" />
        </FormControl>
        <!-- <FormMessage /> -->
      </FormItem>
    </FormField>
    <Popover>
      <PopoverTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                type="button"
                variant="outline"
                size="icon"
                class="flex-shrink-0 hover:ring-2 ring-ring mr-2"
              >
                <Ellipsis class="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Column attributes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PopoverTrigger>
      <PopoverContent class="min-w-32 p-0">
        <ScrollArea>
          <div class="flex flex-col gap-4 m-4 max-h-96">
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
              <FormField
                v-slot="{ value, handleChange }"
                name="attribute.nullable"
              >
                <FormItem
                  v-auto-animate
                  class="flex flex-row items-start space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox :checked="value" @update:checked="handleChange" />
                  </FormControl>
                  <FormLabel>Nullable</FormLabel>
                  <!-- <FormMessage /> -->
                </FormItem>
              </FormField>
              <FormField
                v-slot="{ value, handleChange }"
                name="attribute.autoIncrement"
              >
                <FormItem
                  v-auto-animate
                  class="flex flex-row items-start space-x-3 space-y-0"
                >
                  <FormControl>
                    <Checkbox :checked="value" @update:checked="handleChange" />
                  </FormControl>
                  <FormLabel>Auto increment</FormLabel>
                  <!-- <FormMessage /> -->
                </FormItem>
              </FormField>
            </div>
            <FormField
              v-slot="{ value, componentField }"
              name="attribute.indexType"
            >
              <FormItem>
                <FormLabel>Index type</FormLabel>
                <Select
                  v-bind="componentField"
                  :default-value="value ?? props.column.attribute.indexType"
                >
                  <FormControl>
                    <SelectTrigger id="indexType">
                      <SelectValue placeholder="Select index type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        v-for="(it, i) in indexTypes"
                        :key="i"
                        :value="it"
                      >
                        {{ it }}</SelectItem
                      >
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <!-- <FormMessage /> -->
              </FormItem>
            </FormField>
            <FormField
              v-slot="{ componentField }"
              name="attribute.defaultValue"
            >
              <FormItem v-auto-animate>
                <FormLabel>Default value</FormLabel>
                <FormControl>
                  <Input
                    placeholder="optional default value.."
                    v-bind="componentField"
                  />
                </FormControl>
                <!-- <FormMessage /> -->
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="userComment">
              <FormItem v-auto-animate>
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Textarea placeholder="comment.." v-bind="componentField" />
                </FormControl>
                <!-- <FormMessage /> -->
              </FormItem>
            </FormField>
            <div class="flex flex-col gap-2">
              <label
                for="actions"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Actions
              </label>
              <PopoverClose as-child>
                <Button
                  @click="removeColumn"
                  variant="outline"
                  class="flex-shrink-0 text-center gap-2 hover:border-red-900 hover:text-red-900 mb-4"
                >
                  <Trash class="w-4 h-4" />
                  Delete column
                </Button>
              </PopoverClose>
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  </form>
</template>
