/*************************************************************
 *
 *  Copyright (c) 2017-2025 The MathJax Consortium
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
 * @file Base mappings for TeX Parsing.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import * as sm from '../TokenMap.js';
import { TexConstant } from '../TexConstants.js';
import BaseMethods from './BaseMethods.js';
import ParseMethods from '../ParseMethods.js';
import { ParseUtil } from '../ParseUtil.js';
import { TEXCLASS } from '../../../core/MmlTree/MmlNode.js';
import { MATHSPACE, em } from '../../../util/lengths.js';

const THICKMATHSPACE = em(MATHSPACE.thickmathspace);

const VARIANT = TexConstant.Variant;

/**
 * Letter pattern for parsing identifiers and operators.
 */
new sm.RegExpMap('letter', ParseMethods.variable, /[a-z]/i);

/**
 * Digit pattern for parsing numbers.
 */
new sm.RegExpMap('digit', ParseMethods.digit, /[0-9.,]/);

/**
 * Pattern for spotting start of commands.
 */
new sm.RegExpMap('command', ParseMethods.controlSequence, /^\\/);

/**
 * Treatment of special characters in LaTeX.
 */
new sm.MacroMap('special', {
  // This is now handled with a RegExp!
  // '\\':  'ControlSequence',

  '{': BaseMethods.Open,
  '}': BaseMethods.Close,
  '~': BaseMethods.Tilde,
  '^': BaseMethods.Superscript,
  _: BaseMethods.Subscript,
  '|': BaseMethods.Bar,
  ' ': BaseMethods.Space,
  '\t': BaseMethods.Space,
  '\r': BaseMethods.Space,
  '\n': BaseMethods.Space,
  "'": BaseMethods.Prime,
  '%': BaseMethods.Comment,
  '&': BaseMethods.Entry,
  '#': BaseMethods.Hash,
  '\u00A0': BaseMethods.Space,
  '\u2019': BaseMethods.Prime,
});

/**
 * Macros for identifiers.
 */
new sm.CharacterMap('lcGreek', ParseMethods.lcGreek, {
  // Lower-case greek
  alpha: '\u03B1',
  beta: '\u03B2',
  gamma: '\u03B3',
  delta: '\u03B4',
  epsilon: '\u03F5',
  zeta: '\u03B6',
  eta: '\u03B7',
  theta: '\u03B8',
  iota: '\u03B9',
  kappa: '\u03BA',
  lambda: '\u03BB',
  mu: '\u03BC',
  nu: '\u03BD',
  xi: '\u03BE',
  omicron: '\u03BF', // added for completeness
  pi: '\u03C0',
  rho: '\u03C1',
  sigma: '\u03C3',
  tau: '\u03C4',
  upsilon: '\u03C5',
  phi: '\u03D5',
  chi: '\u03C7',
  psi: '\u03C8',
  omega: '\u03C9',
  varepsilon: '\u03B5',
  vartheta: '\u03D1',
  varpi: '\u03D6',
  varrho: '\u03F1',
  varsigma: '\u03C2',
  varphi: '\u03C6',
});

/**
 * Macros for upper-case Greek
 */
new sm.CharacterMap('ucGreek', ParseMethods.ucGreek, {
  Gamma: '\u0393',
  Delta: '\u0394',
  Theta: '\u0398',
  Lambda: '\u039B',
  Xi: '\u039E',
  Pi: '\u03A0',
  Sigma: '\u03A3',
  Upsilon: '\u03A5',
  Phi: '\u03A6',
  Psi: '\u03A8',
  Omega: '\u03A9',
});

/**
 * Macros for identifiers.
 */
