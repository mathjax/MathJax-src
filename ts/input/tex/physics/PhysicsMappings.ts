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
 * @file Mappings for TeX parsing of the physics package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {
  EnvironmentMap,
  CommandMap,
  MacroMap,
  CharacterMap,
} from '../TokenMap.js';
import PhysicsMethods from './PhysicsMethods.js';
import { TexConstant } from '../TexConstants.js';
import ParseMethods from '../ParseMethods.js';
import { TEXCLASS } from '../../../core/MmlTree/MmlNode.js';

/**
 * Macros for physics package (section 2.1).
 */
new CommandMap('Physics-automatic-bracing-macros', {
  quantity: PhysicsMethods.Quantity,
  qty: PhysicsMethods.Quantity,
  pqty: [PhysicsMethods.Quantity, '(', ')', true],
  bqty: [PhysicsMethods.Quantity, '[', ']', true],
  vqty: [PhysicsMethods.Quantity, '|', '|', true],
  Bqty: [PhysicsMethods.Quantity, '\\{', '\\}', true],
  absolutevalue: [PhysicsMethods.Quantity, '|', '|', true],
  abs: [PhysicsMethods.Quantity, '|', '|', true],
  norm: [PhysicsMethods.Quantity, '\\|', '\\|', true],
  evaluated: PhysicsMethods.Eval,
  eval: PhysicsMethods.Eval,
  order: [
    PhysicsMethods.Quantity,
    '(',
    ')',
    true,
    'O',
    TexConstant.Variant.CALLIGRAPHIC,
  ],
  commutator: PhysicsMethods.Commutator,
  comm: PhysicsMethods.Commutator,
  anticommutator: [PhysicsMethods.Commutator, '\\{', '\\}'],
  acomm: [PhysicsMethods.Commutator, '\\{', '\\}'],
  poissonbracket: [PhysicsMethods.Commutator, '\\{', '\\}'],
  pb: [PhysicsMethods.Commutator, '\\{', '\\}'],
});

/**
 * Macros for physics package (section 2.2).
 */
new CharacterMap('Physics-vector-mo', ParseMethods.mathchar0mo, {
  dotproduct: ['\u22C5', { mathvariant: TexConstant.Variant.BOLD }],
  vdot: ['\u22C5', { mathvariant: TexConstant.Variant.BOLD }],
  crossproduct: '\u00D7',
  cross: '\u00D7',
  cp: '\u00D7',
  // This is auxiliary!
  gradientnabla: ['\u2207', { mathvariant: TexConstant.Variant.BOLD }],
  // Replacements for original latex \div (physics2, and physics versions)
  divsymbol: '\u00F7',
  divisionsymbol: '\u00F7',
});

new CharacterMap('Physics-vector-mi', ParseMethods.mathchar0mi, {
  real: ['\u211C', { mathvariant: TexConstant.Variant.NORMAL }],
  imaginary: ['\u2111', { mathvariant: TexConstant.Variant.NORMAL }],
});

new CommandMap('Physics-vector-macros', {
  vnabla: PhysicsMethods.Vnabla,
  vectorbold: PhysicsMethods.VectorBold,
  vb: PhysicsMethods.VectorBold,
  vectorarrow: [PhysicsMethods.StarMacro, 1, '\\vec{\\vb', '{#1}}'],
  va: [PhysicsMethods.StarMacro, 1, '\\vec{\\vb', '{#1}}'],
  vectorunit: [PhysicsMethods.StarMacro, 1, '\\hat{\\vb', '{#1}}'],
  vu: [PhysicsMethods.StarMacro, 1, '\\hat{\\vb', '{#1}}'],
  gradient: [PhysicsMethods.OperatorApplication, '\\vnabla', '(', '['],
  grad: [PhysicsMethods.OperatorApplication, '\\vnabla', '(', '['],
  divergence: [PhysicsMethods.VectorOperator, '\\vnabla\\vdot', '(', '['],
  div: [PhysicsMethods.VectorOperator, '\\vnabla\\vdot', '(', '['],
  curl: [PhysicsMethods.VectorOperator, '\\vnabla\\crossproduct', '(', '['],
  laplacian: [PhysicsMethods.OperatorApplication, '\\nabla^2', '(', '['],
});

