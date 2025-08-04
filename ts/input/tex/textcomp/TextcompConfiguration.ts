/*************************************************************
 *
 *  Copyright (c) 2021-2025 The MathJax Consortium
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
 * @file Configuration file for the textcomp package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { HandlerType, ConfigurationType } from '../HandlerTypes.js';
import { Configuration } from '../Configuration.js';
import './TextcompMappings.js';

Configuration.create('text-textcomp', {
  [ConfigurationType.PARSER]: 'text',
  [ConfigurationType.HANDLER]: { [HandlerType.MACRO]: ['textcomp-macros'] },
});

export const TextcompConfiguration = Configuration.create('textcomp', {
  [ConfigurationType.HANDLER]: { macro: ['textcomp-macros'] },
  config(_config, jax) {
    const textmacros = jax.parseOptions.packageData.get('textmacros');
    if (textmacros) {
      textmacros.parseOptions.options.textmacros.packages.push('text-textcomp');
      textmacros.textConf.add('text-textcomp', jax, {});
    }
  },
});
