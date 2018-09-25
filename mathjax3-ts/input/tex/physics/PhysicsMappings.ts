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
 * @fileoverview Mappings for TeX parsing of the physics package.
 *                                            
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {CommandMap, MacroMap} from '../SymbolMap.js';
import PhysicsMethods from './PhysicsMethods.js';
import {TexConstant} from '../TexConstants.js';


/**
 * Macros for physics package.
 */
new CommandMap('Physics-automatic-bracing-macros', {
  'quantity':       'Quantity',
  'qty':            'Quantity',
  'pqty':           ['Quantity', '(', ')', true],
  'bqty':           ['Quantity', '[', ']', true],
  'vqty':           ['Quantity', '|', '|', true],
  'Bqty':           ['Quantity', '{', '}', true],
  'absolutevalue':  ['Quantity', '|', '|', true],
  'abs':            ['Quantity', '|', '|', true],
  'norm':           ['Quantity', '\\|', '\\|', true],
  'evaluated':      'Eval',
  'eval':           'Eval',
  'order':          ['Quantity', '(', ')', true, 'O',
                     TexConstant.Variant.CALIGRAPHIC],
  'commutator':     'Commutator',
  'comm':           'Commutator',
  'anticommutator': ['Commutator', '\\{', '\\}'],
  'acomm':          ['Commutator', '\\{', '\\}'],
  'poissonbracket': ['Commutator', '\\{', '\\}'],
  'pb':             ['Commutator', '\\{', '\\}']
}, PhysicsMethods);


new CommandMap('Physics-expressions-macros', {
  'sin':              'Expression',
  'sinh':             'Expression',
  'arcsin':           'Expression',
  'asin':             'Expression',
  'cos':              'Expression',
  'cosh':             'Expression',
  'arccos':           'Expression',
  'acos':             'Expression',
  'tan':              'Expression',
  'tanh':             'Expression',
  'arctan':           'Expression',
  'atan':             'Expression',
  'csc':              'Expression',
  'csch':             'Expression',
  'arccsc':           'Expression',
  'acsc':             'Expression',
  'sec':              'Expression',
  'sech':             'Expression',
  'arcsec':           'Expression',
  'asec':             'Expression',
  'cot':              'Expression',
  'coth':             'Expression',
  'arccot':           'Expression',
  'acot':             'Expression',
  'exp':              ['Expression', false],
  'log':              'Expression',
  'ln':               'Expression',
  'det':              ['Expression', false],
  'Pr':               ['Expression', false],
  // New expressions.
  'tr':               ['Expression', false],
  'trace':            ['Expression', false, 'tr'],
  'Tr':               ['Expression', false],
  'Trace':            ['Expression', false, 'Tr'],
  'rank':             'NamedFn',
  'erf':              ['Expression', false],
  // Old named functions.
  'sine':             ['NamedFn', 'sin'],
  'hypsine':          ['NamedFn', 'sinh'],
  'arcsine':          ['NamedFn', 'arcsin'],
  'asine':            ['NamedFn', 'asin'],
  'cosine':           ['NamedFn', 'cos'],
  'hypcosine':        ['NamedFn', 'cosh'],
  'arccosine':        ['NamedFn', 'arccos'],
  'acosine':          ['NamedFn', 'acos'],
  'tangent':          ['NamedFn', 'tan'],
  'hyptangent':       ['NamedFn', 'tanh'],
  'arctangent':       ['NamedFn', 'arctan'],
  'atangent':         ['NamedFn', 'atan'],
  'cosecant':         ['NamedFn', 'csc'],
  'hypcosecant':      ['NamedFn', 'csch'],
  'arccosecant':      ['NamedFn', 'arccsc'],
  'acosecant':        ['NamedFn', 'acsc'],
  'secant':           ['NamedFn', 'sec'],
  'hypsecant':        ['NamedFn', 'sech'],
  'arcsecant':        ['NamedFn', 'arcsec'],
  'asecant':          ['NamedFn', 'asec'],
  'cotangent':        ['NamedFn', 'cot'],
  'hypcotangent':     ['NamedFn', 'coth'],
  'arccotangent':     ['NamedFn', 'arccot'],
  'acotangent':       ['NamedFn', 'acot'],
  'exponential':      ['NamedFn', 'exp'],
  'logarithm':        ['NamedFn', 'log'],
  'naturallogarithm': ['NamedFn', 'ln'],
  'determinant':      ['NamedFn', 'det'],
  'Probability':      ['NamedFn', 'Pr'],
}, PhysicsMethods);


new CommandMap('Physics-quick-quad-macros', {
  'qqtext':     'Qqtext',
  'qq':         'Qqtext',
  'qcomma':     ['Macro', '\\qqtext*{,}'],
  'qc':         ['Macro', '\\qqtext*{,}'],
  'qcc':        ['Qqtext', 'c.c.'],
  'qif':        ['Qqtext', 'if'],
  'qthen':      ['Qqtext', 'then'],
  'qelse':      ['Qqtext', 'else'],
  'qotherwise': ['Qqtext', 'otherwise'],
  'qunless':    ['Qqtext', 'unless'],
  'qgiven':     ['Qqtext', 'given'],
  'qusing':     ['Qqtext', 'using'],
  'qassume':    ['Qqtext', 'assume'],
  'qsince,':    ['Qqtext', 'since,'],
  'qlet':       ['Qqtext', 'let'],
  'qfor':       ['Qqtext', 'for'],
  'qall':       ['Qqtext', 'all'],
  'qeven':      ['Qqtext', 'even'],
  'qodd':       ['Qqtext', 'odd'],
  'qinteger':   ['Qqtext', 'integer'],
  'qand':       ['Qqtext', 'and'],
  'qor':        ['Qqtext', 'or'],
  'qas':        ['Qqtext', 'as'],
  'qin':        ['Qqtext', 'in'],
}, PhysicsMethods);