new sm.CharacterMap('mathchar0mi', ParseMethods.mathchar0mi, {
  // Ord symbols
  AA: '\u212B',
  S: ['\u00A7', { mathvariant: VARIANT.NORMAL }],
  aleph: ['\u2135', { mathvariant: VARIANT.NORMAL }],
  hbar: ['\u210F', { variantForm: true }],
  imath: '\u0131',
  jmath: '\u0237',
  ell: '\u2113',
  wp: ['\u2118', { mathvariant: VARIANT.NORMAL }],
  Re: ['\u211C', { mathvariant: VARIANT.NORMAL }],
  Im: ['\u2111', { mathvariant: VARIANT.NORMAL }],
  partial: ['\u2202', { mathvariant: VARIANT.ITALIC }],
  infty: ['\u221E', { mathvariant: VARIANT.NORMAL }],
  prime: ['\u2032', { variantForm: true }],
  emptyset: ['\u2205', { mathvariant: VARIANT.NORMAL }],
  nabla: ['\u2207', { mathvariant: VARIANT.NORMAL }],
  top: ['\u22A4', { mathvariant: VARIANT.NORMAL }],
  bot: ['\u22A5', { mathvariant: VARIANT.NORMAL }],
  angle: ['\u2220', { mathvariant: VARIANT.NORMAL }],
  triangle: ['\u25B3', { mathvariant: VARIANT.NORMAL }],
  backslash: ['\\', { mathvariant: VARIANT.NORMAL }],
  forall: ['\u2200', { mathvariant: VARIANT.NORMAL }],
  exists: ['\u2203', { mathvariant: VARIANT.NORMAL }],
  neg: ['\u00AC', { mathvariant: VARIANT.NORMAL }],
  lnot: ['\u00AC', { mathvariant: VARIANT.NORMAL }],
  flat: ['\u266D', { mathvariant: VARIANT.NORMAL }],
  natural: ['\u266E', { mathvariant: VARIANT.NORMAL }],
  sharp: ['\u266F', { mathvariant: VARIANT.NORMAL }],
  clubsuit: ['\u2663', { mathvariant: VARIANT.NORMAL }],
  diamondsuit: ['\u2662', { mathvariant: VARIANT.NORMAL }],
  heartsuit: ['\u2661', { mathvariant: VARIANT.NORMAL }],
  spadesuit: ['\u2660', { mathvariant: VARIANT.NORMAL }],
});

/**
 * Macros for operators.
 */
new sm.CharacterMap('mathchar0mo', ParseMethods.mathchar0mo, {
  surd: '\u221A',

  // big ops
  coprod: ['\u2210', { movesupsub: true }],
  bigvee: ['\u22C1', { movesupsub: true }],
  bigwedge: ['\u22C0', { movesupsub: true }],
  biguplus: ['\u2A04', { movesupsub: true }],
  bigcap: ['\u22C2', { movesupsub: true }],
  bigcup: ['\u22C3', { movesupsub: true }],
  int: '\u222B',
  intop: ['\u222B', { movesupsub: true, movablelimits: true }],
  iint: '\u222C',
  iiint: '\u222D',
  prod: ['\u220F', { movesupsub: true }],
  sum: ['\u2211', { movesupsub: true }],
  bigotimes: ['\u2A02', { movesupsub: true }],
  bigoplus: ['\u2A01', { movesupsub: true }],
  bigodot: ['\u2A00', { movesupsub: true }],
  oint: '\u222E',
  ointop: ['\u222E', { movesupsub: true, movablelimits: true }],
  oiint: '\u222F',
  oiiint: '\u2230',
  bigsqcup: ['\u2A06', { movesupsub: true }],
  smallint: ['\u222B', { largeop: false }],

  // binary operations
  triangleleft: '\u25C3',
  triangleright: '\u25B9',
  bigtriangleup: '\u25B3',
  bigtriangledown: '\u25BD',
  wedge: '\u2227',
  land: '\u2227',
  vee: '\u2228',
  lor: '\u2228',
  cap: '\u2229',
  cup: '\u222A',
  ddagger: '\u2021',
  dagger: '\u2020',
  sqcap: '\u2293',
  sqcup: '\u2294',
  uplus: '\u228E',
  amalg: '\u2A3F',
  diamond: '\u22C4',
  bullet: '\u2219',
  wr: '\u2240',
  div: '\u00F7',
  odot: ['\u2299', { largeop: false }],
  oslash: ['\u2298', { largeop: false }],
  otimes: ['\u2297', { largeop: false }],
  ominus: ['\u2296', { largeop: false }],
  oplus: ['\u2295', { largeop: false }],
  mp: '\u2213',
  pm: '\u00B1',
  circ: '\u2218',
  bigcirc: '\u25EF',
  setminus: '\u2216',
  cdot: '\u22C5',
  ast: '\u2217',
  times: '\u00D7',
  star: '\u22C6',

  // Relations
  propto: '\u221D',
  sqsubseteq: '\u2291',
  sqsupseteq: '\u2292',
  parallel: '\u2225',
  mid: '\u2223',
  dashv: '\u22A3',
  vdash: '\u22A2',
  leq: '\u2264',
  le: '\u2264',
  geq: '\u2265',
  ge: '\u2265',
  lt: '\u003C',
  gt: '\u003E',
  succ: '\u227B',
  prec: '\u227A',
  approx: '\u2248',
  succeq: '\u2AB0', // or '227C',
  preceq: '\u2AAF', // or '227D',
  supset: '\u2283',
  subset: '\u2282',
  supseteq: '\u2287',
  subseteq: '\u2286',
  in: '\u2208',
  ni: '\u220B',
  notin: '\u2209',
  owns: '\u220B',
  gg: '\u226B',
  ll: '\u226A',
  sim: '\u223C',
  simeq: '\u2243',
  perp: '\u27C2',
  equiv: '\u2261',
  asymp: '\u224D',
  smile: '\u2323',
  frown: '\u2322',
  ne: '\u2260',
  neq: '\u2260',
  cong: '\u2245',
  doteq: '\u2250',
  bowtie: '\u22C8',
  models: '\u22A7',

  notChar: '\u29F8',

  // Arrows
  Leftrightarrow: '\u21D4',
  Leftarrow: '\u21D0',
  Rightarrow: '\u21D2',
  leftrightarrow: '\u2194',
  leftarrow: '\u2190',
  gets: '\u2190',
  rightarrow: '\u2192',
  to: ['\u2192', { accent: false }],
  mapsto: '\u21A6',
  leftharpoonup: '\u21BC',
  leftharpoondown: '\u21BD',
  rightharpoonup: '\u21C0',
  rightharpoondown: '\u21C1',
  nearrow: '\u2197',
  searrow: '\u2198',
  nwarrow: '\u2196',
  swarrow: '\u2199',
  rightleftharpoons: '\u21CC',
  hookrightarrow: '\u21AA',
  hookleftarrow: '\u21A9',
  longleftarrow: '\u27F5',
  Longleftarrow: '\u27F8',
  longrightarrow: '\u27F6',
  Longrightarrow: '\u27F9',
  Longleftrightarrow: '\u27FA',
  longleftrightarrow: '\u27F7',
  longmapsto: '\u27FC',

  // Misc.
  ldots: '\u2026',
  cdots: '\u22EF',
  vdots: '\u22EE',
  ddots: '\u22F1',
  iddots: '\u22F0',
  dotsc: '\u2026', // dots with commas
  dotsb: '\u22EF', // dots with binary ops and relations
  dotsm: '\u22EF', // dots with multiplication
  dotsi: '\u22EF', // dots with integrals
  dotso: '\u2026', // other dots

  ldotp: ['\u002E', { texClass: TEXCLASS.PUNCT }],
  cdotp: ['\u22C5', { texClass: TEXCLASS.PUNCT }],
  colon: ['\u003A', { texClass: TEXCLASS.PUNCT }],
});

