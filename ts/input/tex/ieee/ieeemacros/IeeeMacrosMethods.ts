/*************************************************************
 *
 *  Copyright (c) 2023-2024 The MathJax Consortium
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
 * @fileoverview Methods for IEEE macros package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import BaseMethods from '../../base/BaseMethods.js';
import {ParseMethod} from '../../Types.js';
import TexParser from '../../TexParser.js';
import { ParseUtil } from '../../ParseUtil.js';
import { UnitUtil } from '../../UnitUtil.js';
import NodeUtil from '../../NodeUtil.js';
import TexError from '../../TexError.js';
import {TEXCLASS, MmlNode} from '../../../../core/MmlTree/MmlNode.js';
import {IeeeArrayItem} from './IeeeMacrosItems.js';
import {EnvList} from '../../StackItem.js';


let IeeeMacrosMethods: Record<string, ParseMethod> = {};

IeeeMacrosMethods.Macro = BaseMethods.Macro;
IeeeMacrosMethods.Spacer = BaseMethods.Spacer;
IeeeMacrosMethods.Accent = BaseMethods.Accent;
IeeeMacrosMethods.UnderOver = BaseMethods.UnderOver;
IeeeMacrosMethods.HBox = BaseMethods.HBox;

IeeeMacrosMethods.SetFont = BaseMethods.SetFont;
IeeeMacrosMethods.Matrix = BaseMethods.Matrix;
IeeeMacrosMethods.Array = BaseMethods.Array;

IeeeMacrosMethods.Hskip = function(parser: TexParser, name: string) {
  UnitUtil.UNIT_CASES.set('pi', 1 / 10); // Same as points
  return BaseMethods.Hskip(parser, name);
}

const save = ParseUtil.internalText;
const NBSP = "\u00A0";
ParseUtil.internalText = function(
  parser: TexParser, text: string, def: EnvList): MmlNode {
  text = text.replace(
    /\\hfill?|\\hskip *[0-9.]+(pt|ex|pc)/g,
    NBSP + NBSP + NBSP + NBSP + NBSP + NBSP + NBSP + NBSP
  );
  text = text.replace(/(\\kern|\\hskip) *-[0-9.]+(pt|pc|ex)/g, '');
  return save(parser, text, def);
}

IeeeMacrosMethods.RotateBox = function(parser: TexParser, name: string) {
  // We currently ignoring optional arguments.
  parser.GetBrackets(name);
  const deg = parseInt(parser.GetArgument(name));
  if (isNaN(deg)) {
    throw new TexError('InvalidArgument', 'Invalid argument number for rotatebox');
  }
  const arg = parser.ParseArg(name);
  const mrow = parser.create('node', 'mrow', [arg]);
  NodeUtil.setAttribute(mrow, 'style', `rotate: ${deg}deg`);
  parser.Push(mrow);
}

IeeeMacrosMethods.Ignore = function(
  parser: TexParser, name: string, ignore: number) {
  const start = parser.i - name.length; // includes the \
  while (ignore) {
    parser.GetArgument(name);
    ignore--;
  }
  parser.string = parser.string.slice(0, start) + parser.string.slice(parser.i);
  parser.i = start;
}

/**
 *  Override Matrix to support vertical and horizontal rules by
 *  using the ieeeMatrix stack item defined below
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 */
IeeeMacrosMethods.ieeeMatrix = function(parser: TexParser, name: string) {
  var c = parser.GetNext();
  if (c === '') {
    throw new TexError('MissingArgFor', 'Missing argument for %1', parser.currentCS);
  }
  if (c === '{') {
    parser.i++;
  } else {
    parser.string = c + '}' + parser.string.slice(parser.i + 1);
    parser.i = 0;
  }
  var array = parser.itemFactory.create('ieeeArray') as IeeeArrayItem;
  array.setProperty('requireClose', true);
  array.setProperty('arraydef', {
      rowspacing: '4pt',
      columnspacing: '1em'
  });
  if (name === '\\displaylines') {
    array.arraydef.rowspacing = '.5em';
    array.arraydef.displaystyle = true;
  }
  parser.Push(array);
}

