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
 * @file Methods for TeX parsing of the physics package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { HandlerType } from '../HandlerTypes.js';
import { ParseMethod, ParseResult } from '../Types.js';
import BaseMethods from '../base/BaseMethods.js';
import TexParser from '../TexParser.js';
import TexError from '../TexError.js';
import { TEXCLASS, MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { ParseUtil } from '../ParseUtil.js';
import NodeUtil from '../NodeUtil.js';
import { NodeFactory } from '../NodeFactory.js';
import { Macro } from '../Token.js';
import { AutoOpen } from './PhysicsItems.js';

/**
 * Pairs open and closed fences.
 *
 * @type {{[fence: string]: string}}
 */
const pairs: { [fence: string]: string } = {
  '(': ')',
  '[': ']',
  '{': '}',
  '|': '|',
};

/**
 * Regular expression for matching big fence arguments.
 *
 * @type {RegExp}
 */
const biggs: RegExp = /^(b|B)i(g{1,2})$/;

const latinCap: [number, number] = [0x41, 0x5a];
const latinSmall: [number, number] = [0x61, 0x7a];
const greekCap: [number, number] = [0x391, 0x3a9];
const greekSmall: [number, number] = [0x3b1, 0x3c9];
const digits: [number, number] = [0x30, 0x39];

/**
 * Checks if a value is in a given numerical interval.
 *
 * @param {number} value The value.
 * @param {[number, number]} range The closed interval.
 * @returns {boolean} True if in given range.
 */
function inRange(value: number, range: [number, number]): boolean {
  return value >= range[0] && value <= range[1];
}

/**
 * Method to create a token for the vector commands. It creates a vector token
 * with the specific vector font (e.g., bold) in case it is a Latin or capital
 * Greek character, accent or small Greek character if command is starred. This
 * is a replacement for the original token method in the node factory.
 *
 * @param {NodeFactory} factory The current node factory.
 * @param {string} kind The type of token to create.
 * @param {any} def The attributes for the node.
 * @param {string} text The text contained in the token node.
 * @returns {MmlNode} The newly create token node.
 */
function createVectorToken(
  factory: NodeFactory,
  kind: string,
  def: any,
  text: string
): MmlNode {
  const parser = factory.configuration.parser;
  const token = NodeFactory.createToken(factory, kind, def, text);
  const code: number = text.codePointAt(0);
  if (
    text.length === 1 &&
    !parser.stack.env.font &&
    parser.stack.env.vectorFont &&
    (inRange(code, latinCap) ||
      inRange(code, latinSmall) ||
      inRange(code, greekCap) ||
      inRange(code, digits) ||
      (inRange(code, greekSmall) && parser.stack.env.vectorStar) ||
      NodeUtil.getAttribute(token, 'accent'))
  ) {
    NodeUtil.setAttribute(token, 'mathvariant', parser.stack.env.vectorFont);
  }
  return token;
}

/**
 * Computes the application of a vector operation.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} kind The type of stack item to parse the operator into.
 * @param {string} name The macro name.
 * @param {string} operator The operator expression.
 * @param {string[]} fences List of opening fences that should be
 *     automatically sized and paired to its corresponding closing fence.
 */
function vectorApplication(
  parser: TexParser,
  kind: string,
  name: string,
  operator: string,
  fences: string[]
) {
  const op = new TexParser(
    operator,
    parser.stack.env,
    parser.configuration
  ).mml();
  parser.Push(parser.itemFactory.create(kind, op));
  const left = parser.GetNext();
  const right = pairs[left];
  if (!right) {
    return;
  }
  let lfence = '',
    rfence = '',
    arg = '';
  const enlarge = fences.includes(left);
  if (left === '{') {
    arg = parser.GetArgument(name);
    lfence = enlarge ? '\\left\\{' : '';
    rfence = enlarge ? '\\right\\}' : '';
    const macro = `${lfence} ${arg} ${rfence}`;
    parser.string = macro + parser.string.slice(parser.i);
    parser.i = 0;
    return;
  }
  if (!enlarge) {
    return;
  }
  parser.i++;
  parser.Push(
    parser.itemFactory
      .create('auto open')
      .setProperties({ open: left, close: right })
  );
}

/**
 * Generates the expanded braket LaTeX code for matrix operations.
 *
 * @param {string[]} args The three braket arguments.
 * @param {string} args.arg1 The left braket argument.
 * @param {string} args.arg2 The middle braket argument.
 * @param {string} args.arg3 The right braket argument.
 * @param {boolean} star1 No automatic sizing of fences.
 * @param {boolean} star2 Automatic sizing of fences wrt. to arg1 & arg3 only.
 * @returns {string} The expanded macro.
 */
function outputBraket(
  [arg1, arg2, arg3]: [string, string, string],
  star1: boolean,
  star2: boolean
): string {
  return star1 && star2
    ? `\\left\\langle{${arg1}}\\middle\\vert{${arg2}}\\middle\\vert{${arg3}}\\right\\rangle`
    : star1
      ? `\\langle{${arg1}}\\vert{${arg2}}\\vert{${arg3}}\\rangle`
      : `\\left\\langle{${arg1}}\\right\\vert{${arg2}}\\left\\vert{${arg3}}\\right\\rangle`;
}

/**
 * Creates the a (anti)diagonal matrix string.
 *
 * @param {string[]} elements The elements on the diagonal.
 * @param {boolean} anti True if constructing anti-diagonal matrix.
 * @returns {string} The expanded macro.
 */
function makeDiagMatrix(elements: string[], anti: boolean): string {
  const length = elements.length;
  const matrix = [];
  for (let i = 0; i < length; i++) {
    matrix.push(
      Array(anti ? length - i : i + 1).join('&') + `\\mqty{${elements[i]}}`
    );
  }
  return matrix.join('\\\\ ');
}

const PhysicsMethods: { [key: string]: ParseMethod } = {
  /***********************
   * Physics package section 2.1
   * Automatic bracing
   */

  /**
   * Automatic sizing of fences, e.g., \\qty(x). Some with content.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {string=} open Opening fence.
   * @param {string=} close Closing fence.
   * @param {boolean=} arg Fences contain an argument.
   * @param {string=} named Name operator.
   * @param {string=} variant A font for the mathvariant.
   */
  Quantity(
    parser: TexParser,
    name: string,
    open: string = '(',
    close: string = ')',
    arg: boolean = false,
    named: string = '',
    variant: string = ''
  ) {
    const star = arg ? parser.GetStar() : false;
    let next = parser.GetNext();
    const position = parser.i;
    let big = null;
    if (next === '\\') {
      parser.i++;
      big = parser.GetCS();
      if (!big.match(biggs)) {
        // empty
        const empty = parser.create('node', 'mrow');
        parser.Push(ParseUtil.fenced(parser.configuration, open, empty, close));
        parser.i = position;
        return;
      }
      next = parser.GetNext();
    }
    let right = pairs[next];
    if (arg && next !== '{') {
      throw new TexError(
        'MissingArgFor',
        'Missing argument for %1',
        parser.currentCS
      );
    }
    if (!right) {
      const empty = parser.create('node', 'mrow');
      parser.Push(ParseUtil.fenced(parser.configuration, open, empty, close));
      parser.i = position;
      return;
    }
    // Get the fences
    if (named) {
      const mml = parser.create(
        'token',
        'mi',
        { texClass: TEXCLASS.OP },
        named
      );
      if (variant) {
        NodeUtil.setAttribute(mml, 'mathvariant', variant);
      }
      parser.Push(parser.itemFactory.create('fn', mml));
    }
    if (next === '{') {
      let argument = parser.GetArgument(name);
      next = arg ? open : '\\{';
      right = arg ? close : '\\}';
      // TODO: Make all these fenced expressions.
      argument = star
        ? `${next} ${argument} ${right}`
        : big
          ? `\\${big}l${next} ${argument} \\${big}r${right}`
          : `\\left${next} ${argument} \\right${right}`;
      parser.Push(
        new TexParser(argument, parser.stack.env, parser.configuration).mml()
      );
      return;
    }
    parser.i++;
    parser.Push(
      parser.itemFactory
        .create('auto open')
        .setProperties({ open: next, close: right, big: big })
    );
  },

  /**
   * The evaluate macro.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  Eval(parser: TexParser, name: string) {
    const star = parser.GetStar();
    const next = parser.GetNext();
    if (next === '(' || next === '[') {
      parser.i++;
      parser.Push(
        parser.itemFactory.create('auto open').setProperties({
          open: next,
          close: '|',
          smash: star,
          right: '\\vphantom{\\int}',
        })
      );
      return;
    }
    let replace = '\\left.\\vphantom{\\int}\\right|';
    if (next === '{') {
      const arg = parser.GetArgument(name);
      replace = `\\left.${star ? `\\smash{${arg}}` : arg}\\vphantom{\\int}\\right|`;
    }
    parser.string =
      parser.string.substring(0, parser.i) +
      replace +
      parser.string.slice(parser.i);
  },

  /**
   * The anti/commutator and poisson macros.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {string=} open Opening fence.
   * @param {string=} close Closing fence.
   */
  Commutator(
    parser: TexParser,
    name: string,
    open: string = '[',
    close: string = ']'
  ) {
    const star = parser.GetStar();
    let next = parser.GetNext();
    let big = null;
    if (next === '\\') {
      parser.i++;
      big = parser.GetCS();
      if (!big.match(biggs)) {
        // Actually a commutator error arg1 error.
        throw new TexError(
          'MissingArgFor',
          'Missing argument for %1',
          parser.currentCS
        );
      }
      next = parser.GetNext();
    }
    if (next !== '{') {
      throw new TexError(
        'MissingArgFor',
        'Missing argument for %1',
        parser.currentCS
      );
    }
    const arg1 = parser.GetArgument(name);
    const arg2 = parser.GetArgument(name);
    let argument = arg1 + ',' + arg2;
    argument = star
      ? `${open} ${argument} ${close}`
      : big
        ? `\\${big}l${open} ${argument} \\${big}r${close}`
        : `\\left${open} ${argument} \\right${close}`;
    parser.Push(
      new TexParser(argument, parser.stack.env, parser.configuration).mml()
    );
  },

  /***********************
   * Physics package section 2.2
   * Vector notation
   */

  /**
   * Bold vector notation.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  VectorBold(parser: TexParser, name: string) {
    const star = parser.GetStar();
    const arg = parser.GetArgument(name);
    const oldToken = parser.configuration.nodeFactory.get('token');
    const oldFont = parser.stack.env.font;
    delete parser.stack.env.font;
    parser.configuration.nodeFactory.set('token', createVectorToken);
    parser.stack.env.vectorFont = star ? 'bold-italic' : 'bold';
    parser.stack.env.vectorStar = star;
    const node = new TexParser(
      arg,
      parser.stack.env,
      parser.configuration
    ).mml();
    if (oldFont) {
      parser.stack.env.font = oldFont;
    }
    delete parser.stack.env.vectorFont;
    delete parser.stack.env.vectorStar;
    parser.configuration.nodeFactory.set('token', oldToken);
    parser.Push(node);
  },

  /**
   * Macros that can have an optional star which is propagated.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {number} argcount Number of arguments.
   * @param {string[]} parts List of parts from which to assemble the macro.
   *     If the original command is starred, a star will be injected at each part.
   */
  StarMacro(
    parser: TexParser,
    name: string,
    argcount: number,
    ...parts: string[]
  ) {
    const star = parser.GetStar();
    const args: string[] = [];
    if (argcount) {
      for (let i = args.length; i < argcount; i++) {
        args.push(parser.GetArgument(name));
      }
    }
    let macro = parts.join(star ? '*' : '');
    macro = ParseUtil.substituteArgs(parser, args, macro);
    parser.string = ParseUtil.addArgs(
      parser,
      macro,
      parser.string.slice(parser.i)
    );
    parser.i = 0;
    ParseUtil.checkMaxMacros(parser);
  },

  /**
   * An operator that needs to be parsed (e.g., a Greek letter or nabla) and
   * applied to a possibly fenced expression. By default automatic fences are
   * parentheses and brakets, with braces being ignored.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {string} operator The operator expression.
   * @param {string[]} fences List of opening fences that should be
   *     automatically sized and paired to its corresponding closing fence.
   */
  OperatorApplication(
    parser: TexParser,
    name: string,
    operator: string,
    ...fences: string[]
  ) {
    vectorApplication(parser, 'fn', name, operator, fences);
  },

  /**
   * A vector operator that needs to be parsed (e.g., a Greek letter or nabla with
   * a crossproduct) and connected to a possibly fenced expression. By default
   * automatic fences are parentheses and brakets.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {string} operator The operator expression.
   * @param {string[]} fences List of opening fences that should be
   *     automatically sized and paired to its corresponding closing fence.
   */
  VectorOperator(
    parser: TexParser,
    name: string,
    operator: string,
    ...fences: string[]
  ) {
    vectorApplication(parser, 'mml', name, operator, fences);
  },

  /***********************
   * Physics package section 2.3
   * Operators
   */

  /**
   * Operator expression with automatic fences and optional exponent.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {boolean=} opt Set to false if no optional exponent is allowed.
   * @param {string=} id The name of the function if different from name.
   */
  Expression(
    parser: TexParser,
    name: string,
    opt: boolean = true,
    id: string = ''
  ) {
    id = id || name.slice(1);
    const exp = opt ? parser.GetBrackets(name) : null;
    let mml = parser.create('token', 'mi', { texClass: TEXCLASS.OP }, id);
    if (exp) {
      const sup = new TexParser(
        exp,
        parser.stack.env,
        parser.configuration
      ).mml();
      mml = parser.create('node', 'msup', [mml, sup]);
    }
    parser.Push(parser.itemFactory.create('fn', mml));
    if (parser.GetNext() !== '(') {
      return;
    }
    parser.i++;
    parser.Push(
      parser.itemFactory
        .create('auto open')
        .setProperties({ open: '(', close: ')' })
    );
  },

  /***********************
   * Physics package section 2.4
   * Quick quad text
   */

  /**
   * Quad text macros.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {string} text The text that is to be padded with quad spaces.
   */
  Qqtext(parser: TexParser, name: string, text: string) {
    const star = parser.GetStar();
    const arg = text ? text : parser.GetArgument(name);
    const replace = (star ? '' : '\\quad') + '\\text{' + arg + '}\\quad ';
    parser.string =
      parser.string.slice(0, parser.i) +
      replace +
      parser.string.slice(parser.i);
  },

  /***********************
   * Physics package section 2.5
   * Derivatives
   */

  /**
   * The differential and variation macros.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {string} op The operator. It will be parsed.
   */
  Differential(parser: TexParser, name: string, op: string) {
    const optArg = parser.GetBrackets(name);
    const power = optArg != null ? '^{' + optArg + '}' : ' ';
    const parens = parser.GetNext() === '(';
    const braces = parser.GetNext() === '{';
    let macro = op + power;
    if (!(parens || braces)) {
      macro += parser.GetArgument(name, true) || '';
      const mml = new TexParser(
        macro,
        parser.stack.env,
        parser.configuration
      ).mml();
      parser.Push(mml);
      return;
    }
    if (braces) {
      macro += parser.GetArgument(name);
      const mml = new TexParser(
        macro,
        parser.stack.env,
        parser.configuration
      ).mml();
      parser.Push(
        parser.create('node', 'TeXAtom', [mml], { texClass: TEXCLASS.OP })
      );
      return;
    }
    parser.Push(
      new TexParser(macro, parser.stack.env, parser.configuration).mml()
    );
    parser.i++;
    parser.Push(
      parser.itemFactory
        .create('auto open')
        .setProperties({ open: '(', close: ')' })
    );
  },

  /**
   * The derivative macro. Its behaviour depends on the number of arguments
   * provided. In case of
   * 1 argument: will be part of the denominator.
   * 2 arguments: argument one is numerator, argument two is denominator.
   * 3+ arguments: arguments above 2 will be part of the denominator and the
   * exponent of the enumerator will depend on the number of denominator
   * arguments. In particular, the optional exponent argument will be ignored!
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {number} argMax The maximum number of arguments for the macro.
   * @param {string} op The derivative operator.
   */
  Derivative(parser: TexParser, name: string, argMax: number, op: string) {
    const star = parser.GetStar();
    const optArg = parser.GetBrackets(name);
    let argCounter = 1;
    const args = [];
    args.push(parser.GetArgument(name));
    while (parser.GetNext() === '{' && argCounter < argMax) {
      args.push(parser.GetArgument(name));
      argCounter++;
    }
    let ignore = false;
    let power1 = ' ';
    let power2 = ' ';
    if (argMax > 2 && args.length > 2) {
      power1 = '^{' + (args.length - 1) + '}';
      ignore = true;
    } else if (optArg != null) {
      if (argMax > 2 && args.length > 1) {
        ignore = true;
      }
      power1 = `^{${optArg}}`;
      power2 = power1;
    }
    const frac = star ? '\\flatfrac' : '\\frac';
    const first = args.length > 1 ? args[0] : '';
    const second = args.length > 1 ? args[1] : args[0];
    let rest = '';
    for (let i = 2, arg; (arg = args[i]); i++) {
      rest += op + ' ' + arg;
    }
    const macro = `${frac}{${op}${power1}${first}}{${op} ${second}${power2} ${rest}}`;
    parser.Push(
      new TexParser(macro, parser.stack.env, parser.configuration).mml()
    );
    if (parser.GetNext() === '(') {
      parser.i++;
      parser.Push(
        parser.itemFactory
          .create('auto open')
          .setProperties({ open: '(', close: ')', ignore: ignore })
      );
    }
  },

  /***********************
   * Physics package section 2.6
   * Dirac bra-ket notation
   */

  /**
   * The bra macro.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  Bra(parser: TexParser, name: string) {
    const starBra = parser.GetStar();
    const bra = parser.GetArgument(name);
    let ket = '';
    let hasKet = false;
    let starKet = false;
    if (parser.GetNext() === '\\') {
      let saveI = parser.i;
      parser.i++;
      // This ensures that bra-ket also works if \let bound versions of \ket.
      const cs = parser.GetCS();
      const token = parser.lookup(HandlerType.MACRO, cs) as Macro;
      if (token && token.token === 'ket') {
        hasKet = true;
        saveI = parser.i;
        starKet = parser.GetStar();
        if (parser.GetNext() === '{') {
          ket = parser.GetArgument(cs, true);
        } else {
          parser.i = saveI;
          starKet = false;
        }
      } else {
        parser.i = saveI;
      }
    }
    let macro = '';
    if (hasKet) {
      macro =
        starBra || starKet
          ? `\\langle{${bra}}\\vert{${ket}}\\rangle`
          : `\\left\\langle{${bra}}\\middle\\vert{${ket}}\\right\\rangle`;
    } else {
      macro = starBra
        ? `\\langle{${bra}}\\vert`
        : `\\left\\langle{${bra}}\\right\\vert{${ket}}`;
    }
    parser.Push(
      new TexParser(macro, parser.stack.env, parser.configuration).mml()
    );
  },

  /**
   * The ket macro.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  Ket(parser: TexParser, name: string) {
    const star = parser.GetStar();
    const ket = parser.GetArgument(name);
    const macro = star
      ? `\\vert{${ket}}\\rangle`
      : `\\left\\vert{${ket}}\\right\\rangle`;
    parser.Push(
      new TexParser(macro, parser.stack.env, parser.configuration).mml()
    );
  },

  /**
   * The braket macro.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  BraKet(parser: TexParser, name: string) {
    const star = parser.GetStar();
    const bra = parser.GetArgument(name);
    let ket = null;
    if (parser.GetNext() === '{') {
      ket = parser.GetArgument(name, true);
    }
    let macro = '';
    if (ket == null) {
      macro = star
        ? `\\langle{${bra}}\\vert{${bra}}\\rangle`
        : `\\left\\langle{${bra}}\\middle\\vert{${bra}}\\right\\rangle`;
    } else {
      macro = star
        ? `\\langle{${bra}}\\vert{${ket}}\\rangle`
        : `\\left\\langle{${bra}}\\middle\\vert{${ket}}\\right\\rangle`;
    }
    parser.Push(
      new TexParser(macro, parser.stack.env, parser.configuration).mml()
    );
  },

  /**
   * The ketbra macro.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  KetBra(parser: TexParser, name: string) {
    const star = parser.GetStar();
    const ket = parser.GetArgument(name);
    let bra = null;
    if (parser.GetNext() === '{') {
      bra = parser.GetArgument(name, true);
    }
    let macro = '';
    if (bra == null) {
      macro = star
        ? `\\vert{${ket}}\\rangle\\!\\langle{${ket}}\\vert`
        : `\\left\\vert{${ket}}\\middle\\rangle\\!\\middle\\langle{${ket}}\\right\\vert`;
    } else {
      macro = star
        ? `\\vert{${ket}}\\rangle\\!\\langle{${bra}}\\vert`
        : `\\left\\vert{${ket}}\\middle\\rangle\\!\\middle\\langle{${bra}}\\right\\vert`;
    }
    parser.Push(
      new TexParser(macro, parser.stack.env, parser.configuration).mml()
    );
  },

  /**
   * The expectation value macro.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  Expectation(parser: TexParser, name: string) {
    const star1 = parser.GetStar();
    const star2 = star1 && parser.GetStar();
    const arg1 = parser.GetArgument(name);
    let arg2 = null;
    if (parser.GetNext() === '{') {
      arg2 = parser.GetArgument(name, true);
    }
    const macro =
      arg1 && arg2
        ? outputBraket([arg2, arg1, arg2], star1, star2)
        : // Braces for semantics, similar to braket package.
          star1
          ? `\\langle {${arg1}} \\rangle`
          : `\\left\\langle {${arg1}} \\right\\rangle`;
    parser.Push(
      new TexParser(macro, parser.stack.env, parser.configuration).mml()
    );
  },

  /**
   * The matrix element macro.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  MatrixElement(parser: TexParser, name: string) {
    const star1 = parser.GetStar();
    const star2 = star1 && parser.GetStar();
    const arg1 = parser.GetArgument(name);
    const arg2 = parser.GetArgument(name);
    const arg3 = parser.GetArgument(name);
    const macro = outputBraket([arg1, arg2, arg3], star1, star2);
    parser.Push(
      new TexParser(macro, parser.stack.env, parser.configuration).mml()
    );
  },

  /********************
   * Physics package Section 2.7
   * Matrix macros
   */
  /**
   * The matrix quantity macro.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {boolean=} small Use small matrix.
   */
  MatrixQuantity(parser: TexParser, name: string, small?: boolean) {
    const star = parser.GetStar();
    const next = parser.GetNext();
    const array = small ? 'smallmatrix' : 'array';
    let arg = '';
    let open = '';
    let close = '';
    switch (next) {
      case '{':
        arg = parser.GetArgument(name);
        break;
      case '(':
        parser.i++;
        open = star ? '\\lgroup' : '(';
        close = star ? '\\rgroup' : ')';
        arg = parser.GetUpTo(name, ')');
        break;
      case '[':
        parser.i++;
        open = '[';
        close = ']';
        arg = parser.GetUpTo(name, ']');
        break;
      case '|':
        parser.i++;
        open = '|';
        close = '|';
        arg = parser.GetUpTo(name, '|');
        break;
      default:
        open = '(';
        close = ')';
        break;
    }
    const macro =
      (open ? '\\left' : '') +
      `${open}\\begin{${array}}{} ${arg}\\end{${array}}` +
      (open ? '\\right' : '') +
      close;
    parser.Push(
      new TexParser(macro, parser.stack.env, parser.configuration).mml()
    );
  },

  /**
   * Generation of identity matrices.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  IdentityMatrix(parser: TexParser, name: string) {
    const arg = parser.GetArgument(name);
    const size = parseInt(arg, 10);
    if (isNaN(size)) {
      throw new TexError('InvalidNumber', 'Invalid number');
    }
    if (size <= 1) {
      parser.string = '1' + parser.string.slice(parser.i);
      parser.i = 0;
      return;
    }
    const zeros = Array(size).fill('0');
    const columns = [];
    for (let i = 0; i < size; i++) {
      const row = zeros.slice();
      row[i] = '1';
      columns.push(row.join(' & '));
    }
    parser.string = columns.join('\\\\ ') + parser.string.slice(parser.i);
    parser.i = 0;
  },

  /**
   * Generation of matrices with fixed value.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  XMatrix(parser: TexParser, name: string) {
    const star = parser.GetStar();
    const arg1 = parser.GetArgument(name);
    const arg2 = parser.GetArgument(name);
    const arg3 = parser.GetArgument(name);
    let n = parseInt(arg2, 10);
    let m = parseInt(arg3, 10);
    if (
      isNaN(n) ||
      isNaN(m) ||
      m.toString() !== arg3 ||
      n.toString() !== arg2
    ) {
      throw new TexError('InvalidNumber', 'Invalid number');
    }
    n = n < 1 ? 1 : n;
    m = m < 1 ? 1 : m;
    // Elements
    if (!star) {
      const row = Array(m).fill(arg1).join(' & ');
      const matrix = Array(n).fill(row).join('\\\\ ');
      parser.string = matrix + parser.string.slice(parser.i);
      parser.i = 0;
      return;
    }
    let matrix = '';
    if (n === 1 && m === 1) {
      // Case 1: n=m=1, no index.
      matrix = arg1;
    } else if (n === 1) {
      // Case 2: n=1, row vector, single index.
      const row = [];
      for (let i = 1; i <= m; i++) {
        row.push(`${arg1}_{${i}}`);
      }
      matrix = row.join(' & ');
    } else if (m === 1) {
      // Case 3: m=1, column vector, single index.
      const row = [];
      for (let i = 1; i <= n; i++) {
        row.push(`${arg1}_{${i}}`);
      }
      matrix = row.join('\\\\ ');
    } else {
      // Case 4: matrix, double index. Note the extra mrows for indices.
      const rows = [];
      for (let i = 1; i <= n; i++) {
        const row = [];
        for (let j = 1; j <= m; j++) {
          row.push(`${arg1}_{{${i}}{${j}}}`);
        }
        rows.push(row.join(' & '));
      }
      matrix = rows.join('\\\\ ');
    }
    parser.string = matrix + parser.string.slice(parser.i);
    parser.i = 0;
    return;
  },

  /**
   * Generation of Pauli matrices. Matrix 0 is the 2x2 identity.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  PauliMatrix(parser: TexParser, name: string) {
    const arg = parser.GetArgument(name);
    let matrix = arg.slice(1);
    switch (arg[0]) {
      case '0':
        matrix += ' 1 & 0\\\\ 0 & 1';
        break;
      case '1':
      case 'x':
        matrix += ' 0 & 1\\\\ 1 & 0';
        break;
      case '2':
      case 'y':
        matrix += ' 0 & -i\\\\ i & 0';
        break;
      case '3':
      case 'z':
        matrix += ' 1 & 0\\\\ 0 & -1';
        break;
      default:
    }
    parser.string = matrix + parser.string.slice(parser.i);
    parser.i = 0;
  },

  /**
   * Generation of anti/diagonal matrices.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {boolean=} anti True if constructing anti-diagonal matrix.
   */
  DiagonalMatrix(parser: TexParser, name: string, anti?: boolean) {
    if (parser.GetNext() !== '{') {
      return;
    }
    const startI = parser.i;
    /* let arg =*/ parser.GetArgument(name);
    const endI = parser.i;
    parser.i = startI + 1;
    const elements = [];
    let element = '';
    let currentI = parser.i;
    while (currentI < endI) {
      try {
        element = parser.GetUpTo(name, ',');
      } catch (_e) {
        parser.i = endI;
        elements.push(parser.string.slice(currentI, endI - 1));
        break;
      }
      currentI = parser.i;
      elements.push(element);
    }
    parser.string = makeDiagMatrix(elements, anti) + parser.string.slice(endI);
    parser.i = 0;
  },

  /**
   * Closes an automatic fence if one was opened.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} fence The fence.
   * @param {number} texclass The TeX class.
   * @returns {ParseResult} The parse result.
   */
  AutoClose(parser: TexParser, fence: string, texclass: number): ParseResult {
    //
    // Get the top item, skipping an \over item, if there is one.
    //
    let top = parser.stack.Top();
    if (top.isKind('over')) {
      top = parser.stack.Top(2);
    }
    //
    //  If the top isn't an AutoOpen, or this isn't its closing fence,
    //    then process the fence as a normal character
    //
    if (!top.isKind('auto open') || !(top as AutoOpen).closing(fence)) {
      return false;
    }
    //
    // Close any open \over items, then push the mo for the fence.
    //
    const mo = parser.create('token', 'mo', { texClass: texclass }, fence);
    parser.Push(
      parser.itemFactory
        .create('close')
        .setProperties({ 'pre-autoclose': true })
    );
    parser.Push(
      parser.itemFactory.create('mml', mo).setProperties({ autoclose: true })
    );
    return true;
  },

  /**
   * Generates the vector nabla depending on the arrowdel option.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _name The macro name.
   * @returns {ParseResult} The parse result.
   */
  Vnabla(parser: TexParser, _name: string): ParseResult {
    const argument = parser.options.physics.arrowdel
      ? '\\vec{\\gradientnabla}'
      : '{\\gradientnabla}';
    return parser.Push(
      new TexParser(argument, parser.stack.env, parser.configuration).mml()
    );
  },

  /**
   * Generates the differential d depending on the italicdiff option.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _name The macro name.
   * @returns {ParseResult} The parse result.
   */
  DiffD(parser: TexParser, _name: string): ParseResult {
    const argument = parser.options.physics.italicdiff ? 'd' : '{\\rm d}';
    return parser.Push(
      new TexParser(argument, parser.stack.env, parser.configuration).mml()
    );
  },

  Macro: BaseMethods.Macro,
  NamedFn: BaseMethods.NamedFn,
  Array: BaseMethods.Array,
};

export default PhysicsMethods;
