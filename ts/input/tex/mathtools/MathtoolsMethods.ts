/*************************************************************
 *  Copyright (c) 2020-2021 MathJax Consortium
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
 * @fileoverview    Macro and environment implementations for the mathtools package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 * @author dpvc@mathjax.org (Davide P. Cervone)
 */


import {ArrayItem, EqnArrayItem} from '../base/BaseItems.js';
import {StackItem} from '../StackItem.js';
import ParseUtil from '../ParseUtil.js';
import {ParseMethod} from '../Types.js';
import {AmsMethods} from '../ams/AmsMethods.js';
import BaseMethods from '../base/BaseMethods.js';
import TexParser from '../TexParser.js';
import TexError from '../TexError.js';
import NodeUtil from '../NodeUtil.js';
import {TEXCLASS} from '../../../core/MmlTree/MmlNode.js';
import {length2em, em} from '../../../util/lengths.js';
import {lookup} from '../../../util/Options.js';
import NewcommandUtil from '../newcommand/NewcommandUtil.js';
import NewcommandMethods from '../newcommand/NewcommandMethods.js';

import {MathtoolsTags} from './MathtoolsTags.js';
import {MathtoolsUtil} from './MathtoolsUtil.js';

/**
 * The implementations for the macros and environemtns for the mathtools package.
 */
