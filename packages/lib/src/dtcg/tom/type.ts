
export const enum Type {
  // JSON types
  BOOLEAN = 'boolean',
  STRING = 'string',
  NUMBER = 'number',
  NULL = 'null',
  OBJECT = 'object',
  ARRAY = 'array',

  // DTCG basic types
  COLOR = 'color',
  DIMENSION = 'dimension',
  FONT_NAME = 'fontName',
  FONT_WEIGHT = 'fontWeight',
  CUBIC_BEZIER = 'cubicBezier',

  // DTCG composite types
  GRADIENT = 'gradient',
  TYPOGRAPHY = 'typography',
  BORDER = 'border',
}

export const allTypes: string[] = [
  // JSON
  Type.BOOLEAN,
  Type.STRING,
  Type.NUMBER,
  Type.NULL,
  Type.OBJECT,
  Type.ARRAY,

  // DTCG basic
  Type.COLOR,
  Type.DIMENSION,
  Type.FONT_NAME,
  Type.FONT_WEIGHT,
  Type.CUBIC_BEZIER,

  // DTCG composite
  Type.GRADIENT,
  Type.TYPOGRAPHY,
  Type.BORDER,
]
