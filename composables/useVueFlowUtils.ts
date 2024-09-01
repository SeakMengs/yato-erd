import { useVueFlow, type Connection } from "@vue-flow/core";
import type { Position } from "@vueuse/core";

export function useVueFlowUtils() {
  const { getConnectedEdges, getViewport } = useVueFlow();

  function generateRandomNodePosition(): Position {
    return {
      x: Math.random() * 400,
      y: Math.random() * 400,
    };
  }

  function hasExistingEdgeOnColumnSide(
    source: string,
    targetHandle: string | null | undefined,
  ): boolean {
    if (!targetHandle) {
      return false;
    }

    const extractColId = (handle: string | null | undefined): string => {
      // Example
      // targetHandle: "f48e3-left-73149"
      return handle?.split("-")[2] ?? "";
    };

    const targetColId = extractColId(targetHandle);
    const edges = getConnectedEdges(source);
    for (const edge of edges) {
      const colId = extractColId(edge.targetHandle);

      if (targetColId.toLowerCase() === colId.toLowerCase()) {
        return true;
      }
    }

    return false;
  }

  function isValidEdgeConnection(
    connection: Connection,
    checkEdgeSide: boolean = true,
  ): boolean {
    // Call this function in onEdgeUpdate, don't check edge side so that user can drag and move existing edge to the opposite side
    if (checkEdgeSide) {
      if (
        hasExistingEdgeOnColumnSide(
          connection.source,
          connection.targetHandle,
        ) ||
        hasExistingEdgeOnColumnSide(connection.target, connection.sourceHandle)
      ) {
        return false;
      }
    }

    // Prevent handle to connect with it own node (table basically)
    return connection.source !== connection.target;
  }

  return {
    generateRandomNodePosition,
    isValidEdgeConnection,
    handleDefaultEdgeType,
  };
}
