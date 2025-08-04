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
 * @file Configuration file for the centernot package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import { ConfigurationType } from '../HandlerTypes.js';
import { Configuration } from '../Configuration.js';
import ParseOptions from '../ParseOptions.js';
import TexParser from '../TexParser.js';
import NodeUtil from '../NodeUtil.js';
import { CommandMap } from '../TokenMap.js';
import BaseMethods from '../base/BaseMethods.js';

/**
 * Implements \centerOver{base}{symbol}
 *
 * @param {TexParser} parser   The active tex parser.
 * @param {string} name        The name of the macro being processed.
 */
function CenterOver(parser: TexParser, name: string) {
  const arg = '{' + parser.GetArgument(name) + '}';
  const over = parser.ParseArg(name);
  const base = new TexParser(arg, parser.stack.env, parser.configuration).mml();
  const mml = parser.create('node', 'TeXAtom', [
    new TexParser(arg, parser.stack.env, parser.configuration).mml(),
    parser.create(
      'node',
      'mpadded',
      [
        parser.create('node', 'mpadded', [over], {
          width: 0,
          lspace: '-.5width',
        }),
        parser.create('node', 'mphantom', [base]),
      ],
      { width: 0, lspace: '-.5width' }
    ),
  ]);
  parser.configuration.addNode('centerOver', base);
  parser.Push(mml);
}

new CommandMap('centernot', {
  centerOver: CenterOver,
  centernot: [BaseMethods.Macro, '\\centerOver{#1}{{\u29F8}}', 1],
});

/**
 * Filter to copy texClass to the surrounding TeXAtom so that the negated
 *   item has the same class of the base.
 *
 * @param {ParseOptions} data   The active tex parser.
 */
export function filterCenterOver({ data }: { data: ParseOptions }) {
  for (const base of data.getList('centerOver')) {
    const texClass = NodeUtil.getTexClass(base.childNodes[0].childNodes[0]);
    if (texClass !== null) {
      NodeUtil.setProperties(base.parent.parent.parent.parent.parent.parent, {
        texClass,
      });
    }
  }
}

export const CenternotConfiguration = Configuration.create('centernot', {
  [ConfigurationType.HANDLER]: { macro: ['centernot'] },
  [ConfigurationType.POSTPROCESSORS]: [filterCenterOver],
});
