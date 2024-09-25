import type { ErrorCode } from "@vue-flow/core";

export enum YatoErDErrorCode {
  /**
   * An unknown error has occurred, use this for fallback error code only.
   */
  UNKNOWN = "UNKNOWN",

  /**
   * You can't delete the last column of a table.
   */
  DELETE_LAST_COLUMN_OF_TABLE = "DELETE_LAST_COLUMN_OF_TABLE",

  /**
   * The node is missing the required data object, most likely won't happen tho never make assumption.
   */
  NODE_DOES_NOT_HAVE_DATA_OBJECT = "NODE_DOES_NOT_HAVE_DATA_OBJECT",

  /**
   * The node is not a table, but a table was expected.
   */
  NODE_TYPE_NOT_TABLE = "NODE_TYPE_NOT_TABLE",

  /**
   * The specified node could not be found (mostly from findNode ).
   */
  F_NODE_NOT_FOUND = "F_NODE_NOT_FOUND",

  /**
   * There was a problem getting the ERD state from local storage.
   */
  GET_ERD_STATE_FROM_LOCAL_STORAGE = "GET_ERD_STATE_FROM_LOCAL_STORAGE",

  /**
   * There was a problem saving the ERD state to local storage.
   */
  SAVE_ERD_STATE_TO_LOCAL_STORAGE = "SAVE_ERD_STATE_TO_LOCAL_STORAGE",

  /**
   * The ERD state is invalid, could be because user edit the state by themselves.
   */
  ERD_STATE_IS_INVALID = "ERD_STATE_IS_INVALID",

  /**
   * When importing erd state via json file fail. could be because wrong format, wrong file type
   */
  IMPORT_JSON_ERD_STATE = "IMPORT_JSON_ERD_STATE",

  /**
   * The YJS provider needs to be set up on the client side, usually webrtc.
   */
  YJS_PROVIDER_MUST_ESTABLISH_IN_CLIENT_SIDE = "YJS_PROVIDER_MUST_ESTABLISH_IN_CLIENT_SIDE",
}

export type YATO_ERD_ERROR_MESSAGE_TYPE = Record<
  YatoErDErrorCode | ErrorCode,
  ReturnType<typeof buildYatoErdErrorMessage>
>;