/**
 * Macros for special characters and identifiers.
 */
new sm.CharacterMap('mathchar7', ParseMethods.mathchar7, {
  _: '\u005F',
  '#': '\u0023',
  $: '\u0024',
  '%': '\u0025',
  '&': '\u0026',
  And: '\u0026',
});

/**
 * Macros for delimiters.
 */
new sm.DelimiterMap('delimiter', ParseMethods.delimiter, {
  '(': '(',
  ')': ')',
  '[': '[',
  ']': ']',
  '<': '\u27E8',
  '>': '\u27E9',
  '\\lt': '\u27E8',
  '\\gt': '\u27E9',
  '/': '/',
  '|': ['|', { texClass: TEXCLASS.ORD }],
  '.': '',
  '\\lmoustache': '\u23B0', // non-standard
  '\\rmoustache': '\u23B1', // non-standard
  '\\lgroup': '\u27EE', // non-standard
  '\\rgroup': '\u27EF', // non-standard
  '\\arrowvert': '\u23D0',
  '\\Arrowvert': '\u2016',
  '\\bracevert': '\u23AA', // non-standard
  '\\Vert': ['\u2016', { texClass: TEXCLASS.ORD }],
  '\\|': ['\u2016', { texClass: TEXCLASS.ORD }],
  '\\vert': ['|', { texClass: TEXCLASS.ORD }],
  '\\uparrow': '\u2191',
  '\\downarrow': '\u2193',
  '\\updownarrow': '\u2195',
  '\\Uparrow': '\u21D1',
  '\\Downarrow': '\u21D3',
  '\\Updownarrow': '\u21D5',
  '\\backslash': '\\',
  '\\rangle': '\u27E9',
  '\\langle': '\u27E8',
  '\\rbrace': '}',
  '\\lbrace': '{',
  '\\}': '}',
  '\\{': '{',
  '\\rceil': '\u2309',
  '\\lceil': '\u2308',
  '\\rfloor': '\u230B',
  '\\lfloor': '\u230A',
  '\\lbrack': '[',
  '\\rbrack': ']',
});

