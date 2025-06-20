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
 * @file The AMS Parse methods.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import { StackItem } from '../StackItem.js';
import { ParseResult, ParseMethod } from '../Types.js';
import { ParseUtil } from '../ParseUtil.js';
import { UnitUtil } from '../UnitUtil.js';
import ParseMethods from '../ParseMethods.js';
import NodeUtil from '../NodeUtil.js';
import { TexConstant } from '../TexConstants.js';
import TexParser from '../TexParser.js';
import TexError from '../TexError.js';
import { ArrayItem } from '../base/BaseItems.js';
import { FlalignItem } from './AmsItems.js';
import BaseMethods from '../base/BaseMethods.js';
import { splitAlignArray } from '../base/BaseMethods.js';
import { TEXCLASS } from '../../../core/MmlTree/MmlNode.js';
import { MmlMunderover } from '../../../core/MmlTree/MmlNodes/munderover.js';
import {
  MmlNode,
  AbstractMmlTokenNode,
} from '../../../core/MmlTree/MmlNode.js';
import { NewcommandUtil } from '../newcommand/NewcommandUtil.js';

/**
 * Utility for breaking the \sideset scripts from any other material.
 *
 * @param {MmlNode} mml The node to check.
 * @returns {[MmlNode, MmlNode]} The msubsup with the scripts together with any extra nodes.
 */
function splitSideSet(mml: MmlNode): [MmlNode, MmlNode] {
  if (!mml || (mml.isInferred && mml.childNodes.length === 0)) {
    return [null, null];
  }
  if (mml.isKind('msubsup') && checkSideSetBase(mml)) {
    return [mml, null];
  }
  const child = NodeUtil.getChildAt(mml, 0);
  if (!(mml.isInferred && child && checkSideSetBase(child))) {
    return [null, mml];
  }
  mml.childNodes.splice(0, 1); // remove first child
  return [child, mml];
}

/**
 * Utility for checking if a \sideset argument has scripts with an empty base.
 *
 * @param {MmlNode} mml The node to check.
 * @returns {boolean} True if the base is not and empty mi element.
 */
function checkSideSetBase(mml: MmlNode): boolean {
  const base = mml.childNodes[0];
  return (
    base && base.isKind('mi') && (base as AbstractMmlTokenNode).getText() === ''
  );
}

