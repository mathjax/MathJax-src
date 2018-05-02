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


import {StackItem} from './StackItem.js';
import {AmsArrayItem} from './AmsItem.js';
import {ParseMethod} from './Types.js';
import ParseMethods from './ParseMethods.js';
import {ParserUtil} from './ParserUtil.js';
import {TreeHelper} from './TreeHelper.js';
import {TexConstant} from './TexConstants.js';
import TexParser from './TexParser.js';
import TexError from './TexError.js';


// TODO: This is temporary until we find a new place and a better structure.
//
let equationNumbers = {
  number: 0,        // current equation number
  startNumber: 0,   // current starting equation number (for when equation is restarted)
  IDs: {},          // IDs used in previous equations
  eqIDs: {},        // IDs used in this equation
  labels: {},       // the set of labels
  eqlabels: {},     // labels in the current equation
  refs: new Array() // array of jax with unresolved references
  // I thing we should get rid of the last one!
};

let equationFormatting = {
  autoNumber: 'none',  // 'AMS' for standard AMS numbering,
  //  or 'all' for all displayed equations
  formatNumber: function (n: number) { return n; },
  formatTag:    function (n: number) { return '(' + n + ')'; },
  formatID:     function (n: number) {
    return 'mjx-eqn-' + String(n).replace(/\s/g, '_');
  },
  formatURL:    function (id: string, base: string) {
    return base + '#' + encodeURIComponent(id);
  },
  useLabelIds:  true,
  //
  //  Clear the equation numbers and labels
  //
  resetEquationNumbers: function (n: number, keepLabels: boolean) {
    equationNumbers.startNumber = (n || 0);
    if (!keepLabels) {
      equationNumbers.labels = {};
      equationNumbers.IDs = {};
    }
  }
};


// Namespace
let AmsMethods: Record<string, ParseMethod> = {};


// AMS Math
let TAG_SIDE = 'right';
let TAG_INDENT = '0.8em';

