/*************************************************************
 *
 *  Copyright (c) 2020-2023 The MathJax Consortium
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
 * @fileoverview  Character and Macro mappings for the textmacros package
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import {MacroMap, CommandMap} from '../TokenMap.js';
import {TexConstant} from '../TexConstants.js';
import {TextMacrosMethods} from './TextMacrosMethods.js';
import {MATHSPACE} from '../../../util/lengths.js';

const VARIANT = TexConstant.Variant;

//
//  The special characters in text-mode
//
new MacroMap('text-special', {
  '$':          'Math',
  '%':          'Comment',
  '^':          'MathModeOnly',
  '_':          'MathModeOnly',
  '&':          'Misplaced',
  '#':          'Misplaced',
  '~':          'Tilde',
  ' ':          'Space',
  '\t':         'Space',
  '\r':         'Space',
  '\n':         'Space',
  '\u00A0':     'Tilde',
  '{':          'OpenBrace',
  '}':          'CloseBrace',
  '`':          'OpenQuote',
  '\'':         'CloseQuote'
}, TextMacrosMethods);

//
//  The text-mode macro mappings
//
new CommandMap('text-macros', {
  '(':          'Math',

  '$':          'SelfQuote',
  '_':          'SelfQuote',
  '%':          'SelfQuote',
  '{':          'SelfQuote',
  '}':          'SelfQuote',
  ' ':          'SelfQuote',
  '&':          'SelfQuote',
  '#':          'SelfQuote',
  '\\':         ['Macro', '$\\\\$'],

  '\'':         ['Accent', '\u00B4'],
  '\u2019':     ['Accent', '\u00B4'],
  '`':          ['Accent', '\u0060'],
  '\u2018':     ['Accent', '\u0060'],
  '^':          ['Accent', '^'],
  '\"':         ['Accent', '\u00A8'],
  '~':          ['Accent', '~'],
  '=':          ['Accent', '\u00AF'],
  '.':          ['Accent', '\u02D9'],
  'u':          ['Accent', '\u02D8'],
  'v':          ['Accent', '\u02C7'],

  emph:         'Emph',
  rm:           ['SetFont', VARIANT.NORMAL],
  mit:          ['SetFont', VARIANT.ITALIC],
  oldstyle:     ['SetFont', VARIANT.OLDSTYLE],
  cal:          ['SetFont', VARIANT.CALLIGRAPHIC],
  it:           ['SetFont', '-tex-mathit'], // needs special handling
  bf:           ['SetFont', VARIANT.BOLD],
  sf:           ['SetFont', VARIANT.SANSSERIF],
  tt:           ['SetFont', VARIANT.MONOSPACE],

  frak:         ['TextFont', VARIANT.FRAKTUR],
  Bbb:          ['TextFont', VARIANT.DOUBLESTRUCK],

  tiny:         ['SetSize', 0.5],
  Tiny:         ['SetSize', 0.6],  // non-standard
  scriptsize:   ['SetSize', 0.7],
  small:        ['SetSize', 0.85],
  normalsize:   ['SetSize', 1.0],
  large:        ['SetSize', 1.2],
  Large:        ['SetSize', 1.44],
  LARGE:        ['SetSize', 1.73],
  huge:         ['SetSize', 2.07],
  Huge:         ['SetSize', 2.49],

  textnormal:   ['Macro', '{\\rm #1}', 1],
  textup:       ['Macro', '{\\rm #1}', 1],
  textrm:       ['Macro', '{\\rm #1}', 1],
  textit:       ['Macro', '{\\it #1}', 1],
  textbf:       ['Macro', '{\\bf #1}', 1],
  textsf:       ['Macro', '{\\sf #1}', 1],
  texttt:       ['Macro', '{\\tt #1}', 1],

  dagger:       ['Insert', '\u2020'],
  ddagger:      ['Insert', '\u2021'],
  S:            ['Insert', '\u00A7'],

  ',':          ['Spacer', MATHSPACE.thinmathspace],
  ':':          ['Spacer', MATHSPACE.mediummathspace],
  '>':          ['Spacer', MATHSPACE.mediummathspace],
  ';':          ['Spacer', MATHSPACE.thickmathspace],
  '!':          ['Spacer', MATHSPACE.negativethinmathspace],
  enspace:      ['Spacer', .5],
  quad:         ['Spacer', 1],
  qquad:        ['Spacer', 2],
  thinspace:    ['Spacer', MATHSPACE.thinmathspace],
  negthinspace: ['Spacer', MATHSPACE.negativethinmathspace],

  hskip:        'Hskip',
  hspace:       'Hskip',
  kern:         'Hskip',
  mskip:        'Hskip',
  mspace:       'Hskip',
  mkern:        'Hskip',
  rule:         'rule',
  Rule:         ['Rule'],
  Space:        ['Rule', 'blank'],

  color:        'CheckAutoload',
  textcolor:    'CheckAutoload',
  colorbox:     'CheckAutoload',
  fcolorbox:    'CheckAutoload',
  href:         'CheckAutoload',
  style:        'CheckAutoload',
  class:        'CheckAutoload',
  data:         'CheckAutoload',
  cssId:        'CheckAutoload',
  unicode:      'CheckAutoload',
  U:            'CheckAutoload',
  char:         'CheckAutoload',

  ref:          ['HandleRef', false],
  eqref:        ['HandleRef', true],

  underline:    ['UnderOver', '2015'],

  llap:         'Lap',
  rlap:         'Lap',

  phantom:      'Phantom',
  vphantom:     ['Phantom', 1, 0],
  hphantom:     ['Phantom', 0, 1],
  smash:        'Smash',

  mmlToken:     'MmlToken'

}, TextMacrosMethods);