// Namespace
export const AmsMethods: { [key: string]: ParseMethod } = {
  /**
   * Handle AMS array environments.
   *
   * @param {TexParser} parser The calling parser.
   * @param {StackItem} begin The opening stackitem.
   * @param {boolean} numbered Environment numbered.
   * @param {boolean} taggable Environment taggable (e.g., align* is taggable,
   *     split is not).
   * @param {string} align Column alignment.
   * @param {string} balign Column break alignment.
   * @param {string} spacing Column spacing.
   * @param {string} style Display style indicator.
   *
   * @returns {ParseResult} The constructed array stackitem.
   */
  AmsEqnArray(
    parser: TexParser,
    begin: StackItem,
    numbered: boolean,
    taggable: boolean,
    align: string,
    balign: string,
    spacing: string,
    style: string
  ): ParseResult {
    // @test Aligned, Gathered
    const args = parser.GetBrackets('\\begin{' + begin.getName() + '}');
    const array = BaseMethods.EqnArray(
      parser,
      begin,
      numbered,
      taggable,
      align,
      balign,
      spacing,
      style
    );
    return ParseUtil.setArrayAlign(array as ArrayItem, args, parser);
  },

  /**
   * Handle AMS  alignat environments.
   *
   * @param {TexParser} parser The calling parser.
   * @param {StackItem} begin The opening stackitem.
   * @param {boolean} numbered Environment numbered.
   * @param {boolean} taggable Environment taggable (e.g., align* is taggable,
   *     split is not).
   *
   * @returns {ParseResult} The constructed array stackitem.
   */
  AlignAt(
    parser: TexParser,
    begin: StackItem,
    numbered: boolean,
    taggable: boolean
  ): ParseResult {
    const name = begin.getName();
    let valign;
    let align = '';
    let balign = '';
    const spacing = [];
    if (!taggable) {
      // @test Alignedat
      valign = parser.GetBrackets('\\begin{' + name + '}');
    }
    const n = parser.GetArgument('\\begin{' + name + '}');
    if (n.match(/[^0-9]/)) {
      // @test PositiveIntegerArg
      throw new TexError(
        'PositiveIntegerArg',
        'Argument to %1 must be a positive integer',
        '\\begin{' + name + '}'
      );
    }
    let count = parseInt(n, 10);
    while (count > 0) {
      align += 'rl';
      balign += 'bt';
      spacing.push('0em 0em');
      count--;
    }
    const spaceStr = spacing.join(' ');
    if (taggable) {
      // @test Alignat, Alignat Star
      return AmsMethods.EqnArray(
        parser,
        begin,
        numbered,
        taggable,
        align,
        balign,
        spaceStr
      );
    }
    // @test Alignedat
    const array = AmsMethods.EqnArray(
      parser,
      begin,
      numbered,
      taggable,
      align,
      balign,
      spaceStr
    );
    return ParseUtil.setArrayAlign(array as ArrayItem, valign, parser);
  },

  /**
   * Implements multline environment (mostly handled through STACKITEM below)
   *
   * @param {TexParser} parser The calling parser.
   * @param {StackItem} begin The opening stackitem.
   * @param {boolean} numbered Environment numbered.
   *
   * @returns {ParseResult} The constructed multiline stackitem.
   */
  Multline(
    parser: TexParser,
    begin: StackItem,
    numbered: boolean
  ): ParseResult {
    // @test Shove*, Multline
    ParseUtil.checkEqnEnv(parser);
    parser.Push(begin);
    const padding = parser.options.ams['multlineIndent'];
    const item = parser.itemFactory.create(
      'multline',
      numbered,
      parser.stack
    ) as ArrayItem;
    item.arraydef = {
      displaystyle: true,
      rowspacing: '.5em',
      columnspacing: '100%',
      width: parser.options.ams['multlineWidth'],
      side: parser.options['tagSide'],
      minlabelspacing: parser.options['tagIndent'],
      'data-array-padding': `${padding} ${padding}`,
      'data-width-includes-label': true, // take label space out of 100% width
    };
    return item;
  },

  /**
   * Generate an align at environment.
   *
   * @param {TexParser} parser The current TeX parser.
   * @param {StackItem} begin The begin stackitem.
   * @param {boolean} numbered Is this a numbered array.
   * @param {boolean} padded Is it padded.
   *
   * @returns {ParseResult} The constructed flalign stackitem.
   */
  XalignAt(
    parser: TexParser,
    begin: StackItem,
    numbered: boolean,
    padded: boolean
  ): ParseResult {
    const n = parser.GetArgument('\\begin{' + begin.getName() + '}');
    if (n.match(/[^0-9]/)) {
      throw new TexError(
        'PositiveIntegerArg',
        'Argument to %1 must be a positive integer',
        '\\begin{' + begin.getName() + '}'
      );
    }
    const align = padded ? 'crl' : 'rlc';
    const balign = padded ? 'mbt' : 'btm';
    const width = padded ? 'fit auto auto' : 'auto auto fit';
    const item = AmsMethods.FlalignArray(
      parser,
      begin,
      numbered,
      padded,
      false,
      align,
      balign,
      width,
      true
    ) as FlalignItem;
    item.setProperty('xalignat', 2 * parseInt(n));
    return item;
  },

  /**
   * Generate an flalign environment.
   *
   * @param {TexParser} parser The current TeX parser.
   * @param {StackItem} begin The begin stackitem.
   * @param {boolean} numbered Is this a numbered array.
   * @param {boolean} padded Is it padded.
   * @param {boolean} center Is it centered.
   * @param {string} align The horizontal alignment for columns
   * @param {string} balign The vertical break alignment for columns
   * @param {string} width The column widths of the table
   * @param {boolean} zeroWidthLabel True if the label should be in llap/rlap
   *
   * @returns {ParseResult} The constructed flalign stackitem.
   */
  FlalignArray(
    parser: TexParser,
    begin: StackItem,
    numbered: boolean,
    padded: boolean,
    center: boolean,
    align: string,
    balign: string,
    width: string,
    zeroWidthLabel: boolean = false
  ): ParseResult {
    ParseUtil.checkEqnEnv(parser);
    parser.Push(begin);
    align = align
      .split('')
      .join(' ')
      .replace(/r/g, 'right')
      .replace(/l/g, 'left')
      .replace(/c/g, 'center');
    balign = splitAlignArray(balign);
    const item = parser.itemFactory.create(
      'flalign',
      begin.getName(),
      numbered,
      padded,
      center,
      parser.stack
    ) as FlalignItem;
    item.arraydef = {
      width: '100%',
      displaystyle: true,
      columnalign: align,
      columnspacing: '0em',
      columnwidth: width,
      rowspacing: '3pt',
      'data-break-align': balign,
      side: parser.options['tagSide'],
      minlabelspacing: zeroWidthLabel ? '0' : parser.options['tagIndent'],
      'data-width-includes-label': true,
    };
    item.setProperty('zeroWidthLabel', zeroWidthLabel);
    return item;
  },

  /**
   * Handle DeclareMathOperator.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  HandleDeclareOp(parser: TexParser, name: string) {
    const star = parser.GetStar() ? '*' : '';
    const cs = NewcommandUtil.GetCsNameArgument(parser, name);
    const op = parser.GetArgument(name);
    NewcommandUtil.addMacro(parser, cs, AmsMethods.Macro, [
      `\\operatorname${star}{${op}}`,
    ]);
    parser.Push(parser.itemFactory.create('null'));
  },

  /**
   * Handle operatorname.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  HandleOperatorName(parser: TexParser, name: string) {
    // @test Operatorname
    const star = parser.GetStar();
    //
    //  Parse the argument using operator letters and grouping multiple letters.
    //
    const op = UnitUtil.trimSpaces(parser.GetArgument(name));
    let mml = new TexParser(
      op,
      {
        ...parser.stack.env,
        font: TexConstant.Variant.NORMAL,
        multiLetterIdentifiers: parser.options.ams.operatornamePattern,
        operatorLetters: true,
      },
      parser.configuration
    ).mml();
    //
    //  If we get something other than a single mi, wrap in a TeXAtom.
    //
    if (!mml.isKind('mi')) {
      mml = parser.create('node', 'TeXAtom', [mml]);
    }
    //
    //  Mark the limit properties and the TeX class.
    //
    NodeUtil.setProperties(mml, {
      movesupsub: star,
      movablelimits: true,
      texClass: TEXCLASS.OP,
    });
    //
    //  Skip a following \limits macro if not a starred operator
    //
    if (!star) {
      const c = parser.GetNext();
      const i = parser.i;
      if (c === '\\' && ++parser.i && parser.GetCS() !== 'limits') {
        parser.i = i;
      }
    }
    //
    parser.Push(parser.itemFactory.create('fn', mml));
  },

  /**
   * Handle sideset.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  SideSet(parser: TexParser, name: string) {
    //
    //  Get the pre- and post-scripts, and any extra material from the arguments
    //
    const [preScripts, preRest] = splitSideSet(parser.ParseArg(name));
    const [postScripts, postRest] = splitSideSet(parser.ParseArg(name));
    const base = parser.ParseArg(name);
    let mml = base;
    //
    //  If there are pre-scripts...
    //
    if (preScripts) {
      //
      //  If there is other material...
      //
      if (preRest) {
        //
        //  Replace the empty base of the prescripts with a phantom element of the
        //    original base, with width 0 (but still of the correct height and depth).
        //    so the scripts will be at the right heights.
        //
        preScripts.replaceChild(
          parser.create('node', 'mphantom', [
            parser.create(
              'node',
              'mpadded',
              [ParseUtil.copyNode(base, parser)],
              { width: 0 }
            ),
          ]),
          NodeUtil.getChildAt(preScripts, 0)
        );
      } else {
        //
        //  If there is no extra meterial, make a mmultiscripts element
        //
        mml = parser.create('node', 'mmultiscripts', [base]);
        //
        //  Add any postscripts
        //
        if (postScripts) {
          NodeUtil.appendChildren(mml, [
            NodeUtil.getChildAt(postScripts, 1) ||
              parser.create('node', 'none'),
            NodeUtil.getChildAt(postScripts, 2) ||
              parser.create('node', 'none'),
          ]);
        }
        //
        //  Add the prescripts (left aligned)
        //
        NodeUtil.setProperty(mml, 'scriptalign', 'left');
        NodeUtil.appendChildren(mml, [
          parser.create('node', 'mprescripts'),
          NodeUtil.getChildAt(preScripts, 1) || parser.create('node', 'none'),
          NodeUtil.getChildAt(preScripts, 2) || parser.create('node', 'none'),
        ]);
      }
    }
    //
    //  If there are postscripts and we didn't make a mmultiscript element above...
    //
    if (postScripts && mml === base) {
      //
      //  Replace the emtpy base with actual base, and use that as the mml
      //
      postScripts.replaceChild(base, NodeUtil.getChildAt(postScripts, 0));
      mml = postScripts;
    }
    //
    //  Put the needed pieces into a TeXAtom of class OP.
    //  Note that the postScripts are in the mml element,
    //    either as part of the mmultiscripts node, or the
    //    msubsup with the base inserted into it.
    //
    const mrow = parser.create('node', 'TeXAtom', [], {
      texClass: TEXCLASS.OP,
      movesupsub: true,
      movablelimits: true,
    });
    if (preRest) {
      if (preScripts) {
        mrow.appendChild(preScripts);
      }
      mrow.appendChild(preRest);
    }
    mrow.appendChild(mml);
    if (postRest) {
      mrow.appendChild(postRest);
    }
    parser.Push(mrow);
  },

  /**
   * Handle extra letters in \operatorname (- and *), default to normal otherwise.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} c The letter being checked
   *
   * @returns {false|void} Nothing.
   */
  operatorLetter(parser: TexParser, c: string): false | void {
    return parser.stack.env.operatorLetters
      ? ParseMethods.variable(parser, c)
      : false;
  },

  /**
   * Handle multi integral signs.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {string} integral The actual integral sign.
   */
  MultiIntegral(parser: TexParser, name: string, integral: string) {
    let next = parser.GetNext();
    if (next === '\\') {
      // @test MultiInt with Command
      const i = parser.i;
      next = parser.GetArgument(name);
      parser.i = i;
      if (next === '\\limits') {
        // @test MultiInt with Limits
        integral = '\\!\\!\\mathop{\\,\\,' + integral + '}';
      }
    }
    // @test MultiInt, MultiInt in Context
    parser.string = integral + ' ' + parser.string.slice(parser.i);
    parser.i = 0;
  },

  /**
   *  Handle stretchable arrows.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {number} chr The arrow character in hex code.
   * @param {number} l Left width.
   * @param {number} r Right width.
   * @param {number} m Min width
   */
  xArrow(
    parser: TexParser,
    name: string,
    chr: number,
    l: number,
    r: number,
    m: number = 0
  ) {
    const def = {
      width: '+' + UnitUtil.em((l + r) / 18),
      lspace: UnitUtil.em(l / 18),
    };
    const bot = parser.GetBrackets(name);
    const first = parser.ParseArg(name);
    const dstrut = parser.create('node', 'mspace', [], { depth: '.2em' });
    let arrow = parser.create(
      'token',
      'mo',
      { stretchy: true, texClass: TEXCLASS.REL },
      String.fromCodePoint(chr)
    );
    if (m) {
      arrow.attributes.set('minsize', UnitUtil.em(m));
    }
    arrow = parser.create('node', 'mstyle', [arrow], { scriptlevel: 0 });
    const mml = parser.create('node', 'munderover', [arrow]) as MmlMunderover;
    let mpadded = parser.create('node', 'mpadded', [first, dstrut], def);
    NodeUtil.setAttribute(mpadded, 'voffset', '-.2em');
    NodeUtil.setAttribute(mpadded, 'height', '-.2em');
    NodeUtil.setChild(mml, mml.over, mpadded);
    if (bot) {
      // @test Above Below Left Arrow, Above Below Right Arrow
      const bottom = new TexParser(
        bot,
        parser.stack.env,
        parser.configuration
      ).mml();
      const bstrut = parser.create('node', 'mspace', [], { height: '.75em' });
      mpadded = parser.create('node', 'mpadded', [bottom, bstrut], def);
      NodeUtil.setAttribute(mpadded, 'voffset', '.15em');
      NodeUtil.setAttribute(mpadded, 'depth', '-.15em');
      NodeUtil.setChild(mml, mml.under, mpadded);
    }
    // @test Above Left Arrow, Above Right Arrow, Above Left Arrow in Context,
    //       Above Right Arrow in Context
    NodeUtil.setProperty(mml, 'subsupOK', true);
    parser.Push(mml);
  },

  /**
   * Record presence of \shoveleft and \shoveright
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} _name The macro name.
   * @param {string} shove The shove value.
   */
  HandleShove(parser: TexParser, _name: string, shove: string) {
    const top = parser.stack.Top();
    // @test Shove (Left|Right) (Top|Middle|Bottom)
    if (top.kind !== 'multline') {
      // @test Shove Error Environment
      throw new TexError(
        'CommandOnlyAllowedInEnv',
        '%1 only allowed in %2 environment',
        parser.currentCS,
        'multline'
      );
    }
    if (top.Size()) {
      // @test Shove Error (Top|Middle|Bottom)
      throw new TexError(
        'CommandAtTheBeginingOfLine',
        '%1 must come at the beginning of the line',
        parser.currentCS
      );
    }
    top.setProperty('shove', shove);
  },

  /**
   * Handle \cfrac
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  CFrac(parser: TexParser, name: string) {
    let lr = UnitUtil.trimSpaces(parser.GetBrackets(name, ''));
    const num = parser.GetArgument(name);
    const den = parser.GetArgument(name);
    const lrMap: { [key: string]: string } = {
      l: TexConstant.Align.LEFT,
      r: TexConstant.Align.RIGHT,
      '': '',
    };
    const numNode = new TexParser(
      '\\strut\\textstyle{' + num + '}',
      parser.stack.env,
      parser.configuration
    ).mml();
    const denNode = new TexParser(
      '\\strut\\textstyle{' + den + '}',
      parser.stack.env,
      parser.configuration
    ).mml();
    const frac = parser.create('node', 'mfrac', [numNode, denNode]);
    lr = lrMap[lr];
    if (lr == null) {
      // @test Center Fraction Error
      throw new TexError(
        'IllegalAlign',
        'Illegal alignment specified in %1',
        parser.currentCS
      );
    }
    if (lr) {
      // @test Right Fraction, Left Fraction
      NodeUtil.setProperties(frac, { numalign: lr, denomalign: lr });
    }
    // @test Center Fraction
    parser.Push(frac);
  },

  /**
   * Implement AMS generalized fraction.
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   * @param {string} left Left delimiter.
   * @param {string} right Right delimiter.
   * @param {string} thick Line thickness.
   * @param {string} style Math style.
   */
  Genfrac(
    parser: TexParser,
    name: string,
    left: string,
    right: string,
    thick: string,
    style: string
  ) {
    if (left == null) {
      // @test Genfrac
      left = parser.GetDelimiterArg(name);
    }
    if (right == null) {
      // @test Genfrac
      right = parser.GetDelimiterArg(name);
    }
    if (thick == null) {
      // @test Genfrac
      thick = parser.GetArgument(name);
    }
    if (style == null) {
      // @test Genfrac
      style = UnitUtil.trimSpaces(parser.GetArgument(name));
    }
    const num = parser.ParseArg(name);
    const den = parser.ParseArg(name);
    let frac = parser.create('node', 'mfrac', [num, den]);
    if (thick !== '') {
      // @test Normal Binomial, Text Binomial, Display Binomial
      NodeUtil.setAttribute(frac, 'linethickness', thick);
    }
    if (left || right) {
      // @test Normal Binomial, Text Binomial, Display Binomial
      NodeUtil.setProperty(frac, 'withDelims', true);
      frac = ParseUtil.fixedFence(parser.configuration, left, frac, right);
    }
    if (style !== '') {
      const styleDigit = parseInt(style, 10);
      const styleAlpha = ['D', 'T', 'S', 'SS'][styleDigit];
      if (styleAlpha == null) {
        // @test Genfrac Error
        throw new TexError(
          'BadMathStyleFor',
          'Bad math style for %1',
          parser.currentCS
        );
      }
      frac = parser.create('node', 'mstyle', [frac]);
      if (styleAlpha === 'D') {
        // @test Display Fraction, Display Sub Fraction, Display Binomial,
        //       Display Sub Binomial
        NodeUtil.setProperties(frac, { displaystyle: true, scriptlevel: 0 });
      } else {
        // @test Text Fraction, Text Sub Fraction, Text Binomial,
        //       Text Sub Binomial
        NodeUtil.setProperties(frac, {
          displaystyle: false,
          scriptlevel: styleDigit - 1,
        });
      }
    }
    // @test Text Fraction, Normal Sub Binomial, Normal Binomial
    parser.Push(frac);
  },

  /**
   * Add the tag to the environment (to be added to the table row later).
   *
   * @param {TexParser} parser The calling parser.
   * @param {string} name The macro name.
   */
  HandleTag(parser: TexParser, name: string) {
    if (!parser.tags.currentTag.taggable && parser.tags.env) {
      // @test Illegal Tag Error
      throw new TexError(
        'CommandNotAllowedInEnv',
        '%1 not allowed in %2 environment',
        parser.currentCS,
        parser.tags.env
      );
    }
    if (parser.tags.currentTag.tag) {
      // @test Double Tag Error
      throw new TexError('MultipleCommand', 'Multiple %1', parser.currentCS);
    }
    const star = parser.GetStar();
    const tagId = UnitUtil.trimSpaces(parser.GetArgument(name));
    parser.tags.tag(tagId, star);
    parser.Push(parser.itemFactory.create('null'));
  },

  HandleNoTag: BaseMethods.HandleNoTag,
  HandleRef: BaseMethods.HandleRef,
  Macro: BaseMethods.Macro,
  Accent: BaseMethods.Accent,
  Tilde: BaseMethods.Tilde,
  Array: BaseMethods.Array,
  Spacer: BaseMethods.Spacer,
  NamedOp: BaseMethods.NamedOp,
  EqnArray: BaseMethods.EqnArray,
  Equation: BaseMethods.Equation,
};
