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
 * @file The Basic Parse methods.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { HandlerType } from '../HandlerTypes.js';
import * as sitem from './BaseItems.js';
import { StackItem, EnvList } from '../StackItem.js';
import { Macro } from '../Token.js';
import { ParseResult, ParseMethod } from '../Types.js';
import NodeUtil from '../NodeUtil.js';
import TexError from '../TexError.js';
import TexParser from '../TexParser.js';
import { TexConstant } from '../TexConstants.js';
import { ParseUtil } from '../ParseUtil.js';
import { UnitUtil } from '../UnitUtil.js';
import { PropertyList } from '../../../core/Tree/Node.js';
import { MmlNode, TEXCLASS } from '../../../core/MmlTree/MmlNode.js';
import { MmlMo } from '../../../core/MmlTree/MmlNodes/mo.js';
import { MmlMsubsup } from '../../../core/MmlTree/MmlNodes/msubsup.js';
import { MmlMunderover } from '../../../core/MmlTree/MmlNodes/munderover.js';
import { Label } from '../Tags.js';
import { em } from '../../../util/lengths.js';
import { entities } from '../../../util/Entities.js';
import { lookup } from '../../../util/Options.js';
import { ColumnState } from '../ColumnParser.js';
import { replaceUnicode } from '../../../util/string.js';

const P_HEIGHT = 1.2 / 0.85; // cmex10 height plus depth over .85
const MmlTokenAllow: { [key: string]: number } = {
  fontfamily: 1,
  fontsize: 1,
  fontweight: 1,
  fontstyle: 1,
  color: 1,
  background: 1,
  id: 1,
  class: 1,
  href: 1,
  style: 1,
};

/**
 * @param {string} align   The vertical aligment to use (t, b, m or c)
 * @param {number} n       The number of expected alignment characters
 * @returns {string} String with space separated alignment characters
 */
export function splitAlignArray(align: string, n: number = Infinity): string {
  const list = align
    .replace(/\s+/g, '')
    .split('')
    .map((s: string) => {
      const name = { t: 'top', b: 'bottom', m: 'middle', c: 'center' }[s];
      if (!name) {
        throw new TexError(
          'BadBreakAlign',
          'Invalid alignment character: %1',
          s
        );
      }
      return name;
    });
  if (list.length > n) {
    throw new TexError(
      'TooManyAligns',
      'Too many alignment characters: %1',
      align
    );
  }
  return n === 1 ? list[0] : list.join(' ');
}

/**
 * Parse a general root.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} n The index of the root.
 * @returns {MmlNode} The node with the parsed root.
 */
function parseRoot(parser: TexParser, n: string): MmlNode {
  // @test General Root, Explicit Root
  const env = parser.stack.env;
  const inRoot = env['inRoot'];
  env['inRoot'] = true;
  const newParser = new TexParser(n, env, parser.configuration);
  let node = newParser.mml();
  const global = newParser.stack.global;
  if (global['leftRoot'] || global['upRoot']) {
    // @test Tweaked Root
    const def: EnvList = {};
    if (global['leftRoot']) {
      def['width'] = global['leftRoot'];
    }
    if (global['upRoot']) {
      def['voffset'] = global['upRoot'];
      def['height'] = global['upRoot'];
    }
    node = parser.create('node', 'mpadded', [node], def);
  }
  env['inRoot'] = inRoot;
  return node;
}

/**
 * Handle LaTeX tokens.
 */
