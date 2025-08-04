/*************************************************************
 *  Copyright (c) 2020-2025 MathJax Consortium
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
 * @file    Macro and environment mappings for the mathtools package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import ParseMethods from '../ParseMethods.js';
import { CommandMap, EnvironmentMap, DelimiterMap } from '../TokenMap.js';
import { TexConstant } from '../TexConstants.js';

import { MathtoolsMethods } from './MathtoolsMethods.js';

//
//  Mathtools macros that are not implemented:
//
//    \smashoperator[〈pos〉]{〈operator with limits〉}
//    \SwapAboveDisplaySkip
//    \noeqref{〈label,label,. . . 〉}
//    \intertext{〈text 〉}
//    \shortintertext{〈text 〉}
//    \reDeclarePairedDelimiterInnerWrapper{〈macro name〉}{〈star or nostarnonscaled or nostarscaled〉}{〈code〉}
//    \DeclareMathSizes{〈dimen〉}{〈dimen〉}{〈dimen〉}{〈dimen〉}
//    \newgathered{〈name〉}{〈pre_line〉}{〈post_line〉}{〈after〉}
//    \renewgathered{〈name〉}{〈pre_line〉}{〈post_line〉}{〈after〉}
//

/**
 * The macros for this package.
 */
new CommandMap('mathtools-macros', {
  shoveleft: [MathtoolsMethods.HandleShove, TexConstant.Align.LEFT], // override AMS version
  shoveright: [MathtoolsMethods.HandleShove, TexConstant.Align.RIGHT], // override AMS version

  xleftrightarrow: [MathtoolsMethods.xArrow, 0x2194, 10, 10],
  xLeftarrow: [MathtoolsMethods.xArrow, 0x21d0, 12, 7],
  xRightarrow: [MathtoolsMethods.xArrow, 0x21d2, 7, 12],
  xLeftrightarrow: [MathtoolsMethods.xArrow, 0x21d4, 12, 12],
  xhookleftarrow: [MathtoolsMethods.xArrow, 0x21a9, 10, 5],
  xhookrightarrow: [MathtoolsMethods.xArrow, 0x21aa, 5, 10],
  xmapsto: [MathtoolsMethods.xArrow, 0x21a6, 10, 10],
  xrightharpoondown: [MathtoolsMethods.xArrow, 0x21c1, 5, 10],
  xleftharpoondown: [MathtoolsMethods.xArrow, 0x21bd, 10, 5],
  xrightleftharpoons: [MathtoolsMethods.xArrow, 0x21cc, 10, 10],
  xrightharpoonup: [MathtoolsMethods.xArrow, 0x21c0, 5, 10],
  xleftharpoonup: [MathtoolsMethods.xArrow, 0x21bc, 10, 5],
  xleftrightharpoons: [MathtoolsMethods.xArrow, 0x21cb, 10, 10],
  xlongrightarrow: [MathtoolsMethods.xArrow, 0x27f6, 7, 12, 1.45],
  xlongleftarrow: [MathtoolsMethods.xArrow, 0x27f5, 12, 7, 1.45],
  xLongrightarrow: [MathtoolsMethods.xArrow, 0x27f9, 7, 12, 1.45],
  xLongleftarrow: [MathtoolsMethods.xArrow, 0x27f8, 12, 7, 1.45],

  mathllap: [MathtoolsMethods.MathLap, 'l', false],
  mathrlap: [MathtoolsMethods.MathLap, 'r', false],
  mathclap: [MathtoolsMethods.MathLap, 'c', false],
  clap: [MathtoolsMethods.MtLap, 'c'],
  textllap: [MathtoolsMethods.MtLap, 'l'],
  textrlap: [MathtoolsMethods.MtLap, 'r'],
  textclap: [MathtoolsMethods.MtLap, 'c'],

  cramped: MathtoolsMethods.Cramped,
  crampedllap: [MathtoolsMethods.MathLap, 'l', true],
  crampedrlap: [MathtoolsMethods.MathLap, 'r', true],
  crampedclap: [MathtoolsMethods.MathLap, 'c', true],
  crampedsubstack: [
    MathtoolsMethods.Macro,
    '\\begin{crampedsubarray}{c}#1\\end{crampedsubarray}',
    1,
  ],

  mathmbox: MathtoolsMethods.MathMBox,
  mathmakebox: MathtoolsMethods.MathMakeBox,

  overbracket: MathtoolsMethods.UnderOverBracket,
  underbracket: MathtoolsMethods.UnderOverBracket,

  refeq: MathtoolsMethods.HandleRef,

  MoveEqLeft: [
    MathtoolsMethods.Macro,
    '\\hspace{#1em}&\\hspace{-#1em}',
    1,
    '2',
  ],
  Aboxed: MathtoolsMethods.Aboxed,
  MakeAboxedCommand: MathtoolsMethods.MakeAboxedCommand,

  ArrowBetweenLines: MathtoolsMethods.ArrowBetweenLines,
  vdotswithin: MathtoolsMethods.VDotsWithin,
  shortvdotswithin: MathtoolsMethods.ShortVDotsWithin,
  MTFlushSpaceAbove: MathtoolsMethods.FlushSpaceAbove,
  MTFlushSpaceBelow: MathtoolsMethods.FlushSpaceBelow,

  DeclarePairedDelimiter: MathtoolsMethods.DeclarePairedDelimiter,
  DeclarePairedDelimiterX: MathtoolsMethods.DeclarePairedDelimiterX,
  DeclarePairedDelimiterXPP: MathtoolsMethods.DeclarePairedDelimiterXPP,

  //
  //  Typos from initial release -- kept for backward compatibility for now
  //
  DeclarePairedDelimiters: MathtoolsMethods.DeclarePairedDelimiter,
  DeclarePairedDelimitersX: MathtoolsMethods.DeclarePairedDelimiterX,
  DeclarePairedDelimitersXPP: MathtoolsMethods.DeclarePairedDelimiterXPP,

  vcentercolon: [MathtoolsMethods.CenterColon, true, true],
  ordinarycolon: [MathtoolsMethods.CenterColon, false],
  MTThinColon: [MathtoolsMethods.CenterColon, true, true, true],

  coloneqq: [MathtoolsMethods.Relation, ':=', '\u2254'],
  Coloneqq: [MathtoolsMethods.Relation, '::=', '\u2A74'],
  coloneq: [MathtoolsMethods.Relation, ':=', '\u2254'],
  Coloneq: [MathtoolsMethods.Relation, '::=', '\u2A7A'],
  eqqcolon: [MathtoolsMethods.Relation, '=:', '\u2255'],
  Eqqcolon: [MathtoolsMethods.Relation, '=::'],
  eqcolon: [MathtoolsMethods.Relation, '=:', '\u2255'],
  Eqcolon: [MathtoolsMethods.Relation, '=::'],
  colonapprox: [MathtoolsMethods.Relation, ':\\approx'],
  Colonapprox: [MathtoolsMethods.Relation, '::\\approx'],
  colonsim: [MathtoolsMethods.Relation, ':\\sim'],
  Colonsim: [MathtoolsMethods.Relation, '::\\sim'],
  dblcolon: [MathtoolsMethods.Relation, '::', '\u2237'],
  approxcolon: [MathtoolsMethods.Relation, '\\approx:'],
  Approxcolon: [MathtoolsMethods.Relation, '\\approx::'],
  simcolon: [MathtoolsMethods.Relation, '\\sim:'],
  Simcolon: [MathtoolsMethods.Relation, '\\sim::'],
  colondash: [MathtoolsMethods.Relation, ':-'],
  Colondash: [MathtoolsMethods.Relation, '::-'],
  dashcolon: [MathtoolsMethods.Relation, '-:', '\u2239'],
  Dashcolon: [MathtoolsMethods.Relation, '-::'],

  nuparrow: [MathtoolsMethods.NArrow, '\u2191', '.06em'],
  ndownarrow: [MathtoolsMethods.NArrow, '\u2193', '.25em'],
  bigtimes: [
    MathtoolsMethods.Macro,
    '\\mathop{\\Large\\kern-.1em\\boldsymbol{\\times}\\kern-.1em}',
  ],

  splitfrac: [MathtoolsMethods.SplitFrac, false],
  splitdfrac: [MathtoolsMethods.SplitFrac, true],

  xmathstrut: MathtoolsMethods.XMathStrut,

  prescript: MathtoolsMethods.Prescript,

  newtagform: [MathtoolsMethods.NewTagForm, false],
  renewtagform: [MathtoolsMethods.NewTagForm, true],
  usetagform: MathtoolsMethods.UseTagForm,

  /* eslint-disable no-sparse-arrays */
  adjustlimits: [
    MathtoolsMethods.MacroWithTemplate,
    '\\mathop{{#1}\\vphantom{{#3}}}_{{#2}\\vphantom{{#4}}}\\mathop{{#3}\\vphantom{{#1}}}_{{#4}\\vphantom{{#2}}}',
    4,
    ,
    '_',
    ,
    '_',
  ],

  mathtoolsset: MathtoolsMethods.SetOptions,
});

