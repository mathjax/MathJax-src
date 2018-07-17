/*************************************************************
 *
 *  Copyright (c) 2017 The MathJax Consortium
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
 * @fileoverview The Basic Parse methods.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import * as sitem from './BaseItems.js';
import {StackItem, EnvList} from '../StackItem.js';
import {Symbol, Macro} from '../Symbol.js';
import {ParseMethod} from '../Types.js';
import NodeUtil from '../NodeUtil.js';
import TexError from '../TexError.js';
import TexParser from '../TexParser.js';
import {TexConstant} from '../TexConstants.js';
import ParseUtil from '../ParseUtil.js';
import {MmlNode, TEXCLASS} from '../../../core/MmlTree/MmlNode.js';
import {MmlMsubsup} from '../../../core/MmlTree/MmlNodes/msubsup.js';
import {MmlMunderover} from '../../../core/MmlTree/MmlNodes/munderover.js';
import {MmlMo} from '../../../core/MmlTree/MmlNodes/mo.js';
import {Label} from '../Tags.js';


// Namespace
let BaseMethods: Record<string, ParseMethod> = {};

// TODO: Once we can properly load AllEntities, there should be no need for
//       those anymore.
const PRIME = '\u2032';
const SMARTQUOTE = '\u2019';
const NBSP = '\u00A0';
const P_HEIGHT = 1.2 / .85;   // cmex10 height plus depth over .85

const MmlTokenAllow: {[key: string]: number} = {
  fontfamily: 1, fontsize: 1, fontweight: 1, fontstyle: 1,
  color: 1, background: 1,
  id: 1, 'class': 1, href: 1, style: 1
};


// Handle LaTeX tokens
/**
 *  Handle { 
 */
BaseMethods.Open = function(parser: TexParser, c: string) {
  parser.Push( parser.itemFactory.create('open') );
};

/**
 *  Handle }
 */
BaseMethods.Close = function(parser: TexParser, c: string) {
  parser.Push( parser.itemFactory.create('close') );
};


/**
 *  Handle tilde and spaces
 */
BaseMethods.Tilde = function(parser: TexParser, c: string) {
  // @test Tilde, Tilde2
  const textNode = parser.configuration.nodeFactory.create('text', NBSP);
  const node = parser.configuration.nodeFactory.create('node', 'mtext', [], {}, textNode);
  parser.Push(node);
};
BaseMethods.Space = function(parser: TexParser, c: string) {};

/**
 *  Handle ^
 */
BaseMethods.Superscript = function(parser: TexParser, c: string) {
  if (parser.GetNext().match(/\d/)) {
    // don't treat numbers as a unit
    parser.string = parser.string.substr(0, parser.i + 1) +
      ' ' + parser.string.substr(parser.i + 1);
  }
  let primes: MmlNode;
  let base: MmlNode | void;
  const top = parser.stack.Top();
  if (top.isKind('prime')) {
    // @test Prime on Prime
    [base, primes] = top.TopN(2);
    parser.stack.Pop();
  } else {
    // @test Empty base2, Square, Cube
    base = parser.stack.Prev();
    if (!base) {
      // @test Empty base
      base = parser.configuration.nodeFactory.create('token', 'mi', {}, '');
    }
  }
  const movesupsub = NodeUtil.getProperty(base, 'movesupsub');
  let position = NodeUtil.isType(base, 'msubsup') ? (base as MmlMsubsup).sup :
    (base as MmlMunderover).over;
  if ((NodeUtil.isType(base, 'msubsup') && NodeUtil.getChildAt(base, (base as MmlMsubsup).sup)) ||
      (NodeUtil.isType(base, 'munderover') && NodeUtil.getChildAt(base, (base as MmlMunderover).over) &&
       !NodeUtil.getProperty(base, 'subsupOK'))) {
    // @test Double-super-error, Double-over-error
    throw new TexError('DoubleExponent', 'Double exponent: use braces to clarify');
  }
  if (!NodeUtil.isType(base, 'msubsup')) {
    if (movesupsub) {
      // @test Move Superscript, Large Operator
      if (!NodeUtil.isType(base, 'munderover') || NodeUtil.getChildAt(base, (base as MmlMunderover).over)) {
        if (NodeUtil.getProperty(base, 'movablelimits') && NodeUtil.isType(base, 'mi')) {
          // @test Mathop Super
          base = ParseUtil.mi2mo(parser, base);
        }
        // @test Large Operator
        base = parser.configuration.nodeFactory.create('node', 'munderover', [base], {movesupsub: true});
      }
      position = (base as MmlMunderover).over;
    } else {
      // @test Empty base, Empty base2, Square, Cube
      base = parser.configuration.nodeFactory.create('node', 'msubsup', [base], {});
      position = (base as MmlMsubsup).sup;
    }
  }
  parser.Push(
    parser.itemFactory.create('subsup', base).setProperties({
      position: position, primes: primes, movesupsub: movesupsub
    }) );
};


/**
 *  Handle _
 */
