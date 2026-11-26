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
 * @file Utilities file for the thermodynamics package.
 *
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */

import TexParser from '../TexParser.js';
import { NewcommandUtil } from '../newcommand/NewcommandUtil.js';
import { EnvProp } from '../StackItem.js';
import { MmlMi } from '../../../core/MmlTree/MmlNodes/mi.js';
import { ThermodynamicsMethods as TDM } from './ThermodynamicsMethods.js';

/**
 * The sorting order for partial-derivative arguments
 */
export const ThermodynamicsOrder = (() => {
  const symbols = (
    String.raw`\Et \Em \Es \Ut \Um \Us \Ht \Hm \Hs \Ft \Fm \Fs \Gt \Gm \Gs \Lt \Lm ` +
    String.raw`\Ls T \St \Sm \Ss P \Vt \Vm \Vs \mu \Nt m w x y z \At \Am \As \sigma`
  ).split(/ /);
  let i = 0;
  return new Map(symbols.map((c) => [c, ++i]));
})();

/**
 * The utilities for the [tex]/thermodynamics package.
 */
export const ThermodynamicsUtil = {
  /**
   * Parse a self-contained LaTeX string.
   *
   * @param {TexParser} parser   The current TeX parser
   * @param {string} tex         The LaTeX string to process
   */
  latex(parser: TexParser, tex: string) {
    parser.Push(
      new TexParser(tex, parser.stack.env, parser.configuration).mml()
    );
  },

  /**
   * Define the `t`, `m`, and `s` suffixed macros for a given symbol
   *
   * @param {TexParser} parser   The current TeX parser
   * @param {string} symbol      The symbol used for the definition
   * @param {string} cs          The base control-sequence name to define
   * @param {string} prefix      The prefix of the characters to attach to `cs`, if any
   * @param {string} sup         The superscript to include in the definition, if any
   */
  tmsMacros(
    parser: TexParser,
    symbol: string,
    cs: string,
    prefix: string = '',
    sup: string = ''
  ) {
    const arg = `{${symbol}}${sup ? `^${sup}` : ''}`;
    for (const [c, macro] of [
      [prefix + 't', '\\extensive'],
      [prefix || 'm', '\\intensive'],
      [prefix + 's', '\\specific'],
    ]) {
      NewcommandUtil.addMacro(parser, cs + c, TDM.Latex, [`${macro}${arg}`]);
    }
  },

  /**
   * Define a `pm` suffixed macros for a given symbol
   *
   * @param {TexParser} parser   The current TeX parser
   * @param {string} symbol      The symbol used for the definition
   * @param {string} cs          The base control-sequence name to define
   * @param {string} prefix      The prefix of the characters to attach to `cs`, if any
   * @param {string} sup         The superscript to include in the definition, if any
   */
  pmMacro(
    parser: TexParser,
    symbol: string,
    cs: string,
    prefix: string = '',
    sup: string = ''
  ) {
    NewcommandUtil.addMacro(
      parser,
      cs + prefix + 'pm',
      sup ? TDM.PartialMolarSuperscripted : TDM.PartialMolar,
      sup ? [symbol, sup] : [symbol]
    );
  },

  /**
   * Get an option's value either from the stack.env or the
   * thermodymanics package data (the defaults).
   *
   * @param {TexParser} parser   The current TeX parser
   * @param {string} name        The name of the property to get
   * @returns {string}           The value of the named property
   */
  getOption(parser: TexParser, name: string): string {
    return (
      parser.stack.env[`-thermodynamics-${name}`] ??
      parser.configuration.packageData.get('thermodynamics')[name]
    );
  },

  /**
   * Set an option's value tin the stack.env (i.e., a temporary
   * value that will be lost when the top stack item is popped).
   * This is used by the environments that set local properties.
   *
   * @param {TexParser} parser   The current TeX parser
   * @param {string} name        The name of the property to set
   * @param {EnvProp} value      The value to set for the property
   */
  setOption(parser: TexParser, name: string, value: EnvProp) {
    parser.stack.env[`-thermodynamics-${name}`] = value;
  },

  /**
   * Get the next superscript and/or subscript, merged with given
   * super- or subscripts, and placed within `^{...}` and `_{...}`
   * constructs.
   *
   * @param {TexParser} parser     The current TeX parser
   * @param {string} name          The name of the current macro
   * @param {string} subscript     The subscript prefix, if any
   * @param {string} superscript   The superscript prefix, if any
   * @param {string} sub           '' to find subscript following superscript, undefined to not
   * @param {string} sup           '' to find superscript following subscript, undefined to not
   * @param {boolean} forceSub     `true` forces next argument to be a subscript
   * @returns {[string, string]}   The TeX code for the superscript and subscript, if any
   */
  getSupSub(
    parser: TexParser,
    name: string,
    subscript: string = '',
    superscript: string = '',
    sub: string = '',
    sup: string = parser.GetBrackets(name, ''),
    forceSub: boolean = true
  ): [string, string] {
    const c = parser.GetNext();
    if (c === '_') {
      parser.i++;
      sub = parser.GetArgument(name);
      if (parser.GetNext() === '^' && sup !== undefined) {
        parser.i++;
        sup = parser.GetArgument(name);
      }
    } else if (c === '^') {
      parser.i++;
      sup = parser.GetArgument(name);
      if (parser.GetNext() === '_' && sub !== undefined) {
        parser.i++;
        sub = parser.GetArgument(name);
      }
    } else if (c && forceSub) {
      sub = parser.GetArgument(name);
    }
    if (subscript) {
      sub = subscript + (sub ? `,${sub}` : '');
    }
    if (superscript) {
      sup = superscript + (sup ? `,${sup}` : '');
    }
    return [sup ? `^{${sup}}` : '', sub ? `_{${sub}}` : ''];
  },

  /**
   * Determine whether we are inline or not, and whether the
   * delimiters are stretchy, based on whether the macro indicates
   * inline and/or text mode, or if the previous call used these
   * modes.
   *
   * @param {TexParser} parser            The current TeX parser
   * @param {boolean} inline              Whether the calling macro is explicitly inline
   * @param {boolean} text                Whether the calling macro is explicitly (inline)text
   * @param {string} left                 The macro to stretch the left delimiter
   * @param {string} right                The macro to stretch the right delimiter
   * @returns {[boolean,string,string]}   The inline mode and the left/right macros to use, if any
   */
  getILR(
    parser: TexParser,
    inline: boolean,
    text: boolean,
    left: string,
    right: string
  ): [boolean, string, string] {
    if (inline) {
      ThermodynamicsUtil.setOption(parser, 'inline', true);
    } else if (ThermodynamicsUtil.getOption(parser, 'inline')) {
      inline = true;
    }
    if (text) {
      ThermodynamicsUtil.setOption(parser, 'text', true);
    } else if (ThermodynamicsUtil.getOption(parser, 'text')) {
      text = true;
    }
    if (text) {
      left = right = '';
    }
    return [inline, left, right];
  },

  /**
   * Get the lower-case version of a symbol (either a macro name, or
   * the value of the `mi` node that it produces).
   *
   * @param {TexParser} parser   The current TeX parser
   * @param {string} symbol      The symbol to convert to lower case
   * @returns {string}           The lower-case verson of the symbol
   */
  lowerCase(parser: TexParser, symbol: string): string {
    const mml = new TexParser(
      symbol,
      parser.stack.env,
      parser.configuration
    ).mml();
    return (
      mml.kind === 'mi' ? (mml as MmlMi).getText() : symbol
    ).toLowerCase();
  },

  /**
   * Sort a list of arguments in the order given by
   * `ThermodynamicsOrder`.  Characters not in that list are treated
   * as being after all the ones in the list, and are sorted as per
   * the javascript localCompare() function, with a leading `\\all` or
   * `\\` removed.
   *
   * @param {string[]} list   The list of arguments to sort
   * @returns {string}        The sorted arguments separated by commas
   */
  sort(...list: string[]): string {
    if (list.length === 3) {
      const i = list.indexOf('\\Nt');
      if (i >= 0 && i < list.length - 1) {
        list.splice(i, 1);
      }
    }
    list = list.join(',').split(/,/); // since last entry can have commas;
    return list
      .filter((x) => x !== '')
      .sort((a, b) => {
        const na = ThermodynamicsOrder.get(a);
        const nb = ThermodynamicsOrder.get(b);
        if (na && nb) return na < nb ? -1 : na > nb ? 1 : 0;
        if (na) return -1;
        if (nb) return 1;
        return a
          .replace(/^\\(?:all)?/, '')
          .localeCompare(b.replace(/^\\(?:all)?/, ''));
      })
      .join(',');
  },
};
