import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  parseData,
  type ParseDesignTokenDataFn,
  type ParseGroupDataFn,
  type IsDesignTokenDataFn,
  type ParserConfig,
  InvalidDataError,
  AddChildFn,
} from "./parseData.js";

interface TestGroup {
  type: "group";
}

interface TestDesignToken {
  type: "token";
}

interface TestParentContext {
  dummyData?: number;

  // Used to pass in a mock addChild() function for
  // mockParseGroupData() to use for testing
  addChild?: AddChildFn<TestGroup, TestDesignToken>;
}

interface ParseDataCall {
  type: "group" | "token";
  path: string[];
}

interface AddChildCall {
  type: "addChild";
  name: string;
}

// Used to track the order in which parseXyzData and addChild
// functions are called
let parseDataCalls: (ParseDataCall | AddChildCall)[] = [];

/*
 * For the purpose of these tests, any object with a
 * value property will be considered a design token.
 *
 * Intentionally not using (current) DTCG syntax, to
 * demonstrate that parseData() could be used to parse
 * other formats too, as long as they use the same
 * nested object structure for groups and tokens.
 */
const mockIsDesignTokenData = vi.fn<IsDesignTokenDataFn>(
  (data) => data.value !== undefined
);

const mockParseGroupData = vi.fn<
  ParseGroupDataFn<TestGroup, TestDesignToken, TestParentContext>
>((_data, path, contextFromParent) => {
  parseDataCalls.push({
    type: "group",
    path,
  });
  return {
    group: {
      type: "group",
    },
    // pass through contextFromParent
    contextForChildren: contextFromParent,

    // pass through addChild
    addChild: contextFromParent?.addChild,
  };
});

const mockParseDesignTokenData = vi.fn<
  ParseDesignTokenDataFn<TestDesignToken, TestParentContext>
>((_data, path, _contextFromParent) => {
  parseDataCalls.push({ type: "token", path });
  const result: TestDesignToken = {
    type: "token",
  };
  return result;
});

