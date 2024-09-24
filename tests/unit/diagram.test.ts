import { useVueFlow } from "@vue-flow/core";
import { beforeEach, describe, expect, it } from "vitest";
import {
  INVALID_EDGE_CONNECTION,
  MOCK_CONFLICT_TABLE,
  MOCK_NO_CONFLICT_TABLE,
  MOCK_TABLE_NODES,
  REMOVE_TABLE_NODE_ID,
  VALID_EDGE_CONNECTION,
} from "./mock-data/diagram";
import { VUEFLOW_ID } from "~/constants/key";
import type {
  CustomTableNode,
  TableNodeData,
  TableNodeDataColumn,
} from "~/types/diagram/table_node";
import { EdgeType } from "~/types/diagram/edge";
import { tableHasConflict } from "#imports";

describe("useVueFlowUtils functionality", () => {
  const store = useVueFlow(VUEFLOW_ID);
  const {
    getEdgeRemoveChangeFormat,
    getNodeRemoveChangeFormat,
    updateTableNodeName,
    updateTableNodeColumn,
    removeTable,
    addTable,
    addColumn,
    removeColumn,
    handleDefaultEdgeType,
    isValidEdgeConnection,
  } = useVueFlowUtils();

  function getTable1Columns(): TableNodeDataColumn[] {
    const data = store.getNodes.value[0].data as TableNodeData;
    return data.columns;
  }

  beforeEach(() => {
    // Reset node before everytime `it` function run
    store.setNodes(MOCK_TABLE_NODES);
  });

  it("Should mock the `useVueFlow` composable, using getNodes should return mock table data", () => {
    expect(store).to.exist;
    expect(store.getNodes.value.length).toEqual(MOCK_TABLE_NODES.length);
    expect(store.getNodes.value[0].id).toEqual(MOCK_TABLE_NODES[0].id);
    expect(store.getNodes.value[0].data).toEqual(MOCK_TABLE_NODES[0].data);
  });

  it("Table node conflict check", () => {
    expect(tableHasConflict(MOCK_NO_CONFLICT_TABLE)).toBe(false);
    expect(tableHasConflict(MOCK_CONFLICT_TABLE)).toBe(true);
  });

  it("Should be able to add a new table node", () => {
    expect(store.getNodes.value.length).toBe(MOCK_TABLE_NODES.length);
    addTable();
    expect(store.getNodes.value.length).toBe(MOCK_TABLE_NODES.length + 1);
  });

  it("Should be able to remove a table node", () => {
    expect(store.getNodes.value.length).toBe(MOCK_TABLE_NODES.length);
    removeTable(REMOVE_TABLE_NODE_ID);
    expect(store.getNodes.value.length).toBe(MOCK_TABLE_NODES.length - 1);
  });

  it("Should be able to add a new column to an existing table", () => {
    expect(getTable1Columns().length).toBe(1);
    addColumn(store.getNodes.value[0].id);
    expect(getTable1Columns().length).toBe(2);
  });

  it("Should be able to remove a column from an existing table", () => {
    addColumn(store.getNodes.value[0].id);
    expect(getTable1Columns().length).toBe(2);
    removeColumn(store.getNodes.value[0].id, getTable1Columns()[0].columnId);
    expect(getTable1Columns().length).toBe(1);
  });

  it("Should be able to edit table columns", () => {
    const nodeToUpdate = store.getNodes.value[0] as CustomTableNode;

    const columnToBeUpdated = {
      ...MOCK_TABLE_NODES[1].data.columns[0],
      columnId: nodeToUpdate.data!.columns[0].columnId,
    };

    // Update first node column to second node column
    updateTableNodeColumn(nodeToUpdate.id, columnToBeUpdated);

    expect(nodeToUpdate.data?.columns[0]).toStrictEqual(columnToBeUpdated);
  });

  it("Should be able to edit table name", () => {
    const nodeToUpdate = store.getNodes.value[0] as CustomTableNode;
    const tableNameToBeUpdated = "TestTableNameUpdate";

    updateTableNodeName(nodeToUpdate.id, tableNameToBeUpdated);
    expect(nodeToUpdate.data?.tableName).toBe(tableNameToBeUpdated);
  });

  it("Should not be able to remove a column from an existing table when there is only one column left", () => {
    expect(getTable1Columns().length).toBe(1);
    removeColumn(store.getNodes.value[0].id, getTable1Columns()[0].columnId);
    expect(getTable1Columns().length).toBe(1);
  });

  it("Should return type 'ERD' if the function received type 'default', otherwise return passed type", () => {
    expect(handleDefaultEdgeType(EdgeType.Default)).toEqual(EdgeType.ERD);
    expect(handleDefaultEdgeType(EdgeType.Step)).toEqual(EdgeType.Step);
    expect(handleDefaultEdgeType(EdgeType.SmoothStep)).toEqual(
      EdgeType.SmoothStep,
    );
    expect(handleDefaultEdgeType(EdgeType.ERD)).toEqual(EdgeType.ERD);
  });

  it("Should not allow table handle to connect itself", () => {
    expect(isValidEdgeConnection(INVALID_EDGE_CONNECTION, false)).toBe(false);
    expect(isValidEdgeConnection(VALID_EDGE_CONNECTION, false)).toBe(true);
  });
});
