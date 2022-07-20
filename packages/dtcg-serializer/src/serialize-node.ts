import { TOMNode, DesignToken, JsonValue, Group, RootGroup } from '@udt/tom';

function serializeCommonProps(node: TOMNode) {
  return {
    $type: node.getType(),
    $description: node.getDescription(),
  };
}

function serializeDesignToken(token: DesignToken) {
  let extensions: Record<string, JsonValue> | undefined;
  if (token.hasExtensions()) {
    extensions = {};
    for (const [key, extension] of token.extensions()) {
      extensions[key] = extension;
    }
  }


  return {
    ...serializeCommonProps(token),

    $value: token.value,
    $extensions: extensions,
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
