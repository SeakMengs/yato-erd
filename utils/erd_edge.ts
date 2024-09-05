import { useVueFlow, type GraphEdge, type Node } from "@vue-flow/core";
import { VUEFLOW_ID } from "~/constants/key";
import { EdgeType } from "~/types/diagram/edge";

const { getConnectedEdges } = useVueFlow(VUEFLOW_ID);

export function handleDefaultEdgeType(type: EdgeType | string): string {
  return type === EdgeType.Default ? EdgeType.ERD : type;
}

// Example targetHandle: "f48e3-left-73149"
function extractColumnId(handle: string | null | undefined): string {
  return handle?.split("-")[2] ?? "";
}

// A column has two handles, this function will check if either side has already had an edge connected
export function hasExistingEdgeOnColumnSide(
  source: string,
  targetHandle: string | null | undefined,
): boolean {
  if (!targetHandle) {
    return false;
  }

  const targetColId = extractColumnId(targetHandle);
  const edges = getConnectedEdges(source);

  return edges.some(
    (e) =>
      targetColId.toLowerCase() === extractColumnId(targetHandle).toLowerCase(),
  );
}
