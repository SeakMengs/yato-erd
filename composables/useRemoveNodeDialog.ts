export function useRemoveNodeDiloag() {
  const nodeId = useState<string | undefined>(
    "removeNodeDialogNodeId",
    () => undefined,
  );
  const pendingNodeRemoval = computed<boolean>(() => !!nodeId.value);

  type ResolveCallback = (value: boolean) => void;
  const resolveCallback = useState<ResolveCallback | undefined>(
    "removeNodeDialogResolveCallBack",
    () => undefined,
  );

  // Opens the dialog and returns a promise that resolves when the user confirms or cancels.
  // When noded id is assigned, dialog in ~/components/diagram/ConfirmDeleteNodeDialog will show up if the node exist
  function confirm(nId: string): Promise<boolean> {
    return new Promise((resolve: ResolveCallback) => {
      nodeId.value = nId;
      resolveCallback.value = resolve;
    });
  }

  function cleanState(): void {
    nodeId.value = undefined;
    resolveCallback.value = undefined;
  }

  function onConfirm(): void {
    if (typeof resolveCallback.value === "function") {
      resolveCallback.value(true);
    }

    cleanState();
  }

  function onCancel(): void {
    if (typeof resolveCallback.value === "function") {
      resolveCallback.value(false);
    }

    cleanState();
  }

  return {
    nodeId,
    pendingNodeRemoval,
    confirm,
    onConfirm,
    onCancel,
  };
}