BaseMethods.Subscript = function(parser: TexParser, c: string) {
  if (parser.GetNext().match(/\d/)) {
    // don't treat numbers as a unit
    parser.string =
      parser.string.substr(0, parser.i + 1) + ' ' +
      parser.string.substr(parser.i + 1);
  }
  let primes, base;
  const top = parser.stack.Top();
  if (top.isKind('prime')) {
    // @test Prime on Sub
    [base, primes] = top.TopN(2);
    parser.stack.Pop();
  } else {
    base = parser.stack.Prev();
    if (!base) {
      // @test Empty Base Index
      base = parser.configuration.nodeFactory.create('token', 'mi', {}, '');
    }
  }
  const movesupsub = NodeUtil.getProperty(base, 'movesupsub');
  let position = NodeUtil.isType(base, 'msubsup') ?
    (base as MmlMsubsup).sub : (base as MmlMunderover).under;
  if ((NodeUtil.isType(base, 'msubsup') &&
       NodeUtil.getChildAt(base, (base as MmlMsubsup).sub)) ||
      (NodeUtil.isType(base, 'munderover') &&
       NodeUtil.getChildAt(base, (base as MmlMunderover).under) &&
       !NodeUtil.getProperty(base, 'subsupOK'))) {
    // @test Double-sub-error, Double-under-error
    throw new TexError('DoubleSubscripts', 'Double subscripts: use braces to clarify');
  }
  if (!NodeUtil.isType(base, 'msubsup')) {
    if (movesupsub) {
      // @test Large Operator, Move Superscript
      if (!NodeUtil.isType(base, 'munderover') ||
          NodeUtil.getChildAt(base, (base as MmlMunderover).under)) {
        if (NodeUtil.getProperty(base, 'movablelimits') &&
            NodeUtil.isType(base, 'mi')) {
          // @test Mathop Sub
          base = ParseUtil.mi2mo(parser, base);
        }
        // @test Move Superscript
        base = parser.configuration.nodeFactory.create('node', 'munderover', [base], {movesupsub: true});
      }
      position = (base as MmlMunderover).under;
    } else {
      // @test Empty Base Index, Empty Base Index2, Index
      base = parser.configuration.nodeFactory.create('node', 'msubsup', [base], {});
      position = (base as MmlMsubsup).sub;
    }
  }
  parser.Push(
    parser.itemFactory.create('subsup', base).setProperties({
      position: position, primes: primes, movesupsub: movesupsub
    }) );
};


/**
 *  Handle '
 */
BaseMethods.Prime = function(parser: TexParser, c: string) {
  // @test Prime
  let base = parser.stack.Prev();
  if (!base) {
    // @test PrimeSup, PrePrime, Prime on Sup
    base = parser.configuration.nodeFactory.create('node', 'mi', [], {});
  }
  if (NodeUtil.isType(base, 'msubsup') &&
      NodeUtil.getChildAt(base, (base as MmlMsubsup).sup)) {
    // @test Double Prime Error
    throw new TexError('DoubleExponentPrime',
                        'Prime causes double exponent: use braces to clarify');
  }
  let sup = '';
  parser.i--;
  do {
    sup += PRIME; parser.i++, c = parser.GetNext();
  } while (c === '\'' || c === SMARTQUOTE);
  sup = ['', '\u2032', '\u2033', '\u2034', '\u2057'][sup.length] || sup;
  const node = parser.configuration.nodeFactory.create('token', 'mo', {}, sup);
  parser.Push(
    parser.itemFactory.create('prime', base, node) );
};


/**
 *  Handle comments
 */
BaseMethods.Comment = function(parser: TexParser, c: string) {
  while (parser.i < parser.string.length && parser.string.charAt(parser.i) !== '\n') {
    parser.i++;
  }
};


/**
 *  Handle hash marks outside of definitions
 */
BaseMethods.Hash = function(parser: TexParser, c: string) {
  // @test Hash Error
  throw new TexError('CantUseHash1',
                      'You can\'t use \'macro parameter character #\' in math mode');
};



// Handle LaTeX Macros
/**
 *  Macros
 */
BaseMethods.SetFont = function(parser: TexParser, name: string, font: string) {
  parser.stack.env['font'] = font;
};

BaseMethods.SetStyle = function(parser: TexParser, name: string,
                                texStyle: string, style: string,
                                level: string) {
  parser.stack.env['style'] = texStyle; parser.stack.env['level'] = level;
  parser.Push(
    parser.itemFactory.create('style').setProperties(
      {styles: {displaystyle: style, scriptlevel: level}}) );
};

BaseMethods.SetSize = function(parser: TexParser, name: string, size: string) {
  parser.stack.env['size'] = size;
  parser.Push(
    parser.itemFactory.create('style').setProperties({styles: {mathsize: size + 'em'}}) );
};

// TODO: Will be replace by the color extension!
BaseMethods.Color = function(parser: TexParser, name: string) {
  // @test Color Frac
  const color = parser.GetArgument(name);
  const old = parser.stack.env['color'];
  parser.stack.env['color'] = color;
  const math = parser.ParseArg(name);
  if (old) {
    parser.stack.env['color'];
  } else {
    delete parser.stack.env['color'];
  }
  const node = parser.configuration.nodeFactory.create('node', 'mstyle', [math], {mathcolor: color});
  parser.Push(node);
};

BaseMethods.Spacer = function(parser: TexParser, name: string, space: string) {
  // @test Positive Spacing, Negative Spacing
  const node = parser.configuration.nodeFactory.create('node', 'mspace', [],
                                                       {width: space, scriptlevel: 0});
  parser.Push(node);
};

BaseMethods.LeftRight = function(parser: TexParser, name: string) {
  // @test Fenced, Fenced3
  const alpha = name.substr(1);
  parser.Push(
    parser.itemFactory.create(alpha)
      .setProperties({delim: parser.GetDelimiter(name)}) );
};

BaseMethods.Middle = function(parser: TexParser, name: string) {
  // @test Middle
  const delim = parser.GetDelimiter(name);
  let node = parser.configuration.nodeFactory.create('node', 'TeXAtom', [], {texClass: TEXCLASS.CLOSE});
  parser.Push(node);
  if (!parser.stack.Top().isKind('left')) {
    // @test Orphan Middle, Middle with Right
    throw new TexError('MisplacedMiddle',
                        '%1 must be within \\left and \\right', parser.currentCS);
  }
  node = parser.configuration.nodeFactory.create('token', 'mo', {stretchy: true}, delim);
  parser.Push(node);
  node = parser.configuration.nodeFactory.create('node', 'TeXAtom', [], {texClass: TEXCLASS.OPEN});
  parser.Push(node);
};