/**
 * Macros for physics package (section 2.3).
 */
new CommandMap('Physics-expressions-macros', {
  sin: PhysicsMethods.Expression,
  sinh: PhysicsMethods.Expression,
  arcsin: PhysicsMethods.Expression,
  asin: PhysicsMethods.Expression,
  cos: PhysicsMethods.Expression,
  cosh: PhysicsMethods.Expression,
  arccos: PhysicsMethods.Expression,
  acos: PhysicsMethods.Expression,
  tan: PhysicsMethods.Expression,
  tanh: PhysicsMethods.Expression,
  arctan: PhysicsMethods.Expression,
  atan: PhysicsMethods.Expression,
  csc: PhysicsMethods.Expression,
  csch: PhysicsMethods.Expression,
  arccsc: PhysicsMethods.Expression,
  acsc: PhysicsMethods.Expression,
  sec: PhysicsMethods.Expression,
  sech: PhysicsMethods.Expression,
  arcsec: PhysicsMethods.Expression,
  asec: PhysicsMethods.Expression,
  cot: PhysicsMethods.Expression,
  coth: PhysicsMethods.Expression,
  arccot: PhysicsMethods.Expression,
  acot: PhysicsMethods.Expression,
  exp: [PhysicsMethods.Expression, false],
  log: PhysicsMethods.Expression,
  ln: PhysicsMethods.Expression,
  det: [PhysicsMethods.Expression, false],
  Pr: [PhysicsMethods.Expression, false],
  // New expressions.
  tr: [PhysicsMethods.Expression, false],
  trace: [PhysicsMethods.Expression, false, 'tr'],
  Tr: [PhysicsMethods.Expression, false],
  Trace: [PhysicsMethods.Expression, false, 'Tr'],
  rank: PhysicsMethods.NamedFn,
  erf: [PhysicsMethods.Expression, false],
  Residue: [PhysicsMethods.Macro, '\\mathrm{Res}'],
  Res: [PhysicsMethods.OperatorApplication, '\\Residue', '(', '[', '{'],
  principalvalue: [PhysicsMethods.OperatorApplication, '{\\cal P}'],
  pv: [PhysicsMethods.OperatorApplication, '{\\cal P}'],
  PV: [PhysicsMethods.OperatorApplication, '{\\rm P.V.}'],
  Re: [PhysicsMethods.OperatorApplication, '\\mathrm{Re}', '{'],
  Im: [PhysicsMethods.OperatorApplication, '\\mathrm{Im}', '{'],
  // Old named functions.
  sine: [PhysicsMethods.NamedFn, 'sin'],
  hypsine: [PhysicsMethods.NamedFn, 'sinh'],
  arcsine: [PhysicsMethods.NamedFn, 'arcsin'],
  asine: [PhysicsMethods.NamedFn, 'asin'],
  cosine: [PhysicsMethods.NamedFn, 'cos'],
  hypcosine: [PhysicsMethods.NamedFn, 'cosh'],
  arccosine: [PhysicsMethods.NamedFn, 'arccos'],
  acosine: [PhysicsMethods.NamedFn, 'acos'],
  tangent: [PhysicsMethods.NamedFn, 'tan'],
  hyptangent: [PhysicsMethods.NamedFn, 'tanh'],
  arctangent: [PhysicsMethods.NamedFn, 'arctan'],
  atangent: [PhysicsMethods.NamedFn, 'atan'],
  cosecant: [PhysicsMethods.NamedFn, 'csc'],
  hypcosecant: [PhysicsMethods.NamedFn, 'csch'],
  arccosecant: [PhysicsMethods.NamedFn, 'arccsc'],
  acosecant: [PhysicsMethods.NamedFn, 'acsc'],
  secant: [PhysicsMethods.NamedFn, 'sec'],
  hypsecant: [PhysicsMethods.NamedFn, 'sech'],
  arcsecant: [PhysicsMethods.NamedFn, 'arcsec'],
  asecant: [PhysicsMethods.NamedFn, 'asec'],
  cotangent: [PhysicsMethods.NamedFn, 'cot'],
  hypcotangent: [PhysicsMethods.NamedFn, 'coth'],
  arccotangent: [PhysicsMethods.NamedFn, 'arccot'],
  acotangent: [PhysicsMethods.NamedFn, 'acot'],
  exponential: [PhysicsMethods.NamedFn, 'exp'],
  logarithm: [PhysicsMethods.NamedFn, 'log'],
  naturallogarithm: [PhysicsMethods.NamedFn, 'ln'],
  determinant: [PhysicsMethods.NamedFn, 'det'],
  Probability: [PhysicsMethods.NamedFn, 'Pr'],
});

