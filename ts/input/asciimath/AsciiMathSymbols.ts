/*************************************************************
 *
 *  Copyright (c) 2025 The MathJax Consortium
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
 * @file Symbol tables and constants for AsciiMath parser.
 *
 * @author mathjax@mathjax.org (MathJax Consortium)
 */

// Token types
export const enum TokenType {
  CONST = 0,
  UNARY = 1,
  BINARY = 2,
  INFIX = 3,
  LEFTBRACKET = 4,
  RIGHTBRACKET = 5,
  SPACE = 6,
  UNDEROVER = 7,
  DEFINITION = 8,
  LEFTRIGHT = 9,
  TEXT = 10,
  UNARYUNDEROVER = 15
}

/**
 * Symbol definition interface
 */
export interface Symbol {
  input: string;
  tag: string;
  output: string;
  tex: string | null;
  ttype: TokenType;
  acc?: boolean;
  func?: boolean;
  codes?: number[];
  invisible?: boolean;
  rewriteleftright?: string[];
  atname?: string;
  atval?: string;
  notexcopy?: boolean;
}

// Character lists for special fonts
export const AMcal = [0x1D49C,0x212C,0x1D49E,0x1D49F,0x2130,0x2131,0x1D4A2,0x210B,0x2110,0x1D4A5,0x1D4A6,0x2112,0x2133,0x1D4A9,0x1D4AA,0x1D4AB,0x1D4AC,0x211B,0x1D4AE,0x1D4AF,0x1D4B0,0x1D4B1,0x1D4B2,0x1D4B3,0x1D4B4,0x1D4B5,0x1D4B6,0x1D4B7,0x1D4B8,0x1D4B9,0x212F,0x1D4BB,0x210A,0x1D4BD,0x1D4BE,0x1D4BF,0x1D4C0,0x1D4C1,0x1D4C2,0x1D4C3,0x2134,0x1D4C5,0x1D4C6,0x1D4C7,0x1D4C8,0x1D4C9,0x1D4CA,0x1D4CB,0x1D4CC,0x1D4CD,0x1D4CE,0x1D4CF];
export const AMfrk = [0x1D504,0x1D505,0x212D,0x1D507,0x1D508,0x1D509,0x1D50A,0x210C,0x2111,0x1D50D,0x1D50E,0x1D50F,0x1D510,0x1D511,0x1D512,0x1D513,0x1D514,0x211C,0x1D516,0x1D517,0x1D518,0x1D519,0x1D51A,0x1D51B,0x1D51C,0x2128,0x1D51E,0x1D51F,0x1D520,0x1D521,0x1D522,0x1D523,0x1D524,0x1D525,0x1D526,0x1D527,0x1D528,0x1D529,0x1D52A,0x1D52B,0x1D52C,0x1D52D,0x1D52E,0x1D52F,0x1D530,0x1D531,0x1D532,0x1D533,0x1D534,0x1D535,0x1D536,0x1D537];
export const AMbbb = [0x1D538,0x1D539,0x2102,0x1D53B,0x1D53C,0x1D53D,0x1D53E,0x210D,0x1D540,0x1D541,0x1D542,0x1D543,0x1D544,0x2115,0x1D546,0x2119,0x211A,0x211D,0x1D54A,0x1D54B,0x1D54C,0x1D54D,0x1D54E,0x1D54F,0x1D550,0x2124,0x1D552,0x1D553,0x1D554,0x1D555,0x1D556,0x1D557,0x1D558,0x1D559,0x1D55A,0x1D55B,0x1D55C,0x1D55D,0x1D55E,0x1D55F,0x1D560,0x1D561,0x1D562,0x1D563,0x1D564,0x1D565,0x1D566,0x1D567,0x1D568,0x1D569,0x1D56A,0x1D56B,0x1D7D8];
export const AMbb = [0x1D400, 0x1D41A, 0x1D7CE];  // Mathematical Bold
export const AMsf = [0x1D5A0, 0x1D5BA, 0x1D7E2];  // Mathematical Sans-Serif
export const AMtt = [0x1D670, 0x1D68A, 0x1D7F6];  // Mathematical Monospace
// Quote symbol
export const AMquote: Symbol = {input:"\"", tag:"mtext", output:"mbox", tex:null, ttype:TokenType.TEXT};

/**
 * Main symbol table for AsciiMath
 */