new CommandMap('mathtools-legacycolonsymbols', {
  coloneq: [MathtoolsMethods.Relation, ':-'],
  Coloneq: [MathtoolsMethods.Relation, '::-'],
  eqcolon: [MathtoolsMethods.Relation, '-:', '\u2239'],
  Eqcolon: [MathtoolsMethods.Relation, '-::'],
});

/**
 *  The environments for this package.
 */
new EnvironmentMap('mathtools-environments', ParseMethods.environment, {
  dcases: [MathtoolsMethods.Array, null, '\\{', '', 'll', null, '.2em', 'D'],
  rcases: [MathtoolsMethods.Array, null, '', '\\}', 'll', null, '.2em'],
  drcases: [MathtoolsMethods.Array, null, '', '\\}', 'll', null, '.2em', 'D'],
  'dcases*': [MathtoolsMethods.Cases, null, '{', '', 'D'],
  'rcases*': [MathtoolsMethods.Cases, null, '', '}'],
  'drcases*': [MathtoolsMethods.Cases, null, '', '}', 'D'],
  'cases*': [MathtoolsMethods.Cases, null, '{', ''],

  'matrix*': [MathtoolsMethods.MtMatrix, null, null, null],
  'pmatrix*': [MathtoolsMethods.MtMatrix, null, '(', ')'],
  'bmatrix*': [MathtoolsMethods.MtMatrix, null, '[', ']'],
  'Bmatrix*': [MathtoolsMethods.MtMatrix, null, '\\{', '\\}'],
  'vmatrix*': [MathtoolsMethods.MtMatrix, null, '\\vert', '\\vert'],
  'Vmatrix*': [MathtoolsMethods.MtMatrix, null, '\\Vert', '\\Vert'],

  'smallmatrix*': [MathtoolsMethods.MtSmallMatrix, null, null, null],
  psmallmatrix: [MathtoolsMethods.MtSmallMatrix, null, '(', ')', 'c'],
  'psmallmatrix*': [MathtoolsMethods.MtSmallMatrix, null, '(', ')'],
  bsmallmatrix: [MathtoolsMethods.MtSmallMatrix, null, '[', ']', 'c'],
  'bsmallmatrix*': [MathtoolsMethods.MtSmallMatrix, null, '[', ']'],
  Bsmallmatrix: [MathtoolsMethods.MtSmallMatrix, null, '\\{', '\\}', 'c'],
  'Bsmallmatrix*': [MathtoolsMethods.MtSmallMatrix, null, '\\{', '\\}'],
  vsmallmatrix: [MathtoolsMethods.MtSmallMatrix, null, '\\vert', '\\vert', 'c'],
  'vsmallmatrix*': [MathtoolsMethods.MtSmallMatrix, null, '\\vert', '\\vert'],
  Vsmallmatrix: [MathtoolsMethods.MtSmallMatrix, null, '\\Vert', '\\Vert', 'c'],
  'Vsmallmatrix*': [MathtoolsMethods.MtSmallMatrix, null, '\\Vert', '\\Vert'],

  crampedsubarray: [
    MathtoolsMethods.Array,
    null,
    null,
    null,
    null,
    '0em',
    '0.1em',
    "S'",
    1,
  ],

  multlined: MathtoolsMethods.MtMultlined,

  spreadlines: [MathtoolsMethods.SpreadLines, true],

  lgathered: [
    MathtoolsMethods.AmsEqnArray,
    null,
    null,
    null,
    'l',
    't',
    null,
    '.5em',
    'D',
  ],
  rgathered: [
    MathtoolsMethods.AmsEqnArray,
    null,
    null,
    null,
    'r',
    't',
    null,
    '.5em',
    'D',
  ],
});

/**
 * The delimiters for this package.
 */
new DelimiterMap('mathtools-delimiters', ParseMethods.delimiter, {
  '\\lparen': '(',
  '\\rparen': ')',
});

/**
 * The special characters for this package.
 */
new CommandMap('mathtools-characters', {
  ':': [MathtoolsMethods.CenterColon, true],
});
