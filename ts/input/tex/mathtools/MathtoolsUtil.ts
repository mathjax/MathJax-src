/*************************************************************
 *  Copyright (c) 2021 MathJax Consortium
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
 * @fileoverview    Utility functions for the mathtools package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import {EqnArrayItem} from '../base/BaseItems.js';
import ParseUtil from '../ParseUtil.js';
import TexParser from '../TexParser.js';
import TexError from '../TexError.js';
import {CommandMap} from '../SymbolMap.js';
import {Macro} from '../Symbol.js';
import ParseOptions from '../ParseOptions.js';
import {lookup} from '../../../util/Options.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';

import {MathtoolsMethods} from './MathtoolsMethods.js';
import {PAIREDDELIMS} from './MathtoolsConfiguration.js';

/**
 * Utility functions for the Mathtools package.
 */
export const MathtoolsUtil = {

  setDisplayLevel(mml: MmlNode, style: string) {
    if (!style) return;
    const [display, script] = lookup(style, {
      '\\displaystyle':      [true, 0],
      '\\textstyle':         [false, 0],
      '\\scriptstyle':       [false, 1],
      '\\scriptscriptstyle': [false, 2]
    }, [null, null]);
    if (display !== null) {
      mml.attributes.set('displaystyle', display);
      mml.attributes.set('scriptlevel', script);
    }
  },

  checkAlignment(parser: TexParser, name: string) {
    const top = parser.stack.Top() as EqnArrayItem;
    if (top.kind !== EqnArrayItem.prototype.kind) {
      throw new TexError('NotInAlignment', '%1 can only be used in aligment environments', name);
    }
    return top;
  },

  addPairedDelims(config: ParseOptions, cs: string, args: string[]) {
    const delims = config.handlers.retrieve(PAIREDDELIMS) as CommandMap;
    delims.add(cs, new Macro(cs, MathtoolsMethods.PairedDelimiters, args));
  },

  spreadLines(mtable: MmlNode, spread: string) {
    if (!mtable.isKind('mtable')) return;
    let rowspacing = mtable.attributes.get('rowspacing') as string;
    if (rowspacing) {
      const add = ParseUtil.dimen2em(spread);
      rowspacing = rowspacing
        .split(/ /)
        .map(s => ParseUtil.Em(Math.max(0, ParseUtil.dimen2em(s) + add)))
        .join(' ');
    } else {
      rowspacing = spread;
    }
    mtable.attributes.set('rowspacing', rowspacing);
  },

  plusOrMinus(name: string, n: string) {
    n = n.trim();
    if (!n.match(/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/)) {
      throw new TexError('NotANumber', 'Argument to %1 is not a number', name);
    }
    return (n.match(/^[-+]/) ? n : '+' + n);
  },

  getScript(parser: TexParser, name: string, pos: string) {
    let arg = ParseUtil.trimSpaces(parser.GetArgument(name));
    if (arg === '') {
      return parser.create('node', 'none');
    }
    const format = parser.options.mathtools[`prescript-${pos}-format`];
    format && (arg = `${format}{${arg}}`);
    return new TexParser(arg, parser.stack.env, parser.configuration).mml();
  }

};
