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
  openEditTableName: () => void;
  closeEditTableName: () => void;
}>();

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

const confirm = async ({
  closeTN,
  fromButton,
}: {
  closeTN: boolean;
  fromButton: boolean;
}): Promise<void> => {
  const { valid } = await form.validate();

  if (fromButton && !valid) {
    return showErrorToast();
  }

  updateTableNodeName(
    props.tableNodeDataWithNodeId.tableNodeId,
    form.controlledValues.value.tableName ?? "",
  );

  if (closeTN) {
    props.closeEditTableName();
  }
};

const cancel = async (): Promise<void> => {
  const { valid } = await form.validate();

  if (!valid) {
    updateTableNodeName(
      props.tableNodeDataWithNodeId.tableNodeId,
      tableNameBefore.value,
    );
  }

  props.closeEditTableName();
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

watch(
  () => props.tableNodeDataWithNodeId.tableName,
  () => {
    form.resetForm({
      values: {
        tableName: props.tableNodeDataWithNodeId.tableName,
      },
    });
  },
);

watch(() => form.errors.value, showErrorToast);

// If enable auto validate then save on change uncomment this. but be cautious when user can click edit other table and
// If the user click edit other table name when the selected edit table is null, it will not call cancel() function
// watch(
//   () => form.controlledValues.value,
//   async () => {
//     await confirm({
//       closeTN: false,
//       fromButton: false,
//     });
//   },
// );

const divRef = ref<HTMLElement | null>(null);
const handleClickOutside = async (event: MouseEvent): Promise<void> => {
  if (divRef.value && !divRef.value.contains(event.target as Node)) {
    await cancel();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
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
      <form
        class="w-full"
        @click.stop
        @submit.prevent
        @focusin="onInputFocusIn"
      >
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
                  closeTN: true,
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
