/*************************************************************
 *
 *  Copyright (c) 2020-2025 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @file  Character and Macro mappings for the textmacros package
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import { MacroMap, CommandMap } from '../TokenMap.js';
import { TexConstant } from '../TexConstants.js';
import { TextMacrosMethods } from './TextMacrosMethods.js';
import { MATHSPACE } from '../../../util/lengths.js';

const VARIANT = TexConstant.Variant;

//
//  The special characters in text-mode
//
new MacroMap('text-special', {
  $: TextMacrosMethods.Math,
  '%': TextMacrosMethods.Comment,
  '^': TextMacrosMethods.MathModeOnly,
  _: TextMacrosMethods.MathModeOnly,
  '&': TextMacrosMethods.Misplaced,
  '#': TextMacrosMethods.Misplaced,
  '~': TextMacrosMethods.Tilde,
  ' ': TextMacrosMethods.Space,
  '\t': TextMacrosMethods.Space,
  '\r': TextMacrosMethods.Space,
  '\n': TextMacrosMethods.Space,
  '\u00A0': TextMacrosMethods.Tilde,
  '{': TextMacrosMethods.OpenBrace,
  '}': TextMacrosMethods.CloseBrace,
  '`': TextMacrosMethods.OpenQuote,
  "'": TextMacrosMethods.CloseQuote,
});

//
//  The text-mode macro mappings
//
new CommandMap('text-macros', {
  '(': TextMacrosMethods.Math,

  $: TextMacrosMethods.SelfQuote,
  _: TextMacrosMethods.SelfQuote,
  '%': TextMacrosMethods.SelfQuote,
  '{': TextMacrosMethods.SelfQuote,
  '}': TextMacrosMethods.SelfQuote,
  ' ': TextMacrosMethods.SelfQuote,
  '&': TextMacrosMethods.SelfQuote,
  '#': TextMacrosMethods.SelfQuote,
  '\\': [TextMacrosMethods.Macro, '$\\\\$'],

  "'": [TextMacrosMethods.Accent, '\u00B4'],
  '\u2019': [TextMacrosMethods.Accent, '\u00B4'],
  '`': [TextMacrosMethods.Accent, '\u0060'],
  '\u2018': [TextMacrosMethods.Accent, '\u0060'],
  '^': [TextMacrosMethods.Accent, '^'],
  '"': [TextMacrosMethods.Accent, '\u00A8'],
  '~': [TextMacrosMethods.Accent, '~'],
  '=': [TextMacrosMethods.Accent, '\u00AF'],
  '.': [TextMacrosMethods.Accent, '\u02D9'],
  u: [TextMacrosMethods.Accent, '\u02D8'],
  v: [TextMacrosMethods.Accent, '\u02C7'],

  emph: TextMacrosMethods.Emph,
  rm: [TextMacrosMethods.SetFont, VARIANT.NORMAL],
  mit: [TextMacrosMethods.SetFont, VARIANT.ITALIC],
  oldstyle: [TextMacrosMethods.SetFont, VARIANT.OLDSTYLE],
  cal: [TextMacrosMethods.SetFont, VARIANT.CALLIGRAPHIC],
  it: [TextMacrosMethods.SetFont, '-tex-mathit'], // needs special handling
  bf: [TextMacrosMethods.SetFont, VARIANT.BOLD],
  sf: [TextMacrosMethods.SetFont, VARIANT.SANSSERIF],
  tt: [TextMacrosMethods.SetFont, VARIANT.MONOSPACE],

  frak: [TextMacrosMethods.TextFont, VARIANT.FRAKTUR],
  Bbb: [TextMacrosMethods.TextFont, VARIANT.DOUBLESTRUCK],

  tiny: [TextMacrosMethods.SetSize, 0.5],
  Tiny: [TextMacrosMethods.SetSize, 0.6], // non-standard
  scriptsize: [TextMacrosMethods.SetSize, 0.7],
  small: [TextMacrosMethods.SetSize, 0.85],
  normalsize: [TextMacrosMethods.SetSize, 1.0],
  large: [TextMacrosMethods.SetSize, 1.2],
  Large: [TextMacrosMethods.SetSize, 1.44],
  LARGE: [TextMacrosMethods.SetSize, 1.73],
  huge: [TextMacrosMethods.SetSize, 2.07],
  Huge: [TextMacrosMethods.SetSize, 2.49],

  textnormal: [TextMacrosMethods.Macro, '{\\rm #1}', 1],
  textup: [TextMacrosMethods.Macro, '{\\rm #1}', 1],
  textrm: [TextMacrosMethods.Macro, '{\\rm #1}', 1],
  textit: [TextMacrosMethods.Macro, '{\\it #1}', 1],
  textbf: [TextMacrosMethods.Macro, '{\\bf #1}', 1],
  textsf: [TextMacrosMethods.Macro, '{\\sf #1}', 1],
  texttt: [TextMacrosMethods.Macro, '{\\tt #1}', 1],

  dagger: [TextMacrosMethods.Insert, '\u2020'],
  ddagger: [TextMacrosMethods.Insert, '\u2021'],
  S: [TextMacrosMethods.Insert, '\u00A7'],
  AA: [TextMacrosMethods.Insert, '\u212B'],
  ldots: [TextMacrosMethods.Insert, '\u2026'],
  vdots: [TextMacrosMethods.Insert, '\u22EE'],

  ',': [TextMacrosMethods.Spacer, MATHSPACE.thinmathspace],
  ':': [TextMacrosMethods.Spacer, MATHSPACE.mediummathspace],
  '>': [TextMacrosMethods.Spacer, MATHSPACE.mediummathspace],
  ';': [TextMacrosMethods.Spacer, MATHSPACE.thickmathspace],
  '!': [TextMacrosMethods.Spacer, MATHSPACE.negativethinmathspace],
  enspace: [TextMacrosMethods.Spacer, 0.5],
  quad: [TextMacrosMethods.Spacer, 1],
  qquad: [TextMacrosMethods.Spacer, 2],
  thinspace: [TextMacrosMethods.Spacer, MATHSPACE.thinmathspace],
  negthinspace: [TextMacrosMethods.Spacer, MATHSPACE.negativethinmathspace],

  hskip: TextMacrosMethods.Hskip,
  hspace: TextMacrosMethods.Hskip,
  kern: TextMacrosMethods.Hskip,
  mskip: TextMacrosMethods.Hskip,
  mspace: TextMacrosMethods.Hskip,
  mkern: TextMacrosMethods.Hskip,
  rule: TextMacrosMethods.rule,
  Rule: [TextMacrosMethods.Rule],
  Space: [TextMacrosMethods.Rule, 'blank'],

  color: TextMacrosMethods.CheckAutoload,
  textcolor: TextMacrosMethods.CheckAutoload,
  colorbox: TextMacrosMethods.CheckAutoload,
  fcolorbox: TextMacrosMethods.CheckAutoload,
  href: TextMacrosMethods.CheckAutoload,
  style: TextMacrosMethods.CheckAutoload,
  class: TextMacrosMethods.CheckAutoload,
  data: TextMacrosMethods.CheckAutoload,
  cssId: TextMacrosMethods.CheckAutoload,
  unicode: TextMacrosMethods.CheckAutoload,
  U: TextMacrosMethods.CheckAutoload,
  char: TextMacrosMethods.CheckAutoload,

  ref: [TextMacrosMethods.HandleRef, false],
  eqref: [TextMacrosMethods.HandleRef, true],

  underline: [TextMacrosMethods.UnderOver, '2015'],

  llap: TextMacrosMethods.Lap,
  rlap: TextMacrosMethods.Lap,

  phantom: TextMacrosMethods.Phantom,
  vphantom: [TextMacrosMethods.Phantom, 1, 0],
  hphantom: [TextMacrosMethods.Phantom, 0, 1],
  smash: TextMacrosMethods.Smash,

  mmlToken: TextMacrosMethods.MmlToken,
});