/**
 * Macros for physics package (section 2.4).
 */
new CommandMap('Physics-quick-quad-macros', {
  qqtext: PhysicsMethods.Qqtext,
  qq: PhysicsMethods.Qqtext,
  qcomma: [PhysicsMethods.Macro, '\\qqtext*{,}'],
  qc: [PhysicsMethods.Macro, '\\qqtext*{,}'],
  qcc: [PhysicsMethods.Qqtext, 'c.c.'],
  qif: [PhysicsMethods.Qqtext, 'if'],
  qthen: [PhysicsMethods.Qqtext, 'then'],
  qelse: [PhysicsMethods.Qqtext, 'else'],
  qotherwise: [PhysicsMethods.Qqtext, 'otherwise'],
  qunless: [PhysicsMethods.Qqtext, 'unless'],
  qgiven: [PhysicsMethods.Qqtext, 'given'],
  qusing: [PhysicsMethods.Qqtext, 'using'],
  qassume: [PhysicsMethods.Qqtext, 'assume'],
  qsince: [PhysicsMethods.Qqtext, 'since'],
  qlet: [PhysicsMethods.Qqtext, 'let'],
  qfor: [PhysicsMethods.Qqtext, 'for'],
  qall: [PhysicsMethods.Qqtext, 'all'],
  qeven: [PhysicsMethods.Qqtext, 'even'],
  qodd: [PhysicsMethods.Qqtext, 'odd'],
  qinteger: [PhysicsMethods.Qqtext, 'integer'],
  qand: [PhysicsMethods.Qqtext, 'and'],
  qor: [PhysicsMethods.Qqtext, 'or'],
  qas: [PhysicsMethods.Qqtext, 'as'],
  qin: [PhysicsMethods.Qqtext, 'in'],
});

/**
 * Macros for physics package (section 2.5).
 */
new CommandMap('Physics-derivative-macros', {
  diffd: PhysicsMethods.DiffD,
  flatfrac: [PhysicsMethods.Macro, '\\left.#1\\middle/#2\\right.', 2],
  differential: [PhysicsMethods.Differential, '\\diffd'],
  dd: [PhysicsMethods.Differential, '\\diffd'],
  variation: [PhysicsMethods.Differential, '\\delta'],
  var: [PhysicsMethods.Differential, '\\delta'],
  derivative: [PhysicsMethods.Derivative, 2, '\\diffd'],
  dv: [PhysicsMethods.Derivative, 2, '\\diffd'],
  partialderivative: [PhysicsMethods.Derivative, 3, '\\partial'],
  pderivative: [PhysicsMethods.Derivative, 3, '\\partial'],
  pdv: [PhysicsMethods.Derivative, 3, '\\partial'],
  functionalderivative: [PhysicsMethods.Derivative, 2, '\\delta'],
  fderivative: [PhysicsMethods.Derivative, 2, '\\delta'],
  fdv: [PhysicsMethods.Derivative, 2, '\\delta'],
});

