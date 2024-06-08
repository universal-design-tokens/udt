import { TOMNode, DesignToken, Group, RootGroup } from '@udt/tom';
import { serializeValue } from './values/serialize-value.js';

function serializeExtensions(node: TOMNode): Record<string, any> | undefined {
  let extensions: Record<string, any> | undefined;
  if (node.hasExtensions()) {
    extensions = {};
    for (const [key, extension] of node.extensions()) {
      extensions[key] = extension;
    }
  }
  return extensions;
}

function serializeCommonProps(node: TOMNode) {
  return {
    $type: node.getType(),
    $description: node.getDescription(),
    $extensions: serializeExtensions(node),
  };
}

function serializeDesignToken(token: DesignToken) {
  return {
    ...serializeCommonProps(token),

    $value: serializeValue(token.getValue(), token.getResolvedType()),
  };
}

function serializeGroup(group: Group) {
  const output: any = {
    ...serializeCommonProps(group),
  };

  for (const child of group) {
    if (child instanceof DesignToken) {
      output[child.getName()] = serializeDesignToken(child);
    }
    else {
      output[child.getName()] = serializeGroup(child);
    }
  }

  return output;
}


export function serializeDtcgFile(file: RootGroup) {
  return serializeGroup(file);
}