export const MathtoolsMethods: Record<string, ParseMethod> = {

  MtMatrix(parser: TexParser, begin: StackItem, open: string, close: string) {
    const align = parser.GetBrackets(`\\begin{${begin.getName()}}`, 'c');
    return MathtoolsMethods.Array(parser, begin, open, close, align);
  },

  MtSmallMatrix(parser: TexParser, begin: StackItem, open: string, close: string, align: string) {
    if (!align) {
      align = parser.GetBrackets(`\\begin{${begin.getName()}}`, parser.options.mathtools['smallmatrix-align']);
    }
    return MathtoolsMethods.Array(
      parser, begin, open, close, align, ParseUtil.Em(1 / 3), '.2em', 'S', 1
    );
  },

  MtMultlined(parser: TexParser, begin: StackItem) {
    const name = `\\begin{${begin.getName()}}`;
    let pos = parser.GetBrackets(name, parser.options.mathtools['multlined-pos'] || 'c');
    let width = pos ? parser.GetBrackets(name, '') : '';
    if (pos && !pos.match(/^[cbt]$/)) {
      [width, pos] = [pos, width];
    }
    parser.Push(begin);
    const item = parser.itemFactory.create('multlined', parser, begin) as ArrayItem;
    item.arraydef = {
      displaystyle: true,
      rowspacing: '.5em',
      width: width || 'auto',
      columnwidth: '100%',
    };
    return ParseUtil.setArrayAlign(item as ArrayItem, pos || 'c');
  },

  HandleShove(parser: TexParser, name: string, shove: string) {
    let top = parser.stack.Top();
    if (top.kind !== 'multline' && top.kind !== 'multlined') {
      throw new TexError(
        'CommandInMultlined',
        '%1 can only appear within the multline or multlined environments',
        name);
    }
    if (top.Size()) {
      throw new TexError(
        'CommandAtTheBeginingOfLine',
        '%1 must come at the beginning of the line',
        name);
    }
    top.setProperty('shove', shove);
    let shift = parser.GetBrackets(name);
    let mml = parser.ParseArg(name);
    if (shift) {
      let mrow = parser.create('node', 'mrow', []);
      let mspace = parser.create('node', 'mspace', [], {width: shift});
      if (shove === 'left') {
        mrow.appendChild(mspace);
        mrow.appendChild(mml);
      } else {
        mrow.appendChild(mml);
        mrow.appendChild(mspace);
      }
      mml = mrow;
    }
    parser.Push(mml);
  },

  SpreadLines(parser: TexParser, begin: StackItem) {
    if (parser.stack.env.closing === begin.getName()) {
      delete parser.stack.env.closing;
      const top = parser.stack.Pop();
      const mml = top.toMml();
      const spread = top.getProperty('spread') as string;
      if (mml.isInferred) {
        for (const child of NodeUtil.getChildren(mml)) {
          MathtoolsUtil.spreadLines(child, spread);
        }
      } else {
        MathtoolsUtil.spreadLines(mml, spread);
      }
      parser.Push(mml);
    } else {
      const spread = parser.GetDimen(`\\begin{${begin.getName()}}`);
      begin.setProperty('spread', spread);
      parser.Push(begin);
    }
  },

  /**
   * Handle mathrlap, mathllap, mathclap commands.
   *
   * @param {TexParser} parser   The calling parser.
   * @param {string} name        The macro name.
   * @param {string} post        The position (l, c, r) of the lapped content
   */
  MathLap(parser: TexParser, name: string, pos: string) {
    const style = parser.GetBrackets(name);
    let mml = parser.create('node', 'mpadded', [parser.ParseArg(name)], {width: 0});
    if (pos !== 'r') {
      NodeUtil.setAttribute(mml, 'lspace', pos === 'l' ? '-1width' : '-.5width');
    }
    if (style) {
      const [display, script] = lookup(style, {
        '\\displaystyle':      [true, 0],
        '\\textstyle':         [false, 0],
        '\\scriptstyle':       [false, 1],
        '\\scriptscriptstyle': [false, 2]
      }, [null, null]);
      if (display !== null) {
        mml = parser.create('node', 'mstyle', [mml], {displaystyle: display, scriptlevel: script});
      }
    }
    const atom = parser.create('node', 'TeXAtom', [mml]);
    parser.Push(atom);
  },

  MtLap(parser: TexParser, name: string, pos: string) {
    const content = ParseUtil.internalMath(parser, parser.GetArgument(name), 0);
    let mml = parser.create('node', 'mpadded', content, {width: 0});
    if (pos !== 'r') {
      NodeUtil.setAttribute(mml, 'lspace', pos === 'l' ? '-1width' : '-.5width');
    }
    parser.Push(mml);
  },

  MathMakeBox(parser: TexParser, name: string) {
    const width = parser.GetBrackets(name);
    const pos = parser.GetBrackets(name, 'c');
    const mml = parser.create('node', 'mpadded', [parser.ParseArg(name)]);
    if (width) {
      NodeUtil.setAttribute(mml, 'width', width);
    }
    const align = lookup(pos, {c: 'center', r: 'right'}, '');
    if (align) {
      NodeUtil.setAttribute(mml, 'data-align', align);
    }
    parser.Push(mml);
  },

  MathMBox(parser: TexParser, name: string) {
    parser.Push(parser.create('node', 'mrow', [parser.ParseArg(name)]));
  },

  UnderOverBracket(parser: TexParser, name: string) {
    const thickness = length2em(parser.GetBrackets(name, '.1em'), .1);
    const height = parser.GetBrackets(name, '.2em');
    const arg = parser.GetArgument(name);
    const [pos, accent, border, side] = (
      name.charAt(1) === 'o' ?
        ['over', 'accent', 'bottom', 'height'] :
        ['under', 'accentunder', 'top', 'depth']
    );
    const t = em(thickness);
    const t2 = em(2 * thickness);
    const base = new TexParser(arg, parser.stack.env, parser.configuration).mml();
    const copy = new TexParser(arg, parser.stack.env, parser.configuration).mml();
    const script = parser.create('node', 'mpadded', [
      parser.create('node', 'mpadded', [
        parser.create('node', 'mphantom', [copy])
      ], {
        style: `border: ${t} solid; border-${border}: none`,
        width: `-${t2}`,
        height: height,
        depth: 0
      })
    ], {
      width: `+${t2}`,
      [side]: `+${t}`
    });
    const node = ParseUtil.underOver(parser, base, script, pos, true);
    const munderover = NodeUtil.getChildAt(NodeUtil.getChildAt(node, 0), 0);  // TeXAtom.inferredMrow child 0
    NodeUtil.setAttribute(munderover, accent, true);
    parser.Push(node);
  },

  Cases(parser: TexParser, begin: StackItem, open: string, close: string, style: string) {
    const array = parser.itemFactory.create('array').setProperty('casesEnv', begin.getName()) as ArrayItem;
    array.arraydef = {
      rowspacing: '.2em',
      columnspacing: '1em',
      columnalign: 'left'
    };
    if (style === 'D') {
      array.arraydef.displaystyle = true;
    }
    array.setProperties({open, close});
    parser.Push(begin);
    return array;
  },

  Aboxed(parser: TexParser, name: string) {
    //
    //  Check that the top item is an alignment, and that we are on an even number of cells
    //  (othewise add one to make it even).
    //
    const top = MathtoolsUtil.checkAlignment(parser, name);
    if (top.row.length % 2 === 1) {
      top.row.push(parser.create('node', 'mtd', []));
    }
    //
    //  Get the argument and the rest of the TeX string.
    //
    const arg = parser.GetArgument(name);
    const rest = parser.string.substr(parser.i);
    //
    //  Put argument back, followed by "&&", which we look for below.
    //
    parser.string = arg + '&&';
    parser.i = 0;
    //
    //  Get the two parts separated by ampersands, and ignore the rest.
    //
    const left = parser.GetUpTo(name, '&');
    const right = parser.GetUpTo(name, '&');
    //
    //  Insert the TeX needed for the boxed content
    //
    const tex = ParseUtil.substituteArgs(
      parser, [left, right], '\\rlap{\\boxed{#1{}#2}}\\kern.267em\\phantom{#1}&\\phantom{{}#2}\\kern.267em'
    );
    parser.string = tex + rest;
    parser.i = 0;
  },

  ArrowBetweenLines(parser: TexParser, name: string) {
    const top = MathtoolsUtil.checkAlignment(parser, name);
    if (top.Size() || top.row.length) {
      throw new TexError('BetweenLines', '%1 must be on a row by itself', name);
    }
    const star = parser.GetStar();
    const symbol = parser.GetBrackets(name, '\\Updownarrow');
    if (star) {
      top.EndEntry();
      top.EndEntry();
    }
    const tex = (star ? '\\quad' + symbol : symbol + '\\quad');
    const mml = new TexParser(tex, parser.stack.env, parser.configuration).mml();
    parser.Push(mml);
    top.EndEntry();
    top.EndRow();
  },

  VDotsWithin(parser: TexParser, name: string) {
    const top = parser.stack.Top() as EqnArrayItem;
    const isFlush = (top.getProperty('flushspaceabove') === top.table.length);
    const arg = '\\mmlToken{mi}{}' + parser.GetArgument(name) + '\\mmlToken{mi}{}';
    const base = new TexParser(arg, parser.stack.env, parser.configuration).mml();
    let mml = parser.create('node', 'mpadded', [
      parser.create('node', 'mpadded', [
        parser.create('node', 'mo', [parser.create('text', '\u22EE')])
      ], {width: 0, lspace: '-.5width', ...(isFlush ? {height: '-.6em', voffset: '-.18em'} : {})}),
      parser.create('node', 'mphantom', [base])
    ], {lspace: '.5width'});
    parser.Push(mml);
  },

  ShortVDotsWithin(parser: TexParser, _name: string) {
    const top = parser.stack.Top() as EqnArrayItem;
    const star = parser.GetStar();
    MathtoolsMethods.FlushSpaceAbove(parser, '\\MTFlushSpaceAbove');
    !star && top.EndEntry();
    MathtoolsMethods.VDotsWithin(parser, '\\vdotswithin');
    star && top.EndEntry();
    MathtoolsMethods.FlushSpaceBelow(parser, '\\MTFlushSpaceBelow');
  },

  FlushSpaceAbove(parser: TexParser, name: string) {
    const top = MathtoolsUtil.checkAlignment(parser, name);
    top.setProperty('flushspaceabove', top.table.length);
    top.addRowSpacing('-' + parser.options.mathtools['shortvdotsadjustabove']);
  },

  FlushSpaceBelow(parser: TexParser, name: string) {
    const top = MathtoolsUtil.checkAlignment(parser, name);
    top.Size() && top.EndEntry();
    top.EndRow();
    top.addRowSpacing('-' + parser.options.mathtools['shortvdotsadjustbelow']);
  },

  PairedDelimiters(parser: TexParser, name: string,
                   open: string, close: string,
                   body: string = '#1', n: number = 1,
                   pre: string = '',  post: string = '') {
    const star = parser.GetStar();
    const size = (star ? '' : parser.GetBrackets(name));
    const [left, right] = (star ? ['\\left', '\\right'] : size ? [size + 'l' , size + 'r'] : ['', '']);
    const delim = (star ? '\\middle' : size || '');
    if (n) {
      const args: string[] = [];
      for (let i = args.length; i < n; i++) {
        args.push(parser.GetArgument(name));
      }
      body = ParseUtil.substituteArgs(parser, args, body);
    }
    body = body.replace(/\\delimsize/g, delim);
    parser.string = [pre, left, open, body, right, close, post, parser.string.substr(parser.i)]
      .reduce((s, part) => ParseUtil.addArgs(parser, s, part), '');
    parser.i = 0;
    ParseUtil.checkMaxMacros(parser);
  },

  DeclarePairedDelimiters(parser: TexParser, name: string) {
    const cs = NewcommandUtil.GetCsNameArgument(parser, name);
    const open = parser.GetArgument(name);
    const close = parser.GetArgument(name);
    MathtoolsUtil.addPairedDelims(parser.configuration, cs, [open, close]);
  },

  DeclarePairedDelimitersX(parser: TexParser, name: string) {
    const cs = NewcommandUtil.GetCsNameArgument(parser, name);
    const n = NewcommandUtil.GetArgCount(parser, name);
    const open = parser.GetArgument(name);
    const close = parser.GetArgument(name);
    const body = parser.GetArgument(name);
    MathtoolsUtil.addPairedDelims(parser.configuration, cs, [open, close, body, n]);
  },

  DeclarePairedDelimitersXPP(parser: TexParser, name: string) {
    const cs = NewcommandUtil.GetCsNameArgument(parser, name);
    const n = NewcommandUtil.GetArgCount(parser, name);
    const pre = parser.GetArgument(name);
    const open = parser.GetArgument(name);
    const close = parser.GetArgument(name);
    const post = parser.GetArgument(name);
    const body = parser.GetArgument(name);
    MathtoolsUtil.addPairedDelims(parser.configuration, cs, [open, close, body, n, pre, post]);
  },

  CenterColon(parser: TexParser, _name: string, center: boolean, force: boolean = false, thin: boolean = false) {
    const options = parser.options.mathtools;
    let mml = parser.create('token', 'mo', {}, ':');
    if (center && (options['centercolon'] || force)) {
      const dy = options['centercolon-offset'];
      mml = parser.create('node', 'mpadded', [mml], {
        voffset: dy, height: `+${dy}`, depth: `-${dy}`,
          ...(thin ? {width: options['thincolon-dw'], lspace: options['thincolon-dx']} : {})
      });
    }
    parser.Push(mml);
  },

  Relation(parser: TexParser, _name: string, tex: string, unicode?: string) {
    const options = parser.options.mathtools;
    if (options['use-unicode'] && unicode) {
      parser.Push(parser.create('token', 'mo', {texClass: TEXCLASS.REL}, unicode));
    } else {
      tex = '\\mathrel{' + tex.replace(/:/g, '\\MTThinColon').replace(/-/g, '\\mathrel{-}') + '}';
      parser.string = ParseUtil.addArgs(parser, tex, parser.string.substr(parser.i));
      parser.i = 0;
    }
  },

  NArrow(parser: TexParser, _name: string, c: string, dy: string) {
    parser.Push(
      parser.create('node', 'TeXAtom', [
        parser.create('token', 'mtext', {}, c),
        parser.create('node', 'mpadded', [
          parser.create('node', 'mpadded', [
            parser.create('node', 'menclose', [
              parser.create('node', 'mspace', [], {height: '.2em', depth: 0, width: '.4em'})
            ], {notation: 'updiagonalstrike', 'data-thickness': '.05em', 'data-padding': 0})
          ], {width: 0, lspace: '-.5width', voffset: dy}),
          parser.create('node', 'mphantom', [
            parser.create('token', 'mtext', {}, c)
          ])
        ], {width: 0, lspace: '-.5width'})
      ], {texClass: TEXCLASS.REL})
    );
  },

  SplitFrac(parser: TexParser, name: string, display: boolean) {
    const num = parser.ParseArg(name);
    const den = parser.ParseArg(name);
    parser.Push(
      parser.create('node', 'mstyle', [
        parser.create('node', 'mfrac', [
          parser.create('node', 'mstyle', [
            num,
            parser.create('token', 'mi'),
            parser.create('token', 'mspace', {width: '1em'})
          ], {scriptlevel: 0}),
          parser.create('node', 'mstyle', [
            parser.create('token', 'mspace', {width: '1em'}),
            parser.create('token', 'mi'),
            den
          ], {scriptlevel: 0})
        ], {linethickness: 0, numalign: 'left', denomalign: 'right'})
      ], {displaystyle: display, scriptlevel: 0})
    );
  },

  XMathStrut(parser: TexParser, name: string) {
    let dd = parser.GetBrackets(name);
    let dh = parser.GetArgument(name);
    dh = MathtoolsUtil.plusOrMinus(name, dh);
    dd = MathtoolsUtil.plusOrMinus(name, dd || dh);
    parser.Push(
      parser.create('node', 'TeXAtom', [
        parser.create('node', 'mpadded', [
          parser.create('node', 'mphantom', [
            parser.create('token', 'mo', {stretchy: false}, '(')
          ])
        ], {width: 0, height: dh + 'height', depth: dd + 'depth'})
      ], {texClass: TEXCLASS.ORD})
    );
  },

  Prescript(parser: TexParser, name: string) {
    const sup = MathtoolsUtil.getScript(parser, name, 'sup');
    const sub = MathtoolsUtil.getScript(parser, name, 'sub');
    const base = MathtoolsUtil.getScript(parser, name, 'arg');
    if (NodeUtil.isType(sup, 'none') && NodeUtil.isType(sub, 'none')) {
      parser.Push(base);
      return;
    }
    const mml = parser.create('node', 'mmultiscripts', [base]);
    NodeUtil.getChildren(mml).push(null, null);
    NodeUtil.appendChildren(mml, [parser.create('node', 'mprescripts'), sub, sup]);
    mml.setProperty('fixPrescript', true);
    parser.Push(mml);
  },

  NewTagForm(parser: TexParser, name: string, renew: boolean = false) {
    const tags = parser.tags as MathtoolsTags;
    if (!('mtFormats' in tags)) {
      throw new TexError('TagsNotMT', '%1 can only be used with ams or mathtools tags', name);
    }
    const id = parser.GetArgument(name).trim();
    if (!id) {
      throw new TexError('InvalidTagFormID', 'Tag form name can\'t be empty');
    }
    const format = parser.GetBrackets(name, '');
    const left = parser.GetArgument(name);
    const right = parser.GetArgument(name);
    if (!renew && tags.mtFormats.has(id)) {
      throw new TexError('DuplicateTagForm', 'Duplicate tag form: %1', id);
    }
    tags.mtFormats.set(id, [left, right, format]);
  },

  UseTagForm(parser: TexParser, name: string) {
    const tags = parser.tags as MathtoolsTags;
    if (!('mtFormats' in tags)) {
      throw new TexError('TagsNotMT', '%1 can only be used with ams or mathtools tags', name);
    }
    const id = parser.GetArgument(name).trim();
    if (!id) {
      tags.mtCurrent = null;
      return;
    }
    if (!tags.mtFormats.has(id)) {
      throw new TexError('UndefinedTagForm', 'Undefined tag form: %1', id);
    }
    tags.mtCurrent = tags.mtFormats.get(id);
  },

  /**
   * Use the Base or AMS methods for these
   */
  Array:  BaseMethods.Array,
  Macro:  BaseMethods.Macro,
  xArrow:      AmsMethods.xArrow,
  HandleRef:   AmsMethods.HandleRef,
  AmsEqnArray: AmsMethods.AmsEqnArray,
  MacroWithTemplate: NewcommandMethods.MacroWithTemplate

};