BaseMethods.NamedFn = function(parser: TexParser, name: string, id: string) {
  // @test Named Function
  if (!id) {
    id = name.substr(1);
  }
  const mml = parser.configuration.nodeFactory.create('token', 'mi', {texClass: TEXCLASS.OP}, id);
  parser.Push( parser.itemFactory.create('fn', mml) );
};
BaseMethods.NamedOp = function(parser: TexParser, name: string, id: string) {
  // @test Limit
  if (!id) {
    id = name.substr(1);
  }
  id = id.replace(/&thinsp;/, '\u2006');
  const mml = parser.configuration.nodeFactory.create('token', 'mo', {
    movablelimits: true,
    movesupsub: true,
    form: TexConstant.Form.PREFIX,
    texClass: TEXCLASS.OP
  }, id);
  parser.Push(mml);
};

BaseMethods.Limits = function(parser: TexParser, name: string, limits: string) {
  // @test Limits
  let op = parser.stack.Prev(true);
  // Get the texclass for the core operator. Q: Davide?
  if (!op || (NodeUtil.getTexClass(NodeUtil.getCoreMO(op)) !== TEXCLASS.OP &&
              NodeUtil.getProperty(op, 'movesupsub') == null)) {
    // @test Limits Error
    throw new TexError('MisplacedLimits', '%1 is allowed only on operators', parser.currentCS);
  }
  const top = parser.stack.Top();
  let node;
  if (NodeUtil.isType(op, 'munderover') && !limits) {
    // @test Limits UnderOver
    node = parser.configuration.nodeFactory.create('node', 'msubsup', [], {});
    NodeUtil.copyChildren(op, node);
    op = top.Last = node;
  } else if (NodeUtil.isType(op, 'msubsup') && limits) {
    // @test Limits SubSup
    // node = parser.configuration.nodeFactory.create('node', 'munderover', NodeUtil.getChildren(op), {});
    // Needs to be copied, otherwise we get an error in MmlNode.appendChild!
    node = parser.configuration.nodeFactory.create('node', 'munderover', [], {});
    NodeUtil.copyChildren(op, node);
    op = top.Last = node;
  }
  NodeUtil.setProperties(op, {'movesupsub': limits ? true : false});
  NodeUtil.setProperties(NodeUtil.getCoreMO(op), {'movablelimits': false});
  if (NodeUtil.getAttribute(op, 'movablelimits') ||
      NodeUtil.getProperty(op, 'movablelimits')) {
    NodeUtil.setProperties(op, {'movablelimits': false});
  }
};

BaseMethods.Over = function(parser: TexParser, name: string, open: string, close: string) {
  // @test Over
  const mml = parser.itemFactory.create('over').setProperties({name: parser.currentCS}) ;
  if (open || close) {
    // @test Choose
    mml.setProperty('open', open);
    mml.setProperty('close', close);
  } else if (name.match(/withdelims$/)) {
    // @test Over With Delims, Above With Delims
    mml.setProperty('open', parser.GetDelimiter(name));
    mml.setProperty('close', parser.GetDelimiter(name));
  }
  if (name.match(/^\\above/)) {
    // @test Above, Above With Delims
    mml.setProperty('thickness', parser.GetDimen(name));
  }
  else if (name.match(/^\\atop/) || open || close) {
    // @test Choose
    mml.setProperty('thickness', 0);
  }
  parser.Push(mml);
};

BaseMethods.Frac = function(parser: TexParser, name: string) {
  // @test Frac
  const num = parser.ParseArg(name);
  const den = parser.ParseArg(name);
  const node = parser.configuration.nodeFactory.create('node', 'mfrac', [num, den], {});
  parser.Push(node);
};

BaseMethods.Sqrt = function(parser: TexParser, name: string) {
  const n = parser.GetBrackets(name);
  let arg = parser.GetArgument(name);
  if (arg === '\\frac') {
    arg  += '{' + parser.GetArgument(arg) + '}{' + parser.GetArgument(arg) + '}';
  }
  let mml = new TexParser(arg, parser.stack.env, parser.configuration).mml();
  if (!n) {
    // @test Square Root
    mml = parser.configuration.nodeFactory.create('node', 'msqrt', [mml], {});
  } else {
    // @test General Root
    mml = parser.configuration.nodeFactory.create('node', 'mroot', [mml, parseRoot(parser, n)], {});
  }
  parser.Push(mml);
};


// Utility
function parseRoot(parser: TexParser, n: string) {
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
    node = parser.configuration.nodeFactory.create('node', 'mpadded', [node], def);
  }
  env['inRoot'] = inRoot;
  return node;
};


BaseMethods.Root = function(parser: TexParser, name: string) {
  const n = parser.GetUpTo(name, '\\of');
  const arg = parser.ParseArg(name);
  const node = parser.configuration.nodeFactory.create('node', 'mroot', [arg, parseRoot(parser, n)], {});
  parser.Push(node);
};


BaseMethods.MoveRoot = function(parser: TexParser, name: string, id: string) {
  // @test Tweaked Root
  if (!parser.stack.env['inRoot']) {
    // @test Misplaced Move Root
    throw new TexError('MisplacedMoveRoot', '%1 can appear only within a root', parser.currentCS);
  }
  if (parser.stack.global[id]) {
    // @test Multiple Move Root
    throw new TexError('MultipleMoveRoot', 'Multiple use of %1', parser.currentCS);
  }
  let n = parser.GetArgument(name);
  if (!n.match(/-?[0-9]+/)) {
    // @test Incorrect Move Root
    throw new TexError('IntegerArg', 'The argument to %1 must be an integer', parser.currentCS);
  }
  n = (parseInt(n, 10) / 15) + 'em';
  if (n.substr(0, 1) !== '-') {
    n = '+' + n;
  }
  parser.stack.global[id] = n;
};

