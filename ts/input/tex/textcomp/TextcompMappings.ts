/*************************************************************
 *
 *  Copyright (c) 2021 The MathJax Consortium
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
 * @fileoverview Mappings for the textcomp package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import ParseMethods from '../ParseMethods.js';
import {CharacterMap} from '../SymbolMap.js';
import {TexConstant} from '../TexConstants.js';


/**
 * Identifiers from the Textcomp package.
 */
new CharacterMap('textcomp', ParseMethods.mathchar0mi, {

  // Table 3: Predefined LATEX 2ε Text-Mode Commands
  'textasciicircum':     ['\u005E', {mathvariant: TexConstant.Variant.NORMAL}],
  'textasciitilde':      ['\u007E', {mathvariant: TexConstant.Variant.NORMAL}],
// 'textasteriskcentered'
  'textbackslash':       ['\u005C', {mathvariant: TexConstant.Variant.NORMAL}],
  'textbar':             ['\u007C', {mathvariant: TexConstant.Variant.NORMAL}],
  'textbraceleft':       ['\u007B', {mathvariant: TexConstant.Variant.NORMAL}],
  'textbraceright':      ['\u007D', {mathvariant: TexConstant.Variant.NORMAL}],
  'textbullet':          ['\u2022', {mathvariant: TexConstant.Variant.NORMAL}],
  'textdagger':          ['\u2020', {mathvariant: TexConstant.Variant.NORMAL}],
  'textdaggerdbl':       ['\u2021', {mathvariant: TexConstant.Variant.NORMAL}],
  'textellipsis':        ['\u2026', {mathvariant: TexConstant.Variant.NORMAL}],
  'textemdash':          ['\u2014', {mathvariant: TexConstant.Variant.NORMAL}],
  'textendash':          ['\u2013', {mathvariant: TexConstant.Variant.NORMAL}],
  'textexclamdown':      ['\u00A1', {mathvariant: TexConstant.Variant.NORMAL}],
  'textgreater':         ['\u003E', {mathvariant: TexConstant.Variant.NORMAL}],
  'textless':            ['\u003C', {mathvariant: TexConstant.Variant.NORMAL}],
  'textordfeminine':     ['\u00AA', {mathvariant: TexConstant.Variant.NORMAL}],
  'textordmasculine':    ['\u00BA', {mathvariant: TexConstant.Variant.NORMAL}],
  'textparagraph':       ['\u00B6', {mathvariant: TexConstant.Variant.NORMAL}],
  'textperiodcentered':  ['\u00B7', {mathvariant: TexConstant.Variant.NORMAL}],
  'textquestiondown':    ['\u00BF', {mathvariant: TexConstant.Variant.NORMAL}],
  'textquotedblleft':    ['\u201C', {mathvariant: TexConstant.Variant.NORMAL}],
  'textquotedblright':   ['\u201D', {mathvariant: TexConstant.Variant.NORMAL}],
  'textquoteleft':       ['\u2018', {mathvariant: TexConstant.Variant.NORMAL}],
  'textquoteright':      ['\u2019', {mathvariant: TexConstant.Variant.NORMAL}],
  'textsection':         ['\u00A7', {mathvariant: TexConstant.Variant.NORMAL}],
  'textunderscore':      ['\u005F', {mathvariant: TexConstant.Variant.NORMAL}],
  'textvisiblespace':    ['\u2423', {mathvariant: TexConstant.Variant.NORMAL}],

  // Table 12: textcomp Diacritics
  'textacutedbl':        ['\u02DD', {mathvariant: TexConstant.Variant.NORMAL}],
  'textasciiacute':      ['\u00B4', {mathvariant: TexConstant.Variant.NORMAL}],
  'textasciibreve':      ['\u02D8', {mathvariant: TexConstant.Variant.NORMAL}],
  'textasciicaron':      ['\u02C7', {mathvariant: TexConstant.Variant.NORMAL}],
  'textasciidieresis':   ['\u00A8', {mathvariant: TexConstant.Variant.NORMAL}],
  'textasciimacron':     ['\u00AF', {mathvariant: TexConstant.Variant.NORMAL}],
  'textgravedbl':        ['\u02F5', {mathvariant: TexConstant.Variant.NORMAL}],
  'texttildelow':        ['\u02F7', {mathvariant: TexConstant.Variant.NORMAL}],

  // Table 13: textcomp Currency Symbols
  'textbaht':            ['\u0E3F', {mathvariant: TexConstant.Variant.NORMAL}],
  'textcent':            ['\u00A2', {mathvariant: TexConstant.Variant.NORMAL}],
  // This is not the correct glyph
  'textcentoldstyle':    ['$', {mathvariant: TexConstant.Variant.OLDSTYLE}],
  'textcolonmonetary':   ['\u20A1', {mathvariant: TexConstant.Variant.NORMAL}],
  'textcurrency':        ['\u00A4', {mathvariant: TexConstant.Variant.NORMAL}],
  'textdollar':          ['\u0024', {mathvariant: TexConstant.Variant.NORMAL}],
  // This is not the correct glyph
  'textdollaroldstyle':    ['$', {mathvariant: TexConstant.Variant.OLDSTYLE}],
  'textdong':            ['\u20AB', {mathvariant: TexConstant.Variant.NORMAL}],
  'texteuro':            ['\u20AC', {mathvariant: TexConstant.Variant.NORMAL}],
  'textflorin':          ['\u0192', {mathvariant: TexConstant.Variant.NORMAL}],
  'textguarani':         ['\u20B2', {mathvariant: TexConstant.Variant.NORMAL}],
  'textlira':            ['\u20A4', {mathvariant: TexConstant.Variant.NORMAL}],
  'textnaira':           ['\u20A6', {mathvariant: TexConstant.Variant.NORMAL}],
  'textpeso':            ['\u20B1', {mathvariant: TexConstant.Variant.NORMAL}],
  'textsterling':        ['\u00A3', {mathvariant: TexConstant.Variant.NORMAL}],
  'textwon':             ['\u20A9', {mathvariant: TexConstant.Variant.NORMAL}],
  'textyen':             ['\u00A5', {mathvariant: TexConstant.Variant.NORMAL}],

  // Table 15: textcomp Legal Symbols
  'textcircledP':        ['\u2117', {mathvariant: TexConstant.Variant.NORMAL}],
  'textcompwordmark':    ['\u200C', {mathvariant: TexConstant.Variant.NORMAL}],
  'textcopyleft':        ['\u1F12F', {mathvariant: TexConstant.Variant.NORMAL}],
  'textcopyright':       ['\u00A9', {mathvariant: TexConstant.Variant.NORMAL}],
  'textregistered':      ['\u00AE', {mathvariant: TexConstant.Variant.NORMAL}],
  'textservicemark':     ['\u2120', {mathvariant: TexConstant.Variant.NORMAL}],
  'texttrademark':       ['\u2122', {mathvariant: TexConstant.Variant.NORMAL}],

  // Table 16: textcomp Old-Style Numerals
  'textzerooldstyle':    ['0', {mathvariant: TexConstant.Variant.OLDSTYLE}],
  'textoneoldstyle':     ['1', {mathvariant: TexConstant.Variant.OLDSTYLE}],
  'texttwooldstyle':     ['2', {mathvariant: TexConstant.Variant.OLDSTYLE}],
  'textthreeoldstyle':   ['3', {mathvariant: TexConstant.Variant.OLDSTYLE}],
  'textfouroldstyle':    ['4', {mathvariant: TexConstant.Variant.OLDSTYLE}],
  'textfiveoldstyle':    ['5', {mathvariant: TexConstant.Variant.OLDSTYLE}],
  'textsixoldstyle':     ['6', {mathvariant: TexConstant.Variant.OLDSTYLE}],
  'textsevenoldstyle':   ['7', {mathvariant: TexConstant.Variant.OLDSTYLE}],
  'texteightoldstyle':   ['8', {mathvariant: TexConstant.Variant.OLDSTYLE}],
  'textnineoldstyle':    ['9', {mathvariant: TexConstant.Variant.OLDSTYLE}],

  // Table 20: Miscellaneous textcomp Symbol
  'textbardbl':          ['\u2016', {mathvariant: TexConstant.Variant.NORMAL}],
  'textbigcircle':       ['\u25EF', {mathvariant: TexConstant.Variant.NORMAL}],
  'textblank':           ['\u2422', {mathvariant: TexConstant.Variant.NORMAL}],
  'textbrokenbar':       ['\u00A6', {mathvariant: TexConstant.Variant.NORMAL}],
  'textdiscount':        ['\u2052', {mathvariant: TexConstant.Variant.NORMAL}],
  'textestimated':       ['\u212E', {mathvariant: TexConstant.Variant.NORMAL}],
  'textinterrobang':     ['\u203D', {mathvariant: TexConstant.Variant.NORMAL}],
  'textinterrobangdown': ['\u2E18', {mathvariant: TexConstant.Variant.NORMAL}],
  'textmusicalnote':     ['\u266A', {mathvariant: TexConstant.Variant.NORMAL}],
  'textnumero':          ['\u2116', {mathvariant: TexConstant.Variant.NORMAL}],
  'textopenbullet':      ['\u25E6', {mathvariant: TexConstant.Variant.NORMAL}],
  'textpertenthousand':  ['\u2031', {mathvariant: TexConstant.Variant.NORMAL}],
  'textperthousand':     ['\u2030', {mathvariant: TexConstant.Variant.NORMAL}],
  'textrecipe':          ['\u211E', {mathvariant: TexConstant.Variant.NORMAL}],
  'textreferencemark':   ['\u203B', {mathvariant: TexConstant.Variant.NORMAL}],
  // 'textthreequartersemdash'
  // 'texttwelveudash'

  // Table 51: textcomp Text-Mode Delimiters
  'textlangle':          ['\u2329', {mathvariant: TexConstant.Variant.NORMAL}],
  'textrangle':          ['\u232A', {mathvariant: TexConstant.Variant.NORMAL}],
  'textlbrackdbl':       ['\u27E6', {mathvariant: TexConstant.Variant.NORMAL}],
  'textrbrackdbl':       ['\u27E7', {mathvariant: TexConstant.Variant.NORMAL}],
  'textlquill':          ['\u2045', {mathvariant: TexConstant.Variant.NORMAL}],
  'textrquill':          ['\u2046', {mathvariant: TexConstant.Variant.NORMAL}],

  // Table 62: textcomp Text-Mode Math and Science Symbols
    'textcelsius':         ['\u2103', {mathvariant: TexConstant.Variant.NORMAL}],
  'textdegree':          ['\u00B0', {mathvariant: TexConstant.Variant.NORMAL}],
  'textdiv':             ['\u00F7', {mathvariant: TexConstant.Variant.NORMAL}],
  'textdownarrow':       ['\u2193', {mathvariant: TexConstant.Variant.NORMAL}],
  'textfractionsolidus': ['\u2044', {mathvariant: TexConstant.Variant.NORMAL}],
  'textleftarrow':       ['\u2190', {mathvariant: TexConstant.Variant.NORMAL}],
  'textlnot':            ['\u00AC', {mathvariant: TexConstant.Variant.NORMAL}],
  'textmho':             ['\u2127', {mathvariant: TexConstant.Variant.NORMAL}],
  'textminus':           ['\u2212', {mathvariant: TexConstant.Variant.NORMAL}],
  'textmu':              ['\u00B5', {mathvariant: TexConstant.Variant.NORMAL}],
  'textohm':             ['\u2126', {mathvariant: TexConstant.Variant.NORMAL}],
  'textonehalf':         ['\u00BD', {mathvariant: TexConstant.Variant.NORMAL}],
  'textonequarter':      ['\u00BC', {mathvariant: TexConstant.Variant.NORMAL}],
  'textonesuperior':     ['\u00B9', {mathvariant: TexConstant.Variant.NORMAL}],
  'textpm':              ['\u00B1', {mathvariant: TexConstant.Variant.NORMAL}],
  'textrightarrow':      ['\u2192', {mathvariant: TexConstant.Variant.NORMAL}],
  'textsurd':            ['\u221A', {mathvariant: TexConstant.Variant.NORMAL}],
  'textthreequarters':   ['\u00BE', {mathvariant: TexConstant.Variant.NORMAL}],
  'textthreesuperior':   ['\u00B3', {mathvariant: TexConstant.Variant.NORMAL}],
  'texttimes':           ['\u00D7', {mathvariant: TexConstant.Variant.NORMAL}],
  'texttwosuperior':     ['\u00B2', {mathvariant: TexConstant.Variant.NORMAL}],
  'textuparrow':         ['\u2191', {mathvariant: TexConstant.Variant.NORMAL}],

  // Table 110: textcomp Genealogical Symbols
  'textborn':            ['\u002A', {mathvariant: TexConstant.Variant.NORMAL}],
  'textdied':            ['\u2020', {mathvariant: TexConstant.Variant.NORMAL}],
  'textdivorced':        ['\u26AE', {mathvariant: TexConstant.Variant.NORMAL}],
  //  'textleaf'
  'textmarried':         ['\u26AD', {mathvariant: TexConstant.Variant.NORMAL}]
});