export const AMsymbols: Symbol[] = [
  // Greek symbols
  {input:"alpha",  tag:"mi", output:"\u03B1", tex:null, ttype:TokenType.CONST},
  {input:"beta",   tag:"mi", output:"\u03B2", tex:null, ttype:TokenType.CONST},
  {input:"chi",    tag:"mi", output:"\u03C7", tex:null, ttype:TokenType.CONST},
  {input:"delta",  tag:"mi", output:"\u03B4", tex:null, ttype:TokenType.CONST},
  {input:"Delta",  tag:"mo", output:"\u0394", tex:null, ttype:TokenType.CONST},
  {input:"epsi",   tag:"mi", output:"\u03B5", tex:"epsilon", ttype:TokenType.CONST},
  {input:"varepsilon", tag:"mi", output:"\u025B", tex:null, ttype:TokenType.CONST},
  {input:"eta",    tag:"mi", output:"\u03B7", tex:null, ttype:TokenType.CONST},
  {input:"gamma",  tag:"mi", output:"\u03B3", tex:null, ttype:TokenType.CONST},
  {input:"Gamma",  tag:"mo", output:"\u0393", tex:null, ttype:TokenType.CONST},
  {input:"iota",   tag:"mi", output:"\u03B9", tex:null, ttype:TokenType.CONST},
  {input:"kappa",  tag:"mi", output:"\u03BA", tex:null, ttype:TokenType.CONST},
  {input:"lambda", tag:"mi", output:"\u03BB", tex:null, ttype:TokenType.CONST},
  {input:"Lambda", tag:"mo", output:"\u039B", tex:null, ttype:TokenType.CONST},
  {input:"lamda", tag:"mi", output:"\u03BB", tex:null, ttype:TokenType.CONST},
  {input:"Lamda", tag:"mo", output:"\u039B", tex:null, ttype:TokenType.CONST},
  {input:"mu",     tag:"mi", output:"\u03BC", tex:null, ttype:TokenType.CONST},
  {input:"nu",     tag:"mi", output:"\u03BD", tex:null, ttype:TokenType.CONST},
  {input:"omega",  tag:"mi", output:"\u03C9", tex:null, ttype:TokenType.CONST},
  {input:"Omega",  tag:"mo", output:"\u03A9", tex:null, ttype:TokenType.CONST},
  {input:"phi",    tag:"mi", output:"\u03D5", tex:null, ttype:TokenType.CONST},
  {input:"varphi", tag:"mi", output:"\u03C6", tex:null, ttype:TokenType.CONST},
  {input:"Phi",    tag:"mo", output:"\u03A6", tex:null, ttype:TokenType.CONST},
  {input:"pi",     tag:"mi", output:"\u03C0", tex:null, ttype:TokenType.CONST},
  {input:"Pi",     tag:"mo", output:"\u03A0", tex:null, ttype:TokenType.CONST},
  {input:"psi",    tag:"mi", output:"\u03C8", tex:null, ttype:TokenType.CONST},
  {input:"Psi",    tag:"mi", output:"\u03A8", tex:null, ttype:TokenType.CONST},
  {input:"rho",    tag:"mi", output:"\u03C1", tex:null, ttype:TokenType.CONST},
  {input:"sigma",  tag:"mi", output:"\u03C3", tex:null, ttype:TokenType.CONST},
  {input:"Sigma",  tag:"mo", output:"\u03A3", tex:null, ttype:TokenType.CONST},
  {input:"tau",    tag:"mi", output:"\u03C4", tex:null, ttype:TokenType.CONST},
  {input:"theta",  tag:"mi", output:"\u03B8", tex:null, ttype:TokenType.CONST},
  {input:"vartheta", tag:"mi", output:"\u03D1", tex:null, ttype:TokenType.CONST},
  {input:"Theta",  tag:"mo", output:"\u0398", tex:null, ttype:TokenType.CONST},
  {input:"upsilon", tag:"mi", output:"\u03C5", tex:null, ttype:TokenType.CONST},
  {input:"xi",     tag:"mi", output:"\u03BE", tex:null, ttype:TokenType.CONST},
  {input:"Xi",     tag:"mo", output:"\u039E", tex:null, ttype:TokenType.CONST},
  {input:"zeta",   tag:"mi", output:"\u03B6", tex:null, ttype:TokenType.CONST},

  // Binary operation symbols
  {input:"*",  tag:"mo", output:"\u22C5", tex:"cdot", ttype:TokenType.CONST},
  {input:"**", tag:"mo", output:"\u2217", tex:"ast", ttype:TokenType.CONST},
  {input:"***", tag:"mo", output:"\u22C6", tex:"star", ttype:TokenType.CONST},
  {input:"//", tag:"mo", output:"/",      tex:null, ttype:TokenType.CONST},
  {input:"\\\\", tag:"mo", output:"\\",   tex:"backslash", ttype:TokenType.CONST},
  {input:"setminus", tag:"mo", output:"\\", tex:null, ttype:TokenType.CONST},
  {input:"xx", tag:"mo", output:"\u00D7", tex:"times", ttype:TokenType.CONST},
  {input:"|><", tag:"mo", output:"\u22C9", tex:"ltimes", ttype:TokenType.CONST},
  {input:"><|", tag:"mo", output:"\u22CA", tex:"rtimes", ttype:TokenType.CONST},
  {input:"|><|", tag:"mo", output:"\u22C8", tex:"bowtie", ttype:TokenType.CONST},
  {input:"-:", tag:"mo", output:"\u00F7", tex:"div", ttype:TokenType.CONST},
  {input:"divide",   tag:"mo", output:"-:", tex:null, ttype:TokenType.DEFINITION},
  {input:"@",  tag:"mo", output:"\u2218", tex:"circ", ttype:TokenType.CONST},
  {input:"o+", tag:"mo", output:"\u2295", tex:"oplus", ttype:TokenType.CONST},
  {input:"o-", tag:"mo", output:"\u2296", tex:"ominus", ttype:TokenType.CONST},
  {input:"ox", tag:"mo", output:"\u2297", tex:"otimes", ttype:TokenType.CONST},
  {input:"o.", tag:"mo", output:"\u2299", tex:"odot", ttype:TokenType.CONST},
  {input:"sum", tag:"mo", output:"\u2211", tex:null, ttype:TokenType.UNDEROVER},
  {input:"prod", tag:"mo", output:"\u220F", tex:null, ttype:TokenType.UNDEROVER},
  {input:"^^",  tag:"mo", output:"\u2227", tex:"wedge", ttype:TokenType.CONST},
  {input:"^^^", tag:"mo", output:"\u22C0", tex:"bigwedge", ttype:TokenType.UNDEROVER},
  {input:"vv",  tag:"mo", output:"\u2228", tex:"vee", ttype:TokenType.CONST},
  {input:"vvv", tag:"mo", output:"\u22C1", tex:"bigvee", ttype:TokenType.UNDEROVER},
  {input:"nn",  tag:"mo", output:"\u2229", tex:"cap", ttype:TokenType.CONST},
  {input:"nnn", tag:"mo", output:"\u22C2", tex:"bigcap", ttype:TokenType.UNDEROVER},
  {input:"uu",  tag:"mo", output:"\u222A", tex:"cup", ttype:TokenType.CONST},
  {input:"uuu", tag:"mo", output:"\u22C3", tex:"bigcup", ttype:TokenType.UNDEROVER},
  {input:"dag", tag:"mo", output:"\u2020", tex:"dagger", ttype:TokenType.CONST},
  {input:"ddag", tag:"mo", output:"\u2021", tex:"ddagger", ttype:TokenType.CONST},

  // Binary relation symbols
  {input:"!=",  tag:"mo", output:"\u2260", tex:"ne", ttype:TokenType.CONST},
  {input:":=",  tag:"mo", output:":=",     tex:null, ttype:TokenType.CONST},
  {input:"lt",  tag:"mo", output:"<",      tex:null, ttype:TokenType.CONST},
  {input:"<=",  tag:"mo", output:"\u2264", tex:"le", ttype:TokenType.CONST},
  {input:"lt=", tag:"mo", output:"\u2264", tex:"leq", ttype:TokenType.CONST},
  {input:"gt",  tag:"mo", output:">",      tex:null, ttype:TokenType.CONST},
  {input:"mlt", tag:"mo", output:"\u226A", tex:"ll", ttype:TokenType.CONST},
  {input:">=",  tag:"mo", output:"\u2265", tex:"ge", ttype:TokenType.CONST},
  {input:"gt=", tag:"mo", output:"\u2265", tex:"geq", ttype:TokenType.CONST},
  {input:"mgt", tag:"mo", output:"\u226B", tex:"gg", ttype:TokenType.CONST},
  {input:"-<",  tag:"mo", output:"\u227A", tex:"prec", ttype:TokenType.CONST},
  {input:"-lt", tag:"mo", output:"\u227A", tex:null, ttype:TokenType.CONST},
  {input:">-",  tag:"mo", output:"\u227B", tex:"succ", ttype:TokenType.CONST},
  {input:"-<=", tag:"mo", output:"\u2AAF", tex:"preceq", ttype:TokenType.CONST},
  {input:">-=", tag:"mo", output:"\u2AB0", tex:"succeq", ttype:TokenType.CONST},
  {input:"in",  tag:"mo", output:"\u2208", tex:null, ttype:TokenType.CONST},
  {input:"!in", tag:"mo", output:"\u2209", tex:"notin", ttype:TokenType.CONST},
  {input:"sub", tag:"mo", output:"\u2282", tex:"subset", ttype:TokenType.CONST},
  {input:"!sub", tag:"mo", output:"\u2284", tex:"not\\subset", ttype:TokenType.CONST},
  {input:"notsubset",   tag:"mo", output:"!sub", tex:null, ttype:TokenType.DEFINITION},
  {input:"sup", tag:"mo", output:"\u2283", tex:"supset", ttype:TokenType.CONST},
  {input:"!sup", tag:"mo", output:"\u2285", tex:"not\\supset", ttype:TokenType.CONST},
  {input:"notsupset",   tag:"mo", output:"!sup", tex:null, ttype:TokenType.DEFINITION},
  {input:"sube", tag:"mo", output:"\u2286", tex:"subseteq", ttype:TokenType.CONST},
  {input:"!sube", tag:"mo", output:"\u2288", tex:"not\\subseteq", ttype:TokenType.CONST},
  {input:"notsubseteq",   tag:"mo", output:"!sube", tex:null, ttype:TokenType.DEFINITION},
  {input:"supe", tag:"mo", output:"\u2287", tex:"supseteq", ttype:TokenType.CONST},
  {input:"!supe", tag:"mo", output:"\u2289", tex:"not\\supseteq", ttype:TokenType.CONST},
  {input:"notsupseteq",   tag:"mo", output:"!supe", tex:null, ttype:TokenType.DEFINITION},
  {input:"-=",  tag:"mo", output:"\u2261", tex:"equiv", ttype:TokenType.CONST},
  {input:"!-=", tag:"mo", output:"\u2262", tex:"not\\equiv", ttype:TokenType.CONST},
  {input:"notequiv",   tag:"mo", output:"!-=", tex:null, ttype:TokenType.DEFINITION},
  {input:"~=",  tag:"mo", output:"\u2245", tex:"cong", ttype:TokenType.CONST},
  {input:"~~",  tag:"mo", output:"\u2248", tex:"approx", ttype:TokenType.CONST},
  {input:"~",  tag:"mo", output:"\u223C", tex:"sim", ttype:TokenType.CONST},
  {input:"prop", tag:"mo", output:"\u221D", tex:"propto", ttype:TokenType.CONST},

  // Logical symbols
  {input:"and", tag:"mtext", output:"and", tex:null, ttype:TokenType.SPACE},
  {input:"or",  tag:"mtext", output:"or",  tex:null, ttype:TokenType.SPACE},
  {input:"not", tag:"mo", output:"\u00AC", tex:"neg", ttype:TokenType.CONST},
  {input:"=>",  tag:"mo", output:"\u21D2", tex:"implies", ttype:TokenType.CONST},
  {input:"if",  tag:"mo", output:"if",     tex:null, ttype:TokenType.SPACE},
  {input:"<=>", tag:"mo", output:"\u21D4", tex:"iff", ttype:TokenType.CONST},
  {input:"AA",  tag:"mo", output:"\u2200", tex:"forall", ttype:TokenType.CONST},
  {input:"EE",  tag:"mo", output:"\u2203", tex:"exists", ttype:TokenType.CONST},
  {input:"_|_", tag:"mo", output:"\u22A5", tex:"bot", ttype:TokenType.CONST},
  {input:"TT",  tag:"mo", output:"\u22A4", tex:"top", ttype:TokenType.CONST},
  {input:"|--",  tag:"mo", output:"\u22A2", tex:"vdash", ttype:TokenType.CONST},
  {input:"|==",  tag:"mo", output:"\u22A8", tex:"models", ttype:TokenType.CONST},

  // Grouping brackets
  {input:"(", tag:"mo", output:"(", tex:"left(", ttype:TokenType.LEFTBRACKET},
  {input:")", tag:"mo", output:")", tex:"right)", ttype:TokenType.RIGHTBRACKET},
  {input:"[", tag:"mo", output:"[", tex:"left[", ttype:TokenType.LEFTBRACKET},
  {input:"]", tag:"mo", output:"]", tex:"right]", ttype:TokenType.RIGHTBRACKET},
  {input:"{", tag:"mo", output:"{", tex:null, ttype:TokenType.LEFTBRACKET},
  {input:"}", tag:"mo", output:"}", tex:null, ttype:TokenType.RIGHTBRACKET},
  {input:"|", tag:"mo", output:"|", tex:null, ttype:TokenType.LEFTRIGHT},
  {input:":|:", tag:"mo", output:"|", tex:null, ttype:TokenType.CONST},
  {input:"|:", tag:"mo", output:"|", tex:null, ttype:TokenType.LEFTBRACKET},
  {input:":|", tag:"mo", output:"|", tex:null, ttype:TokenType.RIGHTBRACKET},
  {input:"(:", tag:"mo", output:"\u2329", tex:"langle", ttype:TokenType.LEFTBRACKET},
  {input:":)", tag:"mo", output:"\u232A", tex:"rangle", ttype:TokenType.RIGHTBRACKET},
  {input:"<<", tag:"mo", output:"\u2329", tex:null, ttype:TokenType.LEFTBRACKET},
  {input:">>", tag:"mo", output:"\u232A", tex:null, ttype:TokenType.RIGHTBRACKET},
  {input:"{:", tag:"mo", output:"{:", tex:null, ttype:TokenType.LEFTBRACKET, invisible:true},
  {input:":}", tag:"mo", output:":}", tex:null, ttype:TokenType.RIGHTBRACKET, invisible:true},

  // Miscellaneous symbols
  {input:"int",  tag:"mo", output:"\u222B", tex:null, ttype:TokenType.CONST},
  {input:"dx",   tag:"mi", output:"{:d x:}", tex:null, ttype:TokenType.DEFINITION},
  {input:"dy",   tag:"mi", output:"{:d y:}", tex:null, ttype:TokenType.DEFINITION},
  {input:"dz",   tag:"mi", output:"{:d z:}", tex:null, ttype:TokenType.DEFINITION},
  {input:"dt",   tag:"mi", output:"{:d t:}", tex:null, ttype:TokenType.DEFINITION},
  {input:"oint", tag:"mo", output:"\u222E", tex:null, ttype:TokenType.CONST},
  {input:"del",  tag:"mo", output:"\u2202", tex:"partial", ttype:TokenType.CONST},
  {input:"grad", tag:"mo", output:"\u2207", tex:"nabla", ttype:TokenType.CONST},
  {input:"+-",   tag:"mo", output:"\u00B1", tex:"pm", ttype:TokenType.CONST},
  {input:"-+",   tag:"mo", output:"\u2213", tex:"mp", ttype:TokenType.CONST},
  {input:"O/",   tag:"mo", output:"\u2205", tex:"emptyset", ttype:TokenType.CONST},
  {input:"oo",   tag:"mo", output:"\u221E", tex:"infty", ttype:TokenType.CONST},
  {input:"aleph", tag:"mo", output:"\u2135", tex:null, ttype:TokenType.CONST},
  {input:"...",  tag:"mo", output:"...",    tex:"ldots", ttype:TokenType.CONST},
  {input:":.",  tag:"mo", output:"\u2234",  tex:"therefore", ttype:TokenType.CONST},
  {input:":'",  tag:"mo", output:"\u2235",  tex:"because", ttype:TokenType.CONST},
  {input:"/_",  tag:"mo", output:"\u2220",  tex:"angle", ttype:TokenType.CONST},
  {input:"/_\\",  tag:"mo", output:"\u25B3",  tex:"triangle", ttype:TokenType.CONST},
  {input:"'",   tag:"mo", output:"\u2032",  tex:"prime", ttype:TokenType.CONST},
  {input:"tilde", tag:"mover", output:"~", tex:null, ttype:TokenType.UNARY, acc:true},
  {input:"\\ ",  tag:"mo", output:"\u00A0", tex:null, ttype:TokenType.CONST},
  {input:"frown",  tag:"mo", output:"\u2322", tex:null, ttype:TokenType.CONST},
  {input:"quad", tag:"mo", output:"\u00A0\u00A0", tex:null, ttype:TokenType.CONST},
  {input:"qquad", tag:"mo", output:"\u00A0\u00A0\u00A0\u00A0", tex:null, ttype:TokenType.CONST},
  {input:"cdots", tag:"mo", output:"\u22EF", tex:null, ttype:TokenType.CONST},
  {input:"vdots", tag:"mo", output:"\u22EE", tex:null, ttype:TokenType.CONST},
  {input:"ddots", tag:"mo", output:"\u22F1", tex:null, ttype:TokenType.CONST},
  {input:"diamond", tag:"mo", output:"\u22C4", tex:null, ttype:TokenType.CONST},
  {input:"square", tag:"mo", output:"\u25A1", tex:null, ttype:TokenType.CONST},
  {input:"|__", tag:"mo", output:"\u230A",  tex:"lfloor", ttype:TokenType.CONST},
  {input:"__|", tag:"mo", output:"\u230B",  tex:"rfloor", ttype:TokenType.CONST},
  {input:"|~", tag:"mo", output:"\u2308",  tex:"lceiling", ttype:TokenType.CONST},
  {input:"~|", tag:"mo", output:"\u2309",  tex:"rceiling", ttype:TokenType.CONST},
  {input:"CC",  tag:"mo", output:"\u2102", tex:null, ttype:TokenType.CONST},
  {input:"NN",  tag:"mo", output:"\u2115", tex:null, ttype:TokenType.CONST},
  {input:"QQ",  tag:"mo", output:"\u211A", tex:null, ttype:TokenType.CONST},
  {input:"RR",  tag:"mo", output:"\u211D", tex:null, ttype:TokenType.CONST},
  {input:"ZZ",  tag:"mo", output:"\u2124", tex:null, ttype:TokenType.CONST},
  {input:"f",   tag:"mi", output:"f",      tex:null, ttype:TokenType.UNARY, func:true},
  {input:"g",   tag:"mi", output:"g",      tex:null, ttype:TokenType.UNARY, func:true},
  {input:"hbar", tag:"mo", output:"\u210F", tex:null, ttype:TokenType.CONST},

  // Standard functions
  {input:"lim",  tag:"mo", output:"lim", tex:null, ttype:TokenType.UNDEROVER},
  {input:"Lim",  tag:"mo", output:"Lim", tex:null, ttype:TokenType.UNDEROVER},
  {input:"sin",  tag:"mo", output:"sin", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"cos",  tag:"mo", output:"cos", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"tan",  tag:"mo", output:"tan", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"sinh", tag:"mo", output:"sinh", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"cosh", tag:"mo", output:"cosh", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"tanh", tag:"mo", output:"tanh", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"cot",  tag:"mo", output:"cot", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"sec",  tag:"mo", output:"sec", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"csc",  tag:"mo", output:"csc", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"arcsin",  tag:"mo", output:"arcsin", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"arccos",  tag:"mo", output:"arccos", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"arctan",  tag:"mo", output:"arctan", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"arcsec",  tag:"mo", output:"arcsec", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"arccsc",  tag:"mo", output:"arccsc", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"arccot",  tag:"mo", output:"arccot", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"coth",  tag:"mo", output:"coth", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"sech",  tag:"mo", output:"sech", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"csch",  tag:"mo", output:"csch", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"exp",  tag:"mo", output:"exp", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"abs",   tag:"mo", output:"abs",  tex:null, ttype:TokenType.UNARY, rewriteleftright:["|","|"]},
  {input:"norm",   tag:"mo", output:"norm",  tex:null, ttype:TokenType.UNARY, rewriteleftright:["\u2225","\u2225"]},
  {input:"floor",   tag:"mo", output:"floor",  tex:null, ttype:TokenType.UNARY, rewriteleftright:["\u230A","\u230B"]},
  {input:"ceil",   tag:"mo", output:"ceil",  tex:null, ttype:TokenType.UNARY, rewriteleftright:["\u2308","\u2309"]},
  {input:"log",  tag:"mo", output:"log", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"ln",   tag:"mo", output:"ln",  tex:null, ttype:TokenType.UNARY, func:true},
  {input:"det",  tag:"mo", output:"det", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"dim",  tag:"mo", output:"dim", tex:null, ttype:TokenType.CONST},
  {input:"mod",  tag:"mo", output:"mod", tex:null, ttype:TokenType.CONST},
  {input:"gcd",  tag:"mo", output:"gcd", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"lcm",  tag:"mo", output:"lcm", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"lub",  tag:"mo", output:"lub", tex:null, ttype:TokenType.CONST},
  {input:"glb",  tag:"mo", output:"glb", tex:null, ttype:TokenType.CONST},
  {input:"min",  tag:"mo", output:"min", tex:null, ttype:TokenType.UNDEROVER},
  {input:"max",  tag:"mo", output:"max", tex:null, ttype:TokenType.UNDEROVER},
  {input:"Sin",  tag:"mo", output:"Sin", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"Cos",  tag:"mo", output:"Cos", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"Tan",  tag:"mo", output:"Tan", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"Arcsin",  tag:"mo", output:"Arcsin", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"Arccos",  tag:"mo", output:"Arccos", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"Arctan",  tag:"mo", output:"Arctan", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"Sinh", tag:"mo", output:"Sinh", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"Cosh", tag:"mo", output:"Cosh", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"Tanh", tag:"mo", output:"Tanh", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"Cot",  tag:"mo", output:"Cot", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"Sec",  tag:"mo", output:"Sec", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"Csc",  tag:"mo", output:"Csc", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"Log",  tag:"mo", output:"Log", tex:null, ttype:TokenType.UNARY, func:true},
  {input:"Ln",   tag:"mo", output:"Ln",  tex:null, ttype:TokenType.UNARY, func:true},
  {input:"Abs",   tag:"mo", output:"abs",  tex:null, ttype:TokenType.UNARY, notexcopy:true, rewriteleftright:["|","|"]},

  // Arrows
  {input:"uarr", tag:"mo", output:"\u2191", tex:"uparrow", ttype:TokenType.CONST},
  {input:"darr", tag:"mo", output:"\u2193", tex:"downarrow", ttype:TokenType.CONST},
  {input:"rarr", tag:"mo", output:"\u2192", tex:"rightarrow", ttype:TokenType.CONST},
  {input:"->",   tag:"mo", output:"\u2192", tex:"to", ttype:TokenType.CONST},
  {input:">->",   tag:"mo", output:"\u21A3", tex:"rightarrowtail", ttype:TokenType.CONST},
  {input:"->>",   tag:"mo", output:"\u21A0", tex:"twoheadrightarrow", ttype:TokenType.CONST},
  {input:">->>",   tag:"mo", output:"\u2916", tex:"twoheadrightarrowtail", ttype:TokenType.CONST},
  {input:"|->",  tag:"mo", output:"\u21A6", tex:"mapsto", ttype:TokenType.CONST},
  {input:"larr", tag:"mo", output:"\u2190", tex:"leftarrow", ttype:TokenType.CONST},
  {input:"harr", tag:"mo", output:"\u2194", tex:"leftrightarrow", ttype:TokenType.CONST},
  {input:"rArr", tag:"mo", output:"\u21D2", tex:"Rightarrow", ttype:TokenType.CONST},
  {input:"lArr", tag:"mo", output:"\u21D0", tex:"Leftarrow", ttype:TokenType.CONST},
  {input:"dArr", tag:"mo", output:"\u21D3", tex:"Downarrow", ttype:TokenType.CONST},
  {input:"hArr", tag:"mo", output:"\u21D4", tex:"Leftrightarrow", ttype:TokenType.CONST},
  {input:"rightleftharpoons",   tag:"mo", output:"\u21CC", tex:null, ttype:TokenType.CONST},

  // Commands with argument
  {input:"sqrt", tag:"msqrt", output:"sqrt", tex:null, ttype:TokenType.UNARY},
  {input:"root", tag:"mroot", output:"root", tex:null, ttype:TokenType.BINARY},
  {input:"frac", tag:"mfrac", output:"/",    tex:null, ttype:TokenType.BINARY},
  {input:"/",    tag:"mfrac", output:"/",    tex:null, ttype:TokenType.INFIX},
  {input:"stackrel", tag:"mover", output:"stackrel", tex:null, ttype:TokenType.BINARY},
  {input:"overset", tag:"mover", output:"stackrel", tex:null, ttype:TokenType.BINARY},
  {input:"underset", tag:"munder", output:"stackrel", tex:null, ttype:TokenType.BINARY},
  {input:"_",    tag:"msub",  output:"_",    tex:null, ttype:TokenType.INFIX},
  {input:"^",    tag:"msup",  output:"^",    tex:null, ttype:TokenType.INFIX},
  {input:"hat", tag:"mover", output:"\u005E", tex:null, ttype:TokenType.UNARY, acc:true},
  {input:"bar", tag:"mover", output:"\u00AF", tex:"overline", ttype:TokenType.UNARY, acc:true},
  {input:"vec", tag:"mover", output:"\u2192", tex:null, ttype:TokenType.UNARY, acc:true},
  {input:"dot", tag:"mover", output:".",      tex:null, ttype:TokenType.UNARY, acc:true},
  {input:"ddot", tag:"mover", output:"..",    tex:null, ttype:TokenType.UNARY, acc:true},
  {input:"overarc", tag:"mover", output:"\u23DC", tex:"overparen", ttype:TokenType.UNARY, acc:true},
  {input:"ul", tag:"munder", output:"\u0332", tex:"underline", ttype:TokenType.UNARY, acc:true},
  {input:"ubrace", tag:"munder", output:"\u23DF", tex:"underbrace", ttype:TokenType.UNARYUNDEROVER, acc:true},
  {input:"obrace", tag:"mover", output:"\u23DE", tex:"overbrace", ttype:TokenType.UNARYUNDEROVER, acc:true},
  {input:"text", tag:"mtext", output:"text", tex:null, ttype:TokenType.TEXT},
  {input:"mbox", tag:"mtext", output:"mbox", tex:null, ttype:TokenType.TEXT},
  {input:"color", tag:"mstyle", output:"color", tex:null, ttype:TokenType.BINARY},
  {input:"id", tag:"mrow", output:"id", tex:null, ttype:TokenType.BINARY},
  {input:"class", tag:"mrow", output:"class", tex:null, ttype:TokenType.BINARY},
  {input:"cancel", tag:"menclose", output:"cancel", tex:null, ttype:TokenType.UNARY},
  AMquote,
  {input:"bb", tag:"mstyle", atname:"mathvariant", atval:"bold", output:"bb", tex:null, ttype:TokenType.UNARY, codes:AMbb},
  {input:"mathbf", tag:"mstyle", atname:"mathvariant", atval:"bold", output:"mathbf", tex:null, ttype:TokenType.UNARY, codes:AMbb},
  {input:"sf", tag:"mstyle", atname:"mathvariant", atval:"sans-serif", output:"sf", tex:null, ttype:TokenType.UNARY, codes:AMsf},
  {input:"mathsf", tag:"mstyle", atname:"mathvariant", atval:"sans-serif", output:"mathsf", tex:null, ttype:TokenType.UNARY, codes:AMsf},
  {input:"bbb", tag:"mstyle", atname:"mathvariant", atval:"double-struck", output:"bbb", tex:null, ttype:TokenType.UNARY, codes:AMbbb},
  {input:"mathbb", tag:"mstyle", atname:"mathvariant", atval:"double-struck", output:"mathbb", tex:null, ttype:TokenType.UNARY, codes:AMbbb},
  {input:"cc",  tag:"mstyle", atname:"mathvariant", atval:"script", output:"cc", tex:null, ttype:TokenType.UNARY, codes:AMcal},
  {input:"mathcal", tag:"mstyle", atname:"mathvariant", atval:"script", output:"mathcal", tex:null, ttype:TokenType.UNARY, codes:AMcal},
  {input:"tt",  tag:"mstyle", atname:"mathvariant", atval:"monospace", output:"tt", tex:null, ttype:TokenType.UNARY, codes:AMtt},
  {input:"mathtt", tag:"mstyle", atname:"mathvariant", atval:"monospace", output:"mathtt", tex:null, ttype:TokenType.UNARY, codes:AMtt},
  {input:"fr",  tag:"mstyle", atname:"mathvariant", atval:"fraktur", output:"fr", tex:null, ttype:TokenType.UNARY, codes:AMfrk},
  {input:"mathfrak",  tag:"mstyle", atname:"mathvariant", atval:"fraktur", output:"mathfrak", tex:null, ttype:TokenType.UNARY, codes:AMfrk}
];
