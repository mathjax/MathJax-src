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
 * @file Methods file for the thermodynamics package.
 *
 * @author kaiserkarl31@yahoo.com (Karl D. Hammond)
 * Updated by dpvc@mathjax.org (Davide P. Cervone)
 */

import TexParser from '../TexParser.js';
import BaseMethods from '../base/BaseMethods.js';
import { StackItem } from '../StackItem.js';
import { texError } from '../TexError.js';
import { ThermodynamicsUtil as TDU } from './ThermodynamicsUtil.js';
import { COMPONENT } from './__locales__/Component.js';

/**
 * A mapping of extensive/intensive styles to functions that convert a
 * symbol to the proper format.
 */
export type EISmethods = {
  [style: string]: (
    symbol: string,
    parser?: TexParser,
    name?: string
  ) => string | (() => void);
};

/**
 * A function to priduce an object with no prototype from
 * an object literal.
 *
 * @param {EISmethods} methods   The methods to define
 * @returns {EISmethods}         The methods with no prototype
 */
export function DefineEISmethods(methods: EISmethods): EISmethods {
  return Object.assign(Object.create(null), methods);
}

/**
 * The collection of conversion functions for the various output formats.
 */
export const EISmethodsMap = {
  extensive: DefineEISmethods({
    'extensive-plain': (symbol) => symbol,
    'intensive-plain': (symbol) =>
      `{\\mkern1mu\\underline{\\mkern-1mu ${symbol}\\mkern-4mu}\\mkern4mu}`,
    'extensive-superscript': (symbol, parser, name) => () => {
      ThermodynamicsMethods.SuperscriptedSymbol(parser, name, symbol, 't');
    },
    'intensive-lowercase': (symbol) => symbol,
  }),

  intensive: DefineEISmethods({
    'extensive-plain': (symbol) =>
      `{\\mkern1mu\\underline{\\mkern-1mu ${symbol}\\mkern-4mu}\\mkern4mu}`,
    'intensive-plain': (symbol) => symbol,
    'extensive-superscript': (symbol) => symbol,
    'intensive-lowercase': (symbol, parser) => TDU.lowerCase(parser, symbol),
  }),

  specific: DefineEISmethods({
    'extensive-plain': (symbol) => `\\hat{${symbol}}`,
    'intensive-plain': (symbol) => `\\hat{${symbol}}`,
    'extensive-superscript': (symbol) => `\\hat{${symbol}}`,
    'intensive-lowercase': (symbol, parser) =>
      `\\hat{${TDU.lowerCase(parser, symbol)}}`,
  }),
};

/**
 * The union 'extensive' | 'intensive' | 'specific'
 */
export type THERMODYNAMICS_EIS_NAMES = keyof typeof EISmethodsMap;

/**
 * A union of valid names for the extensive/intensive/specific styles.
 */
export type THERMODYNAMICS_EIS_STYLE = keyof typeof EISmethodsMap.extensive;

/**
 * The delimiters to use for the various partial derivative styles.
 */
export const ThermodynamicsDelimiters = Object.assign(Object.create(null), {
  parentheses: '( ) )',
  brackets: '[ ] ]',
  braces: '\\{ \\} \\}',
  bar: '. | .',
  plain: '. . .',
});

/**
 * The union of the names of the delimiter styles.
 */
export type THERMODYNAMICS_DELIMITER_STYLE =
  keyof typeof ThermodynamicsDelimiters;

/**
 * The macro methods for the [tex]/thermodynamics package.
 */
