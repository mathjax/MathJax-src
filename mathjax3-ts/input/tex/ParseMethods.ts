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

import * as sitem from './StackItem.js';
import {NewTex} from './Translate.js';
import {Symbol} from './Symbol.js';
import {TreeHelper} from './TreeHelper.js';
import TexError from './TexError.js';
import TexParser from './TexParser.js';
import {TexConstant} from './TexConstants.js';
import {ParserUtil} from './ParserUtil.js';
import {MmlNode, TEXCLASS} from '../../core/MmlTree/MmlNode.js';
import {MmlMsubsup} from '../../core/MmlTree/MmlNodes/msubsup.js';
import {MmlMunderover} from '../../core/MmlTree/MmlNodes/munderover.js';
import {MmlMo} from '../../core/MmlTree/MmlNodes/mo.js';


// Namespace
export namespace ParseMethods {

  const PRIME = '\u2032';
  const SMARTQUOTE = '\u2019';
  const NUMBER = /^(?:[0-9]+(?:\{,\}[0-9]{3})*(?:\.[0-9]*)*|\.[0-9]+)/;
  const NBSP = '\u00A0';
  const P_HEIGHT = 1.2 / .85;   // cmex10 height plus depth over .85

  // Utilities?
  export function MmlFilterAttribute(parser: TexParser, name: string, value: string): string {
    return value;
  };

  let MmlTokenAllow: {[key: string]: number} = {
    fontfamily: 1, fontsize: 1, fontweight: 1, fontstyle: 1,
    color: 1, background: 1,
    id: 1, 'class': 1, href: 1, style: 1
  };
  // End Utilities?

  /************************************************************************/
  /*
   *   Handle various token classes
   */

  /*
   *  Lookup a control-sequence and process it
   */
  export function ControlSequence(parser: TexParser, c: string) {
    TreeHelper.printMethod('ControlSequence');
    const name = parser.GetCS();
    parser.parse('macro', [name, this]);
  };

  //
  //  Look up a macro in the macros list
  //  (overridden in begingroup extension)
  //
  // csFindMacro: function(name) {return TEXDEF.macros[name]},
  //
  //  Handle normal mathchar (as an mi)
  //
  export function csMathchar0mi(parser: TexParser, mchar: Symbol) {
    TreeHelper.printMethod('csMathchar0mi');
    const def = mchar.attributes || {mathvariant: TexConstant.Variant.ITALIC};
    // @test Greek
    const textNode = TreeHelper.createText(mchar.char);
    const node = TreeHelper.createNode('mi', [], def, textNode);
    parser.Push(parser.mmlToken(node));
  };

  //
  //  Handle normal mathchar (as an mo)
  //
  export function csMathchar0mo(parser: TexParser, mchar: Symbol) {
    TreeHelper.printMethod('csMathchar0mo');
    const def = mchar.attributes || {};
    def['stretchy'] = false;
    // @test Large Set
    const textNode = TreeHelper.createText(mchar.char);
    const node = TreeHelper.createNode('mo', [], def, textNode);
    // PROBLEM: Attributes stop working when Char7 are explicitly set.
    parser.Push(parser.mmlToken(node));
  };
  //
  //  Handle mathchar in current family
  //
  export function csMathchar7(parser: TexParser, mchar: Symbol) {
    TreeHelper.printMethod('csMathchar7');
    const def = mchar.attributes || {mathvariant: TexConstant.Variant.NORMAL};
    if (parser.stack.env['font']) {
      // @test MathChar7 Single Font
      def.mathvariant = parser.stack.env['font'];
    }
    // @test MathChar7 Single, MathChar7 Operator, MathChar7 Multi
    const textNode = TreeHelper.createText(mchar.char);
    const node = TreeHelper.createNode('mi', [], def, textNode);
    // setVariant(node, def.mathvariant);
    // PROBLEM: Attributes have to be explicitly set, but then interfere with
    // AMS tests. Try setting variant of node!
    // for (var x in def) {
    //   node.attributes.set(x, def[x]);
    // }
    parser.Push(parser.mmlToken(node));
  };
  //
  //  Handle delimiter
  //
  export function csDelimiter(parser: TexParser, delim: Symbol) {
    TreeHelper.printMethod('csDelimiter');
    let def = delim.attributes || {};
    // @test Fenced2, Delimiter (AMS)
    def = Object.assign({fence: false, stretchy: false}, def);
    const textNode = TreeHelper.createText(delim.char);
    const node = TreeHelper.createNode('mo', [], def, textNode);
    // var node = MML.mo(textNode).With({fence: false, stretchy: false}).With(def);
    parser.Push(parser.mmlToken(node));
  };
  //
  //  Handle undefined control sequence
  //  (overridden in noUndefined extension)
  //
  export function csUndefined(parser: TexParser, name: string) {
    TreeHelper.printMethod('csUndefined');
    throw new TexError(['UndefinedControlSequence',
                        'Undefined control sequence %1', '\\' + name]);
  };

  export function envUndefined(parser: TexParser, env: string) {
    TreeHelper.printMethod('envUndefined');
    throw new TexError(['UnknownEnv', 'Unknown environment \'%1\'', env]);
  };

  /*
   *  Handle a variable (a single letter)
   */
  export function Variable(parser: TexParser, c: string) {
    TreeHelper.printMethod('Variable');
    const def: sitem.EnvList = {};
    if (parser.stack.env['font']) {
      // @test Identifier Font
      def['mathvariant'] = parser.stack.env['font'];
    }
    // @test Identifier
    const textNode = TreeHelper.createText(c);
    const node = TreeHelper.createNode('mi', [], def, textNode);
    parser.Push(parser.mmlToken(node));
  };

  /*
   *  Determine the extent of a number (pattern may need work)
   */
  export function Number(parser: TexParser, c: string) {
    TreeHelper.printMethod('Number');
    let mml: MmlNode;
    const n = parser.string.slice(parser.i-1).match(NUMBER);
    const def: sitem.EnvList = {};
    if (parser.stack.env['font']) {
      // @test Integer Font
      def['mathvariant'] = parser.stack.env['font'];
    }
    if (n) {
      // @test Integer, Number
      const textNode = TreeHelper.createText(n[0].replace(/[{}]/g,''));
      mml = TreeHelper.createNode('mn', [], def, textNode);
      parser.i += n[0].length - 1;
    } else {
      // @test Decimal
      const textNode = TreeHelper.createText(c);
      mml = TreeHelper.createNode('mo', [], def, textNode);
    }
    parser.Push(parser.mmlToken(mml));
    // else {mml = MML.mo(MML.chars(c))}
    // if (parser.stack.env.font) {mml.mathvariant = parser.stack.env.font}
    // parser.Push(parser.mmlToken(mml));
  };

  /*
   *  Handle { and }
   */
  export function Open(parser: TexParser, c: string) {
    parser.Push( new sitem.OpenItem() );
  };
  export function Close(parser: TexParser, c: string) {
    parser.Push( new sitem.CloseItem() );
  };

