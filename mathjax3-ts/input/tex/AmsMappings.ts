/*************************************************************
 *
 *  Copyright (c) 2017 The MathJax Consortium
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
 * @fileoverview AMS mappings for TeX Parsing.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import *  as sm from './SymbolMap.js';
import {TexConstant} from './TexConstants.js';
import {TEXCLASS} from '../../core/MmlTree/MmlNode.js';
import BaseMethods from './BaseMethods.js';
import {ParserUtil} from './ParserUtil.js';
import MapHandler from './MapHandler.js';


export namespace AmsMappings {

  let COLS = function(W: number[]) {
    const WW: string[] = [];
    for (let i = 0, m = W.length; i < m; i++) {
      WW[i] = ParserUtil.Em(W[i]);
    }
    return WW.join(' ');
  };


  sm.CharacterMap.create('AMSmath-mathchar0mo', BaseMethods.mathchar0mo, {
    iiiint:     ['\u2A0C', {texClass: TEXCLASS.OP}]
  });

  sm.CommandMap.create('AMSmath-macros', {
    mathring:   ['Accent', '2DA'],  // or 0x30A
      nobreakspace: 'Tilde',
      negmedspace:    ['Spacer', TexConstant.Length.NEGATIVEMEDIUMMATHSPACE],
      negthickspace:  ['Spacer', TexConstant.Length.NEGATIVETHICKMATHSPACE],

//    intI:       ['Macro', '\\mathchoice{\\!}{}{}{}\\!\\!\\int'],
//    iint:       ['MultiIntegral', '\\int\\intI'],          // now in core TeX input jax
//    iiint:      ['MultiIntegral', '\\int\\intI\\intI'],    // now in core TeX input jax
//    iiiint:     ['MultiIntegral', '\\int\\intI\\intI\\intI'], // now in mathchar0mo above
      idotsint:   ['MultiIntegral', '\\int\\cdots\\int'],

//    dddot:      ['Macro', '\\mathop{#1}\\limits^{\\textstyle \\mathord{.}\\mathord{.}\\mathord{.}}', 1],
//    ddddot:     ['Macro', '\\mathop{#1}\\limits^{\\textstyle \\mathord{.}\\mathord{.}\\mathord{.}\\mathord{.}}', 1],
      dddot:      ['Accent', '20DB'],
      ddddot:     ['Accent', '20DC'],

      sideset:    ['Macro', '\\mathop{\\mathop{\\rlap{\\phantom{#3}}}\\nolimits#1\\!\\mathop{#3}\\nolimits#2}', 3],

      boxed:      ['Macro', '\\fbox{$\\displaystyle{#1}$}', 1],

      tag:         'HandleTag',
      notag:       'HandleNoTag',
      label:       'HandleLabel',
      ref:         'HandleRef',
      eqref:       ['HandleRef', true],

      substack:   ['Macro', '\\begin{subarray}{c}#1\\end{subarray}', 1],

      injlim:     ['NamedOp', 'inj&thinsp;lim'],
      projlim:    ['NamedOp', 'proj&thinsp;lim'],
      varliminf:  ['Macro', '\\mathop{\\underline{\\mmlToken{mi}{lim}}}'],
      varlimsup:  ['Macro', '\\mathop{\\overline{\\mmlToken{mi}{lim}}}'],
      varinjlim:  ['Macro', '\\mathop{\\underrightarrow{\\mmlToken{mi}{lim}}}'],
      varprojlim: ['Macro', '\\mathop{\\underleftarrow{\\mmlToken{mi}{lim}}}'],

      DeclareMathOperator: 'HandleDeclareOp',
      operatorname:        'HandleOperatorName',
      SkipLimits:          'SkipLimits',

      genfrac:     'Genfrac',
      frac:       ['Genfrac', '', '', '', ''],
      tfrac:      ['Genfrac', '', '', '', 1],
      dfrac:      ['Genfrac', '', '', '', 0],
      binom:      ['Genfrac', '(', ')', '0', ''],
      tbinom:     ['Genfrac', '(', ')', '0', 1],
      dbinom:     ['Genfrac', '(', ')', '0', 0],

      cfrac:       'CFrac',

      shoveleft:  ['HandleShove', TexConstant.Align.LEFT],
      shoveright: ['HandleShove', TexConstant.Align.RIGHT],

      xrightarrow: ['xArrow', 0x2192, 5, 6],
      xleftarrow:  ['xArrow', 0x2190, 7, 3]
  });

  sm.EnvironmentMap.create('AMSmath-environment', {
      align:         ['AMSarray', null, true, true,  'rlrlrlrlrlrl', COLS([0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0])],
      'align*':      ['AMSarray', null, false, true, 'rlrlrlrlrlrl', COLS([0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0])],
      multline:      ['Multline', null, true],
      'multline*':   ['Multline', null, false],
      split:         ['AMSarray', null, false, false, 'rl', COLS([0])],
      gather:        ['AMSarray', null, true, true,  'c'],
      'gather*':     ['AMSarray', null, false, true, 'c'],

      alignat:       ['AlignAt', null, true, true],
      'alignat*':    ['AlignAt', null, false, true],
      alignedat:     ['AlignAt', null, false, false],

      aligned:       ['AlignedAMSArray', null, null, null, 'rlrlrlrlrlrl', COLS([0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0]), '.5em', 'D'],
      gathered:      ['AlignedAMSArray', null, null, null, 'c', null, '.5em', 'D'],

      subarray:      ['Array', null, null, null, null, COLS([0]), '0.1em', 'S', 1],
      smallmatrix:   ['Array', null, null, null, 'c', COLS([1 / 3]), '.2em', 'S', 1],

      'equation':    ['EquationBegin', 'Equation', true],
      'equation*':   ['EquationBegin', 'EquationStar', false],

      eqnarray:      ['AMSarray', null, true, true, 'rcl', '0 ' + TexConstant.Length.THICKMATHSPACE, '.5em'],
      'eqnarray*':   ['AMSarray', null, false, true, 'rcl', '0 ' + TexConstant.Length.THICKMATHSPACE, '.5em']
  }).parser = BaseMethods.environment;

  sm.DelimiterMap.create('AMSmath-delimiter', BaseMethods.delimiter, {
      '\\lvert':     ['\u007C', {texClass: TEXCLASS.OPEN}],
      '\\rvert':     ['\u007C', {texClass: TEXCLASS.CLOSE}],
      '\\lVert':     ['\u2016', {texClass: TEXCLASS.OPEN}],
      '\\rVert':     ['\u2016', {texClass: TEXCLASS.CLOSE}]
  });


  /**
   * Dummy init function to make sure the mappings are created.
   */
  export function init() {};

}
