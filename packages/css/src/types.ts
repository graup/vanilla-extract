import type { MapLeafNodes, CSSVarFunction } from '@vanilla-extract/private';
import type { PropertiesFallback, AtRule, Properties } from 'csstype';

import type { SimplePseudos } from './simplePseudos';

type CSSTypeProperties = PropertiesFallback<number | (string & {})>;

export type CSSProperties = {
  [Property in keyof CSSTypeProperties]:
    | CSSTypeProperties[Property]
    | CSSVarFunction
    | Array<CSSVarFunction | Properties[Property]>;
};

export interface CSSKeyframes {
  [time: string]: CSSProperties;
}

export type CSSPropertiesWithVars = CSSProperties & {
  vars?: {
    [key: string]: string;
  };
};

type PseudoProperties = {
  [key in SimplePseudos]?: CSSPropertiesWithVars;
};

type CSSPropertiesAndPseudos = CSSPropertiesWithVars & PseudoProperties;

interface SelectorMap {
  [selector: string]: CSSPropertiesWithVars &
    MediaQueries<
      CSSPropertiesWithVars & FeatureQueries<CSSPropertiesWithVars>
    > &
    FeatureQueries<CSSPropertiesWithVars & MediaQueries<CSSPropertiesWithVars>>;
}

export interface MediaQueries<StyleType> {
  '@media'?: {
    [query: string]: StyleType;
  };
}

export interface FeatureQueries<StyleType> {
  '@supports'?: {
    [query: string]: StyleType;
  };
}

export interface StyleWithSelectors extends CSSPropertiesAndPseudos {
  selectors?: SelectorMap;
}

export type StyleRule = StyleWithSelectors &
  MediaQueries<StyleWithSelectors & FeatureQueries<StyleWithSelectors>> &
  FeatureQueries<StyleWithSelectors & MediaQueries<StyleWithSelectors>>;

export type GlobalStyleRule = CSSPropertiesWithVars &
  MediaQueries<CSSPropertiesWithVars & FeatureQueries<CSSPropertiesWithVars>> &
  FeatureQueries<CSSPropertiesWithVars & MediaQueries<CSSPropertiesWithVars>>;

export type GlobalFontFaceRule = Omit<AtRule.FontFaceFallback, 'src'> &
  Required<Pick<AtRule.FontFaceFallback, 'src'>>;
export type FontFaceRule = Omit<GlobalFontFaceRule, 'fontFamily'>;
export type GlobalImportRule = {
  url: string;
  mediaQuery?: string;
  supportsQuery?: string;
};

export type CSSStyleBlock = {
  type: 'local';
  selector: string;
  rule: StyleRule;
};

export type CSSFontFaceBlock = {
  type: 'fontFace';
  rule: GlobalFontFaceRule;
};

export type CSSKeyframesBlock = {
  type: 'keyframes';
  name: string;
  rule: CSSKeyframes;
};

export type CSSSelectorBlock = {
  type: 'selector' | 'global';
  selector: string;
  rule: GlobalStyleRule;
};

export type CSSImportBlock = {
  type: 'import';
  rule: GlobalImportRule;
};

export type CSS =
  | CSSStyleBlock
  | CSSFontFaceBlock
  | CSSKeyframesBlock
  | CSSSelectorBlock
  | CSSImportBlock;

export type FileScope = {
  packageName?: string;
  filePath: string;
};

export interface Composition {
  identifier: string;
  classList: string;
}

type IdentOption = 'short' | 'debug';
export interface Adapter {
  appendCss: (css: CSS, fileScope: FileScope) => void;
  registerClassName: (className: string) => void;
  registerComposition: (composition: Composition) => void;
  markCompositionUsed: (identifier: string) => void;
  onEndFileScope: (fileScope: FileScope) => void;
  getIdentOption: () => IdentOption;
}

export type NullableTokens = {
  [key: string]: string | NullableTokens | null;
};

export type Tokens = {
  [key: string]: string | Tokens;
};

export type ThemeVars<ThemeContract extends NullableTokens> = MapLeafNodes<
  ThemeContract,
  CSSVarFunction
>;

export type ClassNames = string | Array<ClassNames>;

export type ComplexStyleRule = StyleRule | Array<StyleRule | ClassNames>;