  /*
   *  Handle tilde and spaces
   */
  export function Tilde(parser: TexParser, c: string) {
    // @test Tilde, Tilde2
    //
    // TODO: Once we can properly load AllEntities, this should be the line.
    // var textNode = TreeHelper.createText(MmlEntities.ENTITIES.nbsp);
    const textNode = TreeHelper.createText(NBSP);
    const node = TreeHelper.createNode('mtext', [], {}, textNode);
    parser.Push(node as any);
  };
  export function Space(parser: TexParser, c: string) {};

  /*
   *  Handle ^, _, and '
   */
  export function Superscript(parser: TexParser, c: string) {
    TreeHelper.printMethod('Superscript');
    if (parser.GetNext().match(/\d/)) {
      // don't treat numbers as a unit
      parser.string = parser.string.substr(0,parser.i+1)+' '+parser.string.substr(parser.i+1);
    }
    let primes: MmlNode;
    let base: MmlNode | void;
    const top = parser.stack.Top();
    if (top.hasType('prime')) {
      // @test Prime on Prime
      base = top.data[0];
      primes = top.data[1];
      parser.stack.Pop();
    } else {
      // @test Empty base2, Square, Cube
      base = parser.stack.Prev();
      if (!base) {
        // @test Empty base
        const textNode = TreeHelper.createText('');
        base = TreeHelper.createNode('mi', [], {}, textNode);
      }
    }
    // TODO: This does not seem to be used. Check with Davide.
    //
    // if (base.isEmbellishedWrapper) {
    //   // TODO: Warning, those are childNodes now!
    //   // base = base.data[0].data[0];
    //   base = TreeHelper.getChildAt(TreeHelper.getChildAt(base, 0), 0);
    // }
    const movesupsub = TreeHelper.getProperty(base, 'movesupsub');
    let position = TreeHelper.isType(base, 'msubsup') ? (base as MmlMsubsup).sup :
      (base as MmlMunderover).over;
    // var movesupsub = base.movesupsub, position = base.sup;
    if ((TreeHelper.isType(base, 'msubsup') && TreeHelper.getChildAt(base, (base as MmlMsubsup).sup)) ||
        (TreeHelper.isType(base, 'munderover') && TreeHelper.getChildAt(base, (base as MmlMunderover).over) &&
         !TreeHelper.getProperty(base, 'subsupOK'))) {
      // @test Double-super-error, Double-over-error
      throw new TexError(['DoubleExponent','Double exponent: use braces to clarify']);
    }
    if (!TreeHelper.isType(base, 'msubsup')) {
      TreeHelper.printSimple('Case 1');
      if (movesupsub) {
        TreeHelper.printSimple('Case 2');
        // @test Move Superscript, Large Operator
        if (!TreeHelper.isType(base, 'munderover') || TreeHelper.getChildAt(base, (base as MmlMunderover).over)) {
          TreeHelper.printSimple('Case 3');
          if (TreeHelper.getProperty(base, 'movablelimits') && TreeHelper.isType(base, 'mi')) {
            // @test Mathop Super
            base = ParseMethods.mi2mo(base);
          }
          // @test Large Operator
          base = TreeHelper.createNode('munderover', [base], {movesupsub:true});
        }
        position = (base as MmlMunderover).over;
      } else {
        TreeHelper.printSimple('Case 4');
        // @test Empty base, Empty base2, Square, Cube
        base = TreeHelper.createNode('msubsup', [base], {});
        position = (base as MmlMsubsup).sup;
      }
    }
    parser.Push(
                new sitem.SubsupItem(base).With({
                  position: position, primes: primes, movesupsub: movesupsub
                }) );
  };

  export function Subscript(parser: TexParser, c: string) {
    TreeHelper.printMethod('Subscript');
    if (parser.GetNext().match(/\d/)) {
      // don't treat numbers as a unit
      parser.string = parser.string.substr(0,parser.i+1)+' '+parser.string.substr(parser.i+1);
    }
    let primes, base;
    const top = parser.stack.Top();
    if (top.hasType('prime')) {
      // @test Prime on Sub
      base = top.data[0]; primes = top.data[1];
      parser.stack.Pop();
    } else {
      base = parser.stack.Prev();
      if (!base) {
        // @test Empty Base Indes
        const textNode = TreeHelper.createText('');
        base = TreeHelper.createNode('mi', [], {}, textNode);
      }
    }
    // TODO: This does not seem to be used. Check with Davide.
    //
    // if (base.isEmbellishedWrapper) {
    //   // TODO: Warning, those are childNodes now!
    //   base = TreeHelper.getChildAt(TreeHelper.getChildAt(base, 0), 0);
    // }
    const movesupsub = TreeHelper.getProperty(base, 'movesupsub');
    let position = TreeHelper.isType(base, 'msubsup') ?
        (base as MmlMsubsup).sub : (base as MmlMunderover).under;
    // var movesupsub = base.movesupsub, position = base.sub;
    if ((TreeHelper.isType(base, 'msubsup') &&
         TreeHelper.getChildAt(base, (base as MmlMsubsup).sub)) ||
        (TreeHelper.isType(base, 'munderover') &&
         TreeHelper.getChildAt(base, (base as MmlMunderover).under) &&
         !TreeHelper.getProperty(base, 'subsupOK'))) {
      // @test Double-sub-error, Double-under-error
      throw new TexError(['DoubleSubscripts','Double subscripts: use braces to clarify']);
    }
    if (!TreeHelper.isType(base, 'msubsup')) {
      if (movesupsub) {
        // @test Large Operator, Move Superscript
        if (!TreeHelper.isType(base, 'munderover') ||
            TreeHelper.getChildAt(base, (base as MmlMunderover).under)) {
          if (TreeHelper.getProperty(base, 'movablelimits') &&
              TreeHelper.isType(base, 'mi')) {
            // @test Mathop Sub
            base = ParseMethods.mi2mo(base);
          }
          // @test Move Superscript
          base = TreeHelper.createNode('munderover', [base], {movesupsub:true});
        }
        position = (base as MmlMunderover).under;
      } else {
        // @test Empty Base Index, Empty, Base Index2, Index
        base = TreeHelper.createNode('msubsup', [base], {});
        position = (base as MmlMsubsup).sub;
      }
    }
    parser.Push(
                new sitem.SubsupItem(base).With({
                  position: position, primes: primes, movesupsub: movesupsub
                }) );
  };

  export function Prime(parser: TexParser, c: string) {
    // @test Prime
    let base = parser.stack.Prev();
    if (!base) {
      // @test PrimeSup, PrePrime, Prime on Sup
      base = TreeHelper.createNode('mi', [], {});
    }
    if (TreeHelper.isType(base, 'msubsup') &&
        TreeHelper.getChildAt(base, (base as MmlMsubsup).sup)) {
      // @test Double Prime Error
      throw new TexError(['DoubleExponentPrime',
                          'Prime causes double exponent: use braces to clarify']);
    }
    let sup = '';
    parser.i--;
    do {
      sup += PRIME; parser.i++, c = parser.GetNext();
    } while (c === '\'' || c === SMARTQUOTE);
    sup = ['', '\u2032', '\u2033', '\u2034', '\u2057'][sup.length] || sup;
    const textNode = TreeHelper.createText(sup);
    const node = TreeHelper.createNode('mo', [], {}, textNode);
    parser.Push(
                new sitem.PrimeItem(base, parser.mmlToken(node)) );
  };

