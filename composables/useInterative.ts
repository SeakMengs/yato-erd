import { useVueFlow } from "@vue-flow/core";
import { VUEFLOW_ID } from "~/constants/key";

export function useInterative() {
  const { setInteractive } = useVueFlow(VUEFLOW_ID);
  const interactive = useState<boolean>("useInterative", () => true);

  const toggleInteractive = () => {
    interactive.value = !interactive.value;
    setInteractive(interactive.value);
  };

  return {
    toggleInteractive,
    interactive,
  };
}
