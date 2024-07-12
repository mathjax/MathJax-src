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
 * @fileoverview Configuration and implementation of the units package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {HandlerType, ConfigurationType} from '../HandlerTypes.js';
import {Configuration} from '../Configuration.js';
import TexParser from '../TexParser.js';
import {CommandMap} from '../TokenMap.js';
import {ParseMethod} from '../Types.js';

// Namespace
export let UnitsMethods: {[key: string]: ParseMethod} = {

  /**
   * Implements the basic \units macro.
   * @param {TexParser} parser The current tex parser.
   * @param {string} name The name of the calling macro.
   */
  Unit(parser: TexParser, name: string) {
    let val = parser.GetBrackets(name) ;
    let dim = parser.GetArgument(name);
    let macro = `\\mathrm{${dim}}`;
    if (val) {
      macro = val + (parser.options.units.loose ? '~' : '\\,') + macro;
    }
    parser.string = macro + parser.string.slice(parser.i);
    parser.i = 0;
  },

  /**
   * The \unitfrac macro.
   * @param {TexParser} parser The current tex parser.
   * @param {string} name The name of the calling macro.
   */
  UnitFrac(parser: TexParser, name: string) {
    let val = parser.GetBrackets(name) || '';
    let num = parser.GetArgument(name);
    let den = parser.GetArgument(name);
    let macro = `\\nicefrac[\\mathrm]{${num}}{${den}}`;
    if (val) {
      macro = val + (parser.options.units.loose ? '~' : '\\,') + macro;
    }
    parser.string = macro + parser.string.slice(parser.i);
    parser.i = 0;
  },

  /**
   * The \nicefrac macro.
   * @param {TexParser} parser The current tex parser.
   * @param {string} name The name of the calling macro.
   */
  NiceFrac(parser: TexParser, name: string) {
    let font = parser.GetBrackets(name) || '\\mathrm';
    let num = parser.GetArgument(name);
    let den = parser.GetArgument(name);
    let numMml = new TexParser(`${font}{${num}}`, {...parser.stack.env},
                               parser.configuration).mml();
    let denMml = new TexParser(`${font}{${den}}`, {...parser.stack.env},
                               parser.configuration).mml();
    const def = parser.options.units.ugly ? {} : {bevelled: true};
    const node = parser.create('node', 'mfrac', [numMml, denMml], def);
    parser.Push(node);
  },
}

new CommandMap('units', {
  units:    UnitsMethods.Unit,
  unitfrac: UnitsMethods.UnitFrac,
  nicefrac: UnitsMethods.NiceFrac
});


export const UnitsConfiguration = Configuration.create(
  'units', {
    [ConfigurationType.HANDLER]: {[HandlerType.MACRO]: ['units']},
    [ConfigurationType.OPTIONS]: {
      units: {
        loose: false,
        ugly: false
      }
    }
  }
);
