// Credit to reactflow simple float example.
// https://codesandbox.io/p/sandbox/dank-architecture-c49ycq?file=%2FSimpleFloatingEdge.jsx%3A32%2C22
import { Position, type XYPosition, type GraphNode } from "@vue-flow/core";

// returns the position (top,right,bottom or right) passed node compared to
type GetParams = XYPosition & {
  position: Position;
};

function getParams(
  nodeA: GraphNode,
  nodeB: GraphNode,
  columnId: string,
): GetParams {
  const centerA = getNodeCenter(nodeA);
  const centerB = getNodeCenter(nodeB);

  // const horizontalDiff = Math.abs(centerA.x - centerB.x);
  // const verticalDiff = Math.abs(centerA.y - centerB.y);

  let position: Position;

  // when the horizontal difference between the nodes is bigger, we use Position.Left or Position.Right for the handle
  // if (horizontalDiff > verticalDiff) {
  //   position = centerA.x > centerB.x ? Position.Left : Position.Right;
  // } else {
  //   // here the vertical difference between the nodes is bigger, so we use Position.Top or Position.Bottom for the handle
  //   position = centerA.y > centerB.y ? Position.Top : Position.Bottom;
  // }

  // Since we only have left and right handle, no need to compare horizontal and vertical
  position = centerA.x > centerB.x ? Position.Left : Position.Right;

  const { x, y } = getHandleCoordsByPosition(nodeA, position, columnId);
  return { x, y, position };
}

function getHandleCoordsByPosition(
  node: GraphNode,
  handlePosition: Position,
  columnId: string,
): XYPosition {
  let x: number = 0;
  let y: number = 0;
  if (!node.handleBounds.source) {
    return { x, y };
  }

  // all handles are from type source, that's why we use handleBounds.source here
  // Make sure only find handle with the same column id
  const handle = node.handleBounds.source.find(
    (h) => extractColumnId(h.id) === columnId && h.position === handlePosition,
  );

  if (!handle) {
    return { x, y };
  }

  let offsetX = handle.width / 2;
  let offsetY = handle.height / 2;

  // this is a tiny detail to make the markerEnd of an edge visible.
  // The handle position that gets calculated has the origin top-left, so depending which side we are using, we add a little offset
  // when the handlePosition is Position.Right for example, we need to add an offset as big as the handle itself in order to get the correct position
  switch (handlePosition) {
    case Position.Left:
      offsetX = 0;
      break;
    case Position.Right:
      offsetX = handle.width;
      break;
    case Position.Top:
      offsetY = 0;
      break;
    case Position.Bottom:
      offsetY = handle.height;
      break;
  }

  x = node.position.x + handle.x + offsetX;
  y = node.position.y + handle.y + offsetY;

  return { x, y };
}

function getNodeCenter(node: GraphNode): XYPosition {
  return {
    x: node.position.x + node.dimensions.width / 2,
    y: node.position.y + node.dimensions.height / 2,
  };
}

type EdgeParams = {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  sourcePos: Position;
  targetPos: Position;
};

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(
  sourceNode: GraphNode,
  targetNode: GraphNode,
  sourceColumnId: string,
  targetColumnId: string,
): EdgeParams {
  const {
    x: sx,
    y: sy,
    position: sourcePos,
  } = getParams(sourceNode, targetNode, sourceColumnId);
  const {
    x: tx,
    y: ty,
    position: targetPos,
  } = getParams(targetNode, sourceNode, targetColumnId);

  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos,
    targetPos,
  };
}