/**
 * Macros for LaTeX commands.
 */
new sm.CommandMap('macros', {
  displaystyle: [BaseMethods.SetStyle, 'D', true, 0],
  textstyle: [BaseMethods.SetStyle, 'T', false, 0],
  scriptstyle: [BaseMethods.SetStyle, 'S', false, 1],
  scriptscriptstyle: [BaseMethods.SetStyle, 'SS', false, 2],

  rm: [BaseMethods.SetFont, VARIANT.NORMAL],
  mit: [BaseMethods.SetFont, VARIANT.ITALIC],
  oldstyle: [BaseMethods.SetFont, VARIANT.OLDSTYLE],
  cal: [BaseMethods.SetFont, VARIANT.CALLIGRAPHIC],
  it: [BaseMethods.SetFont, VARIANT.MATHITALIC], // needs special handling
  bf: [BaseMethods.SetFont, VARIANT.BOLD],
  sf: [BaseMethods.SetFont, VARIANT.SANSSERIF],
  tt: [BaseMethods.SetFont, VARIANT.MONOSPACE],

  frak: [BaseMethods.MathFont, VARIANT.FRAKTUR],
  Bbb: [BaseMethods.MathFont, VARIANT.DOUBLESTRUCK],

  mathrm: [BaseMethods.MathFont, VARIANT.NORMAL],
  mathup: [BaseMethods.MathFont, VARIANT.NORMAL],
  mathnormal: [BaseMethods.MathFont, ''],
  mathbf: [BaseMethods.MathFont, VARIANT.BOLD],
  mathbfup: [BaseMethods.MathFont, VARIANT.BOLD],
  mathit: [BaseMethods.MathFont, VARIANT.MATHITALIC],
  mathbfit: [BaseMethods.MathFont, VARIANT.BOLDITALIC],
  mathbb: [BaseMethods.MathFont, VARIANT.DOUBLESTRUCK],
  mathfrak: [BaseMethods.MathFont, VARIANT.FRAKTUR],
  mathbffrak: [BaseMethods.MathFont, VARIANT.BOLDFRAKTUR],
  mathscr: [BaseMethods.MathFont, VARIANT.SCRIPT],
  mathbfscr: [BaseMethods.MathFont, VARIANT.BOLDSCRIPT],
  mathsf: [BaseMethods.MathFont, VARIANT.SANSSERIF],
  mathsfup: [BaseMethods.MathFont, VARIANT.SANSSERIF],
  mathbfsf: [BaseMethods.MathFont, VARIANT.BOLDSANSSERIF],
  mathbfsfup: [BaseMethods.MathFont, VARIANT.BOLDSANSSERIF],
  mathsfit: [BaseMethods.MathFont, VARIANT.SANSSERIFITALIC],
  mathbfsfit: [BaseMethods.MathFont, VARIANT.SANSSERIFBOLDITALIC],
  mathtt: [BaseMethods.MathFont, VARIANT.MONOSPACE],
  mathcal: [BaseMethods.MathFont, VARIANT.CALLIGRAPHIC],
  mathbfcal: [BaseMethods.MathFont, VARIANT.BOLDCALLIGRAPHIC],

  symrm: [BaseMethods.MathFont, VARIANT.NORMAL],
  symup: [BaseMethods.MathFont, VARIANT.NORMAL],
  symnormal: [BaseMethods.MathFont, ''],
  symbf: [BaseMethods.MathFont, VARIANT.BOLD, VARIANT.BOLDITALIC],
  symbfup: [BaseMethods.MathFont, VARIANT.BOLD],
  symit: [BaseMethods.MathFont, VARIANT.ITALIC],
  symbfit: [BaseMethods.MathFont, VARIANT.BOLDITALIC],
  symbb: [BaseMethods.MathFont, VARIANT.DOUBLESTRUCK],
  symfrak: [BaseMethods.MathFont, VARIANT.FRAKTUR],
  symbffrak: [BaseMethods.MathFont, VARIANT.BOLDFRAKTUR],
  symscr: [BaseMethods.MathFont, VARIANT.SCRIPT],
  symbfscr: [BaseMethods.MathFont, VARIANT.BOLDSCRIPT],
  symsf: [BaseMethods.MathFont, VARIANT.SANSSERIF, VARIANT.SANSSERIFITALIC],
  symsfup: [BaseMethods.MathFont, VARIANT.SANSSERIF],
  symbfsf: [BaseMethods.MathFont, VARIANT.BOLDSANSSERIF],
  symbfsfup: [BaseMethods.MathFont, VARIANT.BOLDSANSSERIF],
  symsfit: [BaseMethods.MathFont, VARIANT.SANSSERIFITALIC],
  symbfsfit: [BaseMethods.MathFont, VARIANT.SANSSERIFBOLDITALIC],
  symtt: [BaseMethods.MathFont, VARIANT.MONOSPACE],
  symcal: [BaseMethods.MathFont, VARIANT.CALLIGRAPHIC],
  symbfcal: [BaseMethods.MathFont, VARIANT.BOLDCALLIGRAPHIC],

  textrm: [BaseMethods.HBox, null, VARIANT.NORMAL],
  textup: [BaseMethods.HBox, null, VARIANT.NORMAL],
  textnormal: [BaseMethods.HBox],
  textit: [BaseMethods.HBox, null, VARIANT.ITALIC],
  textbf: [BaseMethods.HBox, null, VARIANT.BOLD],
  textsf: [BaseMethods.HBox, null, VARIANT.SANSSERIF],
  texttt: [BaseMethods.HBox, null, VARIANT.MONOSPACE],

  tiny: [BaseMethods.SetSize, 0.5],
  Tiny: [BaseMethods.SetSize, 0.6], // non-standard
  scriptsize: [BaseMethods.SetSize, 0.7],
  small: [BaseMethods.SetSize, 0.85],
  normalsize: [BaseMethods.SetSize, 1.0],
  large: [BaseMethods.SetSize, 1.2],
  Large: [BaseMethods.SetSize, 1.44],
  LARGE: [BaseMethods.SetSize, 1.73],
  huge: [BaseMethods.SetSize, 2.07],
  Huge: [BaseMethods.SetSize, 2.49],

  arcsin: BaseMethods.NamedFn,
  arccos: BaseMethods.NamedFn,
  arctan: BaseMethods.NamedFn,
  arg: BaseMethods.NamedFn,
  cos: BaseMethods.NamedFn,
  cosh: BaseMethods.NamedFn,
  cot: BaseMethods.NamedFn,
  coth: BaseMethods.NamedFn,
  csc: BaseMethods.NamedFn,
  deg: BaseMethods.NamedFn,
  det: BaseMethods.NamedOp,
  dim: BaseMethods.NamedFn,
  exp: BaseMethods.NamedFn,
  gcd: BaseMethods.NamedOp,
  hom: BaseMethods.NamedFn,
  inf: BaseMethods.NamedOp,
  ker: BaseMethods.NamedFn,
  lg: BaseMethods.NamedFn,
  lim: BaseMethods.NamedOp,
  liminf: [BaseMethods.NamedOp, 'lim&thinsp;inf'],
  limsup: [BaseMethods.NamedOp, 'lim&thinsp;sup'],
  ln: BaseMethods.NamedFn,
  log: BaseMethods.NamedFn,
  max: BaseMethods.NamedOp,
  min: BaseMethods.NamedOp,
  Pr: BaseMethods.NamedOp,
  sec: BaseMethods.NamedFn,
  sin: BaseMethods.NamedFn,
  sinh: BaseMethods.NamedFn,
  sup: BaseMethods.NamedOp,
  tan: BaseMethods.NamedFn,
  tanh: BaseMethods.NamedFn,

  limits: [BaseMethods.Limits, true],
  nolimits: [BaseMethods.Limits, false],

  overline: [BaseMethods.UnderOver, '2015'],
  underline: [BaseMethods.UnderOver, '2015'],
  overbrace: [BaseMethods.UnderOver, '23DE', true],
  underbrace: [BaseMethods.UnderOver, '23DF', true],
  overparen: [BaseMethods.UnderOver, '23DC'],
  underparen: [BaseMethods.UnderOver, '23DD'],
  overrightarrow: [BaseMethods.UnderOver, '2192'],
  underrightarrow: [BaseMethods.UnderOver, '2192'],
  overleftarrow: [BaseMethods.UnderOver, '2190'],
  underleftarrow: [BaseMethods.UnderOver, '2190'],
  overleftrightarrow: [BaseMethods.UnderOver, '2194'],
  underleftrightarrow: [BaseMethods.UnderOver, '2194'],

  overset: BaseMethods.Overset,
  underset: BaseMethods.Underset,
  overunderset: BaseMethods.Overunderset,
  stackrel: [BaseMethods.Macro, '\\mathrel{\\mathop{#2}\\limits^{#1}}', 2],
  stackbin: [BaseMethods.Macro, '\\mathbin{\\mathop{#2}\\limits^{#1}}', 2],

  over: BaseMethods.Over,
  overwithdelims: BaseMethods.Over,
  atop: BaseMethods.Over,
  atopwithdelims: BaseMethods.Over,
  above: BaseMethods.Over,
  abovewithdelims: BaseMethods.Over,
  brace: [BaseMethods.Over, '{', '}'],
  brack: [BaseMethods.Over, '[', ']'],
  choose: [BaseMethods.Over, '(', ')'],

  frac: BaseMethods.Frac,
  sqrt: BaseMethods.Sqrt,
  root: BaseMethods.Root,
  uproot: [BaseMethods.MoveRoot, 'upRoot'],
  leftroot: [BaseMethods.MoveRoot, 'leftRoot'],

  left: BaseMethods.LeftRight,
  right: BaseMethods.LeftRight,
  middle: BaseMethods.LeftRight,

  llap: BaseMethods.Lap,
  rlap: BaseMethods.Lap,
  raise: BaseMethods.RaiseLower,
  lower: BaseMethods.RaiseLower,
  moveleft: BaseMethods.MoveLeftRight,
  moveright: BaseMethods.MoveLeftRight,

  ',': [BaseMethods.Spacer, MATHSPACE.thinmathspace],
  ':': [BaseMethods.Spacer, MATHSPACE.mediummathspace],
  '>': [BaseMethods.Spacer, MATHSPACE.mediummathspace],
  ';': [BaseMethods.Spacer, MATHSPACE.thickmathspace],
  '!': [BaseMethods.Spacer, MATHSPACE.negativethinmathspace],
  enspace: [BaseMethods.Spacer, 0.5],
  quad: [BaseMethods.Spacer, 1],
  qquad: [BaseMethods.Spacer, 2],
  thinspace: [BaseMethods.Spacer, MATHSPACE.thinmathspace],
  negthinspace: [BaseMethods.Spacer, MATHSPACE.negativethinmathspace],

  '*': BaseMethods.DiscretionaryTimes,

  allowbreak: BaseMethods.AllowBreak,
  goodbreak: [BaseMethods.Linebreak, TexConstant.LineBreak.GOODBREAK],
  badbreak: [BaseMethods.Linebreak, TexConstant.LineBreak.BADBREAK],
  nobreak: [BaseMethods.Linebreak, TexConstant.LineBreak.NOBREAK],
  break: BaseMethods.Break,

  hskip: BaseMethods.Hskip,
  hspace: BaseMethods.Hskip,
  kern: [BaseMethods.Hskip, true],
  mskip: BaseMethods.Hskip,
  mspace: BaseMethods.Hskip,
  mkern: [BaseMethods.Hskip, true],
  rule: BaseMethods.rule,
  Rule: [BaseMethods.Rule],
  Space: [BaseMethods.Rule, 'blank'],
  nonscript: BaseMethods.Nonscript,

  big: [BaseMethods.MakeBig, TEXCLASS.ORD, 0.85],
  Big: [BaseMethods.MakeBig, TEXCLASS.ORD, 1.15],
  bigg: [BaseMethods.MakeBig, TEXCLASS.ORD, 1.45],
  Bigg: [BaseMethods.MakeBig, TEXCLASS.ORD, 1.75],
  bigl: [BaseMethods.MakeBig, TEXCLASS.OPEN, 0.85],
  Bigl: [BaseMethods.MakeBig, TEXCLASS.OPEN, 1.15],
  biggl: [BaseMethods.MakeBig, TEXCLASS.OPEN, 1.45],
  Biggl: [BaseMethods.MakeBig, TEXCLASS.OPEN, 1.75],
  bigr: [BaseMethods.MakeBig, TEXCLASS.CLOSE, 0.85],
  Bigr: [BaseMethods.MakeBig, TEXCLASS.CLOSE, 1.15],
  biggr: [BaseMethods.MakeBig, TEXCLASS.CLOSE, 1.45],
  Biggr: [BaseMethods.MakeBig, TEXCLASS.CLOSE, 1.75],
  bigm: [BaseMethods.MakeBig, TEXCLASS.REL, 0.85],
  Bigm: [BaseMethods.MakeBig, TEXCLASS.REL, 1.15],
  biggm: [BaseMethods.MakeBig, TEXCLASS.REL, 1.45],
  Biggm: [BaseMethods.MakeBig, TEXCLASS.REL, 1.75],

  mathord: [BaseMethods.TeXAtom, TEXCLASS.ORD],
  mathop: [BaseMethods.TeXAtom, TEXCLASS.OP],
  mathopen: [BaseMethods.TeXAtom, TEXCLASS.OPEN],
  mathclose: [BaseMethods.TeXAtom, TEXCLASS.CLOSE],
  mathbin: [BaseMethods.TeXAtom, TEXCLASS.BIN],
  mathrel: [BaseMethods.TeXAtom, TEXCLASS.REL],
  mathpunct: [BaseMethods.TeXAtom, TEXCLASS.PUNCT],
  mathinner: [BaseMethods.TeXAtom, TEXCLASS.INNER],

  vtop: [BaseMethods.VBox, 'top'],
  vcenter: [BaseMethods.VBox, 'center'],
  vbox: [BaseMethods.VBox, 'bottom'],
  hsize: BaseMethods.Hsize,
  parbox: BaseMethods.ParBox,

  breakAlign: BaseMethods.BreakAlign,

  buildrel: BaseMethods.BuildRel,

  hbox: [BaseMethods.HBox, 0],
  text: BaseMethods.HBox,
  mbox: [BaseMethods.HBox, 0],
  fbox: BaseMethods.FBox,
  boxed: [BaseMethods.Macro, '\\fbox{$\\displaystyle{#1}$}', 1],
  framebox: BaseMethods.FrameBox,
  makebox: BaseMethods.MakeBox,

  strut: BaseMethods.Strut,
  mathstrut: [BaseMethods.Macro, '\\vphantom{(}'],
  phantom: BaseMethods.Phantom,
  vphantom: [BaseMethods.Phantom, 1, 0],
  hphantom: [BaseMethods.Phantom, 0, 1],
  smash: BaseMethods.Smash,

  acute: [BaseMethods.Accent, '00B4'], // or 0301 or 02CA
  grave: [BaseMethods.Accent, '0060'], // or 0300 or 02CB
  ddot: [BaseMethods.Accent, '00A8'], // or 0308
  dddot: [BaseMethods.Accent, '20DB'],
  ddddot: [BaseMethods.Accent, '20DC'],
  tilde: [BaseMethods.Accent, '007E'], // or 0303 or 02DC
  bar: [BaseMethods.Accent, '00AF'], // or 0304 or 02C9
  breve: [BaseMethods.Accent, '02D8'], // or 0306
  check: [BaseMethods.Accent, '02C7'], // or 030C
  hat: [BaseMethods.Accent, '005E'], // or 0302 or 02C6
  vec: [BaseMethods.Accent, '2192', false], // or 20D7
  dot: [BaseMethods.Accent, '02D9'], // or 0307
  widetilde: [BaseMethods.Accent, '007E', true], // or 0303 or 02DC
  widehat: [BaseMethods.Accent, '005E', true], // or 0302 or 02C6

  matrix: BaseMethods.Matrix,
  array: BaseMethods.Matrix,
  pmatrix: [BaseMethods.Matrix, '(', ')'],
  cases: [BaseMethods.Matrix, '{', '', 'left left', null, '.2em', null, true],
  eqalign: [
    BaseMethods.Matrix,
    null,
    null,
    'right left',
    THICKMATHSPACE,
    '.5em',
    'D',
  ],
  displaylines: [BaseMethods.Matrix, null, null, 'center', null, '.5em', 'D'],
  cr: BaseMethods.Cr,
  '\\': BaseMethods.CrLaTeX,
  newline: [BaseMethods.CrLaTeX, true],
  hline: BaseMethods.HLine,
  hdashline: [BaseMethods.HLine, 'dashed'],
  //      noalign:            BaseMethods.HandleNoAlign,
  eqalignno: [
    BaseMethods.Matrix,
    null,
    null,
    'right left',
    THICKMATHSPACE,
    '.5em',
    'D',
    null,
    'right',
  ],
  leqalignno: [
    BaseMethods.Matrix,
    null,
    null,
    'right left',
    THICKMATHSPACE,
    '.5em',
    'D',
    null,
    'left',
  ],
  hfill: BaseMethods.HFill,
  hfil: BaseMethods.HFill, // \hfil treated as \hfill for now
  hfilll: BaseMethods.HFill, // \hfilll treated as \hfill for now

  //  TeX substitution macros
  bmod: [
    BaseMethods.Macro,
    `\\mmlToken{mo}[lspace="${THICKMATHSPACE}" rspace="${THICKMATHSPACE}"]{mod}`,
  ],
  pmod: [BaseMethods.Macro, '\\pod{\\mmlToken{mi}{mod}\\kern 6mu #1}', 1],
  mod: [
    BaseMethods.Macro,
    '\\mathchoice{\\kern18mu}{\\kern12mu}{\\kern12mu}{\\kern12mu}\\mmlToken{mi}{mod}\\,\\,#1',
    1,
  ],
  pod: [
    BaseMethods.Macro,
    '\\mathchoice{\\kern18mu}{\\kern8mu}{\\kern8mu}{\\kern8mu}(#1)',
    1,
  ],
  iff: [BaseMethods.Macro, '\\;\\Longleftrightarrow\\;'],
  skew: [BaseMethods.Macro, '{{#2{#3\\mkern#1mu}\\mkern-#1mu}{}}', 3],

  pmb: [BaseMethods.Macro, '\\rlap{#1}\\kern1px{#1}', 1],
  TeX: [BaseMethods.Macro, 'T\\kern-.14em\\lower.5ex{E}\\kern-.115em X'],
  LaTeX: [
    BaseMethods.Macro,
    'L\\kern-.325em\\raise.21em{\\scriptstyle{A}}\\kern-.17em\\TeX',
  ],

  //  Specially handled
  not: BaseMethods.Not,
  dots: BaseMethods.Dots,
  space: BaseMethods.Tilde,
  '\u00A0': BaseMethods.Tilde,
  ' ': BaseMethods.Tilde,

  //  LaTeX
  begin: BaseMethods.BeginEnd,
  end: BaseMethods.BeginEnd,

  label: BaseMethods.HandleLabel,
  ref: BaseMethods.HandleRef,
  nonumber: BaseMethods.HandleNoTag,

  newcolumntype: BaseMethods.NewColumnType,

  // Internal use:
  mathchoice: BaseMethods.MathChoice,
  mmlToken: BaseMethods.MmlToken,
});