describe("parseData()", () => {
  const parserConfig: ParserConfig<
    TestDesignToken,
    TestGroup,
    TestParentContext
  > = {
    isDesignTokenData: mockIsDesignTokenData,
    groupPropsToExtract: [],
    parseGroupData: mockParseGroupData,
    parseDesignTokenData: mockParseDesignTokenData,
  };

  beforeEach(() => {
    // Reset stuff
    parseDataCalls = [];
    parserConfig.groupPropsToExtract = [];
    mockIsDesignTokenData.mockClear();
    mockParseGroupData.mockClear();
    mockParseDesignTokenData.mockClear();
  });

  describe("parsing an empty group object", () => {
    let parsedGroupOrToken: TestGroup | TestDesignToken;

    beforeEach(() => {
      parsedGroupOrToken = parseData({}, parserConfig);
    });

    it("returns a group", () => {
      expect(parsedGroupOrToken.type).toBe("group");
    });

    it("calls isDesignTokenData function once", () => {
      expect(mockIsDesignTokenData).toHaveBeenCalledOnce();
    });

    it("class isDesignTokenData function with input data", () => {
      expect(mockIsDesignTokenData).toHaveBeenCalledWith({});
    });

    it("calls parseGroupData function once", () => {
      expect(mockParseGroupData).toHaveBeenCalledOnce();
    });

    it("calls parseGroupData function with empty group and empty path array", () => {
      expect(mockParseGroupData).toHaveBeenCalledWith({}, [], undefined);
    });

    it("does not call parseDesignTokenData function", () => {
      expect(mockParseDesignTokenData).not.toHaveBeenCalled();
    });
  });

  describe("parsing a design token object", () => {
    const testTokenData = {
      value: "whatever", // <-- this makes it a token
      other: "thing",
      stuff: 123,
      notAGroup: {},
    };
    let parsedGroupOrToken: TestGroup | TestDesignToken;

    beforeEach(() => {
      parsedGroupOrToken = parseData(testTokenData, parserConfig);
    });

    it("returns a design token", () => {
      expect(parsedGroupOrToken.type).toBe("token");
    });

    it("does not call parseGroupData function", () => {
      expect(mockParseGroupData).not.toHaveBeenCalled();
    });

    it("calls parseDesignTokenData function once", () => {
      expect(mockParseDesignTokenData).toHaveBeenCalledOnce();
    });

    it("calls parseDesignTokenData function with complete data and empty path array", () => {
      expect(mockParseDesignTokenData).toHaveBeenCalledWith(
        testTokenData,
        [],
        undefined
      );
    });
  });

  describe("parsing a group object containing design tokens and nested groups", () => {
    /*
      Contains:

      - 4 groups: <root>, emptyGroup,
        groupWithTokens, nestedGroup

      - 5 tokens: nestedToken, anotherNestedToken,
        deeplyNestedToken, token, anotherToken
    */
    const testData = {
      specialGroupProp: {
        value: "not a token value",
        description: "This is not a group or token!",
      },
      emptyGroup: {},
      groupWithTokens: {
        nestedToken: {
          value: "a",
        },
        anotherNestedToken: {
          value: "b",
        },
        nestedGroup: {
          deeplyNestedToken: {
            value: "x",
          },
        },
      },
      token: {
        value: 1,
      },
      anotherToken: {
        value: 2,
      },
    };

    beforeEach(() => {
      parserConfig.groupPropsToExtract = ["specialGroupProp"];
      parseData(testData, parserConfig);
    });

    it("calls parseDesignTokenData function 5 times", () => {
      expect(mockParseDesignTokenData).toHaveBeenCalledTimes(5);
    });

    it("calls parseGroupData function 4 times", () => {
      expect(mockParseGroupData).toHaveBeenCalledTimes(4);
    });

    it("only passed extracted group props to the parseGroupData function", () => {
      expect(mockParseGroupData).toHaveBeenNthCalledWith(
        1,
        { specialGroupProp: testData.specialGroupProp },
        [],
        undefined
      );
    });

    it("traverses the data depth-first", () => {
      // Start with root group
      expect(parseDataCalls[0]).toStrictEqual({
        type: "group",
        path: [],
      });

      // "emptyGroup" next
      expect(parseDataCalls[1]).toStrictEqual({
        type: "group",
        path: ["emptyGroup"],
      });

      // "groupWithTokens" next
      expect(parseDataCalls[2]).toStrictEqual({
        type: "group",
        path: ["groupWithTokens"],
      });

      // "nestedToken" next
      expect(parseDataCalls[3]).toStrictEqual({
        type: "token",
        path: ["groupWithTokens", "nestedToken"],
      });

      // "anotherNestedToken" next
      expect(parseDataCalls[4]).toStrictEqual({
        type: "token",
        path: ["groupWithTokens", "anotherNestedToken"],
      });

      // "nestedGroup" next
      expect(parseDataCalls[5]).toStrictEqual({
        type: "group",
        path: ["groupWithTokens", "nestedGroup"],
      });

      // "deeplyNestedToken" next
      expect(parseDataCalls[6]).toStrictEqual({
        type: "token",
        path: ["groupWithTokens", "nestedGroup", "deeplyNestedToken"],
      });

      // "token" next
      expect(parseDataCalls[7]).toStrictEqual({
        type: "token",
        path: ["token"],
      });

      // "anotherToken" next
      expect(parseDataCalls[8]).toStrictEqual({
        type: "token",
        path: ["anotherToken"],
      });
    });
  });

  describe("with context data", () => {
    const testData = { group: {}, token: { value: 123 } };
    const testContext: TestParentContext = { dummyData: 42 };

    beforeEach(() => {
      parseData(testData, parserConfig, testContext);
    });

    it("passes the context data to outermost parseGroupData call", () => {
      // 1st call is the root group
      expect(mockParseGroupData).toHaveBeenNthCalledWith(
        1,
        {},
        [],
        testContext
      );
    });

    it("passes context from parent group to parseGroupData calls for child groups", () => {
      expect(mockParseGroupData).toHaveBeenNthCalledWith(
        2,
        {},
        ["group"],
        testContext
      );
    });

    it("passes context from parent group to parseDesignTokenData calls for child tokens", () => {
      expect(mockParseDesignTokenData).toHaveBeenCalledWith(
        testData.token,
        ["token"],
        testContext
      );
    });
  });

  describe("using addChild functions", () => {
    const testData = {
      tokenA: { value: 1 },
      tokenB: { value: 2 },
      groupC: { tokenX: { value: 99 }, tokenY: { value: 100 } },
    };
    const mockAddChild = vi.fn<AddChildFn<TestGroup, TestDesignToken>>(
      (name, _child) => {
        parseDataCalls.push({
          type: "addChild",
          name,
        });
      }
    );
    const testContext: TestParentContext = { addChild: mockAddChild };

    beforeEach(() => {
      mockAddChild.mockClear();
      parseData(testData, parserConfig, testContext);
    });

    it("calls addChild for every child of every group", () => {
      // Root group contains 3 children: "tokenA", "tokenB" and "groupC"
      // "groupC" contains 2 children: "tokenX" and "tokenY"
      // 3 + 2 = 5
      expect(mockAddChild).toHaveBeenCalledTimes(5);
    });

    it("adds a nested group to its parent before parsing its children", () => {
      // Steps should be:
      //  0 parse root group
      expect(parseDataCalls[0]).toStrictEqual({ type: "group", path: [] });

      //  1 parse token "tokenA"
      expect(parseDataCalls[1]).toStrictEqual({
        type: "token",
        path: ["tokenA"],
      });

      //  2 addChild "tokenA" to root group
      expect(parseDataCalls[2]).toStrictEqual({
        type: "addChild",
        name: "tokenA",
      });

      //  3 parse token "tokenB"
      expect(parseDataCalls[3]).toStrictEqual({
        type: "token",
        path: ["tokenB"],
      });

      //  4 addChild "tokenB" to root group
      expect(parseDataCalls[4]).toStrictEqual({
        type: "addChild",
        name: "tokenB",
      });

      //  5 parse group "groupC"
      expect(parseDataCalls[5]).toStrictEqual({
        type: "group",
        path: ["groupC"],
      });

      //  6 addChild "groupC" to root group
      // NOTE that this happens *before* any of groupC's
      // children are parsed.
      expect(parseDataCalls[6]).toStrictEqual({
        type: "addChild",
        name: "groupC",
      });

      //  7 parse token "tokenX"
      expect(parseDataCalls[7]).toStrictEqual({
        type: "token",
        path: ["groupC", "tokenX"],
      });

      //  8 addChild "tokenX" to "groupC"
      expect(parseDataCalls[8]).toStrictEqual({
        type: "addChild",
        name: "tokenX",
      });

      //  9 parse token "tokenY"
      expect(parseDataCalls[9]).toStrictEqual({
        type: "token",
        path: ["groupC", "tokenY"],
      });

      // 10 addChild "tokenY" to "groupC"
      expect(parseDataCalls[10]).toStrictEqual({
        type: "addChild",
        name: "tokenY",
      });
    });
  });

  it("throws an InvalidDataError when given a non-object input", () => {
    expect(() => parseData(123, parserConfig)).toThrowError(InvalidDataError);
  });

  it("throws an InvalidDataError when encountering a non-object child", () => {
    expect(() => parseData({ brokenThing: 123 }, parserConfig)).toThrowError(
      InvalidDataError
    );
  });

  it("includes the path and data when throwing an InvalidDataError", () => {
    try {
      parseData({ brokenThing: 123 }, parserConfig);
    } catch (error) {
      expect((error as InvalidDataError).path).toStrictEqual(["brokenThing"]);
      expect((error as InvalidDataError).data).toBe(123);
    }
  });
});
