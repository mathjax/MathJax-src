/*************************************************************
 *
 *  Copyright (c) 2025-2026 The MathJax Consortium
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
 * @file Configuration file for the begingroup package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import { HandlerType, ConfigurationType } from '../HandlerTypes.js';
import { Configuration } from '../Configuration.js';
import { CommandMap } from '../TokenMap.js';
import { BegingroupStack, begingroupStack } from './BegingroupStack.js';
import { BegingroupMethods } from './BegingroupMethods.js';
export { COMPONENT } from './__locales__/Component.js';

/**
 * Create the begingroup command map.
 */
new CommandMap('begingroup', {
  begingroup: BegingroupMethods.begingroup,
  endgroup: BegingroupMethods.endgroup,
  global: BegingroupMethods.global,
  gdef: [BegingroupMethods.macro, '\\global\\def'],
  begingroupReset: BegingroupMethods.reset,
  begingroupSandbox: BegingroupMethods.sandbox,
});

/**
 * The [tex]/begingroup options types.
 */
export type BEGINGROUP_OPTIONS = {
  begingroup: {
    allowGlobal: string[];
  };
};

/**
 * The [tex]/begingroup option defaults.
 */
const options: BEGINGROUP_OPTIONS = {
  begingroup: {
    allowGlobal: [
      'let',
      'def',
      'newcommand',
      'DeclareMathOperator',
      'Newextarrow',
    ],
  },
};

/**
 * The configuration object for the `begingroup` package.
 */
export const BegingroupConfiguration = Configuration.create('begingroup', {
  [ConfigurationType.HANDLER]: {
    [HandlerType.MACRO]: ['begingroup'],
  },
  [ConfigurationType.CONFIG]: (_config, jax) => {
    //
    // Create a stack and save it in the package data
    //
    jax.parseOptions.packageData.set('begingroup', {
      stack: new BegingroupStack(jax.parseOptions),
    });
  },
  [ConfigurationType.OPTIONS]: options,
  [ConfigurationType.PREPROCESSORS]: [
    ({ data: parser }) => begingroupStack(parser).remove(),
  ],
  [ConfigurationType.POSTPROCESSORS]: [
    ({ data: parser }) => begingroupStack(parser).finish(),
  ],
});
