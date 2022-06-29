import { TOMNode, DesignToken, JsonValue, Group, DtcgFile } from '@udt/tom';

function serializeCommonProps(node: TOMNode) {
  return {
    $type: node.type,
    $description: node.description,
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