/**
 * Macros for LaTeX environments.
 */
new sm.EnvironmentMap('environment', ParseMethods.environment, {
  displaymath: [BaseMethods.Equation, null, false],
  math: [BaseMethods.Equation, null, false, false],
  array: [BaseMethods.AlignedArray],
  darray: [BaseMethods.AlignedArray, null, 'D'],
  equation: [BaseMethods.Equation, null, true],
  eqnarray: [
    BaseMethods.EqnArray,
    null,
    true,
    true,
    'rcl',
    'bmt',
    ParseUtil.cols(0, MATHSPACE.thickmathspace),
    '.5em',
  ],
  indentalign: [BaseMethods.IndentAlign],
});

/**
 * Mapping for negated operators.
 */
new sm.CharacterMap('not_remap', null, {
  '\u2190': '\u219A',
  '\u2192': '\u219B',
  '\u2194': '\u21AE',
  '\u21D0': '\u21CD',
  '\u21D2': '\u21CF',
  '\u21D4': '\u21CE',
  '\u2208': '\u2209',
  '\u220B': '\u220C',
  '\u2223': '\u2224',
  '\u2225': '\u2226',
  '\u223C': '\u2241',
  '\u007E': '\u2241',
  '\u2243': '\u2244',
  '\u2245': '\u2247',
  '\u2248': '\u2249',
  '\u224D': '\u226D',
  '\u003D': '\u2260',
  '\u2261': '\u2262',
  '\u003C': '\u226E',
  '\u003E': '\u226F',
  '\u2264': '\u2270',
  '\u2265': '\u2271',
  '\u2272': '\u2274',
  '\u2273': '\u2275',
  '\u2276': '\u2278',
  '\u2277': '\u2279',
  '\u227A': '\u2280',
  '\u227B': '\u2281',
  '\u2282': '\u2284',
  '\u2283': '\u2285',
  '\u2286': '\u2288',
  '\u2287': '\u2289',
  '\u22A2': '\u22AC',
  '\u22A8': '\u22AD',
  '\u22A9': '\u22AE',
  '\u22AB': '\u22AF',
  '\u227C': '\u22E0',
  '\u227D': '\u22E1',
  '\u2291': '\u22E2',
  '\u2292': '\u22E3',
  '\u22B2': '\u22EA',
  '\u22B3': '\u22EB',
  '\u22B4': '\u22EC',
  '\u22B5': '\u22ED',
  '\u2203': '\u2204',
});
