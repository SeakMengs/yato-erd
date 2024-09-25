import dagre from "@dagrejs/dagre";
import {
  Position,
  useVueFlow,
  type GraphEdge,
  type GraphNode,
} from "@vue-flow/core";
import { ref } from "vue";

// Reference: https://vueflow.dev/examples/layout.html
export function useLayout() {
  const { findNode } = useVueFlow();
  const nodePadding = { width: 50, height: 50 };

  const graph = ref<dagre.graphlib.Graph>(new dagre.graphlib.Graph());

  function layout(
    nodes: GraphNode[],
    edges: GraphEdge[],
    direction: "LR" | "RL" | "TB" | "BT" = "TB",
  ) {
    const dagreGraph = new dagre.graphlib.Graph();
    graph.value = dagreGraph;

    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    for (const node of nodes) {
      const graphNode = findNode(node.id);

      if (!graphNode) {
        continue;
      }

      dagreGraph.setNode(node.id, {
        width: (graphNode.dimensions.width || 150) + nodePadding.width,
        height: (graphNode.dimensions.height || 200) + nodePadding.height,
      });
    }

    for (const edge of edges) {
      dagreGraph.setEdge(edge.source, edge.target);
    }

    dagre.layout(dagreGraph);

    return nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);

      return {
        ...node,
        targetPosition: isHorizontal ? Position.Left : Position.Top,
        sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
        position: {
          x: nodeWithPosition.x,
          y: nodeWithPosition.y,
        },
      };
    });
  }

  return { graph, layout };
}