  /*
   *  Handle comments
   */
  export function Comment(parser: TexParser, c: string) {
    TreeHelper.printMethod('Comment');
    while (parser.i < parser.string.length && parser.string.charAt(parser.i) != '\n') {parser.i++}
  };

  /*
   *  Handle hash marks outside of definitions
   */
  export function Hash(parser: TexParser, c: string) {
    TreeHelper.printMethod('Hash');
    // @test Hash Error
    throw new TexError(['CantUseHash1',
                        'You can\'t use \'macro parameter character #\' in math mode']);
  };

  /*
   *  Handle other characters (as <mo> elements)
   */
  export function Other(parser: TexParser, c: string) {
    TreeHelper.printMethod('Other');
    let def = {};
    if (parser.stack.env['font']) {
      // @test Other Font
      def = {mathvariant: parser.stack.env['font']};
    }

    const remap = parser.GetRemap(c);
    // @test Other
    // @test Other Remap
    const textNode = TreeHelper.createText(remap ? remap.char : c);
    let mo = TreeHelper.createNode('mo', [], def, textNode) as MmlMo;
    parser.secondPass.push(mo);

    // VS: Question: What do these autoDefault methods do exactly.
    //     Is there a modern equivalent in v3?
    //
    //   This changes the operator class, when fences are put around it. Just
    //   propagate from the inherited attributes or properties.
    // TODO: Currently just omitted!
    // if (!TreeHelper.NEW && mo.autoDefault('stretchy',true)) {
    //   // @test A Rogers-Ramanujan Identity
    //   mo.stretchy = false;
    // }
    // if (!TreeHelper.NEW && mo.autoDefault('texClass',true) == '') {
    //   // @test A Rogers-Ramanujan Identity
    //   mo = TreeHelper.createNode('TeXAtom', [mo], {});
    // }
    parser.Push(parser.mmlToken(mo));
  };

  /************************************************************************/
  /*
   *   Macros
   */

  export function SetFont(parser: TexParser, name: string, font: string) {
    parser.stack.env['font'] = font;
  };

  export function SetStyle(parser: TexParser, name: string, texStyle: string, style: string, level: string) {
    TreeHelper.printMethod('SetStyle: ' + name + ' texStyle: ' + texStyle +
                    ' style: ' + style + ' level: ' + level);
    parser.stack.env['style'] = texStyle; parser.stack.env['level'] = level;
    parser.Push(
                new sitem.StyleItem().With({styles: {displaystyle: style, scriptlevel: level}}) );
  };
  export function SetSize(parser: TexParser, name: string, size: string) {
    TreeHelper.printMethod('SetSize');
    parser.stack.env['size'] = size;
    parser.Push(
                new sitem.StyleItem().With({styles: {mathsize: size + 'em'}}) ); // convert to absolute?
  };

  // Look at color extension!
  export function Color(parser: TexParser, name: string) {
    TreeHelper.printMethod('Color');
    // @test Color Frac
    const color = parser.GetArgument(name);
    const old = parser.stack.env['color'];
    parser.stack.env['color'] = color;
    const math = parser.ParseArg(name);
    if (old) {parser.stack.env['color']} else {delete parser.stack.env['color']}
    const node = TreeHelper.createNode('mstyle', [math], {mathcolor: color});
    parser.Push(node);
  };

  export function Spacer(parser: TexParser, name: string, space: string) {
    // @test Positive Spacing, Negative Spacing
    const node = TreeHelper.createNode('mspace', [],
                              {width: space, mathsize: TexConstant.Size.NORMAL, scriptlevel: 0});
    parser.Push(node);
  };

  export function LeftRight(parser: TexParser, name: string) {
    TreeHelper.printMethod('LeftRight');
    // @test Fenced, Fenced3
    const alpha = name.substr(1);
    parser.Push(
      // TODO: Sort this out: Uppercase the first character and add Item!
      new (sitem as any)[alpha[0].toUpperCase() + alpha.slice(1) + 'Item']()
                .With({delim: parser.GetDelimiter(name)}) );
  };

  export function Middle(parser: TexParser, name: string) {
    TreeHelper.printMethod('Middle');
    // @test Middle
    const delim = parser.GetDelimiter(name);
    let node = TreeHelper.createNode('TeXAtom', [], {texClass: TEXCLASS.CLOSE});
    parser.Push(node);
    if (!parser.stack.Top().hasType('left')) {
      // @test Orphan Middle, Middle with Right
      throw new TexError(['MisplacedMiddle',
                          '%1 must be within \\left and \\right', name]);
    }
    const textNode = TreeHelper.createText(delim);
    node = TreeHelper.createNode('mo', [], {stretchy: true}, textNode);
    parser.Push(node);
    node = TreeHelper.createNode('TeXAtom', [], {texClass: TEXCLASS.OPEN});
    parser.Push(node);
  };

  export function NamedFn(parser: TexParser, name: string, id: string) {
    TreeHelper.printMethod('NamedFn');
    // @test Named Function
    if (!id) {
      id = name.substr(1);
    }
    const textNode = TreeHelper.createText(id);
    const mml = TreeHelper.createNode('mi', [], {texClass: TEXCLASS.OP}, textNode);
    parser.Push( new sitem.FnItem(parser.mmlToken(mml)) );
  };
  export function NamedOp(parser: TexParser, name: string, id: string) {
    TreeHelper.printMethod('NamedOp');
    // @test Limit
    if (!id) {id = name.substr(1)};
    id = id.replace(/&thinsp;/,'\u2006');
    const text = TreeHelper.createText(id);
    const mml = TreeHelper.createNode('mo', [], {
      movablelimits: true,
      movesupsub: true,
      form: TexConstant.Form.PREFIX,
      texClass: TEXCLASS.OP
    }, text);
    // TODO: Sort this out with get('form');
    // mml.useMMLspacing &= ~mml.SPACE_ATTR.form;  // don't count this explicit form setting
    parser.Push(parser.mmlToken(mml));
  };

  export function Limits(parser: TexParser, name: string, limits: string) {
    TreeHelper.printMethod('Limits');
    // @test Limits
    let op = parser.stack.Prev(true);
    // TODO: Lookup in Operator Table.
    if (!op || (TreeHelper.getTexClass(op) !== TEXCLASS.OP &&
                TreeHelper.getProperty(op, 'movesupsub') == null)) {
      // @test Limits Error
      throw new TexError(['MisplacedLimits','%1 is allowed only on operators',name]);
    }
    const top = parser.stack.Top();
    let node;
    if (TreeHelper.isType(op, 'munderover') && !limits) {
      // @test Limits UnderOver
      node = TreeHelper.createNode('msubsup', [], {});
      TreeHelper.copyChildren(op, node);
      op = top.data[top.data.length-1] = node;
    } else if (TreeHelper.isType(op, 'msubsup') && limits) {
      // @test Limits SubSup
      // node = TreeHelper.createNode('munderover', TreeHelper.getChildren(op), {});
      // Needs to be copied, otherwise we get an error in MmlNode.appendChild!
      node = TreeHelper.createNode('munderover', [], {});
      TreeHelper.copyChildren(op, node);
      op = top.data[top.data.length-1] = node;
    }
    // TODO: Turns this into properties.
    TreeHelper.setProperties(op, {'movesupsub': limits ? true : false});
    TreeHelper.setProperties(TreeHelper.getCore(op), {'movablelimits': false});
    if (TreeHelper.getProperty(op, 'movablelimits')) {
      TreeHelper.setProperties(op, {'movablelimits': false});
    }
  };

