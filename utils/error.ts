/*
 * Error Handling Flow:
 * 1. **Known Errors**:
 *    - **Inside try-catch block**:
 *      - The `catch` block handles the error using the `errorHandler()` function (no log in the browser).
 *    - **Outside try-catch block**:
 *      - The error is caught by `onErrorCaptured` in `app.vue` and logged in the console.
 * 2. **Unhandled Errors**:
 *    - All unhandled errors are captured by `onErrorCaptured` in `App.vue` and logged in the console.
 * 3. **Vue-Flow Errors**:
 *    - Handled by the `errorHandler()` function.
 * **Note**: Every error we send a toast of information to user. If the error code doesn't exist, a fallback to `YatoErDErrorCode.Unknown` is used.
 */

import { ErrorCode, VueFlowError } from "@vue-flow/core";
import { useToast } from "~/components/ui/toast";

export enum YatoErDErrorCode {
  Unknown = "Unknown",
  Delete_Last_Column_Of_Table = "Delete_Last_Column_Of_Table",
  Node_Does_Not_Have_Data_Object = "Node_Does_Not_Have_Data_Object",
  Node_Type_Not_Table = "Node_Type_Not_Table",
  Node_Not_Found = "Node_Not_Found",
}

export type YATO_ERD_ERROR_MESSAGE_TYPE = Record<
  YatoErDErrorCode | ErrorCode,
  ReturnType<typeof buildYatoErdErrorMessage>
>;

export const YATO_ERD_ERROR_MESSAGE = {
  [YatoErDErrorCode.Delete_Last_Column_Of_Table]: buildYatoErdErrorMessage(
    "A table require at least one column",
  ),
  [YatoErDErrorCode.Unknown]: buildYatoErdErrorMessage(
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


const { toast } = useToast();
export function errorHandler(error: unknown, from: string = "Unknown"): void {
  let err = YATO_ERD_ERROR_MESSAGE[YatoErDErrorCode.Unknown];

  if (error instanceof YatoErDError || error instanceof VueFlowError) {
    if (error.code) {
      err = YATO_ERD_ERROR_MESSAGE[error.code as YatoErDErrorCode];
    }
  } else {
    logger.error("message from app.vue: An unkown error was thrown", error);
  }

  toast({
    description: err.description,
    title: err.title ?? "",
    variant: err.type === "danger" ? "destructive" : "default",
  });

  logger.error(`Development log | An error occured in ${from}`, error);
}

export class YatoErDError extends Error {
  public readonly title: string | undefined | null;
  public readonly description: string | undefined;
  public readonly code: YatoErDErrorCode;

  constructor(
    code: YatoErDErrorCode = YatoErDErrorCode.Unknown,
    args?: {
      message?: string;
      title?: string;
    },
  ) {
    const err = YATO_ERD_ERROR_MESSAGE[code];
    super(args?.message ?? err.description);
    this.name = "YatoErDError";
    this.description = this.message;
    this.title = args?.title;
    this.code = code;
  }
}

export function buildYatoErdErrorMessage(
  description: string,
  type: "warn" | "danger" = "warn",
  title: string | null = null,
) {
  return {
    title: title,
    description: description,
    type: type,
  };
}
