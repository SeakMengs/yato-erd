<script setup lang="ts">
import { useVueFlow } from "@vue-flow/core";

const { getNodes } = useVueFlow();
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="outline"> Open Sheet </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <SheetHeader>
        <SheetTitle>Edit tables</SheetTitle>
        <SheetDescription></SheetDescription>
      </SheetHeader>
      <DiagramModifyTable
        v-for="node in getNodes"
        :key="node.id"
        :id="node.id"
        :table-name="node.data?.tableName ?? ''"
        :columns="node.data?.columns ?? []"
        :selected="node.selected ?? false"
      />
    </SheetContent>
  </Sheet>
</template>