const BaseMethods: { [key: string]: ParseMethod } = {
  /**
   * Handle {
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _c The parsed character.
   */
  Open(parser: TexParser, _c: string) {
    // @test Identifier Font, Prime, Prime with subscript
    parser.Push(parser.itemFactory.create('open'));
  },

  /**
   * Handle }
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _c The parsed character.
   */
  Close(parser: TexParser, _c: string) {
    // @test Identifier Font, Prime, Prime with subscript
    parser.Push(parser.itemFactory.create('close'));
  },

  /**
   * Handle |
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} c The parsed character.
   */
  Bar(parser: TexParser, c: string) {
    parser.Push(
      parser.create(
        'token',
        'mo',
        { stretchy: false, texClass: TEXCLASS.ORD },
        c
      )
    );
  },

  /**
   * Handle tilde and spaces.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _c The parsed character.
   */
  Tilde(parser: TexParser, _c: string) {
    // @test Tilde, Tilde2
    parser.Push(parser.create('token', 'mtext', {}, entities.nbsp));
  },

  /**
   * Handling space, by doing nothing.
   *
   * @param {TexParser} _parser The calling parser.
   * @param {string} _c The parsed character.
   */
  Space(_parser: TexParser, _c: string) {},

  /**
   * Handle ^
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _c The parsed character.
   */
  Superscript(parser: TexParser, _c: string) {
    if (parser.GetNext().match(/\d/)) {
      // don't treat numbers as a unit
      parser.string =
        parser.string.substring(0, parser.i + 1) +
        ' ' +
        parser.string.substring(parser.i + 1);
    }
    let primes: MmlNode;
    let base: MmlNode | void;
    const top = parser.stack.Top();
    if (top.isKind('prime')) {
      // @test Prime on Prime
      [base, primes] = top.Peek(2);
      parser.stack.Pop();
    } else {
      // @test Empty base2, Square, Cube
      base = parser.stack.Prev();
      if (!base) {
        // @test Empty base
        base = parser.create('token', 'mi', {}, '');
      }
    }
    const movesupsub = NodeUtil.getProperty(base, 'movesupsub');
    let position = NodeUtil.isType(base, 'msubsup')
      ? (base as MmlMsubsup).sup
      : (base as MmlMunderover).over;
    if (
      (NodeUtil.isType(base, 'msubsup') &&
        !NodeUtil.isType(base, 'msup') &&
        NodeUtil.getChildAt(base, (base as MmlMsubsup).sup)) ||
      (NodeUtil.isType(base, 'munderover') &&
        !NodeUtil.isType(base, 'mover') &&
        NodeUtil.getChildAt(base, (base as MmlMunderover).over) &&
        !NodeUtil.getProperty(base, 'subsupOK'))
    ) {
      // @test Double-super-error, Double-over-error
      throw new TexError(
        'DoubleExponent',
        'Double exponent: use braces to clarify'
      );
    }
    if (!NodeUtil.isType(base, 'msubsup') || NodeUtil.isType(base, 'msup')) {
      if (movesupsub) {
        // @test Move Superscript, Large Operator
        if (
          !NodeUtil.isType(base, 'munderover') ||
          NodeUtil.isType(base, 'mover') ||
          NodeUtil.getChildAt(base, (base as MmlMunderover).over)
        ) {
          // @test Large Operator
          base = parser.create('node', 'munderover', [base], {
            movesupsub: true,
          });
        }
        position = (base as MmlMunderover).over;
      } else {
        // @test Empty base, Empty base2, Square, Cube
        base = parser.create('node', 'msubsup', [base]);
        position = (base as MmlMsubsup).sup;
      }
    }
    parser.Push(
      parser.itemFactory.create('subsup', base).setProperties({
        position: position,
        primes: primes,
        movesupsub: movesupsub,
      })
    );
  },

  /**
   * Handle _
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _c The parsed character.
   */
  Subscript(parser: TexParser, _c: string) {
    if (parser.GetNext().match(/\d/)) {
      // don't treat numbers as a unit
      parser.string =
        parser.string.substring(0, parser.i + 1) +
        ' ' +
        parser.string.substring(parser.i + 1);
    }
    let primes, base;
    const top = parser.stack.Top();
    if (top.isKind('prime')) {
      // @test Prime on Sub
      [base, primes] = top.Peek(2);
      parser.stack.Pop();
    } else {
      base = parser.stack.Prev();
      if (!base) {
        // @test Empty Base Index
        base = parser.create('token', 'mi', {}, '');
      }
    }
    const movesupsub = NodeUtil.getProperty(base, 'movesupsub');
    let position = NodeUtil.isType(base, 'msubsup')
      ? (base as MmlMsubsup).sub
      : (base as MmlMunderover).under;
    if (
      (NodeUtil.isType(base, 'msubsup') &&
        !NodeUtil.isType(base, 'msup') &&
        NodeUtil.getChildAt(base, (base as MmlMsubsup).sub)) ||
      (NodeUtil.isType(base, 'munderover') &&
        !NodeUtil.isType(base, 'mover') &&
        NodeUtil.getChildAt(base, (base as MmlMunderover).under) &&
        !NodeUtil.getProperty(base, 'subsupOK'))
    ) {
      // @test Double-sub-error, Double-under-error
      throw new TexError(
        'DoubleSubscripts',
        'Double subscripts: use braces to clarify'
      );
    }
    if (!NodeUtil.isType(base, 'msubsup') || NodeUtil.isType(base, 'msup')) {
      if (movesupsub) {
        // @test Large Operator, Move Superscript
        if (
          !NodeUtil.isType(base, 'munderover') ||
          NodeUtil.isType(base, 'mover') ||
          NodeUtil.getChildAt(base, (base as MmlMunderover).under)
        ) {
          // @test Move Superscript
          base = parser.create('node', 'munderover', [base], {
            movesupsub: true,
          });
        }
        position = (base as MmlMunderover).under;
      } else {
        // @test Empty Base Index, Empty Base Index2, Index
        base = parser.create('node', 'msubsup', [base]);
        position = (base as MmlMsubsup).sub;
      }
    }
    parser.Push(
      parser.itemFactory.create('subsup', base).setProperties({
        position: position,
        primes: primes,
        movesupsub: movesupsub,
      })
    );
  },

  /**
   * Handle '
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} c The parsed character.
   */
  Prime(parser: TexParser, c: string) {
    // @test Prime
    let base = parser.stack.Prev();
    if (!base) {
      // @test PrimeSup, PrePrime, Prime on Sup
      base = parser.create('token', 'mi');
    }
    if (
      (NodeUtil.isType(base, 'msubsup') &&
        !NodeUtil.isType(base, 'msup') &&
        NodeUtil.getChildAt(base, (base as MmlMsubsup).sup)) ||
      (NodeUtil.isType(base, 'munderover') &&
        !NodeUtil.isType(base, 'mover') &&
        NodeUtil.getChildAt(base, (base as MmlMunderover).over) &&
        !NodeUtil.getProperty(base, 'subsupOK'))
    ) {
      // @test Double Prime Error
      throw new TexError(
        'DoubleExponentPrime',
        'Prime causes double exponent: use braces to clarify'
      );
    }
    let sup = '';
    parser.i--;
    do {
      // @test Prime, PrimeSup, Double Prime, PrePrime
      sup += entities.prime;
      parser.i++;
      c = parser.GetNext();
    } while (c === "'" || c === entities.rsquo);
    sup = ['', '\u2032', '\u2033', '\u2034', '\u2057'][sup.length] || sup;
    const node = parser.create('token', 'mo', { variantForm: true }, sup);
    parser.Push(parser.itemFactory.create('prime', base, node));
  },

  /**
   * Handle comments
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _c The parsed character.
   */
  Comment(parser: TexParser, _c: string) {
    while (
      parser.i < parser.string.length &&
      parser.string.charAt(parser.i) !== '\n'
    ) {
      parser.i++;
    }
  },

  /**
   * Handle hash marks outside of definitions
   *
   * @param {TexParser} _parser The calling parser.
   * @param {string} _c The parsed character.
   */
  Hash(_parser: TexParser, _c: string) {
    // @test Hash Error
    throw new TexError(
      'CantUseHash1',
      "You can't use 'macro parameter character #' in math mode"
    );
  },

  /**
   * Handle \mathrm, \mathbf, etc, allowing for multi-letter runs to be one <mi>.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {string} variant The font variant.
   * @param {string} italic Optionally, the italic font name.
   */
  MathFont(
    parser: TexParser,
    name: string,
    variant: string,
    italic: string = ''
  ) {
    const text = parser.GetArgument(name);
    const mml = new TexParser(
      text,
      {
        multiLetterIdentifiers: parser.options.identifierPattern,
        ...parser.stack.env,
        font: variant,
        italicFont: italic,
        noAutoOP: true,
      },
      parser.configuration
    ).mml();
    parser.Push(parser.create('node', 'TeXAtom', [mml]));
  },

  /**
   * Setting font, e.g., via \\rm, \\bf etc.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _name The macro name.
   * @param {string} font The font name.
   */
  SetFont(parser: TexParser, _name: string, font: string) {
    parser.stack.env['font'] = font;
    parser.Push(parser.itemFactory.create('null'));
  },

  /**
   * Setting style, e.g., via \\displaystyle, \\textstyle, etc.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _name The macro name.
   * @param {string} texStyle The tex style name: D, T, S, SS
   * @param {boolean} style True if we are in displaystyle.
   * @param {string} level The nesting level for scripts.
   */
  SetStyle(
    parser: TexParser,
    _name: string,
    texStyle: string,
    style: boolean,
    level: string
  ) {
    parser.stack.env['style'] = texStyle;
    parser.stack.env['level'] = level;
    parser.Push(
      parser.itemFactory
        .create('style')
        .setProperty('styles', { displaystyle: style, scriptlevel: level })
    );
  },

  /**
   * Setting size of an expression, e.g., \\small, \\huge.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _name The macro name.
   * @param {number} size The size value.
   */
  SetSize(parser: TexParser, _name: string, size: number) {
    parser.stack.env['size'] = size;
    parser.Push(
      parser.itemFactory
        .create('style')
        .setProperty('styles', { mathsize: em(size) })
    );
  },

  /**
   * Setting explicit spaces, e.g., via commata or colons.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _name The macro name.
   * @param {string} space The space value.
   */
  Spacer(parser: TexParser, _name: string, space: number) {
    // @test Positive Spacing, Negative Spacing
    const node = parser.create('node', 'mspace', [], { width: em(space) });
    const style = parser.create('node', 'mstyle', [node], { scriptlevel: 0 });
    parser.Push(style);
  },

  /**
   * Create a discretionary times operator.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _name The macro name.
   */
  DiscretionaryTimes(parser: TexParser, _name: string) {
    parser.Push(
      parser.create('token', 'mo', { linebreakmultchar: '\u00D7' }, '\u2062')
    );
  },

  /**
   * Create a discretionary breakpoint.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _name The macro name.
   */
  AllowBreak(parser: TexParser, _name: string) {
    parser.Push(parser.create('token', 'mspace'));
  },

  /**
   * Create a forced breakpoint.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _name The macro name.
   */
  Break(parser: TexParser, _name: string) {
    parser.Push(
      parser.create('token', 'mspace', {
        linebreak: TexConstant.LineBreak.NEWLINE,
      })
    );
  },

  /**
   * Set surrounding mo linebreak attributes
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _name The macro name.
   * @param {string} linebreak The linebreak attribute to use.
   */
  Linebreak(parser: TexParser, _name: string, linebreak: string) {
    let insert = true;
    const prev = parser.stack.Prev(true);
    if (prev && prev.isKind('mo')) {
      const style = NodeUtil.getMoAttribute(prev, 'linebreakstyle');
      if (style !== TexConstant.LineBreakStyle.BEFORE) {
        prev.attributes.set('linebreak', linebreak);
        insert = false;
      }
    }
    parser.Push(parser.itemFactory.create('break', linebreak, insert));
  },

  /**
   * Parses left/right fenced expressions.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  LeftRight(parser: TexParser, name: string) {
    // @test Fenced, Fenced3
    const first = name.substring(1);
    parser.Push(
      parser.itemFactory.create(
        first,
        parser.GetDelimiter(name),
        parser.stack.env.color
      )
    );
  },

  /**
   * Handle a named math function, e.g., \\sin, \\cos
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {string} id Alternative string representation of the function.
   */
  NamedFn(parser: TexParser, name: string, id: string) {
    // @test Named Function
    if (!id) {
      id = name.substring(1);
    }
    const mml = parser.create('token', 'mi', { texClass: TEXCLASS.OP }, id);
    parser.Push(parser.itemFactory.create('fn', mml));
  },

  /**
   * Handle a named math operator, e.g., \\min, \\lim
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {string} id Alternative string representation of the operator.
   */
  NamedOp(parser: TexParser, name: string, id: string) {
    // @test Limit
    if (!id) {
      id = name.substring(1);
    }
    id = id.replace(/&thinsp;/, '\u2006');
    const mml = parser.create(
      'token',
      'mo',
      {
        movablelimits: true,
        movesupsub: true,
        form: TexConstant.Form.PREFIX,
        texClass: TEXCLASS.OP,
      },
      id
    );
    parser.Push(mml);
  },

  /**
   * Handle a limits command for math operators.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _name The macro name.
   * @param {boolean} limits True for \limits, false for \nolimits.
   */
  Limits(parser: TexParser, _name: string, limits: boolean) {
    // @test Limits
    let op = parser.stack.Prev(true);
    // Get the texclass for the core operator.
    if (
      !op ||
      (NodeUtil.getTexClass(NodeUtil.getCoreMO(op)) !== TEXCLASS.OP &&
        NodeUtil.getProperty(op, 'movesupsub') == null)
    ) {
      // @test Limits Error
      throw new TexError(
        'MisplacedLimits',
        '%1 is allowed only on operators',
        parser.currentCS
      );
    }
    const top = parser.stack.Top();
    let node;
    if (NodeUtil.isType(op, 'munderover') && !limits) {
      // @test Limits UnderOver
      node = parser.create('node', 'msubsup');
      NodeUtil.copyChildren(op, node);
      op = top.Last = node;
    } else if (NodeUtil.isType(op, 'msubsup') && limits) {
      // @test Limits SubSup
      // node = parser.create('node', 'munderover', NodeUtil.getChildren(op), {});
      // Needs to be copied, otherwise we get an error in MmlNode.appendChild!
      node = parser.create('node', 'munderover');
      NodeUtil.copyChildren(op, node);
      op = top.Last = node;
    }
    NodeUtil.setProperty(op, 'movesupsub', limits ? true : false);
    NodeUtil.setProperties(NodeUtil.getCoreMO(op), { movablelimits: false });
    if (
      (NodeUtil.isType(op, 'mo')
        ? NodeUtil.getMoAttribute(op, 'movableLimits')
        : NodeUtil.getAttribute(op, 'movablelimits')) ||
      NodeUtil.getProperty(op, 'movablelimits')
    ) {
      NodeUtil.setProperties(op, { movablelimits: false });
    }
  },

  /**
   * Handle over commands.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {string} open The open delimiter in case of a "withdelim" version.
   * @param {string} close The close delimiter.
   */
  Over(parser: TexParser, name: string, open: string, close: string) {
    // @test Over
    const mml = parser.itemFactory
      .create('over')
      .setProperty('name', parser.currentCS);
    if (open || close) {
      // @test Choose
      mml.setProperty('ldelim', open);
      mml.setProperty('rdelim', close);
    } else if (name.match(/withdelims$/)) {
      // @test Over With Delims, Above With Delims
      mml.setProperty('ldelim', parser.GetDelimiter(name));
      mml.setProperty('rdelim', parser.GetDelimiter(name));
    }
    if (name.match(/^\\above/)) {
      // @test Above, Above With Delims
      mml.setProperty('thickness', parser.GetDimen(name));
    } else if (name.match(/^\\atop/) || open || close) {
      // @test Choose
      mml.setProperty('thickness', 0);
    }
    parser.Push(mml);
  },

  /**
   * Parses a fraction.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  Frac(parser: TexParser, name: string) {
    // @test Frac
    const num = parser.ParseArg(name);
    const den = parser.ParseArg(name);
    const node = parser.create('node', 'mfrac', [num, den]);
    parser.Push(node);
  },

  /**
   * Parses a square root element.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  Sqrt(parser: TexParser, name: string) {
    const n = parser.GetBrackets(name);
    let arg = parser.GetArgument(name);
    if (arg === '\\frac') {
      arg +=
        '{' + parser.GetArgument(arg) + '}{' + parser.GetArgument(arg) + '}';
    }
    let mml = new TexParser(arg, parser.stack.env, parser.configuration).mml();
    if (!n) {
      // @test Square Root
      mml = parser.create('node', 'msqrt', [mml]);
    } else {
      // @test General Root
      mml = parser.create('node', 'mroot', [mml, parseRoot(parser, n)]);
    }
    parser.Push(mml);
  },

  /**
   * Parse a general root.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  Root(parser: TexParser, name: string) {
    const n = parser.GetUpTo(name, '\\of');
    const arg = parser.ParseArg(name);
    const node = parser.create('node', 'mroot', [arg, parseRoot(parser, n)]);
    parser.Push(node);
  },

  /**
   * Parses a movable index element in a root, e.g. \\uproot, \\leftroot
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {string} id Argument which should be a string representation of an integer.
   */
  MoveRoot(parser: TexParser, name: string, id: string) {
    // @test Tweaked Root
    if (!parser.stack.env['inRoot']) {
      // @test Misplaced Move Root
      throw new TexError(
        'MisplacedMoveRoot',
        '%1 can appear only within a root',
        parser.currentCS
      );
    }
    if (parser.stack.global[id]) {
      // @test Multiple Move Root
      throw new TexError(
        'MultipleMoveRoot',
        'Multiple use of %1',
        parser.currentCS
      );
    }
    let n = parser.GetArgument(name);
    if (!n.match(/-?[0-9]+/)) {
      // @test Incorrect Move Root
      throw new TexError(
        'IntegerArg',
        'The argument to %1 must be an integer',
        parser.currentCS
      );
    }
    n = parseInt(n, 10) / 15 + 'em';
    if (n.substring(0, 1) !== '-') {
      n = '+' + n;
    }
    parser.stack.global[id] = n;
  },

  /**
   * Handle accents.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {string} accent The accent.
   * @param {boolean} stretchy True if accent is stretchy, false if mathaccent should be false.
   */
  Accent(parser: TexParser, name: string, accent: string, stretchy: boolean) {
    // @test Vector
    const c = parser.ParseArg(name);
    // @test Vector Font
    const def = {
      ...ParseUtil.getFontDef(parser),
      accent: true,
      mathaccent: stretchy === undefined ? true : stretchy,
    };
    const entity = NodeUtil.createEntity(accent);
    const mml = parser.create('token', 'mo', def, entity);
    NodeUtil.setAttribute(mml, 'stretchy', stretchy ? true : false);
    // @test Vector Op, Vector
    const mo = NodeUtil.isEmbellished(c) ? NodeUtil.getCoreMO(c) : c;
    if (
      NodeUtil.isType(mo, 'mo') ||
      NodeUtil.getProperty(mo, 'movablelimits')
    ) {
      // @test Vector Op
      NodeUtil.setProperties(mo, { movablelimits: false });
    }
    const muoNode = parser.create('node', 'munderover');
    // This is necessary to get the empty element into the children.
    NodeUtil.setChild(muoNode, 0, c);
    NodeUtil.setChild(muoNode, 1, null);
    NodeUtil.setChild(muoNode, 2, mml);
    const texAtom = parser.create('node', 'TeXAtom', [muoNode]);
    parser.Push(texAtom);
  },

  /**
   * Handles stacked elements.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {string} c Character to stack.
   * @param {boolean} stack True if stacked operator.
   */
  UnderOver(parser: TexParser, name: string, c: string, stack: boolean) {
    const entity = NodeUtil.createEntity(c);
    const mo = parser.create(
      'token',
      'mo',
      { stretchy: true, accent: true },
      entity
    );
    if (entity.match(MmlMo.mathaccentsWithWidth)) {
      mo.setProperty('mathaccent', false);
    }
    const pos = name.charAt(1) === 'o' ? 'over' : 'under';
    const base = parser.ParseArg(name);
    parser.Push(ParseUtil.underOver(parser, base, mo, pos, stack));
  },

  /**
   * Handles overset.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  Overset(parser: TexParser, name: string) {
    // @test Overset
    const top = parser.ParseArg(name);
    const base = parser.ParseArg(name);
    const topMo = top.coreMO();
    const accent =
      topMo.isKind('mo') && NodeUtil.getMoAttribute(topMo, 'accent') === true;
    ParseUtil.checkMovableLimits(base);
    const node = parser.create('node', 'mover', [base, top], { accent });
    parser.Push(node);
  },

  /**
   * Handles underset.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  Underset(parser: TexParser, name: string) {
    // @test Underset
    const bot = parser.ParseArg(name);
    const base = parser.ParseArg(name);
    const botMo = bot.coreMO();
    const accentunder =
      botMo.isKind('mo') && NodeUtil.getMoAttribute(botMo, 'accent') === true;
    ParseUtil.checkMovableLimits(base);
    const node = parser.create('node', 'munder', [base, bot], { accentunder });
    parser.Push(node);
  },

  /**
   * Handles overunderset.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  Overunderset(parser: TexParser, name: string) {
    const top = parser.ParseArg(name);
    const bot = parser.ParseArg(name);
    const base = parser.ParseArg(name);
    const topMo = top.coreMO();
    const botMo = bot.coreMO();
    const accent =
      topMo.isKind('mo') && NodeUtil.getMoAttribute(topMo, 'accent') === true;
    const accentunder =
      botMo.isKind('mo') && NodeUtil.getMoAttribute(botMo, 'accent') === true;
    ParseUtil.checkMovableLimits(base);
    const node = parser.create('node', 'munderover', [base, bot, top], {
      accent,
      accentunder,
    });
    parser.Push(node);
  },

  /**
   * Creates TeXAtom, when class of element is changed explicitly.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {number} mclass The new TeX class.
   */
  TeXAtom(parser: TexParser, name: string, mclass: number) {
    const def: EnvList = { texClass: mclass };
    let mml: StackItem | MmlNode;
    let node: MmlNode;
    if (mclass === TEXCLASS.OP) {
      def['movesupsub'] = def['movablelimits'] = true;
      const arg = parser.GetArgument(name);
      const match = arg.match(/^\s*\\rm\s+([a-zA-Z0-9 ]+)$/);
      if (match) {
        // @test Mathop
        def['mathvariant'] = TexConstant.Variant.NORMAL;
        node = parser.create('token', 'mi', def, match[1]);
      } else {
        // @test Mathop Cal
        const parsed = new TexParser(
          arg,
          parser.stack.env,
          parser.configuration
        ).mml();
        node = parser.create('node', 'TeXAtom', [parsed], def);
      }
      mml = parser.itemFactory.create('fn', node);
    } else {
      // @test Mathrel
      mml = parser.create('node', 'TeXAtom', [parser.ParseArg(name)], def);
    }
    parser.Push(mml);
  },

  /**
   * Creates vboxes with various vertical alignments
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {string} align The alignment for the box.
   */
  VBox(parser: TexParser, name: string, align: string) {
    const arg = new TexParser(
      parser.GetArgument(name),
      parser.stack.env,
      parser.configuration
    );
    const def = {
      'data-vertical-align': align,
      texClass: TEXCLASS.ORD,
    } as EnvList;
    if (arg.stack.env.hsize) {
      def.width = arg.stack.env.hsize;
      def['data-overflow'] = 'linebreak';
    }
    const mml = parser.create('node', 'mpadded', [arg.mml()], def);
    mml.setProperty('vbox', align);
    parser.Push(mml);
  },

  /**
   * Sets hsize for \vbox, \vtop, \vcenter boxes
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  Hsize(parser: TexParser, name: string) {
    if (parser.GetNext() === '=') {
      parser.i++;
    }
    parser.stack.env.hsize = parser.GetDimen(name);
    parser.Push(parser.itemFactory.create('null'));
  },

  /**
   * Handle \parbox[align]{width}{text}
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  ParBox(parser: TexParser, name: string) {
    const c = parser.GetBrackets(name, 'c');
    const width = parser.GetDimen(name);
    const text = ParseUtil.internalMath(parser, parser.GetArgument(name));
    const align = splitAlignArray(c, 1);
    const mml = parser.create('node', 'mpadded', text, {
      width: width,
      'data-overflow': 'linebreak',
      'data-vertical-align': align,
    });
    mml.setProperty('vbox', align);
    parser.Push(mml);
  },

  /**
   * Handle \breakAlign{type}{align} for type = c, r, or t
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  BreakAlign(parser: TexParser, name: string) {
    const top = parser.stack.Top() as sitem.ArrayItem;
    if (!(top instanceof sitem.ArrayItem)) {
      throw new TexError(
        'BreakNotInArray',
        '%1 must be used in an alignment environment',
        parser.currentCS
      );
    }
    const type = parser.GetArgument(name).trim();
    switch (type) {
      case 'c':
        if (top.First) {
          throw new TexError(
            'BreakFirstInEntry',
            '%1 must be at the beginning of an alignment entry',
            parser.currentCS + '{c}'
          );
        }
        top.breakAlign.cell = splitAlignArray(parser.GetArgument(name), 1);
        break;
      case 'r':
        if (top.row.length || top.First) {
          throw new TexError(
            'BreakFirstInRow',
            '%1 must be at the beginning of an alignment row',
            parser.currentCS + '{r}'
          );
        }
        top.breakAlign.row = splitAlignArray(parser.GetArgument(name));
        break;
      case 't':
        if (top.table.length || top.row.length || top.First) {
          throw new TexError(
            'BreakFirstInTable',
            '%1 must be at the beginning of an alignment',
            parser.currentCS + '{t}'
          );
        }
        top.breakAlign.table = splitAlignArray(parser.GetArgument(name));
        break;
      default:
        throw new TexError(
          'BreakType',
          'First argument to %1 must be one of c, r, or t',
          parser.currentCS
        );
    }
  },

  /**
   * Creates mmltoken elements. Used in Macro substitutions.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  MmlToken(parser: TexParser, name: string) {
    // @test Modulo
    const kind = parser.GetArgument(name);
    let attr = parser.GetBrackets(name, '').replace(/^\s+/, '');
    const text = parser.GetArgument(name);
    const def: EnvList = {};
    const keep: string[] = [];
    let node: MmlNode;
    try {
      node = parser.create('node', kind);
    } catch (_e) {
      node = null;
    }
    if (!node || !node.isToken) {
      // @test Token Illegal Type, Token Wrong Type
      throw new TexError('NotMathMLToken', '%1 is not a token element', kind);
    }
    while (attr !== '') {
      const match = attr.match(
        /^([a-z]+)\s*=\s*('[^']*'|"[^"]*"|[^ ,]*)\s*,?\s*/i
      );
      if (!match) {
        // @test Token Invalid Attribute
        throw new TexError(
          'InvalidMathMLAttr',
          'Invalid MathML attribute: %1',
          attr
        );
      }
      if (!node.attributes.hasDefault(match[1]) && !MmlTokenAllow[match[1]]) {
        // @test Token Unknown Attribute, Token Wrong Attribute
        throw new TexError(
          'UnknownAttrForElement',
          '%1 is not a recognized attribute for %2',
          match[1],
          kind
        );
      }
      let value: string | boolean = ParseUtil.mmlFilterAttribute(
        parser,
        match[1],
        match[2].replace(/^(['"])(.*)\1$/, '$2')
      );
      if (value) {
        if (value.toLowerCase() === 'true') {
          value = true;
        } else if (value.toLowerCase() === 'false') {
          value = false;
        }
        def[match[1]] = value;
        keep.push(match[1]);
      }
      attr = attr.substring(match[0].length);
    }
    if (keep.length) {
      def['mjx-keep-attrs'] = keep.join(' ');
    }
    const textNode = parser.create('text', replaceUnicode(text));
    node.appendChild(textNode);
    NodeUtil.setProperties(node, def);
    parser.Push(node);
  },

  /**
   * Handle strut.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _name The macro name.
   */
  Strut(parser: TexParser, _name: string) {
    // @test Strut
    const row = parser.create('node', 'mrow');
    const padded = parser.create('node', 'mpadded', [row], {
      height: '8.6pt',
      depth: '3pt',
      width: 0,
    });
    parser.Push(padded);
  },

  /**
   * Handle phantom commands.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {string} v Vertical size.
   * @param {string} h Horizontal size.
   */
  Phantom(parser: TexParser, name: string, v: string, h: string) {
    // @test Phantom
    let box = parser.create('node', 'mphantom', [parser.ParseArg(name)]);
    if (v || h) {
      // TEMP: Changes here
      box = parser.create('node', 'mpadded', [box]);
      if (h) {
        // @test Horizontal Phantom
        NodeUtil.setAttribute(box, 'height', 0);
        NodeUtil.setAttribute(box, 'depth', 0);
      }
      if (v) {
        // @test Vertical Phantom
        NodeUtil.setAttribute(box, 'width', 0);
      }
    }
    const atom = parser.create('node', 'TeXAtom', [box]);
    parser.Push(atom);
  },

  /**
   * Handle smash.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  Smash(parser: TexParser, name: string) {
    // @test Smash, Smash Top, Smash Bottom
    const bt = UnitUtil.trimSpaces(parser.GetBrackets(name, ''));
    const smash = parser.create('node', 'mpadded', [parser.ParseArg(name)]);
    // TEMP: Changes here:
    switch (bt) {
      case 'b':
        NodeUtil.setAttribute(smash, 'depth', 0);
        break;
      case 't':
        NodeUtil.setAttribute(smash, 'height', 0);
        break;
      default:
        NodeUtil.setAttribute(smash, 'height', 0);
        NodeUtil.setAttribute(smash, 'depth', 0);
    }
    const atom = parser.create('node', 'TeXAtom', [smash]);
    parser.Push(atom);
  },

  /**
   * Handle rlap and llap commands.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  Lap(parser: TexParser, name: string) {
    // @test Llap, Rlap
    const mml = parser.create('node', 'mpadded', [parser.ParseArg(name)], {
      width: 0,
    });
    if (name === '\\llap') {
      // @test Llap
      NodeUtil.setAttribute(mml, 'lspace', '-1width');
    }
    const atom = parser.create('node', 'TeXAtom', [mml]);
    parser.Push(atom);
  },

  /**
   * Handle raise and lower commands.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  RaiseLower(parser: TexParser, name: string) {
    // @test Raise, Lower, Raise Negative, Lower Negative
    let h = parser.GetDimen(name);
    const item = parser.itemFactory
      .create('position')
      .setProperties({ name: parser.currentCS, move: 'vertical' });
    // TEMP: Changes here:
    if (h.charAt(0) === '-') {
      // @test Raise Negative, Lower Negative
      h = h.slice(1);
      name = name.substring(1) === 'raise' ? '\\lower' : '\\raise';
    }
    if (name === '\\lower') {
      // @test Raise, Raise Negative
      item.setProperty('dh', '-' + h);
      item.setProperty('dd', '+' + h);
    } else {
      // @test Lower, Lower Negative
      item.setProperty('dh', '+' + h);
      item.setProperty('dd', '-' + h);
    }
    parser.Push(item);
  },

  /**
   * Handle moveleft, moveright commands
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  MoveLeftRight(parser: TexParser, name: string) {
    // @test Move Left, Move Right, Move Left Negative, Move Right Negative
    let h = parser.GetDimen(name);
    let nh = h.charAt(0) === '-' ? h.slice(1) : '-' + h;
    if (name === '\\moveleft') {
      const tmp = h;
      h = nh;
      nh = tmp;
    }
    parser.Push(
      parser.itemFactory.create('position').setProperties({
        name: parser.currentCS,
        move: 'horizontal',
        left: parser.create('node', 'mspace', [], { width: h }),
        right: parser.create('node', 'mspace', [], { width: nh }),
      })
    );
  },

  /**
   * Handle horizontal spacing commands.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {boolean} nobreak Flag indicating if it is a linebreaking command.
   */
  Hskip(parser: TexParser, name: string, nobreak: boolean = false) {
    // @test Modulo
    const node = parser.create('node', 'mspace', [], {
      width: parser.GetDimen(name),
    });
    if (nobreak) {
      NodeUtil.setAttribute(node, 'linebreak', 'nobreak');
    }
    parser.Push(node);
  },

  /**
   * Handle removal of spaces in script modes
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _name The macro name.
   */
  Nonscript(parser: TexParser, _name: string) {
    parser.Push(parser.itemFactory.create('nonscript'));
  },

  /**
   * Handle Rule and Space command
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {string} style The style of the rule spacer.
   */
  Rule(parser: TexParser, name: string, style: string) {
    // @test Rule 3D, Space 3D
    const w = parser.GetDimen(name),
      h = parser.GetDimen(name),
      d = parser.GetDimen(name);
    const def: EnvList = { width: w, height: h, depth: d };
    if (style !== 'blank') {
      def['mathbackground'] = parser.stack.env['color'] || 'black';
    }
    const node = parser.create('node', 'mspace', [], def);
    parser.Push(node);
  },

  /**
   * Handle rule command.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  rule(parser: TexParser, name: string) {
    // @test Rule 2D
    const v = parser.GetBrackets(name),
      w = parser.GetDimen(name),
      h = parser.GetDimen(name);
    let mml = parser.create('node', 'mspace', [], {
      width: w,
      height: h,
      mathbackground: parser.stack.env['color'] || 'black',
    });
    if (v) {
      mml = parser.create('node', 'mpadded', [mml], { voffset: v });
      if (v.match(/^-/)) {
        NodeUtil.setAttribute(mml, 'height', v);
        NodeUtil.setAttribute(mml, 'depth', '+' + v.substring(1));
      } else {
        NodeUtil.setAttribute(mml, 'height', '+' + v);
      }
    }
    parser.Push(mml);
  },

  /**
   * Handle big command sequences, e.g., \\big, \\Bigg.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {number} mclass The TeX class of the element.
   * @param {number} size The em size.
   */
  MakeBig(parser: TexParser, name: string, mclass: number, size: number) {
    // @test Choose, Over With Delims, Above With Delims
    size *= P_HEIGHT;
    const sizeStr = String(size).replace(/(\.\d\d\d).+/, '$1') + 'em';
    const delim = parser.GetDelimiter(name, true);
    const mo = parser.create(
      'token',
      'mo',
      {
        minsize: sizeStr,
        maxsize: sizeStr,
        fence: true,
        stretchy: true,
        symmetric: true,
      },
      delim
    );
    const node = parser.create('node', 'TeXAtom', [mo], { texClass: mclass });
    parser.Push(node);
  },

  /**
   * Handle buildrel command.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  BuildRel(parser: TexParser, name: string) {
    // @test BuildRel, BuildRel Expression
    const top = parser.ParseUpTo(name, '\\over');
    const bot = parser.ParseArg(name);
    const node = parser.create('node', 'munderover');
    // This is necessary to get the empty element into the children.
    NodeUtil.setChild(node, 0, bot);
    NodeUtil.setChild(node, 1, null);
    NodeUtil.setChild(node, 2, top);
    const atom = parser.create('node', 'TeXAtom', [node], {
      texClass: TEXCLASS.REL,
    });
    parser.Push(atom);
  },

  /**
   * Handle horizontal boxes.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {string} style Box style.
   * @param {string} font The mathvariant to use
   */
  HBox(parser: TexParser, name: string, style: string, font?: string) {
    // @test Hbox
    parser.PushAll(
      ParseUtil.internalMath(parser, parser.GetArgument(name), style, font)
    );
  },

  /**
   * Handle framed boxes.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  FBox(parser: TexParser, name: string) {
    // @test Fbox
    const internal = ParseUtil.internalMath(parser, parser.GetArgument(name));
    const node = parser.create('node', 'menclose', internal, {
      notation: 'box',
    });
    parser.Push(node);
  },

  /**
   * Handle framed boxes with options.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  FrameBox(parser: TexParser, name: string) {
    const width = parser.GetBrackets(name);
    const pos = parser.GetBrackets(name) || 'c';
    let mml = ParseUtil.internalMath(parser, parser.GetArgument(name));
    if (width) {
      mml = [
        parser.create('node', 'mpadded', mml, {
          width,
          'data-align': lookup(pos, { l: 'left', r: 'right' }, 'center'),
        }),
      ];
    }
    const node = parser.create(
      'node',
      'TeXAtom',
      [parser.create('node', 'menclose', mml, { notation: 'box' })],
      { texClass: TEXCLASS.ORD }
    );
    parser.Push(node);
  },

  /**
   * Implements \makebox.
   *
   * @param {TexParser} parser   The calling parser.
   * @param {string} name        The macro name.
   */
  MakeBox(parser: TexParser, name: string) {
    const width = parser.GetBrackets(name);
    const pos = parser.GetBrackets(name, 'c');
    const mml = parser.create(
      'node',
      'mpadded',
      ParseUtil.internalMath(parser, parser.GetArgument(name))
    );
    if (width) {
      NodeUtil.setAttribute(mml, 'width', width);
    }
    const align = lookup(pos.toLowerCase(), { c: 'center', r: 'right' }, '');
    if (align) {
      NodeUtil.setAttribute(mml, 'data-align', align);
    }
    if (pos.toLowerCase() !== pos) {
      NodeUtil.setAttribute(mml, 'data-overflow', 'linebreak');
    }
    parser.Push(mml);
  },

  /**
   * Handle \\not.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _name The macro name.
   */
  Not(parser: TexParser, _name: string) {
    // @test Negation Simple, Negation Complex, Negation Explicit,
    //       Negation Large
    parser.Push(parser.itemFactory.create('not'));
  },

  /**
   * Handle dots.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _name The macro name.
   */
  Dots(parser: TexParser, _name: string) {
    // @test Operator Dots
    const ldotsEntity = NodeUtil.createEntity('2026');
    const cdotsEntity = NodeUtil.createEntity('22EF');
    const ldots = parser.create(
      'token',
      'mo',
      { stretchy: false },
      ldotsEntity
    );
    const cdots = parser.create(
      'token',
      'mo',
      { stretchy: false },
      cdotsEntity
    );
    parser.Push(
      parser.itemFactory.create('dots').setProperties({
        ldots: ldots,
        cdots: cdots,
      })
    );
  },

  /**
   * Handle small matrix environments.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _name The macro name.
   * @param {string} open Opening fence.
   * @param {string} close Closing fence.
   * @param {string} align Column alignment.
   * @param {string} spacing Column spacing.
   * @param {string} vspacing Row spacing.
   * @param {string} style Display or text style.
   * @param {boolean} cases Is it a cases environment.
   * @param {boolean} numbered Is it a numbered environment.
   */
  Matrix(
    parser: TexParser,
    _name: string,
    open: string,
    close: string,
    align: string,
    spacing: string,
    vspacing: string,
    style: string,
    cases: boolean,
    numbered: boolean
  ) {
    const c = parser.GetNext();
    if (c === '') {
      // @test Matrix Error
      throw new TexError(
        'MissingArgFor',
        'Missing argument for %1',
        parser.currentCS
      );
    }
    if (c === '{') {
      // @test Matrix Braces, Matrix Columns, Matrix Rows.
      parser.i++;
    } else {
      // @test Matrix Arg
      parser.string = c + '}' + parser.string.slice(parser.i + 1);
      parser.i = 0;
    }
    // @test Matrix Braces, Matrix Columns, Matrix Rows.
    const array = parser.itemFactory
      .create('array')
      .setProperty('requireClose', true) as sitem.ArrayItem;
    if (open || !align) {
      array.setProperty('arrayPadding', '.2em .125em');
    }
    array.arraydef = {
      rowspacing: vspacing || '4pt',
      columnspacing: spacing || '1em',
    };
    if (cases) {
      // @test Matrix Cases
      array.setProperty('isCases', true);
    }
    if (numbered) {
      // @test Matrix Numbered
      array.setProperty('isNumbered', true);
      array.arraydef.side = numbered;
    }
    if (open || close) {
      // @test Matrix Parens, Matrix Parens Subscript, Matrix Cases
      array.setProperty('open', open);
      array.setProperty('close', close);
    }
    if (style === 'D') {
      // @test Matrix Numbered
      array.arraydef.displaystyle = true;
    }
    if (align != null) {
      // @test Matrix Cases, Matrix Numbered
      array.arraydef.columnalign = align;
    }
    parser.Push(array);
  },

  /**
   * Handle array entry.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  Entry(parser: TexParser, name: string) {
    // @test Label, Array, Cross Product Formula
    parser.Push(
      parser.itemFactory
        .create('cell')
        .setProperties({ isEntry: true, name: name })
    );
    const top = parser.stack.Top();
    const env = top.getProperty('casesEnv') as string;
    const cases = top.getProperty('isCases');
    if (!cases && !env) return;
    //
    //  Make second column be in \text{...} (unless it is already
    //  in a \text{...}, for backward compatibility).
    //
    const str = parser.string;
    let braces = 0;
    let close = -1;
    let i = parser.i;
    let m = str.length;
    const end = env
      ? new RegExp(`^\\\\end\\s*\\{${env.replace(/\*/, '\\*')}\\}`)
      : null;
    //
    //  Look through the string character by character...
    //
    while (i < m) {
      const c = str.charAt(i);
      if (c === '{') {
        //
        //  Increase the nested brace count and go on
        //
        braces++;
        i++;
      } else if (c === '}') {
        //
        //  If there are too many close braces, just end (we will get an
        //    error message later when the rest of the string is parsed)
        //  Otherwise
        //    decrease the nested brace count,
        //    if it is now zero and we haven't already marked the end of the
        //      first brace group, record the position (use to check for \text{} later)
        //    go on to the next character.
        //
        if (braces === 0) {
          m = 0;
        } else {
          braces--;
          if (braces === 0 && close < 0) {
            close = i - parser.i;
          }
          i++;
        }
      } else if (c === '&' && braces === 0) {
        //
        //  Extra alignment tabs are not allowed in cases
        //
        // @test ExtraAlignTab
        throw new TexError(
          'ExtraAlignTab',
          'Extra alignment tab in \\cases text'
        );
      } else if (c === '\\') {
        //
        //  If the macro is \cr or \\, end the search, otherwise skip the macro
        //  (multi-letter names don't matter, as we will skip the rest of the
        //   characters in the main loop)
        //
        const rest = str.substring(i);
        if (rest.match(/^((\\cr)[^a-zA-Z]|\\\\)/) || (end && rest.match(end))) {
          m = 0;
        } else {
          i += 2;
        }
      } else {
        //
        //  Go on to the next character
        //
        i++;
      }
    }
    //
    //  Check if the second column text is already in \text{};
    //  If not, process the second column as text and continue parsing from there,
    //    (otherwise process the second column as normal, since it is in \text{}
    //
    // i >= parser.i
    //
    const text = str.substring(parser.i, i);
    if (
      !text.match(/^\s*\\text[^a-zA-Z]/) ||
      close !== text.replace(/\s+$/, '').length - 1
    ) {
      const internal = ParseUtil.internalMath(
        parser,
        UnitUtil.trimSpaces(text),
        0
      );
      parser.PushAll(internal);
      parser.i = i;
    }
  },

  /**
   * Handle newline in array.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  Cr(parser: TexParser, name: string) {
    // @test Cr Linebreak, Misplaced Cr
    parser.Push(
      parser.itemFactory
        .create('cell')
        .setProperties({ isCR: true, name: name })
    );
  },

  /**
   * Handle newline outside array.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {boolean} nobrackets Flag indicating if newline is followed by
   *     brackets.
   */
  CrLaTeX(parser: TexParser, name: string, nobrackets: boolean = false) {
    let n: string;
    if (!nobrackets) {
      // TODO: spaces before * and [ are not allowed in AMS environments like align, but
      //       should be allowed in array and eqnarray.  This distinction should be honored here.
      if (parser.string.charAt(parser.i) === '*') {
        // The * controls page breaking, so ignore it
        parser.i++;
      }
      if (parser.string.charAt(parser.i) === '[') {
        const dim = parser.GetBrackets(name, '');
        const [value, unit] = UnitUtil.matchDimen(dim);
        // @test Custom Linebreak
        if (dim && !value) {
          // @test Dimension Error
          throw new TexError(
            'BracketMustBeDimension',
            'Bracket argument to %1 must be a dimension',
            parser.currentCS
          );
        }
        n = value + unit;
      }
    }
    parser.Push(
      parser.itemFactory
        .create('cell')
        .setProperties({ isCR: true, name: name, linebreak: true })
    );
    const top = parser.stack.Top();
    let node: MmlNode;
    if (top instanceof sitem.ArrayItem) {
      // @test Array
      if (n) {
        top.addRowSpacing(n);
      }
    } else {
      // @test Linebreak
      node = parser.create('node', 'mspace', [], {
        linebreak: TexConstant.LineBreak.NEWLINE,
      });
      // @test Custom Linebreak
      if (n) {
        NodeUtil.setAttribute(node, 'data-lineleading', n);
      }
      parser.Push(node);
    }
  },

  /**
   * Handle horizontal lines in arrays.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _name The macro name.
   * @param {string} style Style of the line. E.g., dashed.
   */
  HLine(parser: TexParser, _name: string, style: string) {
    if (style == null) {
      style = 'solid';
    }
    const top = parser.stack.Top();
    if (!(top instanceof sitem.ArrayItem) || top.Size()) {
      // @test Misplaced hline
      throw new TexError('Misplaced', 'Misplaced %1', parser.currentCS);
    }
    if (!top.table.length) {
      // @test Enclosed top, Enclosed top bottom
      top.frame.push(['top', style]);
    } else {
      // @test Enclosed bottom, Enclosed top bottom
      const lines = top.arraydef['rowlines']
        ? (top.arraydef['rowlines'] as string).split(/ /)
        : [];
      while (lines.length < top.table.length) {
        lines.push('none');
      }
      lines[top.table.length - 1] = style;
      top.arraydef['rowlines'] = lines.join(' ');
    }
  },

  /**
   * Handle hfill commands.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _name The macro name.
   */
  HFill(parser: TexParser, _name: string) {
    const top = parser.stack.Top();
    if (top instanceof sitem.ArrayItem) {
      // @test Hfill
      top.hfill.push(top.Size());
    } else {
      // @test UnsupportedHFill
      throw new TexError(
        'UnsupportedHFill',
        'Unsupported use of %1',
        parser.currentCS
      );
    }
  },

  /**
   * Create new column declarations
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  NewColumnType(parser: TexParser, name: string) {
    const c = parser.GetArgument(name);
    const n = parser.GetBrackets(name, '0');
    const macro = parser.GetArgument(name);
    if (c.length !== 1) {
      throw new TexError(
        'BadColumnName',
        'Column specifier must be exactly one character: %1',
        c
      );
    }
    if (!n.match(/^\d+$/)) {
      throw new TexError(
        'PositiveIntegerArg',
        'Argument to %1 must be a positive integer',
        n
      );
    }
    const cparser = parser.configuration.columnParser;
    cparser.columnHandler[c] = (state: ColumnState) =>
      cparser.macroColumn(state, macro, parseInt(n));
    parser.Push(parser.itemFactory.create('null'));
  },

  /**
   *   LaTeX environments
   */

  /**
   * Handle begin and end environments. This is a macro method.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  BeginEnd(parser: TexParser, name: string) {
    // @test Array1, Array2, Array Test
    const env = parser.GetArgument(name);
    if (env.match(/\\/)) {
      // @test InvalidEnv
      throw new TexError('InvalidEnv', "Invalid environment name '%1'", env);
    }
    const macro = parser.configuration.handlers
      .get(HandlerType.ENVIRONMENT)
      .lookup(env) as Macro;
    if (macro && name === '\\end') {
      // If the first argument is true, we have some sort of user defined
      // environment. Otherwise we have a standard LaTeX environment that is
      // handled with begin and end items.
      if (!macro.args[0]) {
        const mml = parser.itemFactory.create('end').setProperty('name', env);
        parser.Push(mml);
        return;
      }
      // Remember the user defined environment we are closing.
      parser.stack.env['closing'] = env;
    }
    ParseUtil.checkMaxMacros(parser, false);
    parser.parse(HandlerType.ENVIRONMENT, [parser, env]);
  },

  /**
   * Handle array environment.
   *
   * @param {TexParser} parser The calling parser.
   * @param {StackItem} begin The opening stackitem.
   * @param {string} open Opening fence.
   * @param {string} close Closing fence.
   * @param {string} align Column alignment.
   * @param {string} spacing Column spacing.
   * @param {string} vspacing Row spacing.
   * @param {string} style Display or text style.
   * @param {boolean} raggedHeight Does the height need to be adjusted?
   * @returns {ParseResult} The array stack item.
   */
  Array(
    parser: TexParser,
    begin: StackItem,
    open: string,
    close: string,
    align: string,
    spacing: string,
    vspacing: string,
    style: string,
    raggedHeight: boolean
  ): ParseResult {
    if (!align) {
      // @test Array Single
      align = parser.GetArgument('\\begin{' + begin.getName() + '}');
    }
    const array = parser.itemFactory.create('array') as sitem.ArrayItem;
    if (begin.getName() === 'array') {
      array.setProperty('arrayPadding', '.5em .125em');
    }
    array.parser = parser;
    array.arraydef = {
      columnspacing: spacing || '1em',
      rowspacing: vspacing || '4pt',
    };
    parser.configuration.columnParser.process(parser, align, array);
    if (open) {
      // @test Cross Product
      array.setProperty('open', parser.convertDelimiter(open));
    }
    if (close) {
      // @test Cross Product
      array.setProperty('close', parser.convertDelimiter(close));
    }
    if ((style || '').charAt(1) === "'") {
      array.arraydef['data-cramped'] = true;
      style = style.charAt(0);
    }
    if (style === 'D') {
      // TODO: This case never seems to occur! No test.
      array.arraydef['displaystyle'] = true;
    } else if (style) {
      // @test Subarray, Small Matrix
      array.arraydef['displaystyle'] = false;
    }
    // @test Subarray, Small Matrix
    array.arraydef['scriptlevel'] = style === 'S' ? 1 : 0;
    if (raggedHeight) {
      // @test Subarray, Small Matrix
      array.arraydef['useHeight'] = false;
    }
    parser.Push(begin);
    array.StartEntry();
    return array;
  },

  /**
   * Handle aligned arrays.
   *
   * @param {TexParser} parser The calling parser.
   * @param {StackItem} begin The opening stackitem.
   * @param {string=} style The display style to use
   * @returns {ParseResult} The array stack item.
   */
  AlignedArray(
    parser: TexParser,
    begin: StackItem,
    style: string = ''
  ): ParseResult {
    // @test Array1, Array2, Array Test
    const align = parser.GetBrackets('\\begin{' + begin.getName() + '}');
    const item = BaseMethods.Array(
      parser,
      begin,
      null,
      null,
      null,
      null,
      null,
      style
    );
    return ParseUtil.setArrayAlign(item as sitem.ArrayItem, align);
  },

  /**
   * Handle indentalign environment
   *
   * @param {TexParser} parser The calling parser.
   * @param {StackItem} begin The opening stackitem.
   */
  IndentAlign(parser: TexParser, begin: StackItem) {
    const name = `\\begin{${begin.getName()}}`;
    //
    // Get the indentshift values, if any
    //
    const first = parser.GetBrackets(name, '');
    const shift = parser.GetBrackets(name, '');
    const last = parser.GetBrackets(name, '');
    if (
      (first && !UnitUtil.matchDimen(first)[0]) ||
      (shift && !UnitUtil.matchDimen(shift)[0]) ||
      (last && !UnitUtil.matchDimen(last)[0])
    ) {
      throw new TexError(
        'BracketMustBeDimension',
        'Bracket argument to %1 must be a dimension',
        name
      );
    }
    //
    // Get the indentalign values, if any
    //
    const lcr = parser.GetArgument(name);
    if (lcr && !lcr.match(/^([lcr]{1,3})?$/)) {
      throw new TexError(
        'BadAlignment',
        'Alignment must be one to three copies of l, c, or r'
      );
    }
    const align = [...lcr].map(
      (c) => ({ l: 'left', c: 'center', r: 'right' })[c]
    );
    if (align.length === 1) {
      align.push(align[0]);
    }
    //
    // Set the properties for the mstyle
    //
    const attr: PropertyList = {};
    for (const [name, value] of [
      ['indentshiftfirst', first],
      ['indentshift', shift || first],
      ['indentshiftlast', last],
      ['indentalignfirst', align[0]],
      ['indentalign', align[1]],
      ['indentalignlast', align[2]],
    ]) {
      if (value) {
        attr[name] = value;
      }
    }
    //
    // Push the indentalign item on the stack
    //
    parser.Push(parser.itemFactory.create('mstyle', attr, begin.getName()));
  },

  /**
   * Handle equation environment.
   *
   * @param {TexParser} parser The calling parser.
   * @param {StackItem} begin The opening stackitem.
   * @param {boolean} numbered True if environment is numbered.
   * @param {boolean} display True if equation is in display mode
   *
   * @returns {ParseResult} The constructed equation stackitem.
   */
  Equation(
    parser: TexParser,
    begin: StackItem,
    numbered: boolean,
    display: boolean = true
  ): ParseResult {
    parser.configuration.mathItem.display = display;
    parser.stack.env.display = display;
    ParseUtil.checkEqnEnv(parser);
    parser.Push(begin);
    return parser.itemFactory
      .create('equation', numbered)
      .setProperty('name', begin.getName());
  },

  /**
   * Handle eqnarray.
   *
   * @param {TexParser} parser The calling parser.
   * @param {StackItem} begin The opening stackitem.
   * @param {boolean} numbered True if environment is numbered.
   * @param {boolean} taggable True if taggable.
   * @param {string} align Alignment string.
   * @param {string} balign Vertical alignment string.
   * @param {string} spacing Spacing between columns.
   *
   * @returns {ParseResult} The constructed array stackitem.
   */
  EqnArray(
    parser: TexParser,
    begin: StackItem,
    numbered: boolean,
    taggable: boolean,
    align: string,
    balign: string,
    spacing: string
  ): ParseResult {
    // @test The Lorenz Equations, Maxwell's Equations, Cubic Binomial
    const name = begin.getName();
    const isGather = name === 'gather' || name === 'gather*';
    if (taggable) {
      ParseUtil.checkEqnEnv(parser, !isGather);
    }
    parser.Push(begin);
    align = align
      .replace(/[^clr]/g, '')
      .split('')
      .join(' ');
    align = align
      .replace(/l/g, 'left')
      .replace(/r/g, 'right')
      .replace(/c/g, 'center');
    balign = splitAlignArray(balign);
    const newItem = parser.itemFactory.create(
      'eqnarray',
      name,
      numbered,
      taggable,
      parser.stack.global
    ) as sitem.ArrayItem;
    newItem.arraydef = {
      displaystyle: true,
      columnalign: align,
      columnspacing: spacing || '1em',
      rowspacing: '3pt',
      'data-break-align': balign,
      side: parser.options['tagSide'],
      minlabelspacing: parser.options['tagIndent'],
    };
    if (isGather) {
      newItem.setProperty('nestable', true);
    }
    return newItem;
  },

  /**
   * Handles no tag commands.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _name The macro name.
   */
  HandleNoTag(parser: TexParser, _name: string) {
    parser.tags.notag();
  },

  /**
   * Record a label name for a tag
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  HandleLabel(parser: TexParser, name: string) {
    // @test Label, Label Empty
    const label = parser.GetArgument(name);
    if (label === '') {
      // @test Label Empty
      return;
    }
    if (!parser.tags.refUpdate) {
      // @test Label, Ref, Ref Unknown
      if (parser.tags.label) {
        // @test Double Label Error
        throw new TexError('MultipleCommand', 'Multiple %1', parser.currentCS);
      }
      parser.tags.label = label;
      if (
        (parser.tags.allLabels[label] || parser.tags.labels[label]) &&
        !parser.options['ignoreDuplicateLabels']
      ) {
        // @ Duplicate Label Error
        throw new TexError(
          'MultipleLabel',
          "Label '%1' multiply defined",
          label
        );
      }
      // TODO: This should be set in the tags structure!
      parser.tags.labels[label] = new Label(); // will be replaced by tag value later
    }
  },

  /**
   * Handle a label reference.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {boolean} eqref True if formatted as eqref.
   */
  HandleRef(parser: TexParser, name: string, eqref: boolean) {
    // @test Ref, Ref Unknown, Eqref, Ref Default, Ref Named
    const label = parser.GetArgument(name);
    let ref = parser.tags.allLabels[label] || parser.tags.labels[label];
    if (!ref) {
      // @test Ref Unknown
      if (!parser.tags.refUpdate) {
        parser.tags.redo = true;
      }
      ref = new Label();
    }
    let tag = ref.tag;
    if (eqref) {
      // @test Eqref
      tag = parser.tags.formatRef(tag);
    }
    const node = parser.create(
      'node',
      'mrow',
      ParseUtil.internalMath(parser, tag),
      {
        href: parser.tags.formatUrl(ref.id, parser.options.baseURL),
        class: 'MathJax_ref',
      }
    );
    parser.Push(node);
  },

  /**
   * Basic macro replacement.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {string} macro The macro string.
   * @param {number} argcount The number of arguments of the macro.
   * @param {string} def Additional definitions.
   */
  Macro(
    parser: TexParser,
    name: string,
    macro: string,
    argcount: number,
    def?: string
  ) {
    if (argcount) {
      const args: string[] = [];
      if (def != null) {
        const optional = parser.GetBrackets(name);
        args.push(optional == null ? def : optional);
      }
      for (let i = args.length; i < argcount; i++) {
        args.push(parser.GetArgument(name));
      }
      macro = ParseUtil.substituteArgs(parser, args, macro);
    }
    parser.string = ParseUtil.addArgs(
      parser,
      macro,
      parser.string.slice(parser.i)
    );
    parser.i = 0;
    ParseUtil.checkMaxMacros(parser);
  },

  /**
   * Handle MathChoice for elements whose exact size/style properties can only be
   * determined after the expression has been parsed.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  MathChoice(parser: TexParser, name: string) {
    const D = parser.ParseArg(name);
    const T = parser.ParseArg(name);
    const S = parser.ParseArg(name);
    const SS = parser.ParseArg(name);
    parser.Push(parser.create('node', 'MathChoice', [D, T, S, SS]));
  },
};

export default BaseMethods;
