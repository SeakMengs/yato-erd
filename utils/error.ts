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
import { YATO_ERD_ERROR_MESSAGE } from "~/constants/error";

export enum YatoErDErrorCode {
  Unkown = "Unkown",
  Delete_Last_Column_Of_Table = "Delete_Last_Column_Of_Table",
  Node_Does_Not_Have_Data_Object = "Node_Does_Not_Have_Data_Object",
  Node_Type_Not_Table = "Node_Type_Not_Table",
  Node_Not_Found = "Node_Not_Found",
}

export type YATO_ERD_ERROR_MESSAGE_TYPE = Record<
  YatoErDErrorCode | ErrorCode,
  ReturnType<typeof buildYatoErdErrorMessage>
>;

const { toast } = useToast();
export function errorHandler(error: unknown, from: string = "unkown"): void {
  let err = YATO_ERD_ERROR_MESSAGE[YatoErDErrorCode.Unkown];

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
    code: YatoErDErrorCode = YatoErDErrorCode.Unkown,
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
