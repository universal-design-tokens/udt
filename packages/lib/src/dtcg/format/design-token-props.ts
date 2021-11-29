import { Extensions } from './extensions';
import { Type } from './type';
import { CommonProps } from './common-props'
import { ColorValue, DimensionValue, FontValue } from './value-types';

interface BooleanTokenProps {
  value: boolean;
  type?: Type.BOOLEAN;
}

interface StringTokenProps {
  value: string;
  type?: Type.STRING;
}

interface NumberTokenProps {
  value: number;
  type?: Type.NUMBER;
}

interface NullTokenProps {
  value: null;
  type?: Type.NULL;
}

interface ObjectTokenProps {
  value: object;
  type?: Type.OBJECT;
}

interface ArrayTokenProps {
  value: any[];
  type?: Type.ARRAY;
}

interface ColorTokenProps {
  value: ColorValue;
  type?: Type.COLOR;
}

interface DimensionTokenProps {
  value: DimensionValue;
  type?: Type.DIMENSION;
}

interface FontTokenProps {
  value: FontValue;
  type?: Type.FONT;
}

interface AdditionalTokenProps extends CommonProps {
  extensions?: Extensions;
}

export type DesignTokenProps = AdditionalTokenProps &(
  | BooleanTokenProps
  | StringTokenProps
  | NumberTokenProps
  | NullTokenProps
  | ObjectTokenProps
  | ArrayTokenProps
  | ColorTokenProps
  | DimensionTokenProps
  | FontTokenProps
);
