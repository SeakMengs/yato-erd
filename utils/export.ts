import {
  getRectOfNodes,
  getTransformForBounds,
  useVueFlow,
  type ViewportTransform,
} from "@vue-flow/core";
import { VUEFLOW_ID } from "~/constants/key";
import { MAX_ZOOM, MIN_ZOOM } from "~/constants/vueflow";

export function getVueflowEl(): HTMLElement {
  return document.querySelector(".vue-flow__transformationpane") as HTMLElement;
}

type TransformForWholeDiagram = {
  imageWidth: number;
  imageHeight: number;
  transform: ViewportTransform;
};

// Since vue flow use tranform to movement, this function calculate to find tranformation such that it can tranform to see all nodes
export function getTransformForWholeDiagram(): TransformForWholeDiagram {
  const { getNodes } = useVueFlow(VUEFLOW_ID);
  const nodesBounds = getRectOfNodes(getNodes.value);
  const imageWidth = nodesBounds.width;
  const imageHeight = nodesBounds.height;

  return {
    transform: getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      MIN_ZOOM,
      MAX_ZOOM,
    ),
    imageWidth,
    imageHeight,
  };
}
