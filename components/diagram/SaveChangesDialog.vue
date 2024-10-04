<script setup lang="ts">
import { Save } from "lucide-vue-next";

const erdState = useErd();
const open = ref<boolean>(false);
const asked = ref<boolean>(false);
const redirectTo = ref<string>();

const openDialog = (): void => {
  open.value = true;
};

const closeDialog = (): void => {
  asked.value = true;
  open.value = false;
};

const onCancel = (): void => {
  closeDialog();

  if (redirectTo.value) {
    navigateTo(redirectTo.value, {
      external: true,
    });
  }
};

const onConfirm = (): void => {
  erdState.saveErdStateToLocalStorage({
    silent: false,
  });
  closeDialog();
};

const beforeUnload = (event: Event | undefined): void => {
  if (asked.value) {
    return;
  }

  if (erdState.isVueFlowStateSyncedWithLocalStorage()) {
    return;
  }

  if (event) {
    event.preventDefault();
  }

  openDialog();
};

onBeforeRouteLeave((to, from, next) => {
  beforeUnload(undefined);
  redirectTo.value = to.fullPath;
});

onMounted(() => {
  window.addEventListener("beforeunload", beforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", beforeUnload);
});
</script>

<template>
  <AlertDialog :open="open && !asked">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle class="flex flex-row items-center gap-2">
          <Save class="w-4 h-4" />
          Save changes
        </AlertDialogTitle>
        <AlertDialogDescription class="inline">
          You have unsave changes! Do you wish to save the erd state before you
          leave?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="onCancel"> Discard </AlertDialogCancel>
        <AlertDialogAction @click="onConfirm"> Save changes </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
