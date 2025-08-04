/*************************************************************
 *
 *  Copyright (c) 2009-2025 The MathJax Consortium
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
 * @file A namespace for utility functions for the TeX Parser.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { TEXCLASS, MmlNode } from '../../core/MmlTree/MmlNode.js';
import { EnvList } from './StackItem.js';
import { ArrayItem } from './base/BaseItems.js';
import ParseOptions from './ParseOptions.js';
import NodeUtil from './NodeUtil.js';
import TexParser from './TexParser.js';
import TexError from './TexError.js';
import { entities } from '../../util/Entities.js';
import { MmlMunderover } from '../../core/MmlTree/MmlNodes/munderover.js';
import { UnitUtil } from './UnitUtil.js';

/**
 * The data needed for checking the value of a key-value pair.
 */
export class KeyValueDef<T> {
  public static oneof(...values: string[]) {
    return new this<string>(
      'string',
      (value) => values.includes(value),
      (value) => value
    );
  }

  constructor(
    public name: string,
    public verify: (value: string) => boolean,
    public convert: (value: string) => T
  ) {}
}

export type KeyValueFn = (...data: any[]) => KeyValueDef<any>;
export type KeyValueType = KeyValueDef<any>;

/**
 * Predefined value types that can be used to create the list of allowed types.  E.g.
 *
 *  const allowed = {
 *    compact: KeyValueTypes.boolean,
 *    direction: KeyValueDef.oneof('up', 'down'),
 *    'open-brace': KeyValueTypes.string
 *  };
 *
 *  ParseUtil.keyvalOptions(options, allowed, true);
 */
export const KeyValueTypes: { [name: string]: KeyValueType } = {
  boolean: new KeyValueDef<boolean>(
    'boolean',
    (value) => value === 'true' || value === 'false',
    (value) => value === 'true'
  ),
  number: new KeyValueDef<number>(
    'number',
    (value) => !!value.match(/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?$/),
    (value) => parseFloat(value)
  ),
  integer: new KeyValueDef<number>(
    'integer',
    (value) => !!value.match(/^[-+]?\d+$/),
    (value) => parseInt(value)
  ),
  string: new KeyValueDef<string>(
    'string',
    (_value) => true,
    (value) => value
  ),
  dimen: new KeyValueDef<string>(
    'dimen',
    (value) => UnitUtil.matchDimen(value)[0] !== null,
    (value) => value
  ),
};

/**
 * Implementation of the keyval function from https://www.ctan.org/pkg/keyval
 *
 * @param {string} text The optional parameter string for a package or
 *     command.
 * @param {boolean?} l3keys If true, use l3key-style parsing (only remove one set of braces)
 * @returns {EnvList} Set of options as key/value pairs.
 */
function readKeyval(text: string, l3keys: boolean = false): EnvList {
  const options: EnvList = {};
  let rest = text;
  let end, key, val;
  let dropBrace = true;
  while (rest) {
    [key, end, rest] = readValue(rest, ['=', ','], l3keys, dropBrace);
    dropBrace = false;
    if (end === '=') {
      [val, end, rest] = readValue(rest, [','], l3keys);
      val = val === 'false' || val === 'true' ? JSON.parse(val) : val;
      options[key] = val;
    } else if (key) {
      options[key] = true;
    }
  }
  return options;
}

/**
 * Removes pairs of outer braces.
 *
 * @param {string} text The string to clean.
 * @param {number} count The number of outer braces to slice off.
 * @returns {string} The cleaned string.
 */
function removeBraces(text: string, count: number): string {
  if (count === 0) {
    return text
      .replace(/^\s+/, '')
      .replace(/([^\\\s]|^)((?:\\\\)*(?:\\\s)?)?\s+$/, '$1$2');
  }
  while (count > 0) {
    text = text.trim().slice(1, -1);
    count--;
  }
  return text;
}