AmsMethods.AMSarray = function(parser: TexParser, begin: StackItem,
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
  let newItem = new AmsArrayItem(begin.getName(), numbered, taggable, parser.stack.global);
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


// TODO: How to set an extra definition. Probably best to deal with this
//       together with newcommand, setEnv etc.
// 
// AmsMethods.DeclareOperatorName =  function (name) {
//   var limits = (this.GetStar() ? "" : "\\nolimits\\SkipLimits");
//   var cs = this.trimSpaces(this.GetArgument(name));
//   if (cs.charAt(0) == "\\") {cs = cs.substr(1)}
//   var op = this.GetArgument(name);
//   op = op.replace(/\*/g,'\\text{*}').replace(/-/g,'\\text{-}');
//   this.setDef(cs, ['Macro', '\\mathop{\\rm '+op+'}'+limits]);
// };


AmsMethods.HandleOperatorName = function(parser: TexParser, name: string) {
  TreeHelper.printMethod('AMS-HandleOperatorName');
  // @test Operatorname
  const limits = (parser.GetStar() ? '' : '\\nolimits\\SkipLimits');
  let op = parser.trimSpaces(parser.GetArgument(name));
  op = op.replace(/\*/g, '\\text{*}').replace(/-/g, '\\text{-}');
  parser.string = '\\mathop{\\rm ' + op + '}' + limits + ' ' +
    parser.string.slice(parser.i);
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


AmsMethods.MultiIntegral = function(parser: TexParser, name: string,
                                    integral: string) {
  let next = parser.GetNext();
  if (next === '\\') {
    // @test MultiInt with Command
    let i = parser.i;
    next = parser.GetArgument(name);
    parser.i = i;
    if (next === '\\limits') {
      if (name === '\\idotsint') {
        // @test MultiInt with Limits
        integral = '\\!\\!\\mathop{\\,\\,' + integral + '}';
      }
      else {
        // Question: This is not used anymore?
        integral = '\\!\\!\\!\\mathop{\\,\\,\\,' + integral + '}';
      }
    }
  }
  // @test MultiInt, MultiInt in Context
  parser.string = integral + ' ' + parser.string.slice(parser.i);
  parser.i = 0;
};


/**
 *  Handle \cfrac
 */
AmsMethods.CFrac = function(parser: TexParser, name: string) {
  let lr  = parser.trimSpaces(parser.GetBrackets(name, ''));
  let num = parser.GetArgument(name);
  let den = parser.GetArgument(name);
  let lrMap: {[key: string]: string} = {
    l: TexConstant.Align.LEFT, r: TexConstant.Align.RIGHT, '': ''};
  // VS: OLD
  // 
  // var frac = MML.mfrac(TEX.Parse('\\strut\\textstyle{'+num+'}', parser.stack.env).mml(),
  //                      TEX.Parse('\\strut\\textstyle{'+den+'}', parser.stack.env).mml());
  let numNode = new TexParser('\\strut\\textstyle{' + num + '}', parser.stack.env).mml();
  let denNode = new TexParser('\\strut\\textstyle{' + den + '}', parser.stack.env).mml();
  let frac = TreeHelper.createNode('mfrac', [numNode, denNode], {});
  lr = lrMap[lr];
  if (lr == null) {
    throw new TexError(['IllegalAlign', 'Illegal alignment specified in %1', name]);
  }
  if (lr) {
    TreeHelper.setProperties(frac, {numalign: lr, denomalign: lr});
  }
  parser.Push(frac);
};
    

/**
 *  Implement AMS generalized fraction
 */
// TODO: handle the style more uniformly to avoid casting!
AmsMethods.Genfrac = function(parser: TexParser, name: string,
                              left: string, right: string, thick: string,
                              style: string | number) {
  if (left  == null) {
    left = parser.GetDelimiterArg(name);
  }
  if (right == null) {
    right = parser.GetDelimiterArg(name);
  }
  if (thick == null) {
    thick = parser.GetArgument(name);
  }
  if (style == null) {
    style = parser.trimSpaces(parser.GetArgument(name));
  }
  let num = parser.ParseArg(name);
  let den = parser.ParseArg(name);
  // VS: OLD
  // var frac = MML.mfrac(num, den);
  let frac = TreeHelper.createNode('mfrac', [num, den], {});
  if (thick !== '') {
    TreeHelper.setAttribute(frac, 'linethickness', thick);
  }
  if (left || right) {
    TreeHelper.setProperties(frac, {texWithDelims: true});
    frac = ParserUtil.fixedFence(left, frac, right);
  }
  if (style !== '') {
    let STYLE = (['D', 'T', 'S', 'SS'])[style as number];
    if (STYLE == null) {
      throw new TexError(['BadMathStyleFor', 'Bad math style for %1', name]);
    }
    // VS: OLD
    // frac = MML.mstyle(frac);
    frac = TreeHelper.createNode('mstyle', [frac], {});
    if (STYLE === 'D') {
      TreeHelper.setProperties(frac, {displaystyle: true, scriptlevel: 0});
    }
    else {
      TreeHelper.setProperties(frac, {displaystyle: false, scriptlevel: (style as number) - 1});
    }
  }
  parser.Push(frac);
};



/**
 *  Add the tag to the environment (to be added to the table row later)
 * (Does not work yet!)
 */
AmsMethods.HandleTag = function (parser: TexParser, name: string) {
  TreeHelper.printMethod('AMS-HandleTag');
  console.log('Handling tag!');
  let star = parser.GetStar();
  let arg = parser.trimSpaces(parser.GetArgument(name));
  let tag = parseInt(arg);
  if (!star) {
    arg = equationFormatting.formatTag(tag);
  }
  let global = parser.stack.global;
  global.tagID = tag;
  if (global.notags) {
    throw new TexError(['CommandNotAllowedInEnv',
                        '%1 not allowed in %2 environment',
                        name, global.notags as string]);
  }
  console.log('here');
  if (global.tag) {
    throw new TexError(['MultipleCommand', 'Multiple %1', name]);
  }
  console.log('here2');
  // VS: OLD
  // global.tag = MML.mtd.apply(MML,this.InternalMath(arg)).With({id:CONFIG.formatID(tag)});
  // TODO: These types are wrong!
  global.tag = TreeHelper.createNode('mtd', parser.InternalMath(arg),
                                     {id: equationFormatting.formatID(tag)}) as any;
};



AmsMethods.Macro = ParseMethods.Macro;

AmsMethods.Accent = ParseMethods.Accent;

AmsMethods.Tilde = ParseMethods.Tilde;

AmsMethods.Array = ParseMethods.Array;

AmsMethods.Spacer = ParseMethods.Spacer;

AmsMethods.NamedOp = ParseMethods.NamedOp;

export default AmsMethods;
