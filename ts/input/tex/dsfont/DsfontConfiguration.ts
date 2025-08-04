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
 * @file The dsfont package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { HandlerType, ConfigurationType } from '../HandlerTypes.js';
import { Configuration } from '../Configuration.js';
import { CommandMap } from '../TokenMap.js';
import BaseMethods from '../base/BaseMethods.js';
import TexParser from '../TexParser.js';

/**
 * The methods that implement the dsfont package.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 */
function ChooseFont(parser: TexParser, name: string) {
  BaseMethods.MathFont(
    parser,
    name,
    parser.options.dsfont.sans ? '-ds-ss' : '-ds-rm'
  );
}

new CommandMap('dsfont', {
  mathds: ChooseFont,
});

//
//  Define the package configuration, including switch for sans serif.
//
export const DsfontConfiguration = Configuration.create('dsfont', {
  [ConfigurationType.HANDLER]: {
    [HandlerType.MACRO]: ['dsfont'],
  },
  [ConfigurationType.OPTIONS]: {
    dsfont: {
      sans: false,
    },
  },
});
