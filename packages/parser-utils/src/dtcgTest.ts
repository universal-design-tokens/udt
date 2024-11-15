import { type JsonObject, parseData } from "./index.js";

export type InheritablePropValueProcessor<T = unknown> = (
  propValue: T,
  inheritedValue?: T
) => T;

export interface InheritableProperties {
  [propName: string]: InheritablePropValueProcessor;
}

// Test impl.

function isDtcgDesignToken(data: JsonObject): boolean {
  return data.$value !== undefined;
}

export function parseDtcg(data: unknown) {
  const inheritableProperties: InheritableProperties = {
    $type: (propValue, _inheritedValue) => propValue,
  };

  function parseDtcgDesignToken(
    data: JsonObject,
    path: string[],
    contextFromParent?: JsonObject
  ) {
    console.log(
      `Got token ${path.join(".")}, with data: `,
      data,
      " and inherited props: ",
      contextFromParent
    );
  }

  function parseDtcgGroup(
    data: JsonObject,
    path: string[],
    contextFromParent?: JsonObject
  ) {
    if (path.length === 0) {
      console.log(
        `Got root group, with data: `,
        data,
        " and inherited props: ",
        contextFromParent
      );
    } else {
      console.log(
        `Got group ${path.join(".")}, with data: `,
        data,
        " and inherited props: ",
        contextFromParent
      );
    }

    const contextForChildren = { ...contextFromParent };
    if (contextFromParent) {
      for (const propName in inheritableProperties) {
        const groupProp = data[propName];
        if (groupProp !== undefined) {
          const processProp = inheritableProperties[propName];
          contextForChildren[propName] = processProp(
            groupProp,
            contextFromParent[propName]
          );
        }
      }
    }

    return {
      group: undefined,
      contextForChildren,
    };
  }

  parseData(data, {
    isDesignTokenData: isDtcgDesignToken,
    parseDesignTokenData: parseDtcgDesignToken,
    parseGroupData: parseDtcgGroup,
    groupPropsToExtract: [/^\$/],
  });
}

parseDtcg({
  $description: "root group",
  $type: "color",
  foo: {
    $extensions: {},
    childOfFoo: {
      $type: "number",
      fooToken: {
        $value: 123,
      },
    },
  },
});