  export function Over(parser: TexParser, name: string, open: string, close: string) {
    TreeHelper.printMethod('Over');
    // @test Over
    const mml = new sitem.OverItem().With({name: name}) ;
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

  export function Frac(parser: TexParser, name: string) {
    TreeHelper.printMethod('Frac');
    // @test Frac
    const num = parser.ParseArg(name);
    const den = parser.ParseArg(name);
    const node = TreeHelper.createNode('mfrac', [num, den], {});
    parser.Push(node);
  };

  export function Sqrt(parser: TexParser, name: string) {
    TreeHelper.printMethod('Sqrt');
    const n = parser.GetBrackets(name);
    let arg = parser.GetArgument(name);
    if (arg === '\\frac') {arg += '{'+parser.GetArgument(arg)+'}{'+parser.GetArgument(arg)+'}'}
    let mml = new TexParser(arg, parser.stack.env).mml();
    if (!n) {
      // @test Square Root
      mml = TreeHelper.createNode('msqrt', [mml], {});
    } else {
      // @test General Root
      mml = TreeHelper.createNode('mroot', [mml, ParseMethods.parseRoot(parser, n)], {});
    }
    parser.Push(mml);
  };
  export function Root(parser: TexParser, name: string) {
    TreeHelper.printMethod('Root');
    const n = parser.GetUpTo(name,'\\of');
    const arg = parser.ParseArg(name);
    const node = TreeHelper.createNode('mroot', [arg, ParseMethods.parseRoot(parser, n)], {});
    parser.Push(node);
  };


  // Utility?
  export function parseRoot(parser: TexParser, n: string) {
    TreeHelper.printMethod('parseRoot');
    // @test General Root, Explicit Root
    const env = parser.stack.env;
    const inRoot = env['inRoot'];
    env['inRoot'] = true;
    // TODO: This parser call might change!
    const newParser = new TexParser(n, env);
    let node = newParser.mml();
    TreeHelper.printJSON(node);
    const global = newParser.stack.global;
    if (global['leftRoot'] || global['upRoot']) {
      // @test Tweaked Root
      const def: sitem.EnvList = {};
      if (global['leftRoot']) {
        def['width'] = global['leftRoot'];
      }
      if (global['upRoot']) {
        def['voffset'] = global['upRoot'];
        def['height'] = global['upRoot'];
      }

      node = TreeHelper.createNode('mpadded', [node], def);
      // VS: OLD
      // if (global.leftRoot) {
      //   n.width = global.leftRoot;
      // }
      // if (global.upRoot) {
      //   n.voffset = global.upRoot;
      //   n.height = global.upRoot;
      // }
    }
    env['inRoot'] = inRoot;
    return node;
  };

  export function MoveRoot(parser: TexParser, name: string, id: string) {
    TreeHelper.printMethod('MoveRoot');
    // @test Tweaked Root
    if (!parser.stack.env['inRoot']) {
      // @test Misplaced Move Root
      throw new TexError(['MisplacedMoveRoot','%1 can appear only within a root',name]);
    }
    if (parser.stack.global[id]) {
      // @test Multiple Move Root
      throw new TexError(['MultipleMoveRoot','Multiple use of %1',name]);
    }
    let n = parser.GetArgument(name);
    if (!n.match(/-?[0-9]+/)) {
      // @test Incorrect Move Root
      throw new TexError(['IntegerArg','The argument to %1 must be an integer',name]);
    }
    n = (parseInt(n, 10)/15)+'em';
    if (n.substr(0,1) !== '-') {n = '+'+n}
    parser.stack.global[id] = n;
  };

  export function Accent(parser: TexParser, name: string, accent: string, stretchy: boolean) {
    TreeHelper.printMethod('Accent');
    // @test Vector
    const c = parser.ParseArg(name);
    const def: sitem.EnvList = {accent: true};
    if (parser.stack.env['font']) {
      // @test Vector Font
      def['mathvariant'] = parser.stack.env['font'];
    }
    const entity = TreeHelper.createEntity(accent);
    const moNode = TreeHelper.createNode('mo', [], def, entity);
    const mml = parser.mmlToken(moNode);
    // TODO: This should be property?
    TreeHelper.setProperties(mml, {stretchy: (stretchy ? true : false)});
    // @test Vector Op, Vector
    const mo = (TreeHelper.isEmbellished(c) ? TreeHelper.getCoreMO(c) : c);
    if (TreeHelper.isType(mo, 'mo')) {
      // @test Vector Op
      TreeHelper.setProperties(mo, {'movablelimits': false});
    }
    const muoNode = TreeHelper.createNode('munderover', [], {accent: true});
    // TODO: This is necessary to get the empty element into the children.
    TreeHelper.setData(muoNode, 0, c);
    TreeHelper.setData(muoNode, 1, null);
    TreeHelper.setData(muoNode, 2, mml);
    let texAtom = TreeHelper.createNode('TeXAtom', [muoNode], {});
    parser.Push(texAtom);
  };

  export function UnderOver(parser: TexParser, name: string, c: string, stack: boolean, noaccent: boolean) {
    TreeHelper.printMethod('UnderOver');
    // @test Overline
    let base = parser.ParseArg(name);
    // TODO: Check via operator table later?
    if (TreeHelper.getProperty(base, 'movablelimits')) {
      // @test Overline Sum
      TreeHelper.setProperties(base, {'movablelimits': false});
    }
    let mo;
    if (TreeHelper.isType(base, 'munderover') && TreeHelper.isEmbellished(base)) {
      // @test Overline Limits
      // TODO: Sort these properties out!
      TreeHelper.setProperties(TreeHelper.getCore(base), {lspace:0,rspace:0}); // get spacing right for NativeMML
      mo = TreeHelper.createNode('mo', [], {rspace:0});
      base = TreeHelper.createNode('mrow', [mo,base], {});  // add an empty <mi> so it's not embellished any more
    }
    const mml = TreeHelper.createNode('munderover', [base], {}) as MmlMunderover;
    const entity = TreeHelper.createEntity(c);
    mo = TreeHelper.createNode('mo', [], {stretchy:true, accent:!noaccent}, entity);

    // TEMP: Changes here:
    TreeHelper.setData(mml, name.charAt(1) === 'o' ?  mml.over : mml.under,
                       parser.mmlToken(mo));
    let node: MmlNode = mml;
    if (stack) {
      TreeHelper.untested(8);
      node = TreeHelper.createNode('TeXAtom', [mml], {texClass:TEXCLASS.OP, movesupsub:true});
    }
    // TODO: Sort these properties out!
    TreeHelper.setProperties(node, {subsupOK: true});
    parser.Push(node);
  };

  export function Overset(parser: TexParser, name: string) {
    TreeHelper.printMethod('Overset');
    // @test Overset
    const top = parser.ParseArg(name), base = parser.ParseArg(name);
    if (TreeHelper.getProperty(base, 'movablelimits')) {
      TreeHelper.setProperties(base, {'movablelimits': false});
    }
    const node = TreeHelper.createNode('mover', [base, top], {});
    parser.Push(node);
  };

  export function Underset(parser: TexParser, name: string) {
    TreeHelper.printMethod('Underset');
    // @test Underset
    const bot = parser.ParseArg(name), base = parser.ParseArg(name);
    if (TreeHelper.getProperty(base, 'movablelimits')) {
      // @test Overline Sum
      TreeHelper.setProperties(base, {'movablelimits': false});
    }
    const node = TreeHelper.createNode('munder', [base, bot], {});
    parser.Push(node);
  };

  export function TeXAtom(parser: TexParser, name: string, mclass: number) {
    TreeHelper.printMethod('TeXAtom');
    let def: sitem.EnvList = {texClass: mclass};
    let mml: sitem.StackItem|MmlNode;
    let node: MmlNode;
    let parsed: MmlNode;
    if (mclass == TEXCLASS.OP) {
      def['movesupsub'] = def['movablelimits'] = true;
      const arg = parser.GetArgument(name);
      const match = arg.match(/^\s*\\rm\s+([a-zA-Z0-9 ]+)$/);
      if (match) {
        // @test Mathop
        def['mathvariant'] = TexConstant.Variant.NORMAL;
        const textNode = TreeHelper.createText(match[1]);
        node = TreeHelper.createNode('mi', [], def, textNode);
        mml = new sitem.FnItem(parser.mmlToken(node));
      } else {
        // @test Mathop Cal
        parsed = new TexParser(arg,parser.stack.env).mml();
        node = TreeHelper.createNode('TeXAtom', [parsed], def);
        mml = new sitem.FnItem(node);
      }
    } else {
      // @test Mathrel
      parsed = parser.ParseArg(name);
      mml = TreeHelper.createNode('TeXAtom', [parsed], def);
    }
    parser.Push(mml);
  };

  // VS: This method is only called during a macro call: AMS Math and \\mod.
  export function MmlToken(parser: TexParser, name: string) {
    TreeHelper.printMethod('MmlToken');
    // @test Modulo
    const type = parser.GetArgument(name);
    let attr = parser.GetBrackets(name,'').replace(/^\s+/,'');
    const data = parser.GetArgument(name);
    const def: sitem.EnvList = {};
    let node: MmlNode;
    try {
      node = TreeHelper.createNode(type, [], {});
    } catch (e) {
      node = null;
    }
    if (!node || !node.isToken) {
      // @test Token Illegal Type, Token Wrong Type
      throw new TexError(['NotMathMLToken','%1 is not a token element',type]);
    }
    while (attr !== '') {
      const match = attr.match(/^([a-z]+)\s*=\s*('[^']*'|'[^']*'|[^ ,]*)\s*,?\s*/i);
      if (!match) {
        // @test Token Invalid Attribute
        throw new TexError(['InvalidMathMLAttr','Invalid MathML attribute: %1',attr]);
      }
      if (node.attributes.getAllDefaults()[match[1]] == null && !MmlTokenAllow[match[1]]) {
        // @test Token Unknown Attribute, Token Wrong Attribute
        throw new TexError(['UnknownAttrForElement',
                            '%1 is not a recognized attribute for %2',
                            match[1],type]);
      }
      let value: string | boolean = ParseMethods.MmlFilterAttribute(parser, match[1],
                                                                    match[2].replace(/^([''])(.*)\1$/,'$2'));
      if (value) {
        if (value.toLowerCase() === 'true') {
          value = true}
        else if (value.toLowerCase() === 'false') {
          value = false}
        def[match[1]] = value;
      }
      attr = attr.substr(match[0].length);
    }
    TreeHelper.printSimple('End mmlToken: type: ' + type + ' data: ' + data + ' def: ');
    const textNode = TreeHelper.createText(data);
    node.appendChild(textNode);
    TreeHelper.setProperties(node, def);
    parser.Push(parser.mmlToken(node));
  };


  export function Strut(parser: TexParser, name: string) {
    TreeHelper.printMethod('Strut');
    // @test Strut
    // TODO: Do we still need this row as it is implicit?
    const row = TreeHelper.createNode('mrow', [], {});
    const padded = TreeHelper.createNode('mpadded', [row],
                                {height: '8.6pt', depth: '3pt', width: 0});
    parser.Push(padded);
  };

  export function Phantom(parser: TexParser, name: string, v: string, h: string) {
    TreeHelper.printMethod('Phantom');
    // @test Phantom
    let box = TreeHelper.createNode('mphantom', [parser.ParseArg(name)], {});
    if (v || h) {
      // TEMP: Changes here
      box = TreeHelper.createNode('mpadded', [box], {});
      if (h) {
        // @test Horizontal Phantom
        TreeHelper.setAttribute(box, 'height', 0);
        TreeHelper.setAttribute(box, 'depth', 0);
      }
      if (v) {
        // @test Vertical Phantom
        TreeHelper.setAttribute(box, 'width', 0);
      }
    }
    const atom = TreeHelper.createNode('TeXAtom', [box], {});
    parser.Push(atom);
  };

  export function Smash(parser: TexParser, name: string) {
    TreeHelper.printMethod('Smash');
    // @test Smash, Smash Top, Smash Bottom
    const bt = parser.trimSpaces(parser.GetBrackets(name,''));
    const smash = TreeHelper.createNode('mpadded', [parser.ParseArg(name)], {});
    // TEMP: Changes here:
    switch (bt) {
    case 'b': TreeHelper.setAttribute(smash, 'depth', 0); break;
    case 't': TreeHelper.setAttribute(smash, 'height', 0); break;
    default:
      TreeHelper.setAttribute(smash, 'height', 0);
      TreeHelper.setAttribute(smash, 'depth', 0);
    }
    const atom = TreeHelper.createNode('TeXAtom', [smash], {});
    parser.Push(atom);
  };

  export function Lap(parser: TexParser, name: string) {
    TreeHelper.printMethod('Lap');
    // @test Llap, Rlap
    const mml = TreeHelper.createNode('mpadded', [parser.ParseArg(name)], {width: 0});
    if (name === '\\llap') {
      // @test Llap
      TreeHelper.setAttribute(mml, 'lspace', '-1width');
    }
    const atom = TreeHelper.createNode('TeXAtom', [mml], {});
    parser.Push(atom);
  };

  export function RaiseLower(parser: TexParser, name: string) {
    TreeHelper.printMethod('RaiseLower');
    // @test Raise, Lower, Raise Negative, Lower Negative
    let h = parser.GetDimen(name);
    let item =
      new sitem.PositionItem().With({name: name, move: 'vertical'}) ;
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

  export function MoveLeftRight(parser: TexParser, name: string) {
    TreeHelper.printMethod('MoveLeftRight');
    // @test Move Left, Move Right, Move Left Negative, Move Right Negative
    let h = parser.GetDimen(name);
    let nh = (h.charAt(0) === '-' ? h.slice(1) : '-' + h);
    if (name === '\\moveleft') {
      let tmp = h;
      h = nh;
      nh = tmp;
    }
    parser.Push(
                new sitem.PositionItem().With({
                  name: name, move: 'horizontal',
                  left:  TreeHelper.createNode('mspace', [], {width: h, mathsize: TexConstant.Size.NORMAL}),
                  right: TreeHelper.createNode('mspace', [], {width: nh, mathsize: TexConstant.Size.NORMAL})}) );
  };

  export function Hskip(parser: TexParser, name: string) {
    TreeHelper.printMethod('Hskip');
    // @test Modulo
    const node = TreeHelper.createNode('mspace', [],
                                       {width: parser.GetDimen(name),
                                        mathsize: TexConstant.Size.NORMAL});
    parser.Push(node);
  };

  export function Rule(parser: TexParser, name: string, style: string) {
    TreeHelper.printMethod('Rule');
    // @test Rule 3D, Space 3D
    const w = parser.GetDimen(name),
    h = parser.GetDimen(name),
    d = parser.GetDimen(name);
    let def: sitem.EnvList = {width:w, height:h, depth:d};
    if (style !== 'blank') {
      def['mathbackground'] = (parser.stack.env['color'] || 'black');
    }
    const node = TreeHelper.createNode('mspace', [], def);
    parser.Push(node);
  };
  export function rule(parser: TexParser, name: string) {
    TreeHelper.printMethod('rule');
    // @test Rule 2D
    const v = parser.GetBrackets(name),
    w = parser.GetDimen(name),
    h = parser.GetDimen(name);
    let mml = TreeHelper.createNode('mspace', [], {
      width: w, height:h,
      mathbackground: (parser.stack.env['color'] || 'black') });
    if (v) {
      mml = TreeHelper.createNode('mpadded', [mml], {voffset: v});
      if (v.match(/^\-/)) {
        TreeHelper.setAttribute(mml, 'height', v);
        TreeHelper.setAttribute(mml, 'depth', '+' + v.substr(1));
      } else {
        TreeHelper.setAttribute(mml, 'height', '+' + v);
      }
    }
    parser.Push(mml);
  };

  export function MakeBig(parser: TexParser, name: string, mclass: number, size: number) {
    TreeHelper.printMethod('MakeBig');
    // @test Choose, Over With Delims, Above With Delims
    size *= P_HEIGHT;
    let sizeStr = String(size).replace(/(\.\d\d\d).+/,'$1')+'em';
    const delim = parser.GetDelimiter(name, true);
    const text = TreeHelper.createText(delim);
    const mo = TreeHelper.createNode('mo', [], {
      minsize: sizeStr, maxsize: sizeStr,
      fence: true, stretchy: true, symmetric: true
    }, text);
    const node = TreeHelper.createNode('TeXAtom', [mo], {texClass: mclass});
    parser.Push(node);
  };

  export function BuildRel(parser: TexParser, name: string) {
    TreeHelper.printMethod('BuildRel');
    // @test BuildRel, BuildRel Expression
    const top = parser.ParseUpTo(name,'\\over');
    const bot = parser.ParseArg(name);
    const node = TreeHelper.createNode('munderover', [], {});
    // TODO: This is necessary to get the empty element into the children.
    TreeHelper.setData(node, 0, bot);
    TreeHelper.setData(node, 1, null);
    TreeHelper.setData(node, 2, top);
    const atom = TreeHelper.createNode('TeXAtom', [node], {texClass: TEXCLASS.REL});
    parser.Push(atom);
  };

  export function HBox(parser: TexParser, name: string, style: string) {
    TreeHelper.printMethod('HBox');
    // @test Hbox
    parser.PushAll(parser.InternalMath(parser.GetArgument(name), style));
  };

  export function FBox(parser: TexParser, name: string) {
    TreeHelper.printMethod('FBox');
    // @test Fbox
    const internal = parser.InternalMath(parser.GetArgument(name));
    const node = TreeHelper.createNode('menclose', internal, {notation:'box'});
    parser.Push(node);
  };

  export function Not(parser: TexParser, name: string) {
    TreeHelper.printMethod('Not');
    // @test Negation Simple, Negation Complex, Negation Explicit,
    //       Negation Large
    parser.Push( new sitem.NotItem() );
  };

  export function Dots(parser: TexParser, name: string) {
    TreeHelper.printMethod('Dots');
    // @test Operator Dots
    const ldotsEntity = TreeHelper.createEntity('2026');
    const cdotsEntity = TreeHelper.createEntity('22EF');
    const ldots = TreeHelper.createNode('mo', [], {stretchy:false}, ldotsEntity);
    const cdots = TreeHelper.createNode('mo', [], {stretchy:false}, cdotsEntity);
    parser.Push(
                new sitem.DotsItem().With({
                  ldots: parser.mmlToken(ldots),
                  cdots: parser.mmlToken(cdots)
                }) );
  };

  export function Matrix(parser: TexParser, name: string,
                         open: string, close: string, align: string,
                         spacing: string, vspacing: string, style: string,
                         cases: boolean, numbered: boolean) {
    TreeHelper.printMethod('Matrix');
    // TreeHelper.untested(36);
    const c = parser.GetNext();
    if (c === '') {
      throw new TexError(['MissingArgFor','Missing argument for %1', name]);
    }
    if (c === '{') {
      parser.i++;
    } else {
      parser.string = c + '}' + parser.string.slice(parser.i + 1);
      parser.i = 0;
    }
    const array = new sitem.ArrayItem().With({requireClose: true});
    array.arraydef = {
      rowspacing: (vspacing || '4pt'),
      columnspacing: (spacing || '1em')
    };
    // TEMP: Changes here:
    if (cases) {
      array.setProperty('isCases', true);
    }
    if (numbered) {
      array.setProperty('isNumbered', true);
      array.arraydef.side = numbered;
    }
    if (open || close) {
      array.setProperty('open', open);
      array.setProperty('close', close);
    }
    if (style === 'D') {
      array.arraydef.displaystyle = true;
    }
    if (align != null) {
      array.arraydef.columnalign = align;
    }
    parser.Push(array);
  };

  export function Entry(parser: TexParser, name: string) {
    TreeHelper.printMethod('Entry');
    // @test Label, Array, Cross Product Formula
    parser.Push(
                new sitem.CellItem().With({isEntry: true, name: name}) );
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
          throw new TexError(['ExtraAlignTab', 'Extra alignment tab in \\cases text']);
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
        const internal = parser.InternalMath(text, 0);
        parser.PushAll(internal);
        parser.i = i;
      }
    }
  };