/**
 * Macros for physics package (section 2.6).
 */
new CommandMap('Physics-bra-ket-macros', {
  bra: PhysicsMethods.Bra,
  ket: PhysicsMethods.Ket,
  innerproduct: PhysicsMethods.BraKet,
  ip: PhysicsMethods.BraKet,
  braket: PhysicsMethods.BraKet,
  outerproduct: PhysicsMethods.KetBra,
  dyad: PhysicsMethods.KetBra,
  ketbra: PhysicsMethods.KetBra,
  op: PhysicsMethods.KetBra,
  expectationvalue: PhysicsMethods.Expectation,
  expval: PhysicsMethods.Expectation,
  ev: PhysicsMethods.Expectation,
  matrixelement: PhysicsMethods.MatrixElement,
  matrixel: PhysicsMethods.MatrixElement,
  mel: PhysicsMethods.MatrixElement,
});

/**
 * Macros for physics package (section 2.7).
 */
new CommandMap('Physics-matrix-macros', {
  matrixquantity: PhysicsMethods.MatrixQuantity,
  mqty: PhysicsMethods.MatrixQuantity,
  pmqty: [PhysicsMethods.Macro, '\\mqty(#1)', 1],
  Pmqty: [PhysicsMethods.Macro, '\\mqty*(#1)', 1],
  bmqty: [PhysicsMethods.Macro, '\\mqty[#1]', 1],
  vmqty: [PhysicsMethods.Macro, '\\mqty|#1|', 1],
  // Smallmatrices
  smallmatrixquantity: [PhysicsMethods.MatrixQuantity, true],
  smqty: [PhysicsMethods.MatrixQuantity, true],
  spmqty: [PhysicsMethods.Macro, '\\smqty(#1)', 1],
  sPmqty: [PhysicsMethods.Macro, '\\smqty*(#1)', 1],
  sbmqty: [PhysicsMethods.Macro, '\\smqty[#1]', 1],
  svmqty: [PhysicsMethods.Macro, '\\smqty|#1|', 1],
  matrixdeterminant: [PhysicsMethods.Macro, '\\vmqty{#1}', 1],
  mdet: [PhysicsMethods.Macro, '\\vmqty{#1}', 1],
  smdet: [PhysicsMethods.Macro, '\\svmqty{#1}', 1],
  identitymatrix: PhysicsMethods.IdentityMatrix,
  imat: PhysicsMethods.IdentityMatrix,
  xmatrix: PhysicsMethods.XMatrix,
  xmat: PhysicsMethods.XMatrix,
  zeromatrix: [PhysicsMethods.Macro, '\\xmat{0}{#1}{#2}', 2],
  zmat: [PhysicsMethods.Macro, '\\xmat{0}{#1}{#2}', 2],
  paulimatrix: PhysicsMethods.PauliMatrix,
  pmat: PhysicsMethods.PauliMatrix,
  diagonalmatrix: PhysicsMethods.DiagonalMatrix,
  dmat: PhysicsMethods.DiagonalMatrix,
  antidiagonalmatrix: [PhysicsMethods.DiagonalMatrix, true],
  admat: [PhysicsMethods.DiagonalMatrix, true],
});

/**
 * Auxiliary environment map to define smallmatrix. This makes Physics
 * independent of AmsMath.
 */
new EnvironmentMap('Physics-aux-envs', ParseMethods.environment, {
  smallmatrix: [
    PhysicsMethods.Array,
    null,
    null,
    null,
    'c',
    '0.333em',
    '.2em',
    'S',
    1,
  ],
});

/**
 * Character map for braket package.
 */
new MacroMap('Physics-characters', {
  '|': [PhysicsMethods.AutoClose, TEXCLASS.ORD], // texClass: TEXCLASS.ORD, // Have to push the closer as mml with special property
  ')': PhysicsMethods.AutoClose,
  ']': PhysicsMethods.AutoClose,
});