/**
 * Read a value from the given string until an end parameter is reached or
 * string is exhausted.
 *
 * @param {string} text The string to process.
 * @param {string[]} end List of possible end characters.
 * @param {boolean?} l3keys If true, use l3key-style parsing (only remove one set of braces)
 * @param {boolean?} dropBrace True if the outermost braces should be dropped
 * @returns {[string, string, string]} The collected value, the actual end
 *     character, and the rest of the string still to parse.
 */
function readValue(
  text: string,
  end: string[],
  l3keys: boolean = false,
  dropBrace: boolean = false
): [string, string, string] {
  const length = text.length;
  let braces = 0;
  let value = '';
  let index = 0;
  let start = 0; // Counter for the starting left braces.
  let countBraces = true; // Flag for counting starting left braces.
  // after starting braces, but no other char yet.
  while (index < length) {
    const c = text[index++];
    switch (c) {
      // Handle control sequences (in particular, \{ and \})
      case '\\':
        value += c + (text[index++] || '');
        countBraces = false;
        continue;
      // Ignore spaces.
      case ' ':
        break;
      // Count open left braces at start.
      case '{':
        if (countBraces) {
          start++;
        }
        braces++;
        break;
      // Closing braces.
      case '}':
        if (!braces) {
          throw new TexError(
            'ExtraCloseMissingOpen',
            'Extra close brace or missing open brace'
          );
        }
        braces--;
        countBraces = false; // Stop counting start left braces.
        break;
      default:
        if (!braces && end.includes(c)) {
          // End character reached.
          return [
            removeBraces(value, l3keys ? Math.min(1, start) : start),
            c,
            text.slice(index),
          ];
        }
        if (start > braces) {
          // Some start left braces have been closed.
          start = braces;
        }
        countBraces = false;
    }
    value += c;
  }
  if (braces) {
    throw new TexError(
      'ExtraOpenMissingClose',
      'Extra open brace or missing close brace'
    );
  }
  return dropBrace && start
    ? ['', '', removeBraces(value, 1)]
    : [
        removeBraces(value, l3keys ? Math.min(1, start) : start),
        '',
        text.slice(index),
      ];
}