  export function Cr(parser: TexParser, name: string) {
    TreeHelper.printMethod('Cr');
    TreeHelper.untested(15);
    parser.Push(
                new sitem.CellItem().With({isCR: true, name: name}) );
  };

  export function CrLaTeX(parser: TexParser, name: string) {
    TreeHelper.printMethod('CrLaTeX');
    let n: string;
    if (parser.string.charAt(parser.i) === '[') {
      n = parser.GetBrackets(name, '').replace(/ /g, '').replace(/,/, '.');
      if (n && !ParserUtil.matchDimen(n)) {
        throw new TexError(['BracketMustBeDimension',
                            'Bracket argument to %1 must be a dimension', name]);
      }
    }
    parser.Push(
                new sitem.CellItem().With({isCR: true, name: name, linebreak: true}) );
    const top = parser.stack.Top();
    let node: MmlNode;
    if (top instanceof sitem.ArrayItem) {
      // TEMP: Changes here:
      // @test Array
      if (n && top.arraydef['rowspacing']) {
        const rows = (top.arraydef['rowspacing'] as string).split(/ /);
        if (!top.getProperty('rowspacing')) {
          top.setProperty('rowspacing', ParserUtil.dimen2em(rows[0]));
        }
        while (rows.length < top.table.length) {
          rows.push(ParserUtil.Em(top.getProperty('rowspacing')));
        }
        rows[top.table.length - 1] = ParserUtil.Em(
          Math.max(0, top.getProperty('rowspacing') + ParserUtil.dimen2em(n)));
        top.arraydef['rowspacing'] = rows.join(' ');
      }
    } else {
      if (n) {
        // @test Custom Linebreak
        node = TreeHelper.createNode('mspace', [], {depth: n});
        parser.Push(node);
      }
      // @test Linebreak
      node = TreeHelper.createNode('mspace', [], {linebreak: TexConstant.LineBreak.NEWLINE});
      parser.Push(node);
    }
  };

