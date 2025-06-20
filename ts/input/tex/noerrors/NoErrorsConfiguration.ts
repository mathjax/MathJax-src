/*************************************************************
 *
 *  Copyright (c) 2018-2025 The MathJax Consortium
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
 * @file Configuration file for the NoErrors package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { ConfigurationType } from '../HandlerTypes.js';
import { Configuration } from '../Configuration.js';
import { NodeFactory } from '../NodeFactory.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';

/**
 * Generates an error node containing the erroneous expression.
 *
 * @param {NodeFactory} factory The node factory.
 * @param {string} message The error message.
 * @param {string} _id The error id (which is ignored).
 * @param {string} expr The original LaTeX expression.
 * @returns {MmlNode} The error output node.
 */
function noErrors(
  factory: NodeFactory,
  message: string,
  _id: string,
  expr: string
): MmlNode {
  const mtext = factory.create('token', 'mtext', {}, expr.replace(/\n/g, ' '));
  const error = factory.create('node', 'merror', [mtext], {
    'data-mjx-error': message,
    title: message,
  });
  return error;
}

export const NoErrorsConfiguration = Configuration.create('noerrors', {
  [ConfigurationType.NODES]: { error: noErrors },
});
