import type { ConfirmDeleteNodeDialogProps } from "~/components/diagram/ConfirmDeleteNodeDialog.vue";

// Initialize state globally otherwise user won't receive reactivity
const isDeleteNodeDialogOpen = reactive<
  Omit<ConfirmDeleteNodeDialogProps, "onOpenChange">
>({
  open: false,
  nodeId: undefined,
});

export function useRemoveNodeDiloag() {
  function onIsDeleteNodeDialogOpenChange(open: boolean): void {
    isDeleteNodeDialogOpen.open = open;

    if (!open) {
      isDeleteNodeDialogOpen.nodeId = undefined;
    }
  }

  function onRemoveNodeChange(nodeId: string): void {
    isDeleteNodeDialogOpen.nodeId = nodeId;
    isDeleteNodeDialogOpen.open = true;
  }

  return {
    isDeleteNodeDialogOpen,
    onIsDeleteNodeDialogOpenChange,
    onRemoveNodeChange,
  };
}
