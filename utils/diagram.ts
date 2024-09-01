import { EdgeType } from "~/types/diagram/edge";

export function handleDefaultEdgeType(type: EdgeType | string): string {
  return type === EdgeType.Default ? EdgeType.ERD : type;
}
