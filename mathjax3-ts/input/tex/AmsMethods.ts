/*************************************************************
 *
 *  Copyright (c) 2018 The MathJax Consortium
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
 * @fileoverview The AMS Parse methods.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import * as sitem from './StackItem.js';
import {ParseMethod} from './Types.js';
import ParseMethods from './ParseMethods.js';
import {TreeHelper} from './TreeHelper.js';
import TexParser from './TexParser.js';
import TexError from './TexError.js';


// Namespace
let AmsMethods: Record<string, ParseMethod> = {};


// AMS Math
let TAG_SIDE = 'right';
let TAG_INDENT = '0.8em';

AmsMethods.AMSarray = function(parser: TexParser, begin: sitem.StackItem,
                         numbered: boolean, taggable: boolean, align: string,
                         spacing: string) {
  TreeHelper.printMethod('AMS-AMSarray');
  // @test The Lorenz Equations, Maxwell's Equations, Cubic Binomial
  parser.Push(begin);
  if (taggable) {
    AmsMethods.checkEqnEnv(parser, '');
  }
  align = align.replace(/[^clr]/g, '').split('').join(' ');
  align = align.replace(/l/g, 'left').replace(/r/g, 'right').replace(/c/g, 'center');
  let newItem = new sitem.AMSarrayItem(begin.getName(), numbered, taggable, parser.stack.global);
  newItem.arraydef = {
    displaystyle: true,
    columnalign: align,
    columnspacing: (spacing || '1em'),
    // TODO: Which one is correct?
    rowspacing: '3pt',
    // rowspacing: '.5em',
    side: TAG_SIDE,
    minlabelspacing: TAG_INDENT
  };
  return newItem;
};


/**
 *  Check for bad nesting of equation environments
 */
AmsMethods.checkEqnEnv = function(parser: TexParser) {
  TreeHelper.printMethod('AMS-checkEqnEnv');
  if (parser.stack.global.eqnenv) {
    throw new TexError(['ErroneousNestingEq', 'Erroneous nesting of equation structures']);
  }
  parser.stack.global.eqnenv = true;
};


AmsMethods.HandleOperatorName = function(parser: TexParser, name: string) {
  TreeHelper.printMethod('AMS-HandleOperatorName');
  // @test Operatorname
  const limits = (parser.GetStar() ? '' : '\\nolimits\\SkipLimits');
  let op = parser.trimSpaces(parser.GetArgument(name));
  op = op.replace(/\*/g, '\\text{*}').replace(/-/g, '\\text{-}');
  parser.string = '\\mathop{\\rm '+op+'}' + limits + ' ' + parser.string.slice(parser.i);
  parser.i = 0;
};


AmsMethods.SkipLimits = function(parser: TexParser, name: string) {
  TreeHelper.printMethod('AMS-SkipLimits');
  // @test Operatorname
  const c = parser.GetNext(), i = parser.i;
  if (c === '\\' && ++parser.i && parser.GetCS() !== 'limits') {
    parser.i = i;
  }
};


AmsMethods.Macro = ParseMethods.Macro;

AmsMethods.Accent = ParseMethods.Accent;

AmsMethods.Array = ParseMethods.Array;

export default AmsMethods;
