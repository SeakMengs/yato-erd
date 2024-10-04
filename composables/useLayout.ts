import dagre from "@dagrejs/dagre";
import { Position, type GraphEdge, type GraphNode } from "@vue-flow/core";
import { ref } from "vue";

// Reference: https://vueflow.dev/examples/layout.html
export function useLayout() {
  const graph = ref<dagre.graphlib.Graph>(new dagre.graphlib.Graph());

  function layout(
    nodes: GraphNode[],
    edges: GraphEdge[],
    direction: "LR" | "RL" | "TB" | "BT" = "TB",
  ) {
    const dagreGraph = new dagre.graphlib.Graph();
    graph.value = dagreGraph;

    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const isHorizontal = direction === "LR" || direction === "RL";

    dagreGraph.setGraph({
      rankdir: direction,
    });

    for (const node of nodes) {
      dagreGraph.setNode(node.id, {
        width: node.dimensions.width,
        height: node.dimensions.height,
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
        // https://github.com/xyflow/xyflow/issues/2396#issuecomment-1236985609
        position: {
          x: nodeWithPosition.x - node.dimensions.width / 2,
          y: nodeWithPosition.y - node.dimensions.height / 2,
        },
      };
    });
  }

  return { graph, layout };
}
