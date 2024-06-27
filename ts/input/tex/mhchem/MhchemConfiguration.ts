/*************************************************************
 *
 *  Copyright (c) 2018-2024 The MathJax Consortium
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
 * @fileoverview Configuration file for the mhchem package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {
  HandlerType, ConfigurationType} from '../HandlerTypes.js';
import {Configuration} from '../Configuration.js';
import {CommandMap} from '../TokenMap.js';
import {ParseMethod} from '../Types.js';
import TexError from '../TexError.js';
import TexParser from '../TexParser.js';
import BaseMethods from '../base/BaseMethods.js';
import {AmsMethods} from '../ams/AmsMethods.js';
import {mhchemParser} from '#mhchem/mhchemParser.js';

// Namespace
const MhchemMethods: {[key: string]: ParseMethod} = {

  /**
   * @param{TeXParser} parser   The parser for this expression
   * @param{string} name        The macro name being called
   * @param{string} machine     The name of the finite-state machine to use
   */
  Machine(parser: TexParser, name: string, machine: 'tex' | 'ce' | 'pu') {
    let arg = parser.GetArgument(name);
    let tex;
    try {
      tex = mhchemParser.toTex(arg, machine);
    } catch (err) {
      throw new TexError(err[0], err[1]);
    }
    parser.string = tex + parser.string.substring(parser.i);
    parser.i = 0;
  },

  Macro: BaseMethods.Macro,
  xArrow: AmsMethods.xArrow,

}


new CommandMap(
  'mhchem', {
    ce: [MhchemMethods.Machine, 'ce'],
    pu: [MhchemMethods.Machine, 'pu'],
    longrightleftharpoons: [
      MhchemMethods.Macro,
      '\\stackrel{\\textstyle{-}\\!\\!{\\rightharpoonup}}{\\smash{{\\leftharpoondown}\\!\\!{-}}}'
    ],
    longRightleftharpoons: [
      MhchemMethods.Macro,
      '\\stackrel{\\textstyle{-}\\!\\!{\\rightharpoonup}}{\\smash{\\leftharpoondown}}'
    ],
    longLeftrightharpoons: [
      MhchemMethods.Macro,
      '\\stackrel{\\textstyle\\vphantom{{-}}{\\rightharpoonup}}{\\smash{{\\leftharpoondown}\\!\\!{-}}}'
    ],
    longleftrightarrows: [
      MhchemMethods.Macro,
      '\\stackrel{\\longrightarrow}{\\smash{\\longleftarrow}\\Rule{0px}{.25em}{0px}}'
    ],
    //
    //  Needed for \bond for the ~ forms
    //
    tripledash: [
      MhchemMethods.Macro,
      '\\vphantom{-}\\raise2mu{\\kern2mu\\tiny\\text{-}\\kern1mu\\text{-}\\kern1mu\\text{-}\\kern2mu}'
    ],
    xleftrightarrow:    [MhchemMethods.xArrow, 0x2194, 6, 6],
    xrightleftharpoons: [MhchemMethods.xArrow, 0x21CC, 5, 7],   // FIXME:  doesn't stretch in HTML-CSS output
    xRightleftharpoons: [MhchemMethods.xArrow, 0x21CC, 5, 7],   // FIXME:  how should this be handled?
    xLeftrightharpoons: [MhchemMethods.xArrow, 0x21CC, 5, 7]
  }
);


export const MhchemConfiguration = Configuration.create(
  'mhchem', {[ConfigurationType.HANDLER]: {[HandlerType.MACRO]: ['mhchem']}}
);
