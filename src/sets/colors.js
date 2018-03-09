import TokenSet from '../base/token-set';
import Color from '../tokens/color';

function isColor(token) {
  return token instanceof Color;
}

function colorFromJson(jsonObj) {
  return new Color(jsonObj);
}

class Colors extends TokenSet {
  constructor(jsonArray = []) {
    super(isColor, jsonArray, colorFromJson);
  }
}

export default Colors;
