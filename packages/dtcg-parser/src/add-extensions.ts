import { TOMNode } from "@udt/tom";
import { isJsonObject } from "./utils";

export function addExtensions(node: TOMNode, extensions: any): void {
  if (isJsonObject(extensions)) {
    for (const key of Object.keys(extensions)) {
      node.setExtension(key, extensions[key]);
    }
  }
  else if (extensions !== undefined) {
    throw new Error('Invalid extensions map');
  }
}
