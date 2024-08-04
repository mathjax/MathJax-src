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
 * @fileoverview Configuration file for the AMS package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { HandlerType, ConfigurationType } from '../HandlerTypes.js';
import { Configuration, ParserConfiguration } from '../Configuration.js';
import { MultlineItem, FlalignItem } from './AmsItems.js';
import { AbstractTags } from '../Tags.js';
import { NEW_OPS } from './AmsMethods.js';
import './AmsMappings.js';
import { CommandMap } from '../TokenMap.js';

/**
 * Standard AMS style tagging.
 * @constructor
 * @extends {AbstractTags}
 */
export class AmsTags extends AbstractTags {}

/**
 * Init method for AMS package.
 * @param {ParserConfiguration} config The current configuration.
 */
let init = function (config: ParserConfiguration) {
  new CommandMap(NEW_OPS, {});
  config.append(
    Configuration.local({ handler: { macro: [NEW_OPS] }, priority: -1 }),
  );
};

export const AmsConfiguration = Configuration.create('ams', {
  [ConfigurationType.HANDLER]: {
    [HandlerType.CHARACTER]: ['AMSmath-operatorLetter'],
    [HandlerType.DELIMITER]: ['AMSsymbols-delimiter', 'AMSmath-delimiter'],
    [HandlerType.MACRO]: [
      'AMSsymbols-mathchar0mi',
      'AMSsymbols-mathchar0mo',
      'AMSsymbols-delimiter',
      'AMSsymbols-macros',
      'AMSmath-mathchar0mo',
      'AMSmath-macros',
      'AMSmath-delimiter',
    ],
    [HandlerType.ENVIRONMENT]: ['AMSmath-environment'],
  },
  [ConfigurationType.ITEMS]: {
    [MultlineItem.prototype.kind]: MultlineItem,
    [FlalignItem.prototype.kind]: FlalignItem,
  },
  [ConfigurationType.TAGS]: { ams: AmsTags },
  [ConfigurationType.INIT]: init,
  [ConfigurationType.OPTIONS]: {
    multlineWidth: '',
    ams: {
      operatornamePattern: /^[-*a-zA-Z]+/, // multiLetterIdentifier for \operatorname
      multlineWidth: '100%', // The width to use for multline environments.
      multlineIndent: '1em', // The margin to use on both sides of multline environments.
    },
  },
});