const LEADERS = /^to *[0-9.,]*\\baselineskip\{[^}]*?\\vtop to *([0-9.,]+) *ex *\{(?:[^}]*?height *([0-9.,]+) *(ex|pt)[^{]*?|\\vss\\hbox\{\}\\vss)\} *\\vfill\}/;

/**
 *  Override \vcenter to look for its special use as vertical lines
 *  (solid or dashed) in tables, and for special matrix layout that
 *  uses \halign.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 */
IeeeMacrosMethods.ieeeVCenter = function(parser: TexParser, name: string) {
  var c = parser.GetNext(), match, top;
  var str = parser.string.slice(parser.i).replace(/\n+/g,' ');
  if (c === 't' && (match = str.match(LEADERS))) {
    //
    //  This is a vertical line (dahsed or solid or empty)
    //  so determine which from the sizes of the parts
    //
    parser.i += match[0].length; top = parser.stack.Top();
    if (match[1] !== '0' && match[2] !== '0' &&
      top instanceof IeeeArrayItem) {
      top.vRules[top.row.length] =
        (match[1] > match[2] || match[3] === 'pt' ? 'dashed' : 'solid');
    }
  } else if (c === '{' && str.match(/^\{[^{]*\\halign/)) {
    //
    //  This is a table using \halign, so remove the \halign
    //  and push the contents back onto the input string.
    //  If we aren't already in a matrix, add one around it.
    //  Check for \vrule in the template for the \hrule
    //
    str = parser.GetArgument(name).replace(/.*?\\halign/,'');
    parser.string = str + parser.string.slice(parser.i); parser.i = 0;
    str = parser.GetArgument('\\halign');
    match = str.match(/(.*?)\\cr/);
    str = str.slice(match[0].length).replace(/ *\\crcr */,'');
    top = parser.stack.Top();
    const needsMatrix = top instanceof IeeeArrayItem;
    if (needsMatrix) {
      str = `{${str}}`;
    }
    parser.string = str + parser.string.slice(parser.i);
    parser.i = 0;
    if (needsMatrix) {
      IeeeMacrosMethods.ieeeMatrix(parser, 'halign');
      top = parser.stack.Top();
    }
    (top as IeeeArrayItem).cRules = CRULES(match[1]);
  } else {
    //
    // Just do a regular old \vcenter
    //
    BaseMethods.VBox(parser, name, 'center');
  }
}

/**
 *  If there is a raw \halign (not in a \vcenter) remove the template
 *  and add a matrix around the content.  Check the template for
 *  \vrules.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 */
IeeeMacrosMethods.ieeeHAlign = function(parser: TexParser, name: string) {
  var arg = parser.GetArgument(name);
  var match = arg.match(/(.*)\\cr/);
  arg = arg.replace(/.*?\\cr */,'').replace(/\\crcr/,'');
  parser.string = '{'+arg+'}' + parser.string.slice(parser.i); parser.i= 0;
  IeeeMacrosMethods.ieeeMatrix(parser, name);
  (parser.stack.Top() as IeeeArrayItem).cRules = CRULES(match[1]);
}

/**
 *  Handle \hfill at the beginning or end of a table cell by listing
 *  all the \hfill's in the current cell.  This data is used by the
 *  EndEntry method of the stack items below.
 *  
 * @param {TexParser} parser The calling parser.
 * @param {string} _name The macro name.
 */
IeeeMacrosMethods.ieeeHFill = function(parser: TexParser, _name: string) {
  var top = parser.stack.Top();
  // if (top.isKind('ieeeArray')) {
  if (top instanceof IeeeArrayItem) {
    top.hFill.push(top.Size());
  }
}

/**
 *  Handle \vrule within a table by recording the rule and ignore the \vrule
 *  otherwise
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 */
IeeeMacrosMethods.ieeeVRule = function(parser: TexParser, _name: string) {
  const top = parser.stack.Top();
  const match = parser.string.slice(parser.i).match(/^ *((height|width|depth) *([0-9.,]+pt) *)+/);
  if (match) parser.i += match[0].length;
  // if (top.isKind('ieeeArray')) {
  if (top instanceof IeeeArrayItem) {
    top.vRules[top.row.length] = 'solid';
  }
},

/**
 * Handle \mathchar by looking up the character in a table of ones used
 * (otherwise we'd need tables of data giving the TeX-font to unicode mapping).
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 */
IeeeMacrosMethods.ieeeMathChar = function(parser: TexParser, _name: string) {
  var match = parser.string.slice(parser.i).match(/^ *(\d+|"[0-9A-F]+)/);
  if (!match) {
    throw new TexError(
      'MissingNumber', 'Missing numeric constant for %1', parser.currentCS);
  }
  const charMap: {[key: string]: [string, string]} = {
    '123': ['mo','\u2212'],          // minus sign
    '"702D': ['mtext','-'],
    '"7027': ['mtext','\''],
    '"26': ['mtext','\u207B'],   // superscript minus
    '"705C': ['mtext','\u201C'],   // smart open double quote
    '"7022': ['mtext','\u201D']    // smart close double quote
  }
  const def: [string, string] = charMap[match[1]];
  if (!def) {
    throw new TexError('UnknownChar', 'Unknown math character %1', match[1]);
  }
  parser.i += match[0].length;
  const char = parser.create('token', def[0], {}, def[1]);
  parser.Push(
    parser.create('node', 'TeXAtom', [char], {texClass: TEXCLASS.ORD}));
},

/**
 *  Handle \mathaccent by looking up the accent in a table of ones know to be
 *  used (otherwise we need tables of data giving the TeX-font to unicode
 *  mappings).  Dave Starbuck added to this list 2 items.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 */
IeeeMacrosMethods.ieeeMathAccent = function(parser: TexParser, name: string) {
  var match = parser.string.slice(parser.i).match(/^ *\^\{\\prime\\prime\} */);
  if (match) {
    parser.string = '"' + parser.string.slice(parser.i+match[0].length);
    parser.i = 0;
  }
  match = parser.string.slice(parser.i).match(/^ *(\d+|"[0-9A-F]+)/);
  if (!match) {
    throw new TexError(
      'MissingNumber', 'Missing numeric constant for %1', parser.currentCS);
  }
  const accentMap: {[key: string]: [string, string]} = {
    '"7017': ["mo","\u02DA"],
    '"717F': ["mo","\u2322"],
    '"017F': ["mo","\u2322"]
  };
  const def = accentMap[match[1]];
  if (!def) {
    throw new TexError('UnknownAccent', 'Unknown math accent %1', match[1]);
  };
  parser.i += match[0].length;
  const arg = parser.ParseArg(name);
  const accent = parser.create('token', def[0], {}, def[1]);
  parser.Push(parser.create('node', 'mover', [arg, accent], {accent:true}));
}

/**
 *  Implement \noalign to insert a new row with the noalign content
 *  (Note that most special cases are handled in the prefilter below).
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The macro name.
 */
IeeeMacrosMethods.ieeeNoAlign = function(parser: TexParser, name: string) {
  var arg = parser.GetArgument(name);
  if (arg.match(/ *\\hbox/)) {
    arg += "\\cr ";
  }
  parser.string = arg + parser.string.slice(parser.i);
  parser.i = 0;
}

//
//  Look for \vrule in \halign templates
//
export function CRULES(cols: string) {
  const rules = [];
  const columns = cols.split(/&/);
  for (var i = 0, m = columns.length; i < m; i++) {
    if (columns[i].match(/#.*\\vrule/)) rules[i] = "solid";
    if (columns[i].match(/\\vrule.*#/)) rules[i-1] = "solid";
  }
  return rules;
};


export default IeeeMacrosMethods;
