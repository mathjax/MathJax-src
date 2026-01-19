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
  codes?: string[];
  invisible?: boolean;
  rewriteleftright?: string[];
  atname?: string;
  atval?: string;
  notexcopy?: boolean;
}

// Character lists for special fonts
export const AMcal = ["\uD835\uDC9C","\u212C","\uD835\uDC9E","\uD835\uDC9F","\u2130","\u2131","\uD835\uDCA2","\u210B","\u2110","\uD835\uDCA5","\uD835\uDCA6","\u2112","\u2133","\uD835\uDCA9","\uD835\uDCAA","\uD835\uDCAB","\uD835\uDCAC","\u211B","\uD835\uDCAE","\uD835\uDCAF","\uD835\uDCB0","\uD835\uDCB1","\uD835\uDCB2","\uD835\uDCB3","\uD835\uDCB4","\uD835\uDCB5","\uD835\uDCB6","\uD835\uDCB7","\uD835\uDCB8","\uD835\uDCB9","\u212F","\uD835\uDCBB","\u210A","\uD835\uDCBD","\uD835\uDCBE","\uD835\uDCBF","\uD835\uDCC0","\uD835\uDCC1","\uD835\uDCC2","\uD835\uDCC3","\u2134","\uD835\uDCC5","\uD835\uDCC6","\uD835\uDCC7","\uD835\uDCC8","\uD835\uDCC9","\uD835\uDCCA","\uD835\uDCCB","\uD835\uDCCC","\uD835\uDCCD","\uD835\uDCCE","\uD835\uDCCF"];

export const AMfrk = ["\uD835\uDD04","\uD835\uDD05","\u212D","\uD835\uDD07","\uD835\uDD08","\uD835\uDD09","\uD835\uDD0A","\u210C","\u2111","\uD835\uDD0D","\uD835\uDD0E","\uD835\uDD0F","\uD835\uDD10","\uD835\uDD11","\uD835\uDD12","\uD835\uDD13","\uD835\uDD14","\u211C","\uD835\uDD16","\uD835\uDD17","\uD835\uDD18","\uD835\uDD19","\uD835\uDD1A","\uD835\uDD1B","\uD835\uDD1C","\u2128","\uD835\uDD1E","\uD835\uDD1F","\uD835\uDD20","\uD835\uDD21","\uD835\uDD22","\uD835\uDD23","\uD835\uDD24","\uD835\uDD25","\uD835\uDD26","\uD835\uDD27","\uD835\uDD28","\uD835\uDD29","\uD835\uDD2A","\uD835\uDD2B","\uD835\uDD2C","\uD835\uDD2D","\uD835\uDD2E","\uD835\uDD2F","\uD835\uDD30","\uD835\uDD31","\uD835\uDD32","\uD835\uDD33","\uD835\uDD34","\uD835\uDD35","\uD835\uDD36","\uD835\uDD37"];

export const AMbbb = ["\uD835\uDD38","\uD835\uDD39","\u2102","\uD835\uDD3B","\uD835\uDD3C","\uD835\uDD3D","\uD835\uDD3E","\u210D","\uD835\uDD40","\uD835\uDD41","\uD835\uDD42","\uD835\uDD43","\uD835\uDD44","\u2115","\uD835\uDD46","\u2119","\u211A","\u211D","\uD835\uDD4A","\uD835\uDD4B","\uD835\uDD4C","\uD835\uDD4D","\uD835\uDD4E","\uD835\uDD4F","\uD835\uDD50","\u2124","\uD835\uDD52","\uD835\uDD53","\uD835\uDD54","\uD835\uDD55","\uD835\uDD56","\uD835\uDD57","\uD835\uDD58","\uD835\uDD59","\uD835\uDD5A","\uD835\uDD5B","\uD835\uDD5C","\uD835\uDD5D","\uD835\uDD5E","\uD835\uDD5F","\uD835\uDD60","\uD835\uDD61","\uD835\uDD62","\uD835\uDD63","\uD835\uDD64","\uD835\uDD65","\uD835\uDD66","\uD835\uDD67","\uD835\uDD68","\uD835\uDD69","\uD835\uDD6A","\uD835\uDD6B"];

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
  {input:"sup", tag:"mo", output:"\u2283", tex:"supset", ttype:TokenType.CONST},
  {input:"sube", tag:"mo", output:"\u2286", tex:"subseteq", ttype:TokenType.CONST},
  {input:"supe", tag:"mo", output:"\u2287", tex:"supseteq", ttype:TokenType.CONST},
  {input:"-=",  tag:"mo", output:"\u2261", tex:"equiv", ttype:TokenType.CONST},
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
  {input:"hArr", tag:"mo", output:"\u21D4", tex:"Leftrightarrow", ttype:TokenType.CONST},

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
  {input:"bb", tag:"mstyle", atname:"mathvariant", atval:"bold", output:"bb", tex:null, ttype:TokenType.UNARY},
  {input:"mathbf", tag:"mstyle", atname:"mathvariant", atval:"bold", output:"mathbf", tex:null, ttype:TokenType.UNARY},
  {input:"sf", tag:"mstyle", atname:"mathvariant", atval:"sans-serif", output:"sf", tex:null, ttype:TokenType.UNARY},
  {input:"mathsf", tag:"mstyle", atname:"mathvariant", atval:"sans-serif", output:"mathsf", tex:null, ttype:TokenType.UNARY},
  {input:"bbb", tag:"mstyle", atname:"mathvariant", atval:"double-struck", output:"bbb", tex:null, ttype:TokenType.UNARY, codes:AMbbb},
  {input:"mathbb", tag:"mstyle", atname:"mathvariant", atval:"double-struck", output:"mathbb", tex:null, ttype:TokenType.UNARY, codes:AMbbb},
  {input:"cc",  tag:"mstyle", atname:"mathvariant", atval:"script", output:"cc", tex:null, ttype:TokenType.UNARY, codes:AMcal},
  {input:"mathcal", tag:"mstyle", atname:"mathvariant", atval:"script", output:"mathcal", tex:null, ttype:TokenType.UNARY, codes:AMcal},
  {input:"tt",  tag:"mstyle", atname:"mathvariant", atval:"monospace", output:"tt", tex:null, ttype:TokenType.UNARY},
  {input:"mathtt", tag:"mstyle", atname:"mathvariant", atval:"monospace", output:"mathtt", tex:null, ttype:TokenType.UNARY},
  {input:"fr",  tag:"mstyle", atname:"mathvariant", atval:"fraktur", output:"fr", tex:null, ttype:TokenType.UNARY, codes:AMfrk},
  {input:"mathfrak",  tag:"mstyle", atname:"mathvariant", atval:"fraktur", output:"mathfrak", tex:null, ttype:TokenType.UNARY, codes:AMfrk}
];
