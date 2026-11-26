/*************************************************************
 *
 *  Copyright (c) 2026 The MathJax Consortium
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
 * @file Configuration file for the thermodynamics package.
 *
 * @author kaiserkarl31@yahoo.com (Karl D. Hammond)
 * Updated by dpvc@mathjax.org (Davide P. Cervone)
 */

import { HandlerType, ConfigurationType } from '../HandlerTypes.js';
import { ParserConfiguration, Configuration } from '../Configuration.js';
import { Macro } from '../Token.js';
import { CommandMap } from '../TokenMap.js';
import { TeX } from '../../tex.js';
import { NewcommandConfig } from '../newcommand/NewcommandConfiguration.js';
import { NewcommandTables } from '../newcommand/NewcommandUtil.js';
import {
  ThermodynamicsMethods as TDM,
  ThermodynamicsDelimiters as delimiters,
  THERMODYNAMICS_DELIMITER_STYLE,
  THERMODYNAMICS_EIS_STYLE,
} from './ThermodynamicsMethods.js';
import './ThermodynamicsMappings.js';
export { COMPONENT } from './__locales__/Component.js';

/**
 * The symbol sets that specify the letter used for several constants
 * (these can be set by the `symbol-set` configuration option).
 */
export const SymbolSets = {
  EUAGHan: 'E U A G H a n',
  EUAGHaN: 'E U A G H a N',
  EUHAGan: 'E U A G H a n',
  EUHAGaN: 'E U A G H a N',
  EUFGHAn: 'E U F G H A n',
  EUFGHAN: 'E U F G H A N',
  EEFGHAn: '\\mathcal{E} E F G H A n',
  EEFGHAN: '\\mathcal{E} E F G H A N',
  EEFGHan: '\\mathcal{E} E F G H a n',
  EEFGHaN: '\\mathcal{E} E F G H a N',
  EEAGHaN: '\\mathcal{E} E A G H a N',
  EEAGHAN: '\\mathcal{E} E A G H \\mathcal{A} N',
  EUAGHAN: 'E U A G H \\mathcal{A} N',
  EUFGHan: 'E U F G H a n',
  EUFGHaN: 'E U F G H a N',
};

/**
 * The union of the names of the symbol sets
 */
export type THERMODYNAMICS_SYMBOL_SET = keyof typeof SymbolSets;

/**
 * The macro names for the symbols in `SymbolSets`
 */
export const SymbolMacros = [
  'TotalEnergySymbol',
  'InternalEnergySymbol',
  'HelmholtzSymbol',
  'GibbsSymbol',
  'EnthalpySymbol',
  'AreaSymbol',
  'Nt',
];

/**
 * Define the macros for a given SymbolSet.
 *
 * @param {ParserConfiguration} config         The configuration for the definitions
 * @param {THERMODYNAMICS_SYMBOL_SET} option   The symbol set to use
 */
export function DefineSymbolSet(
  config: ParserConfiguration,
  option: THERMODYNAMICS_SYMBOL_SET
) {
  if (!Object.hasOwn(SymbolSets, option)) {
    option = Array.from(Object.keys(SymbolSets))[0] as keyof typeof SymbolSets;
  }
  const symbols = SymbolSets[option].split(' ');
  const handler = config.handlers.retrieve(
    NewcommandTables.NEW_COMMAND
  ) as CommandMap;
  for (const i of [0, 1, 2, 3, 4, 5, 6, 7]) {
    const cs = SymbolMacros[i];
    handler.add(cs, new Macro(cs, TDM.Latex, [symbols[i]]));
  }
}

/**
 * Configure the `thermodynamics` package.
 *
 * @param {ParserConfiguration} config    The configuration object for the input jax
 * @param {TeX<any,any,any>} jax          THe input jax itself
 */
export function configThermodynamics(
  config: ParserConfiguration,
  jax: TeX<any, any, any>
) {
  const parser = jax.parseOptions;
  const options = parser.options.thermodynamics;
  parser.packageData.set('thermodynamics', {
    'eis-style': options['extensive-style'],
    'pm-delims':
      delimiters[options['delimiter-style']] ?? delimiters.parentheses,
    'pm-style': options['pm-style'],
    subscripts: options.subscripts,
    'moles-style': options['moles-style'],
    ncomponents: options['ncomponents'],
  });
  //
  // Create the needed definitions for the symbol set
  //
  NewcommandConfig(config, jax);
  DefineSymbolSet(config, options['symbol-set']);
}

/**
 * The [tex]/thermodynamics option types.
 */
export type THERMODYNAMICS_OPTIONS = {
  thermodynamics: {
    'delimiter-style': THERMODYNAMICS_DELIMITER_STYLE;
    'extensive-style': THERMODYNAMICS_EIS_STYLE;
    'pm-style': 'long' | 'short';
    subscripts: boolean;
    ncomponents: string;
    'moles-style': 'index' | 'ranges';
    'symbol-set': THERMODYNAMICS_SYMBOL_SET;
    // 'book-style': '...'
    //      'Bejan', 'CBK', 'ElliottLira', 'KlotzRosenberg', 'Koretsky', 'ModellReid', 'MSBB',
    //      'Prausnitz', 'Sandler, 'SVNAS', 'TesterModell', 'Thompson',
  };
};

/**
 * The [tex]/thermodynamics option defaults.
 */
const options: THERMODYNAMICS_OPTIONS = {
  thermodynamics: {
    'delimiter-style': 'parentheses',
    'extensive-style': 'intensive-plain',
    'pm-style': 'long',
    subscripts: true,
    ncomponents: 'C',
    'moles-style': 'index',
    'symbol-set': 'EUAGHan',
  },
};

/**
 * The [tex]/thermodynamics package configuration object.
 */
export const ThermodynamicsConfiguration = Configuration.create(
  'thermodynamics',
  {
    [ConfigurationType.HANDLER]: {
      [HandlerType.MACRO]: ['thermodynamics-macros'],
      [HandlerType.ENVIRONMENT]: ['thermodynamics-environments'],
    },
    [ConfigurationType.OPTIONS]: options,
    [ConfigurationType.CONFIG]: configThermodynamics,
  }
);
