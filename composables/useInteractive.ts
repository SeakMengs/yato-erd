import { useVueFlow } from "@vue-flow/core";
import { VUEFLOW_ID } from "~/constants/key";

export function useInteractive() {
  const { setInteractive } = useVueFlow(VUEFLOW_ID);
  const interactive = useState<boolean>("useInteractive", () => true);

  const toggleInteractive = () => {
    interactive.value = !interactive.value;
    setInteractive(interactive.value);
  };

  return {
    toggleInteractive,
    interactive,
  };
}