export const ThermodynamicsMethods = {
  /**************************************************************************/

  /**
   * Parse a self-contained LaTeX string
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {string} _name       The name of the current macro
   * @param {string} tex         The LaTeX string to parse
   */
  Latex(parser: TexParser, _name: string, tex: string) {
    TDU.latex(parser, tex);
  },

  /**************************************************************************/

  /**
   * Implement \extensive, \intensive, and \specific macros using
   * one of the EISmethodMaps defined above and the current EIS style.
   *
   * @param {TexParser} parser                   The active TeX parser
   * @param {string} name                        The name of the current macro
   * @param {THERMODYNAMICS_EIS_NAMES} methods   The EISmethods map to use
   */
  EISProperty(
    parser: TexParser,
    name: string,
    methods: THERMODYNAMICS_EIS_NAMES
  ) {
    const style = TDU.getOption(parser, 'eis-style');
    const method = EISmethodsMap[methods][style];
    if (!method) {
      texError(COMPONENT, 'InvalidSymbolStyle', style);
    }
    const result = method(parser.GetArgument(name), parser, name);
    if (typeof result === 'string') {
      TDU.latex(parser, result);
    } else {
      result();
    }
  },

  /**
   * Locally change the EIS style within an environment.
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {StackItem} begin    The StackItem that starts an environment
   *                             (which contains a new `stack.env` that disappears
   *                              after the environment is ended)
   * @param {string} style       The name of the temporary EIS style
   */
  LocalEISstyle(parser: TexParser, begin: StackItem, style: string) {
    parser.Push(begin);
    TDU.setOption(parser, 'eis-style', style);
  },

  /**************************************************************************/

  // Partial molar quantities
  // cases to consider:
  // (1) Mpm{i}
  // (2) Mpm[S]{i}
  // (3) Mpm^S_i
  // (4) Mpm_i^S
  // (5) Mpm_i
  /**
   * Implement \partialmolar handling super- and subscripts that follow.
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {string} name        The name of the current macro
   * @param {string} symbol      The symbol that is being decorated
   */
  PartialMolar(
    parser: TexParser,
    name: string,
    symbol: string = parser.GetArgument(name)
  ) {
    const [sup, sub] = TDU.getSupSub(parser, name);
    TDU.latex(
      parser,
      TDU.getOption(parser, 'pm-style') === 'long'
        ? `\\mkern2mu\\overline{\\mkern-2mu{${symbol}}${sub}${sup}\\mkern-1mu}\\mkern1mu`
        : `\\mkern2mu\\overline{\\mkern-2mu{${symbol}\\mkern-1mu}}\\mkern1mu${sub}${sup}`
    );
  },

  /**
   * Locally changes the pm-style option within an environment.
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {StackItem} begin    The StackItem that starts an environment
   *                             (which contains a new `stack.env` that disappears
   *                              after the environment is ended)
   * @param {string} style       The name of the temporary pm style to use
   */
  LocalPmStyle(parser: TexParser, begin: StackItem, style: string) {
    parser.Push(begin);
    TDU.setOption(parser, 'pm-style', style);
  },

  /**
   * Locally change the delimiters to use within an environment.
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {StackItem} begin    The StackItem that starts an environment
   *                             (which contains a new `stack.env` that disappears
   *                              after the environment is ended)
   * @param {string} delimiters  The name of the temporary delimiter style
   */
  LocalPmDelimiters(parser: TexParser, begin: StackItem, delimiters: string) {
    parser.Push(begin);
    TDU.setOption(parser, 'pm-delims', delimiters);
    if (delimiters === ThermodynamicsDelimiters.plain) {
      TDU.setOption(parser, 'subscripts', false);
    }
  },

  /**
   * Locally change the subscript option within an environment.
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {StackItem} begin    The StackItem that starts an environment
   *                             (which contains a new `stack.env` that disappears
   *                              after the environment is ended)
   * @param {boolean} scripts    The temporary setting for the subscripts option
   */
  LocalSubscripts(parser: TexParser, begin: StackItem, scripts: boolean) {
    parser.Push(begin);
    TDU.setOption(parser, 'subscripts', scripts);
  },

  /**************************************************************************/

  /**
   * Implements the \Partial, \Partialinline, and \Partialinlinetext macros.
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {string} name        The name of the current macro
   * @param {boolean} inline     `true` when this is an inline macro
   * @param {boolean} text       `true` when this is an inlinetext macro
   * @param {string} left        The string to use before the left-hand delimiter
   * @param {string} right       The string to use before the right-hand delimiter
   */
  Partial(
    parser: TexParser,
    name: string,
    inline: boolean = false,
    text: boolean = false,
    left: string = '\\left',
    right: string = '\\right'
  ) {
    const star = inline ? '' : parser.GetStar();
    const f = parser.GetArgument(name);
    const v = parser.GetArgument(name);
    const at = parser.GetArgument(name);

    [inline, left, right] = TDU.getILR(parser, inline, text, left, right);
    const [open, close, empty] = TDU.getOption(parser, 'pm-delims').split(/ /);
    const subscripts = TDU.getOption(parser, 'subscripts');
    const args = subscripts ? '' : TDU.sort(v, at);
    const end =
      (subscripts ? (at ? `${close}_{${at}}` : empty) : '') +
      (!inline && star ? '\\mkern-12mu' : '');
    TDU.latex(
      parser,
      subscripts
        ? inline
          ? `${left}${open}\\partial ${f}/\\partial ${v}${right}${end}`
          : `${left}${open}\\frac{\\partial ${f}}{\\partial ${v}}${right}${end}`
        : inline
          ? `${left}${open}\\partial ${f}(${args})/\\partial ${v}${right}${close}`
          : `${left}${open}\\frac{\\partial ${f}(${args})}{\\partial ${v}}${right}${close}`
    );
  },

  /**
   * Implements the \PartialSecnd, \PartialSecondinline, and
   * \PartiaSecondlinlinetext macros.
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {string} name        The name of the current macro
   * @param {boolean} inline     `true` when this is an inline macro
   * @param {boolean} text       `true` when this is an inlinetext macro
   * @param {string} left        The string to use before the left-hand delimiter
   * @param {string} right       The string to use before the right-hand delimiter
   */
  PartialSecond(
    parser: TexParser,
    name: string,
    inline: boolean = false,
    text: boolean = false,
    left: string = '\\left',
    right: string = '\\right'
  ) {
    const star = inline ? '' : parser.GetStar();
    const f = parser.GetArgument(name);
    const v = parser.GetArgument(name);
    const at = parser.GetArgument(name);

    [inline, left, right] = TDU.getILR(parser, inline, text, left, right);
    const [open, close, empty] = TDU.getOption(parser, 'pm-delims').split(/ /);
    const subscripts = TDU.getOption(parser, 'subscripts');
    const args = subscripts ? '' : TDU.sort(v, at);
    const end =
      (subscripts ? (at ? `${close}_{${at}}` : empty) : '') +
      (!inline && star ? '\\mkern-12mu' : '');
    TDU.latex(
      parser,
      subscripts
        ? inline
          ? `${left}${open}\\partial^2 ${f}/\\partial ${v}^2${right}${end}`
          : `${left}${open}\\frac{\\partial^2 ${f}}{\\partial ${v}^2}${right}${end}`
        : inline
          ? `${left}${open}\\partial^2 ${f}(${args})/\\partial ${v}^2${right}${close}`
          : `${left}${open}\\frac{\\partial^2 ${f}(${args})}{\\partial^2 ${v}}${right}${close}`
    );
  },

  /**
   * Implements the \PartialMixSecond, \PartialMixSecondinline, and
   * \PartialMixSecndinlinetext macros.
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {string} name        The name of the current macro
   * @param {boolean} inline     `true` when this is an inline macro
   * @param {boolean} text       `true` when this is an inlinetext macro
   * @param {string} left        The string to use before the left-hand delimiter
   * @param {string} right       The string to use before the right-hand delimiter
   */
  PartialMixSecond(
    parser: TexParser,
    name: string,
    inline: boolean = false,
    text: boolean = false,
    left: string = '\\left',
    right: string = '\\right'
  ) {
    const star = inline ? '' : parser.GetStar();
    const f = parser.GetArgument(name);
    const v1 = parser.GetArgument(name);
    const v2 = parser.GetArgument(name);
    const at = parser.GetArgument(name);

    [inline, left, right] = TDU.getILR(parser, inline, text, left, right);
    const [open, close, empty] = TDU.getOption(parser, 'pm-delims').split(/ /);
    const subscripts = TDU.getOption(parser, 'subscripts');
    const args = subscripts ? '' : TDU.sort(v1, v2, at);
    const end =
      (subscripts ? (at ? `${close}_{${at}}` : empty) : '') +
      (!inline && star ? '\\mkern-12mu' : '');
    TDU.latex(
      parser,
      subscripts
        ? inline
          ? `${left}${open}\\partial^2 ${f}/\\partial ${v1}\\partial ${v2}${right}${end}`
          : `${left}${open}\\frac{\\partial^2 ${f}}{\\partial ${v1}\\partial ${v2}}${right}${end}`
        : inline
          ? `${left}${open}\\partial^2 ${f}(${args})/\\partial ${v1}\\partial ${v2}${right}${close}`
          : `${left}${open}\\frac{\\partial^2 ${f}(${args})}{\\partial ${v1}\\partial ${v2}}${right}${close}`
    );
  },

  /**************************************************************************/

  /**
   * Implements the \NewExtensiceProperty macro.
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {string} name        The name of the current macro
   */
  NewExtensiveProperty(parser: TexParser, name: string) {
    const csbase = parser.GetArgument(name);
    const symbol = parser.GetArgument(name);
    TDU.tmsMacros(parser, symbol, csbase);
  },

  /**
   * Implements the \NewPartialMolarProperty macro.
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {string} name        The name of the current macro
   */
  NewPartialMolarProperty(parser: TexParser, name: string) {
    const csbase = parser.GetArgument(name);
    const symbol = parser.GetArgument(name);
    TDU.pmMacro(parser, symbol, csbase);
  },

  /**
   * Implements the \NewExcessProperty macro.
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {string} name        The name of the current macro
   */
  NewExcessProperty(parser: TexParser, name: string) {
    const csbase = parser.GetArgument(name);
    const symbol = parser.GetArgument(name);
    TDU.tmsMacros(parser, symbol, csbase, 'E', '\\excess');
    TDU.pmMacro(parser, symbol, csbase, 'E', '\\excess');
  },

  /**
   * Implements the \NewResidualProperty macro.
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {string} name        The name of the current macro
   */
  NewResidualProperty(parser: TexParser, name: string) {
    const csbase = parser.GetArgument(name);
    const symbol = parser.GetArgument(name);
    TDU.tmsMacros(parser, symbol, csbase, 'E', '\\excess');
    TDU.tmsMacros(parser, symbol, csbase, 'R', '\\residual');
    TDU.pmMacro(parser, symbol, csbase, 'R', '\\residual');
  },

  /**
   * Implements the \NewThermodynamocProperty macro.
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {string} name        The name of the current macro
   */
  NewThermodynamicProperty(parser: TexParser, name: string) {
    const csbase = parser.GetArgument(name);
    const symbol = parser.GetArgument(name);
    TDU.tmsMacros(parser, symbol, csbase);
    TDU.pmMacro(parser, symbol, csbase);
    TDU.tmsMacros(parser, symbol, csbase, 'E', '\\excess');
    TDU.pmMacro(parser, symbol, csbase, 'E', '\\excess');
    TDU.tmsMacros(parser, symbol, csbase, 'R', '\\residual');
    TDU.pmMacro(parser, symbol, csbase, 'R', '\\residual');
  },

  /**************************************************************************/

  /**
   * Implements a subscripted symbol with a subscript prefix.
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {string} name        The name of the current macro
   * @param {string} symbol      The symbol to have super- and subscripts
   * @param {string} subscript   The prefix subscript
   */
  SubscriptedSymbol(
    parser: TexParser,
    name: string,
    symbol: string,
    subscript: string
  ) {
    const [sup, sub] = TDU.getSupSub(
      parser,
      name,
      subscript,
      '',
      '',
      undefined,
      false
    );
    TDU.latex(parser, symbol + sup + sub);
  },

  /**
   * Implements a superscripted symbol with a superscript prefix.
   *
   * @param {TexParser} parser     The active TeX parser
   * @param {string} name          The name of the current macro
   * @param {string} symbol        The symbol to have super- and subscripts
   * @param {string} superscript   The prefix superscript
   */
  SuperscriptedSymbol(
    parser: TexParser,
    name: string,
    symbol: string,
    superscript: string
  ) {
    const [sup, sub] = TDU.getSupSub(
      parser,
      name,
      '',
      superscript,
      undefined,
      '',
      false
    );
    TDU.latex(parser, symbol + sup + sub);
  },

  /**
   * Implements a subscripted parial-molar symbol with a subscript prefix.
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {string} name        The name of the current macro
   * @param {string} symbol      The symbol to have super- and subscripts
   * @param {string} subscript   The prefix subscript
   */
  PartialMolarSubscripted(
    parser: TexParser,
    name: string,
    symbol: string,
    subscript: string
  ) {
    const [sup, sub] = TDU.getSupSub(parser, name, subscript);
    TDU.latex(
      parser,
      `\\mkern2mu\\overline{\\mkern-2mu{${symbol}}${sub}${sup}\\mkern-1mu}\\mkern1mu`
    );
  },

  /**
   * Implements a superscripted partial-molar symbol with a superscript prefix.
   *
   * @param {TexParser} parser     The active TeX parser
   * @param {string} name          The name of the current macro
   * @param {string} symbol        The symbol to have super- and subscripts
   * @param {string} superscript   The prefix superscript
   */
  PartialMolarSuperscripted(
    parser: TexParser,
    name: string,
    symbol: string,
    superscript: string
  ) {
    const [sup, sub] = TDU.getSupSub(parser, name, '', superscript);
    TDU.latex(
      parser,
      TDU.getOption(parser, 'pm-style') === 'long'
        ? `\\mkern2mu\\overline{\\mkern-2mu{${symbol}}${sub}${sup}\\mkern-1mu}\\mkern1mu`
        : `\\mkern2mu\\overline{\\mkern-2mu${symbol}\\mkern-1mu}\\mkern1mu${sub}${sup}`
    );
  },

  /**************************************************************************/

  /**
   * Implements the \Delta macros.
   *
   * @param {TexParser} parser     The active TeX parser
   * @param {string} name          The name of the current macro
   * @param {string} subscript     The subscript prefix, if any
   * @param {string} superscript   The superscript prefix, if any
   */
  ChangeonSomething(
    parser: TexParser,
    name: string,
    subscript: string = null,
    superscript: string = null
  ) {
    const symbol = parser.GetArgument(name);
    const [sup, sub] = TDU.getSupSub(
      parser,
      name,
      subscript,
      superscript,
      '',
      '',
      false
    );
    TDU.latex(parser, `\\Delta ${symbol}${sub}${sup}`);
  },

  /**************************************************************************/

  /**
   * Implement the \ncomponets macro, based on the its current value.
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {string} _name       The name of the current macro
   */
  NComponents(parser: TexParser, _name: string) {
    TDU.latex(parser, TDU.getOption(parser, 'ncomponents'));
  },

  /**
   * Implements the \all.s macros.
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {string} _name       The name of the current macro
   * @param {string} symbol      The symbol for the range
   */
  AllThings(parser: TexParser, _name: string, symbol: string) {
    TDU.latex(
      parser,
      TDU.getOption(parser, 'moles-style') === 'index'
        ? `\\vec{${symbol}}`
        : `${symbol}_1,\\dotsc,${symbol}_{\\ncomponents}`
    );
  },

  /**
   * Implements the \all.sbut macros.
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {string} name        The name of the current macro
   * @param {string} symbol      The symbol for the range
   */
  AllThingsExcept(parser: TexParser, name: string, symbol: string) {
    const otherindex = parser.GetBrackets(name, 'j');
    const index = parser.GetArgument(name);
    symbol ??= parser.GetArgument(name);
    const ncomponents = TDU.getOption(parser, 'ncomponents');
    const tex =
      TDU.getOption(parser, 'moles-style') === 'index'
        ? index === 'j' && otherindex === 'j'
          ? `${symbol}_{k \\neq ${index}}`
          : `${symbol}_{${otherindex} \\neq ${index}}`
        : index === '1'
          ? `${symbol}_2,\\dotsc,${symbol}_{\\ncomponents}`
          : index === ncomponents || index === '\\ncomponents'
            ? `${symbol}_1,\\dotsc,${symbol}_{\\ncomponents-1}`
            : `${symbol}_1,\\dotsc,[${symbol}_{${index}}],\\dotsc,${symbol}_{\\ncomponents}`;
    TDU.latex(parser, tex);
  },

  /**
   * Implements the \all.sbutLstAnd macros.
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {string} name        The name of the current macro
   * @param {string} symbol      The symbol for the range
   */
  AllThingsExceptLastAnd(parser: TexParser, name: string, symbol: string) {
    const otherindex = parser.GetBrackets(name, 'j');
    const index = parser.GetArgument(name);
    symbol ??= parser.GetArgument(name);
    const ncomponents = TDU.getOption(parser, 'ncomponents');
    const tex =
      TDU.getOption(parser, 'moles-style') === 'index'
        ? index == 'j' && otherindex == 'j'
          ? `${symbol}_{k \\neq ${index},\\ncomponents}`
          : index === ncomponents || index === '\\ncomponents'
            ? `${symbol}_{${otherindex}\\neq ${index}}`
            : `${symbol}_{${otherindex}\\neq ${index},\\ncomponents}`
        : index === '1'
          ? `${symbol}_2,\\dotsc,${symbol}_{\\ncomponents-1}`
          : index === ncomponents || index === '\\ncomponents'
            ? `${symbol}_1,\\dotsc,${symbol}_{\\ncomponents-1}`
            : index.replace(/ /g, '') === `\\ncomponents-1` ||
                index.replace(/ /g, '') === '\\ncomponents-1'
              ? `${symbol}_1,\\dotsc,${symbol}_{\\ncomponents-2}`
              : `${symbol}_1,\\dotsc,[${symbol}_{${index}}],\\dotsc,${symbol}_{\\ncomponents-1}`;
    TDU.latex(parser, tex);
  },

  /**
   * Locally changes the moles-style option within an environment.
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {StackItem} begin    The StackItem that starts an environment
   *                             (which contains a new `stack.env` that disappears
   *                              after the environment is ended)
   * @param {string} style       The name of the temporary moles style to use
   */
  LocalMolesStyle(parser: TexParser, begin: StackItem, style: string) {
    parser.Push(begin);
    TDU.setOption(parser, 'moles-style', style);
  },

  /**************************************************************************/

  /**
   * Implements the Jacobian macros.
   *
   * @param {TexParser} parser   The active TeX parser
   * @param {string} name        The name of the current macro
   * @param {string} env         The environment used to wrap the Jacobian
   */
  JacobianMatrix(parser: TexParser, name: string, env: string = 'matrix') {
    const optional = parser.GetBrackets(name, '');
    const space = parser.GetBrackets(name, '1ex');
    const numerator = parser.GetArgument(name).replace(/ /g, '');
    const denominator = parser.GetArgument(name).replace(/ /g, '');
    const numarray = numerator.split(',');
    const denarray = denominator.split(',');
    const rows = [];
    if (numarray.includes('\\dots')) {
      // handle three arguments with \dots in the middle
      // find which symbols we are working with
      const f = numarray[0].split(/_/)[0];
      const [v, m] = denarray[2].split(/_/);
      TDU.setOption(parser, 'ncomponents', m);
      rows.push(
        [
          `\\Partial{${f}_1}{${v}_1}{\\allbut{1}{${v}}}`,
          '\\dots',
          `\\Partial{${f}_1}{${v}_${m}}{\\allbut{${m}}{${v}}}`,
        ].join(' & '),
        '\\vdots & \\ddots & \\vdots',
        [
          `\\Partial{${f}_{${m}}}{${v}_1}{\\allbut{1}{${v}}}`,
          '\\dots',
          `\\Partial{${f}_{${m}}}{${v}_{${m}}}{\\allbut{${m}}{${v}}}`,
        ].join(' & ')
      );
    } else {
      for (const num of numarray) {
        const cols = [];
        for (let i = 0; i < denarray.length; ++i) {
          const constant = [...denarray];
          constant.splice(i, 1);
          cols.push(
            `${optional}\\Partial{${num}}{${denarray[i]}}{${constant.join(',')}}`
          );
        }
        rows.push(cols.join('&'));
      }
    }
    const table = `\\begin{${env}}${rows.join('\\\\' + (space ? `[${space}]` : ''))}\\end{${env}}`;
    TDU.latex(parser, table);
  },

  /**************************************************************************/

  Macro: BaseMethods.Macro,

  /**************************************************************************/
};