export const ParseUtil = {
  // Above will move into lenghts
  //
  // Remainder: Parse Utililities

  /**
   * Takes an array of numbers and returns a space-separated string of em values.
   *
   * @param {number[]} W  The widths to be turned into em values
   * @returns {string}     The numbers with em units, separated by spaces.
   */
  cols(...W: number[]): string {
    return W.map((n) => UnitUtil.em(n)).join(' ');
  },

  /**
   * Create an mrow that has stretchy delimiters at either end, as needed
   *
   * @param {ParseOptions} configuration Current parse options.
   * @param {string} open The opening fence.
   * @param {MmlNode} mml The enclosed node.
   * @param {string} close The closing fence.
   * @param {string=} big Bigg command.
   * @param {string=} color The color name.
   * @returns {MmlNode} The newly created mrow.
   */
  fenced(
    configuration: ParseOptions,
    open: string,
    mml: MmlNode,
    close: string,
    big: string = '',
    color: string = ''
  ): MmlNode {
    // @test Fenced, Fenced3
    const nf = configuration.nodeFactory;
    const mrow = nf.create('node', 'mrow', [], {
      open: open,
      close: close,
      texClass: TEXCLASS.INNER,
    });
    let mo;
    if (big) {
      mo = new TexParser(
        '\\' + big + 'l' + open,
        configuration.parser.stack.env,
        configuration
      ).mml();
    } else {
      const openNode = nf.create('text', open);
      mo = nf.create(
        'node',
        'mo',
        [],
        {
          fence: true,
          stretchy: true,
          symmetric: true,
          texClass: TEXCLASS.OPEN,
        },
        openNode
      );
    }
    NodeUtil.appendChildren(mrow, [mo, mml]);
    if (big) {
      mo = new TexParser(
        '\\' + big + 'r' + close,
        configuration.parser.stack.env,
        configuration
      ).mml();
    } else {
      const closeNode = nf.create('text', close);
      mo = nf.create(
        'node',
        'mo',
        [],
        {
          fence: true,
          stretchy: true,
          symmetric: true,
          texClass: TEXCLASS.CLOSE,
        },
        closeNode
      );
    }
    if (color) {
      mo.attributes.set('mathcolor', color);
    }
    NodeUtil.appendChildren(mrow, [mo]);
    return mrow;
  },

  /**
   *  Create an mrow that has \\mathchoice using \\bigg and \\big for the delimiters.
   *
   * @param {ParseOptions} configuration The current parse options.
   * @param {string} open The opening fence.
   * @param {MmlNode} mml The enclosed node.
   * @param {string} close The closing fence.
   * @returns {MmlNode} The mrow node.
   */
  fixedFence(
    configuration: ParseOptions,
    open: string,
    mml: MmlNode,
    close: string
  ): MmlNode {
    // @test Choose, Over With Delims, Above with Delims
    const mrow = configuration.nodeFactory.create('node', 'mrow', [], {
      open: open,
      close: close,
      texClass: TEXCLASS.ORD,
    });
    if (open) {
      NodeUtil.appendChildren(mrow, [
        ParseUtil.mathPalette(configuration, open, 'l'),
      ]);
    }
    if (NodeUtil.isType(mml, 'mrow')) {
      NodeUtil.appendChildren(mrow, NodeUtil.getChildren(mml));
    } else {
      NodeUtil.appendChildren(mrow, [mml]);
    }
    if (close) {
      NodeUtil.appendChildren(mrow, [
        ParseUtil.mathPalette(configuration, close, 'r'),
      ]);
    }
    return mrow;
  },

  /**
   * Generates a mathchoice element for fences. These will be resolved later,
   * once the position, and therefore size, of the of the fenced expression is
   * known.
   *
   * @param {ParseOptions} configuration The current parse otpions.
   * @param {string} fence The fence.
   * @param {string} side The side of the fence (l or r).
   * @returns {MmlNode} The mathchoice node.
   */
  mathPalette(
    configuration: ParseOptions,
    fence: string,
    side: string
  ): MmlNode {
    if (fence === '{' || fence === '}') {
      fence = '\\' + fence;
    }
    const D = '{\\bigg' + side + ' ' + fence + '}';
    const T = '{\\big' + side + ' ' + fence + '}';
    return new TexParser(
      '\\mathchoice' + D + T + T + T,
      {},
      configuration
    ).mml();
  },

  /**
   * If the initial child, skipping any initial space or
   * empty braces (TeXAtom with child being an empty inferred row),
   * is an <mo>, precede it by an empty <mi> to force the <mo> to
   * be infix.
   *
   * @param {ParseOptions} configuration The current parse options.
   * @param {MmlNode[]} nodes The row of nodes to scan for an initial <mo>
   */
  fixInitialMO(configuration: ParseOptions, nodes: MmlNode[]) {
    for (let i = 0, m = nodes.length; i < m; i++) {
      const child = nodes[i];
      if (
        child &&
        !NodeUtil.isType(child, 'mspace') &&
        (!NodeUtil.isType(child, 'TeXAtom') ||
          (NodeUtil.getChildren(child)[0] &&
            NodeUtil.getChildren(NodeUtil.getChildren(child)[0]).length))
      ) {
        if (
          NodeUtil.isEmbellished(child) ||
          (NodeUtil.isType(child, 'TeXAtom') &&
            NodeUtil.getTexClass(child) === TEXCLASS.REL)
        ) {
          const mi = configuration.nodeFactory.create('node', 'mi');
          nodes.unshift(mi);
        }
        break;
      }
    }
  },

  /**
   * Break up a string into text and math blocks.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} text The text in the math expression to parse.
   * @param {number|string=} level The scriptlevel.
   * @param {string} font The mathvariant to use
   * @returns {MmlNode[]} The nodes corresponding to the internal math expression.
   */
  internalMath(
    parser: TexParser,
    text: string,
    level?: number | string,
    font?: string
  ): MmlNode[] {
    text = text.replace(/ +/g, ' ');
    if (parser.configuration.options.internalMath) {
      return parser.configuration.options.internalMath(
        parser,
        text,
        level,
        font
      );
    }
    const mathvariant = font || parser.stack.env.font;
    const def = mathvariant ? { mathvariant } : {};
    let mml: MmlNode[] = [],
      i = 0,
      k = 0,
      c,
      node,
      match = '',
      braces = 0;
    if (text.match(/\\?[${}\\]|\\\(|\\(?:eq)?ref\s*\{|\\U/)) {
      while (i < text.length) {
        c = text.charAt(i++);
        if (c === '$') {
          if (match === '$' && braces === 0) {
            // @test Interspersed Text
            node = parser.create('node', 'TeXAtom', [
              new TexParser(
                text.slice(k, i - 1),
                {},
                parser.configuration
              ).mml(),
            ]);
            mml.push(node);
            match = '';
            k = i;
          } else if (match === '') {
            // @test Interspersed Text
            if (k < i - 1) {
              // @test Interspersed Text
              mml.push(
                ParseUtil.internalText(parser, text.slice(k, i - 1), def)
              );
            }
            match = '$';
            k = i;
          }
        } else if (c === '{' && match !== '') {
          // @test Mbox Mbox, Mbox Math
          braces++;
        } else if (c === '}') {
          // @test Mbox Mbox, Mbox Math
          if (match === '}' && braces === 0) {
            // @test Mbox Eqref, Mbox Math
            const atom = new TexParser(
              text.slice(k, i),
              {},
              parser.configuration
            ).mml();
            node = parser.create('node', 'TeXAtom', [atom], def);
            mml.push(node);
            match = '';
            k = i;
          } else if (match !== '') {
            // @test Mbox Math, Mbox Mbox
            if (braces) {
              // @test Mbox Math, Mbox Mbox
              braces--;
            }
          }
        } else if (c === '\\') {
          // @test Mbox Eqref, Mbox CR
          if (match === '' && text.substring(i).match(/^(eq)?ref\s*\{/)) {
            // @test Mbox Eqref
            const len = ((RegExp as any)['$&'] as string).length;
            if (k < i - 1) {
              // @test Mbox Eqref
              mml.push(
                ParseUtil.internalText(parser, text.slice(k, i - 1), def)
              );
            }
            match = '}';
            k = i - 1;
            i += len;
          } else {
            // @test Mbox CR, Mbox Mbox
            c = text.charAt(i++);
            if (c === '(' && match === '') {
              // @test Mbox Internal Display
              if (k < i - 2) {
                // @test Mbox Internal Display
                mml.push(
                  ParseUtil.internalText(parser, text.slice(k, i - 2), def)
                );
              }
              match = ')';
              k = i;
            } else if (c === ')' && match === ')' && braces === 0) {
              // @test Mbox Internal Display
              node = parser.create('node', 'TeXAtom', [
                new TexParser(
                  text.slice(k, i - 2),
                  {},
                  parser.configuration
                ).mml(),
              ]);
              mml.push(node);
              match = '';
              k = i;
            } else if (c.match(/[${}\\]/) && match === '') {
              // @test Mbox CR
              i--;
              text = text.substring(0, i - 1) + text.substring(i); // remove \ from \$, \{, \}, or \\
            } else if (c === 'U') {
              const arg = text
                .substring(i)
                .match(/^\s*(?:([0-9A-F])|\{\s*([0-9A-F]+)\s*\})/);
              if (!arg) {
                throw new TexError(
                  'BadRawUnicode',
                  'Argument to %1 must a hexadecimal number with 1 to 6 digits',
                  '\\U'
                );
              }
              //  Replace \U{...} with specified character
              const c = String.fromCodePoint(parseInt(arg[1] || arg[2], 16));
              text =
                text.substring(0, i - 2) +
                c +
                text.substring(i + arg[0].length);
              i = i - 2 + c.length;
            }
          }
        }
      }
      if (match !== '') {
        // @test Internal Math Error
        throw new TexError(
          'MathNotTerminated',
          'Math mode is not properly terminated'
        );
      }
    }
    if (k < text.length) {
      // @test Interspersed Text, Mbox Mbox
      mml.push(ParseUtil.internalText(parser, text.slice(k), def));
    }
    if (level != null) {
      // @test Label, Fbox, Hbox
      mml = [
        parser.create('node', 'mstyle', mml, {
          displaystyle: false,
          scriptlevel: level,
        }),
      ];
    } else if (mml.length > 1) {
      // @test Interspersed Text
      mml = [parser.create('node', 'mrow', mml)];
    }
    return mml;
  },

  /**
   * Parses text internal to boxes or labels.
   *
   * @param {TexParser} parser The current tex parser.
   * @param {string} text The text to parse.
   * @param {EnvList} def The attributes of the text node.
   * @returns {MmlNode} The text node.
   */
  internalText(parser: TexParser, text: string, def: EnvList): MmlNode {
    // @test Label, Fbox, Hbox
    text = text
      .replace(/\n+/g, ' ')
      .replace(/^ +/, entities.nbsp)
      .replace(/ +$/, entities.nbsp);
    const textNode = parser.create('text', text);
    return parser.create('node', 'mtext', [], def, textNode);
  },

  /**
   * Create an munderover node with the given script position.
   *
   * @param {TexParser} parser   The current TeX parser.
   * @param {MmlNode} base       The base node.
   * @param {MmlNode} script     The under- or over-script.
   * @param {string} pos         Either 'over' or 'under'.
   * @param {boolean} stack      True if super- or sub-scripts should stack.
   * @returns {MmlNode}           The generated node (MmlMunderover or TeXAtom)
   */
  underOver(
    parser: TexParser,
    base: MmlNode,
    script: MmlNode,
    pos: string,
    stack: boolean
  ): MmlNode {
    // @test Overline
    ParseUtil.checkMovableLimits(base);
    if (NodeUtil.isType(base, 'munderover') && NodeUtil.isEmbellished(base)) {
      // @test Overline Limits
      NodeUtil.setProperties(NodeUtil.getCoreMO(base), {
        lspace: 0,
        rspace: 0,
      });
      const mo = parser.create('node', 'mo', [], { rspace: 0 });
      base = parser.create('node', 'mrow', [mo, base]);
      // TODO? add an empty <mi> so it's not embellished any more
    }
    const mml = parser.create('node', 'munderover', [base]) as MmlMunderover;
    NodeUtil.setChild(mml, pos === 'over' ? mml.over : mml.under, script);
    let node: MmlNode = mml;
    if (stack) {
      // @test Overbrace 1 2 3, Underbrace, Overbrace Op 1 2
      node = parser.create(
        'node',
        'TeXAtom',
        [
          parser.create('node', 'mstyle', [mml], {
            displaystyle: true,
            scriptlevel: 0,
          }),
        ],
        {
          texClass: TEXCLASS.OP,
          movesupsub: true,
        }
      );
    }
    NodeUtil.setProperty(node, 'subsupOK', true);
    return node;
  },

  /**
   * Set movablelimits to false if necessary.
   *
   * @param {MmlNode} base   The base node being tested.
   */
  checkMovableLimits(base: MmlNode) {
    const symbol = NodeUtil.isType(base, 'mo') ? NodeUtil.getForm(base) : null;
    if (
      NodeUtil.getProperty(base, 'movablelimits') ||
      (symbol && symbol[3] && symbol[3].movablelimits)
    ) {
      // @test Overline Sum
      NodeUtil.setProperties(base, { movablelimits: false });
    }
  },

  /**
   * Sets alignment in array definitions.
   *
   * @param {ArrayItem} array The array item.
   * @param {string} align The alignment string.
   * @param {TexParser?} parser The current tex parser.
   * @returns {ArrayItem} The altered array item.
   */
  setArrayAlign(
    array: ArrayItem,
    align: string,
    parser?: TexParser
  ): ArrayItem {
    // @test Array1, Array2, Array Test
    if (!parser) {
      align = UnitUtil.trimSpaces(align || '');
    }
    if (align === 't') {
      array.arraydef.align = 'baseline 1';
    } else if (align === 'b') {
      array.arraydef.align = 'baseline -1';
    } else if (align === 'c') {
      array.arraydef.align = 'axis';
    } else if (align) {
      if (parser) {
        parser.string = `[${align}]` + parser.string.slice(parser.i);
        parser.i = 0;
      } else {
        array.arraydef.align = align;
      }
    }
    return array;
  },

  /**
   * Replace macro parameters with their values.
   *
   * @param {TexParser} parser The current TeX parser.
   * @param {string[]} args A list of arguments for macro parameters.
   * @param {string} str The macro parameter string.
   * @returns {string} The string with all parameters replaced by arguments.
   */
  substituteArgs(parser: TexParser, args: string[], str: string): string {
    let text = '';
    let newstring = '';
    let i = 0;
    while (i < str.length) {
      let c = str.charAt(i++);
      if (c === '\\') {
        text += c + str.charAt(i++);
      } else if (c === '#') {
        c = str.charAt(i++);
        if (c === '#') {
          text += c;
        } else {
          if (!c.match(/[1-9]/) || parseInt(c, 10) > args.length) {
            throw new TexError(
              'IllegalMacroParam',
              'Illegal macro parameter reference'
            );
          }
          newstring = ParseUtil.addArgs(
            parser,
            ParseUtil.addArgs(parser, newstring, text),
            args[parseInt(c, 10) - 1]
          );
          text = '';
        }
      } else {
        text += c;
      }
    }
    return ParseUtil.addArgs(parser, newstring, text);
  },

  /**
   * Adds a new expanded argument to an already macro parameter string.  Makes
   * sure that macros are followed by a space if their names could accidentally
   * be continued into the following text.
   *
   * @param {TexParser} parser The current TeX parser.
   * @param {string} s1 The already expanded string.
   * @param {string} s2 The string to add.
   * @returns {string} The combined string.
   */
  addArgs(parser: TexParser, s1: string, s2: string): string {
    if (s2.match(/^[a-z]/i) && s1.match(/(^|[^\\])(\\\\)*\\[a-z]+$/i)) {
      s1 += ' ';
    }
    if (s1.length + s2.length > parser.configuration.options['maxBuffer']) {
      throw new TexError(
        'MaxBufferSize',
        'MathJax internal buffer size exceeded; is there a' +
          ' recursive macro call?'
      );
    }
    return s1 + s2;
  },

  /**
   * Report an error if there are too many macro substitutions.
   *
   * @param {TexParser} parser The current TeX parser.
   * @param {boolean} isMacro  True if we are substituting a macro, false for environment.
   */
  checkMaxMacros(parser: TexParser, isMacro: boolean = true) {
    if (++parser.macroCount <= parser.configuration.options['maxMacros']) {
      return;
    }
    if (isMacro) {
      throw new TexError(
        'MaxMacroSub1',
        'MathJax maximum macro substitution count exceeded; ' +
          'is here a recursive macro call?'
      );
    } else {
      throw new TexError(
        'MaxMacroSub2',
        'MathJax maximum substitution count exceeded; ' +
          'is there a recursive latex environment?'
      );
    }
  },

  /**
   *  Check for bad nesting of equation environments
   *
   * @param {TexParser} parser The current parser.
   * @param {boolean=} nestable Is the environment nestable?
   */
  checkEqnEnv(parser: TexParser, nestable: boolean = true) {
    const top = parser.stack.Top();
    const first = top.First;
    //
    // The gather environment can include align and others, but only one level deep.
    //
    if (
      (top.getProperty('nestable') && nestable && !first) ||
      top.getProperty('nestStart')
    ) {
      return;
    }
    if (!top.isKind('start') || first) {
      throw new TexError(
        'ErroneousNestingEq',
        'Erroneous nesting of equation structures'
      );
    }
  },

  /**
   * Copy an MmlNode and add it (and its children) to the proper lists.
   *
   * @param {MmlNode} node       The MmlNode to copy
   * @param {TexParser} parser   The active tex parser
   * @returns {MmlNode}           The duplicate tree
   */
  copyNode(node: MmlNode, parser: TexParser): MmlNode {
    const tree = node.copy();
    const options = parser.configuration;
    tree.walkTree((n: MmlNode) => {
      options.addNode(n.kind, n);
      const lists = ((n.getProperty('in-lists') as string) || '').split(/,/);
      for (const list of lists) {
        if (list) {
          options.addNode(list, n);
        }
      }
    });
    return tree;
  },

  /**
   * This is a placeholder for future security filtering of attributes.
   *
   * @param {TexParser} _parser The current parser.
   * @param {string} _name The attribute name.
   * @param {string} value The attribute value to filter.
   * @returns {string} The filtered value.
   */
  mmlFilterAttribute(_parser: TexParser, _name: string, value: string): string {
    // TODO: Implement in security package.
    return value;
  },

  /**
   * Initialises an stack environment with current font definition in the parser.
   *
   * @param {TexParser} parser The current tex parser.
   * @returns {EnvList} The initialised environment list.
   */
  getFontDef(parser: TexParser): EnvList {
    const font = parser.stack.env['font'];
    return font ? { mathvariant: font } : {};
  },

  /**
   * Splits a package option list of the form [x=y,z=1] into an attribute list
   * of the form {x: y, z: 1}.
   *
   * @param {string} attrib The attributes of the package.
   * @param {{[key: string]: number}?} allowed A list of allowed options. If
   *     given only allowed arguments are returned.
   * @param {boolean?} error If true, raises an exception if not allowed options
   *     are found.
   * @param {boolean?} l3keys If true, use l3key-style parsing (only remove one set of braces)
   * @returns {EnvList} The attribute list.
   */
  keyvalOptions(
    attrib: string,
    allowed: { [key: string]: number | KeyValueType } = null,
    error: boolean = false,
    l3keys: boolean = false
  ): EnvList {
    const def: EnvList = readKeyval(attrib, l3keys);
    if (allowed) {
      for (const key of Object.keys(def)) {
        if (Object.hasOwn(allowed, key)) {
          //
          // If allowed[key] is a type definition, check the key value against that
          //
          if (allowed[key] instanceof KeyValueDef) {
            const type = allowed[key] as KeyValueDef<any>;
            const value = String(def[key]);
            if (!type.verify(value)) {
              throw new TexError(
                'InvalidValue',
                "Value for key '%1' is not of the expected type",
                key
              );
            }
            def[key] = type.convert(value);
          }
        } else {
          if (error) {
            throw new TexError('InvalidOption', 'Invalid option: %1', key);
          }
          delete def[key];
        }
      }
    }
    return def;
  },

  /**
   * @param {string} c   The character to test.
   * @returns {boolean}   True if the character is Latin or Greek
   */
  isLatinOrGreekChar(c: string): boolean {
    return !!c.normalize('NFD').match(/[a-zA-Z\u0370-\u03F0]/);
  },
};