  export function HLine(parser: TexParser, name: string, style: string) {
    TreeHelper.printMethod('HLine');
    if (style == null) {style = 'solid'}
    const top = parser.stack.Top();
    if (!(top instanceof sitem.ArrayItem) || top.data.length) {
      throw new TexError(['Misplaced','Misplaced %1', name]);
    }
    if (!top.table.length) {
      top.frame.push('top');
    } else {
      const lines = (top.arraydef['rowlines'] ? (top.arraydef['rowlines'] as string).split(/ /) : []);
      while (lines.length < top.table.length) {
        lines.push('none');
      }
      lines[top.table.length - 1] = style;
      top.arraydef['rowlines'] = lines.join(' ');
    }
  };

  export function HFill(parser: TexParser, name: string) {
    TreeHelper.printMethod('HFill');
    const top = parser.stack.Top();
    if (top instanceof sitem.ArrayItem) {
      top.hfill.push(top.data.length);
    } else {
      throw new TexError(['UnsupportedHFill', 'Unsupported use of %1', name]);
    }
  };


  // Utilities:

  export function mi2mo(mi: MmlNode) {
    TreeHelper.printMethod('mi2mo');
    // @test Mathop Sub, Mathop Super
    const mo = TreeHelper.createNode('mo', [], {});
    TreeHelper.copyChildren(mi, mo);
    // TODO: Figure out how to copy these attributes.
    TreeHelper.copyAttributes(mi, mo);
    // TODO: Do this with get('lspace') etc.
    TreeHelper.setProperties(mo, {lspace: '0', rspace: '0'});
    // mo.lspace = mo.rspace = '0';  // prevent mo from having space in NativeMML
    // mo.useMMLspacing &= ~(mo.SPACE_ATTR.lspace | mo.SPACE_ATTR.rspace);  // don't count these explicit settings
    return mo;
  };






