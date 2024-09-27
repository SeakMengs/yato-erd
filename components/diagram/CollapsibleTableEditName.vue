<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { toast } from "~/components/ui/toast";
import { ChevronDown, CircleCheck, CircleX } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { tableNodeDataSchema } from "~/schemas/erd";
import type { TableNodeDataWithNodeId } from "~/types/diagram/table_node";
import { vAutoAnimate } from "@formkit/auto-animate/vue";

const { updateTableNodeName } = useVueFlowUtils();
const props = defineProps<{
  isOpen: boolean;
  tableNodeDataWithNodeId: TableNodeDataWithNodeId;
}>();

const emit = defineEmits<{
  (e: "closeEditTableName"): void;
}>();

const { interactive } = useInterative();
const tableNameBefore = ref<string>(props.tableNodeDataWithNodeId.tableName);
const formSchema = toTypedSchema(tableNodeDataSchema.pick({ tableName: true }));
const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    tableName: tableNameBefore.value,
  },
});

const onInputFocusIn = (): void => {
  tableNameBefore.value = props.tableNodeDataWithNodeId.tableName;
};

const closeEditTableName = (): void => {
  emit("closeEditTableName");
};

const confirm = async ({
  closeETN,
  fromButton,
}: {
  closeETN: boolean;
  fromButton: boolean;
}): Promise<void> => {
  logger.info("Confirm edit table name");
  const { valid } = await form.validate();

  if (fromButton && !valid) {
    logger.info("The confirm was from button, show error toast in the ui");
    return showErrorToast();
  }

  updateTableNodeName(
    props.tableNodeDataWithNodeId.tableNodeId,
    form.controlledValues.value.tableName ?? "",
  );

  if (closeETN) {
    logger.info("Updated the table name, closing the edit table name");
    closeEditTableName();
  }
};

const cancel = (): void => {
  logger.info(
    "Cancel edit table name, reset to initial value when the user click on the input",
  );

  updateTableNodeName(
    props.tableNodeDataWithNodeId.tableNodeId,
    tableNameBefore.value,
  );

  closeEditTableName();
};

const cancelIfNotValid = (): void => {
  const result = tableNodeDataSchema
    .pick({ tableName: true })
    .safeParse(form.controlledValues.value);

  if (result.success) {
    closeEditTableName();
    return;
  }

  logger.info("Cancel the edit table name because it's not a valid form");
  cancel();
};

const showErrorToast = (): void => {
  const fieldKeys = Object.keys(form.errors.value) as Array<
    keyof typeof form.errors.value
  >;

  if (Array.isArray(fieldKeys) && fieldKeys.length === 0) {
    return;
  }

  toast({
    title: "Update table name fail",
    description: form.errors.value.tableName,
    variant: "destructive",
  });
};

const formHasError = (): boolean => {
  return Object.keys(form.errors.value).length > 0;
};
watch(
  () => props.tableNodeDataWithNodeId.tableName,
  () => {
    if (formHasError()) return;

    form.resetForm({
      values: {
        tableName: props.tableNodeDataWithNodeId.tableName,
      },
    });
  },
);

watch(() => form.errors.value, showErrorToast);

watch(
  () => form.controlledValues.value,
  async () => {
    await confirm({
      closeETN: false,
      fromButton: false,
    });
  },
);

const divRef = ref<HTMLDivElement | null>(null);

const handleClickOutside = (event: MouseEvent): void => {
  if (divRef.value && !divRef.value.contains(event.target as Node)) {
    logger.info("User click outside of the form, cancel edit table name");
    cancelIfNotValid();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  cancelIfNotValid();
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div ref="divRef" class="flex flex-row items-center justify-between gap-2">
    <div class="w-full flex flex-row items-center gap-2">
      <ChevronDown
        :data-state="props.isOpen ? 'open' : 'close'"
        class="h-4 w-4 data-[state=close]:-rotate-90 transition-transform duration-200"
      />
      <form @click.stop @submit.prevent @focusin="onInputFocusIn">
        <fieldset class="w-full" :disabled="!interactive">
          <FormField v-slot="{ errors, componentField }" name="tableName">
            <FormItem v-auto-animate class="w-full">
              <FormControl>
                <Input
                  :class="
                    cn({
                      'border-red-500': errors.length > 0,
                    })
                  "
                  placeholder="Table name"
                  v-bind="componentField"
                />
              </FormControl>
              <!-- <FormMessage /> -->
            </FormItem>
          </FormField>
        </fieldset>
      </form>
    </div>
    <div class="flex gap-2 mr-[6px]" @click.stop>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              class="hover:border-green-900 hover:text-green-900"
              size="xs"
              @click="
                confirm({
                  fromButton: true,
                  closeETN: true,
                })
              "
            >
              <CircleCheck class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Confirm</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              class="hover:border-red-900 hover:text-red-900"
              size="xs"
              @click="cancel"
            >
              <CircleX class="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cancel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
</template>
