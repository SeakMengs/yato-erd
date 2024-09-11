import {
  useVueFlow,
  type Edge,
  type GraphEdge,
  type Node,
} from "@vue-flow/core";
import { VUEFLOW_ID } from "~/constants/key";
import { erdEdgesSchema } from "~/schemas/erd";
import { EdgeType } from "~/types/diagram/edge";

const { getConnectedEdges } = useVueFlow(VUEFLOW_ID);

export function handleDefaultEdgeType(type: EdgeType | string): string {
  return type === EdgeType.Default ? EdgeType.ERD : type;
}

export function getHandleId(
  position: "left" | "right",
  nodeId: string,
  columnId: string,
): string {
  return `${nodeId}-${position}-${columnId}`;
}

type SourceHandle = string | null | undefined;
// Example targetHandle: "f48e3-left-73149" | "source-handlePositon-columnId"
function extractColumnId(handle: SourceHandle): string {
  return handle?.split("-")[2] ?? "";
}

function extractSourceId(handle: SourceHandle): string {
  return handle?.split("-")[0] ?? "";
}

// A column has two handles, this function will check if either side has already had an edge connected
export function hasExistingEdgeOnColumnSide(
  sourceHandle: SourceHandle,
  targetHandle: SourceHandle,
): boolean {
  if (!targetHandle) {
    return false;
  }

  const targetColId = extractColumnId(targetHandle);
  const sourceColId = extractColumnId(sourceHandle);
  const edges = getConnectedEdges(extractSourceId(sourceHandle));

  return edges.some(
    (e) =>
      targetColId.toLowerCase() ===
        extractColumnId(e.targetHandle).toLowerCase() &&
      sourceColId.toLowerCase() ===
        extractColumnId(e.sourceHandle).toLowerCase(),
  );
}

export function validateEdges(data: unknown): Edge[] {
  const result = erdEdgesSchema.safeParse(data);
  return result.success ? result.data : [];
}