  /************************************************************************/
  /*
   *   LaTeX environments
   */

  let MAXMACROS = 10000;    // maximum number of macro substitutions per equation
  let MAXBUFFER = 5*1024;   // maximum size of TeX string to process


  export function BeginEnd(parser: TexParser, name: string) {
    TreeHelper.printMethod('BeginEnd');
    // @test Array1, Array2, Array Test
    let env = parser.GetArgument(name);
    const regexp = /^\\end\\/;
    if (env.match(regexp)) {
      env = env.substr(5);
    } // special \end{} for \newenvironment environments
    if (env.match(/\\/i)) {
      throw new TexError(['InvalidEnv','Invalid environment name \'%1\'',env]);
    }
    if (name === '\\end') {
      const mml =
        new sitem.EndItem().With({name: env}) ;
      parser.Push(mml);
    } else {
      if (++parser.macroCount > MAXMACROS) {
        throw new TexError(['MaxMacroSub2',
                            'MathJax maximum substitution count exceeded; ' +
                            'is there a recursive latex environment?']);
      }
      parser.parse('environment', [env, this]);
    }
  };


  export function BeginEnvironment(parser: TexParser, func: Function, env: string, args: any[]) {
    TreeHelper.printMethod('BeginEnvironment');
    const end = args[0];
    let mml = new sitem.BeginItem().With({name: env, end: end});
    mml = func.apply(this,[parser, mml].concat(args.slice(1)));
    parser.Push(mml);
  };

  export function Equation(parser: TexParser, begin: string, row: MmlNode[]) {
    return row;
  };

  // export function ExtensionEnv(parser: TexParser, begin,file) {
  //   parser.Extension(begin.name,file,'environment');
  // };

