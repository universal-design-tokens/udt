import TokenSet from '../base/token-set';
import ColorToken from '../tokens/color-token';

function isColor(token: any): token is ColorToken {
  return token instanceof ColorToken;
}

function colorFromJson(jsonObj: any) {
  return new ColorToken(jsonObj);
}

class ColorSet extends TokenSet<ColorToken> {
  constructor(jsonArray: any = []) {
    super(isColor, colorFromJson, jsonArray);
  }
}

export default ColorSet;
