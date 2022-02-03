import { TOMNode } from '../tom/tom-node';
import { DesignToken } from '../tom/design-token';
import { Group } from '../tom/group';
import { DtcgFile } from '../tom/dtcg-file';

function serializeCommonProps(node: TOMNode) {
  return {
    $type: node.getOwnType(),
    $description: node.description,
  };
}

function serializeDesignToken(token: DesignToken) {
  return {
    ...serializeCommonProps(token),

    $value: token.getOwnValue(),
    // TODO: extensions
  }
}

function serializeGroup(group: Group) {
  const output: any = {
    ...serializeCommonProps(group),
  };

  for (const child of group) {
    if (child instanceof DesignToken) {
      output[child.name] = serializeDesignToken(child);
    }
    else {
      output[child.name] = serializeGroup(child);
    }
  }

  return output;
}


export function serializeDtcgFile(file: DtcgFile) {
  return serializeGroup(file);
}