  export function Array(parser: TexParser, begin: sitem.StackItem,
                        open: string, close: string, align: string,
                        spacing: string, vspacing: string, style: string,
                        raggedHeight: boolean) {
    TreeHelper.printMethod('Array');
    if (!align) {
      // @test Array Single
      align = parser.GetArgument('\\begin{' + begin.getName() + '}');
    }
    let lines = ('c' + align).replace(/[^clr|:]/g,'').replace(/[^|:]([|:])+/g, '$1');
    align = align.replace(/[^clr]/g, '').split('').join(' ');
    align = align.replace(/l/g, 'left').replace(/r/g, 'right').replace(/c/g, 'center');
    const array = new sitem.ArrayItem();
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
      if (lines.charAt(lines.length-1).match(/[|:]/)) {
        // @test Enclosed left right, Enclosed right
        array.frame.push('right');
      }
      // @test Enclosed left right
      lines = lines.substr(1,lines.length-2);
      array.arraydef.columnlines =
        lines.split('').join(' ').replace(/[^|: ]/g,'none').replace(/\|/g,'solid').replace(/:/g,'dashed');
    }
    // TEMP: Changes here;
    if (open)  {
      // @test Cross Product
      array.setProperty('open', parser.convertDelimiter(open));
    }
    if (close) {
      // @test Cross Product
      array.setProperty('close', parser.convertDelimiter(close));
    }
    if (style === 'D') {
      TreeHelper.untested(30);
      array.arraydef.displaystyle = true;
    }
    else if (style) {
      TreeHelper.untested(31);
      array.arraydef.displaystyle = false;
    }
    if (style === 'S') {
      TreeHelper.untested(32);
      array.arraydef.scriptlevel = 1;
    } // FIXME: should use mstyle?
    if (raggedHeight)  {
      TreeHelper.untested(33);
      array.arraydef.useHeight = false;
    }
    parser.Push(begin);
    return array;
  };


  export function AlignedArray(parser: TexParser, begin: sitem.StackItem) {
    TreeHelper.printMethod('AlignedArray');
    // @test Array1, Array2, Array Test
    const align = parser.GetBrackets('\\begin{' + begin.getName() + '}');
    return ParseMethods.setArrayAlign(parser,
                                      ParseMethods.Array.apply(parser,arguments),align);
  };


  export function setArrayAlign(parser: TexParser, array: sitem.ArrayItem, align: string) {
    TreeHelper.printMethod('setArrayAlign');
    // @test Array1, Array2, Array Test
    align = parser.trimSpaces(align || '');
    if (align === 't') {array.arraydef.align = 'baseline 1'}
    else if (align === 'b') {array.arraydef.align = 'baseline -1'}
    else if (align === 'c') {array.arraydef.align = 'center'}
    else if (align) {array.arraydef.align = align} // FIXME: should be an error?
    return array;
  };


  /**************
   * Macros and Extension functionality.
   *************/
  // TODO:
  // Most of this is untested and should probably go into a separate file.
  // We should probably loose require.

  let EXTENSION_DIR = '';


  export function Require(parser: TexParser, name: string) {
    TreeHelper.printMethod('Require');
    const file = parser.GetArgument(name)
      .replace(/.*\//,'')            // remove any leading path
      .replace(/[^a-z0-9_.-]/ig,''); // remove illegal characters
    ParseMethods.Extension(parser, null,file);
  };


  export function Extension(parser: TexParser, name: string|sitem.StackItem,
                            file: string, array?: any) {
    TreeHelper.printMethod('Extension');
    if (name && !(typeof(name) === 'string')) {name = name.getName();}
    // file = TEX.extensionDir+'/'+file;
    file = EXTENSION_DIR + '/' + file;
    if (!file.match(/\.js$/)) {file += '.js'}
  };


  export function Macro(parser: TexParser, name: string,
                        macro: string, argcount: number,
                        // TODO: The final argument seems never to be used.
                        def?: string) {
    TreeHelper.printMethod('Macro');
    if (argcount) {
      const args: string[] = [];
      if (def != null) {
        const optional = parser.GetBrackets(name);
        args.push(optional == null ? def : optional);
      }
      for (let i = args.length; i < argcount; i++) {
        args.push(parser.GetArgument(name));
      }
      macro = ParseMethods.SubstituteArgs(args,macro);
    }
    parser.string = ParseMethods.AddArgs(macro,parser.string.slice(parser.i));
    parser.i = 0;
    if (++parser.macroCount > MAXMACROS) {
      throw new TexError(['MaxMacroSub1',
                          'MathJax maximum macro substitution count exceeded; ' +
                          'is there a recursive macro call?']);
    }
  };


  // These two are Macro Utility functions
  /**
   *  Replace macro paramters with their values
   */
  export function SubstituteArgs(args: string[], string: string) {
    TreeHelper.printMethod('SubstituteArgs');
    let text = '';
    let newstring = '';
    let i = 0;
    while (i < string.length) {
      let c = string.charAt(i++);
      if (c === '\\') {text += c + string.charAt(i++)}
      else if (c === '#') {
        c = string.charAt(i++);
        if (c === '#') {
          text += c;
        } else {
          if (!c.match(/[1-9]/) || parseInt(c, 10) > args.length) {
            throw new TexError(['IllegalMacroParam',
                                'Illegal macro parameter reference']);
          }
          newstring = ParseMethods.AddArgs(this.AddArgs(newstring, text),
                                           args[parseInt(c, 10) - 1]);
          text = '';
        }
      } else {text += c}
    }
    return this.AddArgs(newstring, text);
  };

  /**
   *  Make sure that macros are followed by a space if their names
   *  could accidentally be continued into the following text.
   */
  export function AddArgs(s1: string, s2: string) {
    TreeHelper.printMethod('AddArgs');
    if (s2.match(/^[a-z]/i) && s1.match(/(^|[^\\])(\\\\)*\\[a-z]+$/i)) {s1 += ' '}
    if (s1.length + s2.length > MAXBUFFER) {
      throw new TexError(['MaxBufferSize',
                          'MathJax internal buffer size exceeded; is there a recursive macro call?']);
    }
    return s1+s2;
  };


  // AMS Math
  let TAG_SIDE = 'right';
  let TAG_INDENT = '0.8em';

  export function AMSarray(parser: TexParser, begin: sitem.StackItem,
                           numbered: boolean, taggable: boolean, align: string,
                           spacing: string) {
    TreeHelper.printMethod('AMS-AMSarray');
    // @test The Lorenz Equations, Maxwell's Equations, Cubic Binomial
    parser.Push(begin);
    if (taggable) {
      ParseMethods.checkEqnEnv(parser);
    }
    align = align.replace(/[^clr]/g, '').split('').join(' ');
    align = align.replace(/l/g, 'left').replace(/r/g, 'right').replace(/c/g, 'center');
    let newItem = new sitem.AMSarrayItem(begin.getName(), numbered, taggable, parser.stack.global);
    newItem.arraydef = {
        displaystyle: true,
        rowspacing: '.5em',
        columnalign: align,
        columnspacing: (spacing||'1em'),
        // TODO: Which one is correct?
        // rowspacing: '3pt',
        side: TAG_SIDE,
        minlabelspacing: TAG_INDENT
    };
    return newItem;
  };


  /**
   *  Check for bad nesting of equation environments
   */
  export function checkEqnEnv(parser: TexParser) {
    TreeHelper.printMethod('AMS-checkEqnEnv');
    if (parser.stack.global.eqnenv) {
      throw new TexError(['ErroneousNestingEq', 'Erroneous nesting of equation structures']);
    }
    parser.stack.global.eqnenv = true;
  };


  export function HandleOperatorName(parser: TexParser, name: string) {
    TreeHelper.printMethod('AMS-HandleOperatorName');
    // @test Operatorname
    const limits = (parser.GetStar() ? '' : '\\nolimits\\SkipLimits');
    let op = parser.trimSpaces(parser.GetArgument(name));
    op = op.replace(/\*/g, '\\text{*}').replace(/-/g, '\\text{-}');
    parser.string = '\\mathop{\\rm '+op+'}' + limits + ' ' + parser.string.slice(parser.i);
    parser.i = 0;
  };


  export function SkipLimits(parser: TexParser, name: string) {
    TreeHelper.printMethod('AMS-SkipLimits');
    // @test Operatorname
    const c = parser.GetNext(), i = parser.i;
    if (c === '\\' && ++parser.i && parser.GetCS() !== 'limits') {
      parser.i = i;
    }
  };

  // mathchoice
  export function MathChoice(parser: TexParser, name: string) {
    const D  = parser.ParseArg(name);
    const T  = parser.ParseArg(name);
    const S  = parser.ParseArg(name);
    const SS = parser.ParseArg(name);
    parser.Push(NewTex.display ? D : T);
    // parser.Push(MML.TeXmathchoice(D,T,S,SS));
  }

}
