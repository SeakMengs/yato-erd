import { ErrorCode } from "@vue-flow/core";

export const YATO_ERD_ERROR_MESSAGE = {
  [YatoErDErrorCode.Delete_Last_Column_Of_Table]: buildYatoErdErrorMessage(
    "A table require at least one column",
  ),
  [YatoErDErrorCode.Unkown]: buildYatoErdErrorMessage(
    "Opps! Something went wrong",
    "danger",
  ),
  [YatoErDErrorCode.Node_Does_Not_Have_Data_Object]: buildYatoErdErrorMessage(
    "Opps! Strangely, the table does not have data",
  ),
  [YatoErDErrorCode.Node_Type_Not_Table]: buildYatoErdErrorMessage(
    "Opps! Node type is not 'table'",
  ),
  [YatoErDErrorCode.Node_Not_Found]: buildYatoErdErrorMessage(
    "Opps! Node not found",
  ),
  [ErrorCode.MISSING_STYLES]: buildYatoErdErrorMessage(
    "Styles are missing for the node.",
  ),
  [ErrorCode.MISSING_VIEWPORT_DIMENSIONS]: buildYatoErdErrorMessage(
    "Viewport dimensions are missing.",
  ),
  [ErrorCode.NODE_INVALID]: buildYatoErdErrorMessage("The node is invalid."),
  [ErrorCode.NODE_NOT_FOUND]: buildYatoErdErrorMessage(
    "The node was not found.",
  ),
  [ErrorCode.NODE_MISSING_PARENT]: buildYatoErdErrorMessage(
    "The node is missing a parent.",
  ),
  [ErrorCode.NODE_TYPE_MISSING]: buildYatoErdErrorMessage(
    "The node type is missing.",
  ),
  [ErrorCode.NODE_EXTENT_INVALID]: buildYatoErdErrorMessage(
    "The node extent is invalid.",
  ),
  [ErrorCode.EDGE_INVALID]: buildYatoErdErrorMessage("The edge is invalid."),
  [ErrorCode.EDGE_NOT_FOUND]: buildYatoErdErrorMessage(
    "The edge was not found.",
  ),
  [ErrorCode.EDGE_SOURCE_MISSING]: buildYatoErdErrorMessage(
    "The edge source is missing.",
  ),
  [ErrorCode.EDGE_TARGET_MISSING]: buildYatoErdErrorMessage(
    "The edge target is missing.",
  ),
  [ErrorCode.EDGE_TYPE_MISSING]: buildYatoErdErrorMessage(
    "The edge type is missing.",
  ),
  [ErrorCode.EDGE_SOURCE_TARGET_SAME]: buildYatoErdErrorMessage(
    "The edge source and target are the same.",
  ),
  [ErrorCode.EDGE_SOURCE_TARGET_MISSING]: buildYatoErdErrorMessage(
    "The edge source or target is missing.",
  ),
  [ErrorCode.EDGE_ORPHANED]: buildYatoErdErrorMessage("The edge is orphaned."),
  [ErrorCode.USEVUEFLOW_OPTIONS]: buildYatoErdErrorMessage(
    "Invalid options in useVueFlow.",
  ),
} satisfies YATO_ERD_ERROR_MESSAGE_TYPE;
