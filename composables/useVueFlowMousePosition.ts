import { useVueFlow, type XYPosition } from "@vue-flow/core";
import { VUEFLOW_ID } from "~/constants/key";

export function useVueFlowMousePosition() {
  const position = useState<XYPosition>("vue-flow-mouse-position", () => ({
    x: 0,
    y: 0,
  }));
  const { project } = useVueFlow(VUEFLOW_ID);

  function onMouseMove(event: MouseEvent): void {
    const flowElement = document.querySelector(".vue-flow");
    if (!flowElement) return;

    const rect = flowElement.getBoundingClientRect();
    if (!rect) return;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    position.value = project({ x: mouseX, y: mouseY });
  }

  return {
    position,
    onMouseMove,
  };
}
