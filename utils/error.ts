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
import { toast } from "~/components/ui/toast";
import {
  type YATO_ERD_ERROR_MESSAGE_TYPE,
  YatoErDErrorCode,
} from "~/types/error";

export { YatoErDErrorCode };

export const YATO_ERD_ERROR_MESSAGE = {
  [YatoErDErrorCode.DELETE_LAST_COLUMN_OF_TABLE]: buildYatoErdErrorMessage(
    "A table requires at least one column",
  ),
  [YatoErDErrorCode.UNKNOWN]: buildYatoErdErrorMessage(
    "Oops! Something went wrong",
    "danger",
  ),
  [YatoErDErrorCode.NODE_DOES_NOT_HAVE_DATA_OBJECT]: buildYatoErdErrorMessage(
    "Oops! Strangely, the table does not have data",
  ),
  [YatoErDErrorCode.NODE_TYPE_NOT_TABLE]: buildYatoErdErrorMessage(
    "Oops! Node type is not 'table'",
  ),
  [YatoErDErrorCode.F_NODE_NOT_FOUND]: buildYatoErdErrorMessage(
    "Oops! Node not found",
  ),
  [YatoErDErrorCode.GET_ERD_STATE_FROM_LOCAL_STORAGE]: buildYatoErdErrorMessage(
    "Failed to get ERD state from local storage",
    "danger",
  ),
  [YatoErDErrorCode.SAVE_ERD_STATE_TO_LOCAL_STORAGE]: buildYatoErdErrorMessage(
    "This usually happen when you violate yato-erd validation format",
    "danger",
    "Failed to save ERD state to local storage.",
  ),
  [YatoErDErrorCode.ERD_STATE_IS_INVALID]: buildYatoErdErrorMessage(
    "The erd state is invalid",
    "danger",
  ),
  [YatoErDErrorCode.IMPORT_JSON_ERD_STATE]: buildYatoErdErrorMessage(
    "This usually happen when the json file violate yato-erd validation format",
    "danger",
    "Failed to import state from json file",
  ),
  [YatoErDErrorCode.YJS_PROVIDER_MUST_ESTABLISH_IN_CLIENT_SIDE]:
    buildYatoErdErrorMessage(
      "Yjs provider must establish on client side",
      "danger",
    ),
  [ErrorCode.MISSING_STYLES]: buildYatoErdErrorMessage(
    "Styles are missing for the node.",
    "danger",
  ),
  [ErrorCode.MISSING_VIEWPORT_DIMENSIONS]: buildYatoErdErrorMessage(
    "Viewport dimensions are missing.",
    "danger",
  ),
  [ErrorCode.NODE_INVALID]: buildYatoErdErrorMessage(
    "The node is invalid.",
    "danger",
  ),
  [ErrorCode.NODE_NOT_FOUND]: buildYatoErdErrorMessage(
    "The node was not found.",
    "danger",
  ),
  [ErrorCode.NODE_MISSING_PARENT]: buildYatoErdErrorMessage(
    "The node is missing a parent.",
    "danger",
  ),
  [ErrorCode.NODE_TYPE_MISSING]: buildYatoErdErrorMessage(
    "The node type is missing.",
    "danger",
  ),
  [ErrorCode.NODE_EXTENT_INVALID]: buildYatoErdErrorMessage(
    "The node extent is invalid.",
    "danger",
  ),
  [ErrorCode.EDGE_INVALID]: buildYatoErdErrorMessage(
    "The edge is invalid.",
    "danger",
  ),
  [ErrorCode.EDGE_NOT_FOUND]: buildYatoErdErrorMessage(
    "The edge was not found.",
    "danger",
  ),
  [ErrorCode.EDGE_SOURCE_MISSING]: buildYatoErdErrorMessage(
    "The edge source is missing.",
    "danger",
  ),
  [ErrorCode.EDGE_TARGET_MISSING]: buildYatoErdErrorMessage(
    "The edge target is missing.",
    "danger",
  ),
  [ErrorCode.EDGE_TYPE_MISSING]: buildYatoErdErrorMessage(
    "The edge type is missing.",
    "danger",
  ),
  [ErrorCode.EDGE_SOURCE_TARGET_SAME]: buildYatoErdErrorMessage(
    "The edge source and target are the same.",
    "danger",
  ),
  [ErrorCode.EDGE_SOURCE_TARGET_MISSING]: buildYatoErdErrorMessage(
    "The edge source or target is missing.",
    "danger",
  ),
  [ErrorCode.EDGE_ORPHANED]: buildYatoErdErrorMessage(
    "The edge is orphaned.",
    "danger",
  ),
  [ErrorCode.USEVUEFLOW_OPTIONS]: buildYatoErdErrorMessage(
    "Invalid options in useVueFlow.",
    "danger",
  ),
} satisfies YATO_ERD_ERROR_MESSAGE_TYPE;

export function errorHandler(error: unknown, from: string = "Unknown"): void {
  let err = YATO_ERD_ERROR_MESSAGE[YatoErDErrorCode.UNKNOWN];

  if (error instanceof YatoErDError || error instanceof VueFlowError) {
    if (error.code) {
      err = YATO_ERD_ERROR_MESSAGE[error.code as YatoErDErrorCode];
    }
  } else {
    logger.error(
      `message from app.vue: An unkown error was thrown, ${error}`,
      error,
    );
  }

  toast({
    description: err.description,
    // For debug purpose on device that cannot use inspect element
    // description: `${error}`,
    title: err.title ?? "",
    variant: err.type === "danger" ? "destructive" : "default",
  });

  logger.error(
    `Development log | An error occured in ${from}, ${error}`,
    error,
  );
}

export class YatoErDError extends Error {
  public readonly title: string | undefined | null;
  public readonly description: string | undefined;
  public readonly code: YatoErDErrorCode;

  constructor(
    code: YatoErDErrorCode = YatoErDErrorCode.UNKNOWN,
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
