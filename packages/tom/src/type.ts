
export const enum Type {
  // DTCG basic types
  COLOR = 'color',
  DIMENSION = 'dimension',
  FONT_NAME = 'fontName',
  FONT_WEIGHT = 'fontWeight',
  CUBIC_BEZIER = 'cubicBezier',
  NUMBER = 'number',

  // DTCG composite types
  GRADIENT = 'gradient',
  TYPOGRAPHY = 'typography',
  BORDER = 'border',
  SHADOW = 'shadow',
}

export const allTypes: string[] = [
  // DTCG basic
  Type.COLOR,
  Type.DIMENSION,
  Type.FONT_NAME,
  Type.FONT_WEIGHT,
  Type.CUBIC_BEZIER,
  Type.NUMBER,

  // DTCG composite
  Type.GRADIENT,
  Type.TYPOGRAPHY,
  Type.BORDER,
  Type.SHADOW,
]
