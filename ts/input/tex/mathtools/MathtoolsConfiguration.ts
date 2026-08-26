/*************************************************************
 *  Copyright (c) 2020-2026 MathJax Consortium
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
 * @file    Configuration file for the mathtools package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import { HandlerType, ConfigurationType } from '../HandlerTypes.js';
import { Configuration } from '../Configuration.js';
import { Macro } from '../Token.js';
import { CommandMap } from '../TokenMap.js';
import NodeUtil from '../NodeUtil.js';
import { expandable, EXPANDABLE_LIST_OF } from '../../../util/Options.js';
import { ParserConfiguration } from '../Configuration.js';
import { TeX } from '../../tex.js';
import ParseOptions from '../ParseOptions.js';
import { NewcommandConfig } from '../newcommand/NewcommandConfiguration.js';
import { NewcommandTables } from '../newcommand/NewcommandUtil.js';
import { Args } from '../Types.js';

import './MathtoolsMappings.js';
import {
  MathtoolsMethods,
  LEGACYCONFIG,
  LEGACYPRIORITY,
} from './MathtoolsMethods.js';
import { MathtoolsTagFormat } from './MathtoolsTags.js';
import { MultlinedItem } from './MathtoolsItems.js';
export { COMPONENT } from './__locales__/Component.js';

/**
 * Add any pre-defined paired delimiters, and subclass the configured tag format.
 *
 * @param {ParserConfiguration} config   The current configuration.
 * @param {TeX} jax                      The TeX input jax
 */
function configMathtools(config: ParserConfiguration, jax: TeX<any, any, any>) {
  NewcommandConfig(config, jax);
  const parser = jax.parseOptions;
  const pairedDelims = parser.options.mathtools.pairedDelimiters;
  const handler = config.handlers.retrieve(
    NewcommandTables.NEW_COMMAND
  ) as CommandMap;
  for (const [cs, args] of Object.entries(pairedDelims) as [string, Args[]][]) {
    handler.add(cs, new Macro(cs, MathtoolsMethods.PairedDelimiters, args));
  }
  if (parser.options.mathtools.legacycolonsymbols) {
    config.handlers.add(LEGACYCONFIG, {}, LEGACYPRIORITY);
  }
  MathtoolsTagFormat(config, jax);
}

/**
 * A filter to fix up mmultiscripts elements.
 *
 * @param {ParseOptions} data   The parse options.
 */
export function fixPrescripts({ data }: { data: ParseOptions }) {
  for (const node of data.getList('mmultiscripts')) {
    if (!node.getProperty('fixPrescript')) continue;
    const childNodes = NodeUtil.getChildren(node);
    let n = 0;
    for (const i of [1, 2]) {
      if (!childNodes[i]) {
        NodeUtil.setChild(node, i, data.nodeFactory.create('node', 'none'));
        n++;
      }
    }
    if (n === 2) {
      childNodes.splice(1, 2);
    }
  }
}

type PAIRED_DELIM_DEFS = EXPANDABLE_LIST_OF<
  | [left: string, right: string]
  | [left: string, right: string, body: string, argcount: number]
  | [
      left: string,
      right: string,
      body: string,
      argcount: number,
      pre: string,
      post: string,
    ]
>;

type TAGFORM_DEFS = EXPANDABLE_LIST_OF<
  [left: string, right: string, format: string]
>;

/**
 * The [tex]/mathtools option types.
 */
export type MATHTOOLS_OPTIONS = {
  mathtools: {
    'multlined-gap': string; //               Horizontal space for multlined environments
    'multlined-pos': string; //               Default alignment for multlined environments
    'multlined-width': string; //             Default width for mutlined environments
    'firstline-afterskip': string; //         Space for first line of multlined (overrides multlined-gap)
    'lastline-preskip': string; //            Space for last line of multlined (overrides multlined-gap)
    'smallmatrix-align': string; //           Default alignment for smallmatrix environments
    shortvdotsadjustabove: string; //         Space to remove above \shortvdots
    shortvdotsadjustbelow: string; //         Space to remove below \shortvdots
    centercolon: boolean; //                  True to have colon automatically centered
    'centercolon-offset': string; //          Vertical adjustment for centered colons
    'thincolon-dx': string; //                Horizontal adjustment for thin colons (e.g., \coloneqq)
    'thincolon-dw': string; //                Width adjustment for thin colons
    'use-unicode': boolean; //                True to use unicode characters rather than multi-character
    //                                          version for \coloneqq, etc., when possible
    legacycolonsymbols: boolean; //           True to use legacy \coloneq, etc.
    'prescript-sub-format': string; //        Format for \prescript subscript
    'prescript-sup-format': string; //        Format for \prescript superscript
    'prescript-arg-format': string; //        Format for \prescript base
    'allow-mathtoolsset': boolean; //         True to allow \mathtoolsset to change settings
    pairedDelimiters: PAIRED_DELIM_DEFS; //   Predefined paired delimiters
    tagforms: TAGFORM_DEFS; //                Tag form definitions
  };
};

/**
 * The [tex]/mathtools option defaults.
 */
const options: MATHTOOLS_OPTIONS = {
  mathtools: {
    'multlined-gap': '1em',
    'multlined-pos': 'c',
    'multlined-width': '',
    'firstline-afterskip': '',
    'lastline-preskip': '',
    'smallmatrix-align': 'c',
    shortvdotsadjustabove: '.2em',
    shortvdotsadjustbelow: '.2em',
    centercolon: false,
    'centercolon-offset': '.04em',
    'thincolon-dx': '-.04em',
    'thincolon-dw': '-.08em',
    'use-unicode': false,
    legacycolonsymbols: false,
    'prescript-sub-format': '',
    'prescript-sup-format': '',
    'prescript-arg-format': '',
    'allow-mathtoolsset': true,
    pairedDelimiters: expandable<PAIRED_DELIM_DEFS>({}),
    tagforms: expandable<TAGFORM_DEFS>({}),
  },
};

/**
 * The configuration object for the `mathtools` package.
 */
export const MathtoolsConfiguration = Configuration.create('mathtools', {
  [ConfigurationType.HANDLER]: {
    macro: ['mathtools-macros', 'mathtools-delimiters'],
    [HandlerType.ENVIRONMENT]: ['mathtools-environments'],
    [HandlerType.DELIMITER]: ['mathtools-delimiters'],
    [HandlerType.CHARACTER]: ['mathtools-characters'],
  },
  [ConfigurationType.ITEMS]: {
    [MultlinedItem.prototype.kind]: MultlinedItem,
  },
  [ConfigurationType.CONFIG]: configMathtools,
  [ConfigurationType.POSTPROCESSORS]: [[fixPrescripts, -6]],
  [ConfigurationType.OPTIONS]: options,
});
