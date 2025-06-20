/*************************************************************
 *
 *  Copyright (c) 2017-2025 The MathJax Consortium
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
 * @file Constant definitions for the TeX Parser. These should
 *     eventually be combined with the MathML structure.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

export const TexConstant = {
  Variant: {
    NORMAL: 'normal',
    BOLD: 'bold',
    ITALIC: 'italic',
    BOLDITALIC: 'bold-italic',
    DOUBLESTRUCK: 'double-struck',
    FRAKTUR: 'fraktur',
    BOLDFRAKTUR: 'bold-fraktur',
    SCRIPT: 'script',
    BOLDSCRIPT: 'bold-script',
    SANSSERIF: 'sans-serif',
    BOLDSANSSERIF: 'bold-sans-serif',
    SANSSERIFITALIC: 'sans-serif-italic',
    SANSSERIFBOLDITALIC: 'sans-serif-bold-italic',
    MONOSPACE: 'monospace',
    INITIAL: 'inital',
    TAILED: 'tailed',
    LOOPED: 'looped',
    STRETCHED: 'stretched',
    CALLIGRAPHIC: '-tex-calligraphic',
    BOLDCALLIGRAPHIC: '-tex-bold-calligraphic',
    OLDSTYLE: '-tex-oldstyle',
    BOLDOLDSTYLE: '-tex-bold-oldstyle',
    MATHITALIC: '-tex-mathit',
  },

  Form: {
    PREFIX: 'prefix',
    INFIX: 'infix',
    POSTFIX: 'postfix',
  },

  LineBreak: {
    AUTO: 'auto',
    NEWLINE: 'newline',
    NOBREAK: 'nobreak',
    GOODBREAK: 'goodbreak',
    BADBREAK: 'badbreak',
  },

  LineBreakStyle: {
    BEFORE: 'before',
    AFTER: 'after',
    DUPLICATE: 'duplicate',
    INFIXLINBREAKSTYLE: 'infixlinebreakstyle',
  },

  IndentAlign: {
    LEFT: 'left',
    CENTER: 'center',
    RIGHT: 'right',
    AUTO: 'auto',
    ID: 'id',
    INDENTALIGN: 'indentalign',
  },

  IndentShift: {
    INDENTSHIFT: 'indentshift',
  },

  LineThickness: {
    THIN: 'thin',
    MEDIUM: 'medium',
    THICK: 'thick',
  },

  Notation: {
    LONGDIV: 'longdiv',
    ACTUARIAL: 'actuarial',
    PHASORANGLE: 'phasorangle',
    RADICAL: 'radical',
    BOX: 'box',
    ROUNDEDBOX: 'roundedbox',
    CIRCLE: 'circle',
    LEFT: 'left',
    RIGHT: 'right',
    TOP: 'top',
    BOTTOM: 'bottom',
    UPDIAGONALSTRIKE: 'updiagonalstrike',
    DOWNDIAGONALSTRIKE: 'downdiagonalstrike',
    VERTICALSTRIKE: 'verticalstrike',
    HORIZONTALSTRIKE: 'horizontalstrike',
    NORTHEASTARROW: 'northeastarrow',
    MADRUWB: 'madruwb',
    UPDIAGONALARROW: 'updiagonalarrow',
  },

  Align: {
    TOP: 'top',
    BOTTOM: 'bottom',
    CENTER: 'center',
    BASELINE: 'baseline',
    AXIS: 'axis',
    LEFT: 'left',
    RIGHT: 'right',
  },

  Lines: {
    NONE: 'none',
    SOLID: 'solid',
    DASHED: 'dashed',
  },

  Side: {
    LEFT: 'left',
    RIGHT: 'right',
    LEFTOVERLAP: 'leftoverlap',
    RIGHTOVERLAP: 'rightoverlap',
  },

  Width: {
    AUTO: 'auto',
    FIT: 'fit',
  },

  Actiontype: {
    TOGGLE: 'toggle',
    STATUSLINE: 'statusline',
    TOOLTIP: 'tooltip',
    INPUT: 'input',
  },

  Overflow: {
    LINBREAK: 'linebreak',
    SCROLL: 'scroll',
    ELIDE: 'elide',
    TRUNCATE: 'truncate',
    SCALE: 'scale',
  },

  Unit: {
    EM: 'em',
    EX: 'ex',
    PX: 'px',
    IN: 'in',
    CM: 'cm',
    MM: 'mm',
    PT: 'pt',
    PC: 'pc',
  },

  Attr: {
    LATEX: 'data-latex',
    LATEXITEM: 'data-latex-item',
  },
};