BaseMethods.Accent = function(parser: TexParser, name: string, accent: string, stretchy: boolean) {
  // @test Vector
  const c = parser.ParseArg(name);
  const def: EnvList = {accent: true};
  if (parser.stack.env['font']) {
    // @test Vector Font
    def['mathvariant'] = parser.stack.env['font'];
  }
  const entity = NodeUtil.createEntity(accent);
  const moNode = parser.configuration.nodeFactory.create('token', 'mo', def, entity);
  const mml = moNode;
  NodeUtil.setAttribute(mml, 'stretchy', stretchy ? true : false);
  // @test Vector Op, Vector
  const mo = (NodeUtil.isEmbellished(c) ? NodeUtil.getCoreMO(c) : c);
  if (NodeUtil.isType(mo, 'mo')) {
    // @test Vector Op
    NodeUtil.setProperties(mo, {'movablelimits': false});
  }
  const muoNode = parser.configuration.nodeFactory.create('node', 'munderover', [], {});
  // TODO: This is necessary to get the empty element into the children.
  NodeUtil.setData(muoNode, 0, c);
  NodeUtil.setData(muoNode, 1, null);
  NodeUtil.setData(muoNode, 2, mml);
  let texAtom = parser.configuration.nodeFactory.create('node', 'TeXAtom', [muoNode], {});
  parser.Push(texAtom);
};

BaseMethods.UnderOver = function(parser: TexParser, name: string, c: string, stack: boolean, noaccent: boolean) {
  // @test Overline
  let base = parser.ParseArg(name);
  let symbol = NodeUtil.getForm(base);
  if ((symbol && symbol[3] && symbol[3]['movablelimits'])
      || NodeUtil.getProperty(base, 'movablelimits')) {
    // @test Overline Sum
    NodeUtil.setProperties(base, {'movablelimits': false});
  }
  let mo;
  if (NodeUtil.isType(base, 'munderover') && NodeUtil.isEmbellished(base)) {
    // @test Overline Limits
    NodeUtil.setProperties(NodeUtil.getCoreMO(base), {lspace: 0, rspace: 0}); // get spacing right for NativeMML
    mo = parser.configuration.nodeFactory.create('node', 'mo', [], {rspace: 0});
    base = parser.configuration.nodeFactory.create('node', 'mrow', [mo, base], {});  // add an empty <mi> so it's not embellished any more
  }
  const mml = parser.configuration.nodeFactory.create('node', 'munderover', [base], {}) as MmlMunderover;
  const entity = NodeUtil.createEntity(c);
  mo = parser.configuration.nodeFactory.create('token', 'mo', {stretchy: true, accent: !noaccent}, entity);

  NodeUtil.setData(mml, name.charAt(1) === 'o' ?  mml.over : mml.under,
                     mo);
  let node: MmlNode = mml;
  if (stack) {
    // @test Overbrace 1 2 3, Underbrace, Overbrace Op 1 2
    node = parser.configuration.nodeFactory.create('node', 'TeXAtom', [mml], {texClass: TEXCLASS.OP, movesupsub: true});
  }
  // TODO: Sort these properties out!
  NodeUtil.setProperties(node, {subsupOK: true});
  parser.Push(node);
};

BaseMethods.Overset = function(parser: TexParser, name: string) {
  // @test Overset
  const top = parser.ParseArg(name), base = parser.ParseArg(name);
  if (NodeUtil.getAttribute(base, 'movablelimits') || NodeUtil.getProperty(base, 'movablelimits')) {
    NodeUtil.setProperties(base, {'movablelimits': false});
  }
  const node = parser.configuration.nodeFactory.create('node', 'mover', [base, top], {});
  parser.Push(node);
};

BaseMethods.Underset = function(parser: TexParser, name: string) {
  // @test Underset
  const bot = parser.ParseArg(name), base = parser.ParseArg(name);
  if (NodeUtil.getAttribute(base, 'movablelimits') || NodeUtil.getProperty(base, 'movablelimits')) {
    // @test Overline Sum
    NodeUtil.setProperties(base, {'movablelimits': false});
  }
  const node = parser.configuration.nodeFactory.create('node', 'munder', [base, bot], {});
  parser.Push(node);
};

BaseMethods.TeXAtom = function(parser: TexParser, name: string, mclass: number) {
  let def: EnvList = {texClass: mclass};
  let mml: StackItem | MmlNode;
  let node: MmlNode;
  let parsed: MmlNode;
  if (mclass === TEXCLASS.OP) {
    def['movesupsub'] = def['movablelimits'] = true;
    const arg = parser.GetArgument(name);
    const match = arg.match(/^\s*\\rm\s+([a-zA-Z0-9 ]+)$/);
    if (match) {
      // @test Mathop
      def['mathvariant'] = TexConstant.Variant.NORMAL;
      node = parser.configuration.nodeFactory.create('token', 'mi', def, match[1]);
      mml = parser.itemFactory.create('fn', node);
    } else {
      // @test Mathop Cal
      parsed = new TexParser(arg, parser.stack.env, parser.configuration).mml();
      node = parser.configuration.nodeFactory.create('node', 'TeXAtom', [parsed], def);
      mml = parser.itemFactory.create('fn', node);
    }
  } else {
    // @test Mathrel
    parsed = parser.ParseArg(name);
    mml = parser.configuration.nodeFactory.create('node', 'TeXAtom', [parsed], def);
  }
  parser.Push(mml);
};


BaseMethods.MmlToken = function(parser: TexParser, name: string) {
  // @test Modulo
  const kind = parser.GetArgument(name);
  let attr = parser.GetBrackets(name, '').replace(/^\s+/, '');
  const text = parser.GetArgument(name);
  const def: EnvList = {};
  let node: MmlNode;
  try {
    node = parser.configuration.nodeFactory.create('node', kind, [], {});
  } catch (e) {
    node = null;
  }
  if (!node || !node.isToken) {
    // @test Token Illegal Type, Token Wrong Type
    throw new TexError('NotMathMLToken', '%1 is not a token element', kind);
  }
  while (attr !== '') {
    const match = attr.match(/^([a-z]+)\s*=\s*('[^']*'|'[^']*'|[^ ,]*)\s*,?\s*/i);
    if (!match) {
      // @test Token Invalid Attribute
      throw new TexError('InvalidMathMLAttr', 'Invalid MathML attribute: %1', attr);
    }
    if (node.attributes.getAllDefaults()[match[1]] == null && !MmlTokenAllow[match[1]]) {
      // @test Token Unknown Attribute, Token Wrong Attribute
      throw new TexError('UnknownAttrForElement',
                          '%1 is not a recognized attribute for %2',
                          match[1], kind);
    }
    let value: string | boolean = ParseUtil.MmlFilterAttribute(
      parser, match[1], match[2].replace(/^([''])(.*)\1$/, '$2'));
    if (value) {
      if (value.toLowerCase() === 'true') {
        value = true;
      }
      else if (value.toLowerCase() === 'false') {
        value = false;
      }
      def[match[1]] = value;
    }
    attr = attr.substr(match[0].length);
  }
  const textNode = parser.configuration.nodeFactory.create('text', text);
  node.appendChild(textNode);
  NodeUtil.setProperties(node, def);
  parser.Push(node);
};


BaseMethods.Strut = function(parser: TexParser, name: string) {
  // @test Strut
  // TODO: Do we still need this row as it is implicit?
  const row = parser.configuration.nodeFactory.create('node', 'mrow', [], {});
  const padded = parser.configuration.nodeFactory.create('node', 'mpadded', [row],
                                                         {height: '8.6pt', depth: '3pt', width: 0});
  parser.Push(padded);
};

BaseMethods.Phantom = function(parser: TexParser, name: string, v: string, h: string) {
  // @test Phantom
  let box = parser.configuration.nodeFactory.create('node', 'mphantom', [parser.ParseArg(name)], {});
  if (v || h) {
    // TEMP: Changes here
    box = parser.configuration.nodeFactory.create('node', 'mpadded', [box], {});
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
  const atom = parser.configuration.nodeFactory.create('node', 'TeXAtom', [box], {});
  parser.Push(atom);
};

BaseMethods.Smash = function(parser: TexParser, name: string) {
  // @test Smash, Smash Top, Smash Bottom
  const bt = ParseUtil.trimSpaces(parser.GetBrackets(name, ''));
  const smash = parser.configuration.nodeFactory.create('node', 'mpadded', [parser.ParseArg(name)], {});
  // TEMP: Changes here:
  switch (bt) {
  case 'b': NodeUtil.setAttribute(smash, 'depth', 0); break;
  case 't': NodeUtil.setAttribute(smash, 'height', 0); break;
  default:
    NodeUtil.setAttribute(smash, 'height', 0);
    NodeUtil.setAttribute(smash, 'depth', 0);
  }
  const atom = parser.configuration.nodeFactory.create('node', 'TeXAtom', [smash], {});
  parser.Push(atom);
};

BaseMethods.Lap = function(parser: TexParser, name: string) {
  // @test Llap, Rlap
  const mml = parser.configuration.nodeFactory.create('node', 'mpadded', [parser.ParseArg(name)], {width: 0});
  if (name === '\\llap') {
    // @test Llap
    NodeUtil.setAttribute(mml, 'lspace', '-1width');
  }
  const atom = parser.configuration.nodeFactory.create('node', 'TeXAtom', [mml], {});
  parser.Push(atom);
};

BaseMethods.RaiseLower = function(parser: TexParser, name: string) {
  // @test Raise, Lower, Raise Negative, Lower Negative
  let h = parser.GetDimen(name);
  let item =
    parser.itemFactory.create('position').setProperties({name: parser.currentCS, move: 'vertical'}) ;
  // TEMP: Changes here:
  if (h.charAt(0) === '-') {
    // @test Raise Negative, Lower Negative
    h = h.slice(1);
    name = name.substr(1) === 'raise' ? '\\lower' : '\\raise';
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
};

BaseMethods.MoveLeftRight = function(parser: TexParser, name: string) {
  // @test Move Left, Move Right, Move Left Negative, Move Right Negative
  let h = parser.GetDimen(name);
  let nh = (h.charAt(0) === '-' ? h.slice(1) : '-' + h);
  if (name === '\\moveleft') {
    let tmp = h;
    h = nh;
    nh = tmp;
  }
  parser.Push(
    parser.itemFactory.create('position').setProperties({
      name: parser.currentCS, move: 'horizontal',
      left:  parser.configuration.nodeFactory.create('node', 'mspace', [], {width: h}),
      right: parser.configuration.nodeFactory.create('node', 'mspace', [], {width: nh})}) );
};

BaseMethods.Hskip = function(parser: TexParser, name: string) {
  // @test Modulo
  const node = parser.configuration.nodeFactory.create('node', 'mspace', [],
                                                       {width: parser.GetDimen(name)});
  parser.Push(node);
};

BaseMethods.Rule = function(parser: TexParser, name: string, style: string) {
  // @test Rule 3D, Space 3D
  const w = parser.GetDimen(name),
  h = parser.GetDimen(name),
  d = parser.GetDimen(name);
  let def: EnvList = {width: w, height: h, depth: d};
  if (style !== 'blank') {
    def['mathbackground'] = (parser.stack.env['color'] || 'black');
  }
  const node = parser.configuration.nodeFactory.create('node', 'mspace', [], def);
  parser.Push(node);
};
BaseMethods.rule = function(parser: TexParser, name: string) {
  // @test Rule 2D
  const v = parser.GetBrackets(name),
  w = parser.GetDimen(name),
  h = parser.GetDimen(name);
  let mml = parser.configuration.nodeFactory.create('node', 'mspace', [], {
    width: w, height: h,
    mathbackground: (parser.stack.env['color'] || 'black') });
  if (v) {
    mml = parser.configuration.nodeFactory.create('node', 'mpadded', [mml], {voffset: v});
    if (v.match(/^\-/)) {
      NodeUtil.setAttribute(mml, 'height', v);
      NodeUtil.setAttribute(mml, 'depth', '+' + v.substr(1));
    } else {
      NodeUtil.setAttribute(mml, 'height', '+' + v);
    }
  }
  parser.Push(mml);
};

BaseMethods.MakeBig = function(parser: TexParser, name: string, mclass: number, size: number) {
  // @test Choose, Over With Delims, Above With Delims
  size *= P_HEIGHT;
  let sizeStr = String(size).replace(/(\.\d\d\d).+/, '$1') + 'em';
  const delim = parser.GetDelimiter(name, true);
  const mo = parser.configuration.nodeFactory.create('token', 'mo', {
    minsize: sizeStr, maxsize: sizeStr,
    fence: true, stretchy: true, symmetric: true
  }, delim);
  const node = parser.configuration.nodeFactory.create('node', 'TeXAtom', [mo], {texClass: mclass});
  parser.Push(node);
};

BaseMethods.BuildRel = function(parser: TexParser, name: string) {
  // @test BuildRel, BuildRel Expression
  const top = parser.ParseUpTo(name, '\\over');
  const bot = parser.ParseArg(name);
  const node = parser.configuration.nodeFactory.create('node', 'munderover', [], {});
  // TODO: This is necessary to get the empty element into the children.
  NodeUtil.setData(node, 0, bot);
  NodeUtil.setData(node, 1, null);
  NodeUtil.setData(node, 2, top);
  const atom = parser.configuration.nodeFactory.create('node', 'TeXAtom', [node], {texClass: TEXCLASS.REL});
  parser.Push(atom);
};

BaseMethods.HBox = function(parser: TexParser, name: string, style: string) {
  // @test Hbox
  parser.PushAll(ParseUtil.internalMath(parser, parser.GetArgument(name), style));
};

BaseMethods.FBox = function(parser: TexParser, name: string) {
  // @test Fbox
  const internal = ParseUtil.internalMath(parser, parser.GetArgument(name));
  const node = parser.configuration.nodeFactory.create('node', 'menclose', internal, {notation: 'box'});
  parser.Push(node);
};

BaseMethods.Not = function(parser: TexParser, name: string) {
  // @test Negation Simple, Negation Complex, Negation Explicit,
  //       Negation Large
  parser.Push( parser.itemFactory.create('not') );
};

BaseMethods.Dots = function(parser: TexParser, name: string) {
  // @test Operator Dots
  const ldotsEntity = NodeUtil.createEntity('2026');
  const cdotsEntity = NodeUtil.createEntity('22EF');
  const ldots = parser.configuration.nodeFactory.create('token', 'mo', {stretchy: false}, ldotsEntity);
  const cdots = parser.configuration.nodeFactory.create('token', 'mo', {stretchy: false}, cdotsEntity);
  parser.Push(
    parser.itemFactory.create('dots').setProperties({
      ldots: ldots,
      cdots: cdots
    }) );
};

BaseMethods.Matrix = function(parser: TexParser, name: string,
                              open: string, close: string, align: string,
                              spacing: string, vspacing: string, style: string,
                              cases: boolean, numbered: boolean) {
  const c = parser.GetNext();
  if (c === '') {
    // @test Matrix Error
    throw new TexError('MissingArgFor', 'Missing argument for %1', parser.currentCS);
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
  const array = parser.itemFactory.create('array').setProperties({requireClose: true});
  array.arraydef = {
    rowspacing: (vspacing || '4pt'),
    columnspacing: (spacing || '1em')
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
};

BaseMethods.Entry = function(parser: TexParser, name: string) {
  // @test Label, Array, Cross Product Formula
  parser.Push(
    parser.itemFactory.create('cell').setProperties({isEntry: true, name: name}) );
  if (parser.stack.Top().getProperty('isCases')) {
    //
    //  Make second column be in \text{...} (unless it is already
    //  in a \text{...}, for backward compatibility).
    //
    const str = parser.string;
    let braces = 0, close = -1, i = parser.i, m = str.length;
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
        throw new TexError('ExtraAlignTab', 'Extra alignment tab in \\cases text');
      } else if (c === '\\') {
        //
        //  If the macro is \cr or \\, end the search, otherwise skip the macro
        //  (multi-letter names don't matter, as we will skip the rest of the
        //   characters in the main loop)
        //
        if (str.substr(i).match(/^((\\cr)[^a-zA-Z]|\\\\)/)) {
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
    const text = str.substr(parser.i, i - parser.i);
    if (!text.match(/^\s*\\text[^a-zA-Z]/) || close !== text.replace(/\s+$/, '').length - 1) {
      const internal = ParseUtil.internalMath(parser, text, 0);
      parser.PushAll(internal);
      parser.i = i;
    }
  }
};

BaseMethods.Cr = function(parser: TexParser, name: string) {
  // @test Cr Linebreak, Misplaced Cr
  parser.Push(
    parser.itemFactory.create('cell').setProperties({isCR: true, name: name}) );
};

BaseMethods.CrLaTeX = function(parser: TexParser, name: string) {
  let n: string;
  if (parser.string.charAt(parser.i) === '[') {
    let dim = parser.GetBrackets(name, '');
    let [value, unit, _] = ParseUtil.matchDimen(dim);
    // @test Custom Linebreak
    if (dim && !value) {
      // @test Dimension Error
      throw new TexError('BracketMustBeDimension',
                          'Bracket argument to %1 must be a dimension', parser.currentCS);
    }
    n = value + unit;
  }
  parser.Push(
    parser.itemFactory.create('cell').setProperties({isCR: true, name: name, linebreak: true}) );
  const top = parser.stack.Top();
  let node: MmlNode;
  if (top instanceof sitem.ArrayItem) {
    // @test Array
    if (n && top.arraydef['rowspacing']) {
      const rows = (top.arraydef['rowspacing'] as string).split(/ /);
      if (!top.getProperty('rowspacing')) {
        // @test Array Custom Linebreak
        let dimem = ParseUtil.dimen2em(rows[0]);
        top.setProperty('rowspacing', dimem);
      }
      const rowspacing = top.getProperty('rowspacing') as number;
      while (rows.length < top.table.length) {
        rows.push(ParseUtil.Em(rowspacing));
      }
      rows[top.table.length - 1] = ParseUtil.Em(
        Math.max(0, rowspacing + ParseUtil.dimen2em(n)));
      top.arraydef['rowspacing'] = rows.join(' ');
    }
  } else {
    if (n) {
      // @test Custom Linebreak
      node = parser.configuration.nodeFactory.create('node', 'mspace', [], {depth: n});
      parser.Push(node);
    }
    // @test Linebreak
    node = parser.configuration.nodeFactory.create('node', 'mspace', [], {linebreak: TexConstant.LineBreak.NEWLINE});
    parser.Push(node);
  }
};

BaseMethods.HLine = function(parser: TexParser, name: string, style: string) {
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
    top.frame.push('top');
  } else {
    // @test Enclosed bottom, Enclosed top bottom
    const lines = (top.arraydef['rowlines'] ? (top.arraydef['rowlines'] as string).split(/ /) : []);
    while (lines.length < top.table.length) {
      lines.push('none');
    }
    lines[top.table.length - 1] = style;
    top.arraydef['rowlines'] = lines.join(' ');
  }
};

BaseMethods.HFill = function(parser: TexParser, name: string) {
  const top = parser.stack.Top();
  if (top instanceof sitem.ArrayItem) {
    // @test Hfill
    top.hfill.push(top.Size());
  } else {
    // @test UnsupportedHFill
    throw new TexError('UnsupportedHFill', 'Unsupported use of %1', parser.currentCS);
  }
};



/**
 *   LaTeX environments
 */

let MAXMACROS = 10000;    // maximum number of macro substitutions per equation

BaseMethods.BeginEnd = function(parser: TexParser, name: string) {
  // @test Array1, Array2, Array Test
  let env = parser.GetArgument(name);
  if (env.match(/\\/i)) {
    // @test InvalidEnv
    throw new TexError('InvalidEnv', 'Invalid environment name \'%1\'', env);
  }
  let macro = parser.configuration.handlers.get('environment').lookup(env) as Macro;
  if (macro && name === '\\end') {
    if (!macro.args[0]) {
      const mml = parser.itemFactory.create('end').setProperties({name: env});
      parser.Push(mml);
      return;
    }
    parser.stack.env['closing'] = macro.args[0];
  }
  if (++parser.macroCount > MAXMACROS) {
    throw new TexError('MaxMacroSub2',
                        'MathJax maximum substitution count exceeded; ' +
                        'is there a recursive latex environment?');
  }
  parser.parse('environment', [parser, env]);
};


BaseMethods.Array = function(parser: TexParser, begin: StackItem,
                             open: string, close: string, align: string,
                             spacing: string, vspacing: string, style: string,
                             raggedHeight: boolean) {
  if (!align) {
    // @test Array Single
    align = parser.GetArgument('\\begin{' + begin.getName() + '}');
  }
  let lines = ('c' + align).replace(/[^clr|:]/g, '').replace(/[^|:]([|:])+/g, '$1');
  align = align.replace(/[^clr]/g, '').split('').join(' ');
  align = align.replace(/l/g, 'left').replace(/r/g, 'right').replace(/c/g, 'center');
  const array = parser.itemFactory.create('array');
  array.arraydef = {
    columnalign: align,
    columnspacing: (spacing || '1em'),
    rowspacing: (vspacing || '4pt')
  };
  if (lines.match(/[|:]/)) {
    // @test Enclosed left right
    if (lines.charAt(0).match(/[|:]/)) {
      // @test Enclosed left right, Enclosed left
      array.frame.push('left');
      array.dashed = lines.charAt(0) === ':';
    }
    if (lines.charAt(lines.length - 1).match(/[|:]/)) {
      // @test Enclosed left right, Enclosed right
      array.frame.push('right');
    }
    // @test Enclosed left right
    lines = lines.substr(1, lines.length - 2);
    array.arraydef.columnlines =
      lines.split('').join(' ').replace(/[^|: ]/g, 'none').replace(/\|/g, 'solid').replace(/:/g, 'dashed');
  }
  if (open)  {
    // @test Cross Product
    array.setProperty('open', parser.convertDelimiter(open));
  }
  if (close) {
    // @test Cross Product
    array.setProperty('close', parser.convertDelimiter(close));
  }
  if (style === 'D') {
    // TODO: This case never seems to occur! No test.
    array.arraydef['displaystyle'] = true;
  }
  else if (style) {
    // @test Subarray, Small Matrix
    array.arraydef['displaystyle'] = false;
  }
  if (style === 'S') {
    // @test Subarray, Small Matrix
    array.arraydef['scriptlevel'] = 1;
  } // FIXME: should use mstyle?
  if (raggedHeight)  {
    // @test Subarray, Small Matrix
    array.arraydef['useHeight'] = false;
  }
  parser.Push(begin);
  return array;
};


BaseMethods.AlignedArray = function(parser: TexParser, begin: StackItem) {
  // @test Array1, Array2, Array Test
  const align = parser.GetBrackets('\\begin{' + begin.getName() + '}');
  let item = BaseMethods.Array(parser, begin);
  return ParseUtil.setArrayAlign(item as sitem.ArrayItem, align);
};


/**
 *  Handle equation environment
 */
BaseMethods.Equation = function (parser: TexParser, begin: StackItem, numbered: boolean) {
  parser.Push(begin);
  ParseUtil.checkEqnEnv(parser);
  return parser.itemFactory.create('equation', numbered).
    setProperties({name: begin.getName()});
};


BaseMethods.EqnArray = function(parser: TexParser, begin: StackItem,
                                numbered: boolean, taggable: boolean,
                                align: string, spacing: string, style: string) {
  // @test The Lorenz Equations, Maxwell's Equations, Cubic Binomial
  parser.Push(begin);
  if (taggable) {
    ParseUtil.checkEqnEnv(parser);
  }
  align = align.replace(/[^clr]/g, '').split('').join(' ');
  align = align.replace(/l/g, 'left').replace(/r/g, 'right').replace(/c/g, 'center');
  let newItem = parser.itemFactory.create('eqnarray', begin.getName(), numbered, taggable, parser.stack.global);
  newItem.arraydef = {
    displaystyle: true,
    columnalign: align,
    columnspacing: (spacing || '1em'),
    rowspacing: '3pt',
    side: parser.options.get('TagSide'),
    minlabelspacing: parser.options.get('TagIndent')
  };
  return newItem;
};


/**
 * Handles no tag commands.
 */
BaseMethods.HandleNoTag = function(parser: TexParser, name: string) {
  parser.tags.notag();
};


/*
 *  Record a label name for a tag
 */
BaseMethods.HandleLabel = function(parser: TexParser, name: string) {
  // @test Label, Label Empty
  let global = this.stack.global;
  let label = this.GetArgument(name);
  if (label === '') {
    // @test Label Empty
    return;
  }
  // TODO: refUpdate is currently not implemented.
  if (!parser.options.get('refUpdate')) {
    // @test Label, Ref, Ref Unknown
    if (parser.tags.label) {
      // @test Double Label Error
      throw new TexError('MultipleCommand', 'Multiple %1', parser.currentCS);
    }
    parser.tags.label = label;
    if (parser.tags.allLabels[label] || parser.tags.labels[label]) {
      // @ Duplicate Label Error
      throw new TexError('MultipleLabel', 'Label \'%1\' multiply defined', label);
    }
    // TODO: This should be set in the tags structure!
    parser.tags.labels[label] = new Label(); // will be replaced by tag value later
  }
};


// TODO: What to do with this?
let baseURL = (typeof(document) === 'undefined' ||
               document.getElementsByTagName('base').length === 0) ?
  '' : String(document.location).replace(/#.*$/, '');


/**
 *  Handle a label reference
 */
BaseMethods.HandleRef = function(parser: TexParser, name: string, eqref: boolean) {
  // @test Ref, Ref Unknown, Eqref, Ref Default, Ref Named
  let label = this.GetArgument(name);
  let ref = parser.tags.allLabels[label] || parser.tags.labels[label];
  if (!ref) {
    // @test Ref Unknown
    ref = new Label();
  }
  let tag = ref.tag;
  if (eqref) {
    // @test Eqref
    tag = parser.tags.formatTag(tag);
  }
  let node = parser.configuration.nodeFactory.create('node', 'mrow', ParseUtil.internalMath(parser, tag), {
    href: parser.tags.formatUrl(ref.id, baseURL), 'class': 'MathJax_ref'
  });
  parser.Push(node);
};



/**
 * Macros
 */
BaseMethods.Macro = function(parser: TexParser, name: string,
                             macro: string, argcount: number,
                             def?: string) {
  if (argcount) {
    const args: string[] = [];
    if (def != null) {
      const optional = parser.GetBrackets(name);
      args.push(optional == null ? def : optional);
    }
    for (let i = args.length; i < argcount; i++) {
      args.push(parser.GetArgument(name));
    }
    macro = ParseUtil.substituteArgs(args, macro);
  }
  parser.string = ParseUtil.addArgs(macro, parser.string.slice(parser.i));
  parser.i = 0;
  if (++parser.macroCount > MAXMACROS) {
    throw new TexError('MaxMacroSub1',
                        'MathJax maximum macro substitution count exceeded; ' +
                        'is there a recursive macro call?');
  }
};


// mathchoice
BaseMethods.MathChoice = function(parser: TexParser, name: string) {
  const D  = parser.ParseArg(name);
  const T  = parser.ParseArg(name);
  const S  = parser.ParseArg(name);
  const SS = parser.ParseArg(name);
  parser.Push(parser.configuration.nodeFactory.create(
      'node', 'mathchoice', [D, T, S, SS], {}));
};


export default BaseMethods;
