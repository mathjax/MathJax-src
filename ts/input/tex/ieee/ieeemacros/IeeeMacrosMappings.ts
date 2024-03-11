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
 * @fileoverview Mappings for IEEE macros package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {CommandMap, EnvironmentMap} from '../../TokenMap.js';
import {TexConstant} from '../../TexConstants.js';
import ParseMethods from '../../ParseMethods.js';
import IeeeMacrosMethods from './IeeeMacrosMethods.js';


/**
 * Macros for IEEE macros package.
 */
new CommandMap('ieee-macros', {
  // Rewrite to \U{}
  // Table 2
  circone: ['Macro', '\\unicode{x2460}'],
  circtwo: ['Macro', '\\unicode{x2461}'],
  circthree: ['Macro', '\\unicode{x2462}'],
  circfour: ['Macro', '\\unicode{x2463}'],
  circfive: ['Macro', '\\unicode{x2464}'],
  circsix: ['Macro', '\\unicode{x2465}'],
  circseven: ['Macro', '\\unicode{x2466}'],
  circeight: ['Macro', '\\unicode{x2467}'],
  circnine: ['Macro', '\\unicode{x2468}'],
  circa: ['Macro', '\\unicode{x24D0}'],
  circb: ['Macro', '\\unicode{x24D1}'],
  circc: ['Macro', '\\unicode{x24D2}'],
  circd: ['Macro', '\\unicode{x24D3}'],
  circled: ['Macro', '\\unicode{x24D3}'],
  circe: ['Macro', '\\unicode{x24D4}'],
  circf: ['Macro', '{\\unicode{x24D5}}'],
  circg: ['Macro', '{\\unicode{x24D6}}'],
  circh: ['Macro', '{\\unicode{x24D7}}'],
  circi: ['Macro', '\\unicode{x24D8}'],
  circk: ['Macro', '{\\unicode{x24DA}}'],
  circl: ['Macro', '{\\unicode{x24DB}}'],
  circm: ['Macro', '{\\unicode{x24DC}}'],
  circlem: ['Macro', '\\unicode{x24DC}'],
  circn: ['Macro', '{\\unicode{x24DD}}'],
  circo: ['Macro', '\\unicode{x24DE}'],
  circp: ['Macro', '\\unicode{x24DF}'],  
  circq: ['Macro', '{\\unicode{x24E0}}'],
  circr: ['Macro', '{\\unicode{x24E1}}'],
  circs: ['Macro', '\\unicode{x24E2}'],
  circv: ['Macro', '\\unicode{x24E5}'],
  circw: ['Macro', '\\unicode{x24E6}'],
  circy: ['Macro', '{\\unicode{x24E8}}'],
  circz: ['Macro', '{\\unicode{x24E9}}'],
  circA: ['Macro', '\\unicode{x24B6}'],
  circB: ['Macro', '\\unicode{x24B7}'],
  circC: ['Macro', '\\unicode{x24B8}'],
  circD: ['Macro', '\\unicode{x24B9}'],
  circE: ['Macro', '{\\unicode{x24BA}}'],
  circF: ['Macro', '{\\unicode{x24BB}}'],
  circG: ['Macro', '{\\unicode{x24BC}}'],
  circleH: ['Macro', '\\unicode{x24BD}'],
  circI: ['Macro', '{\\unicode{x24BE}}'],
  circJ: ['Macro', '{\\unicode{x24BF}}'],
  circL: ['Macro', '{\\unicode{x24C1}}'],
  circM: ['Macro', '\\unicode{x24C2}'],
  circO: ['Macro', '{\\unicode{x24C4}}'],
  circP: ['Macro', '{\\unicode{x24C5}}'],
  circR: ['Macro', '\\unicode{x24C7}'],
  circS: ['Macro', '\\unicode{x24C8}'],
  circT: ['Macro', '{\\unicode{x24C9}}'],
  circU: ['Macro', '\\unicode{x24CA}'],
  circV: ['Macro', '{\\unicode{x24CB}}'],
  circX: ['Macro', '\\unicode{x24CD}'],
  circY: ['Macro', '{\\unicode{x24CE}}'],
  circZ: ['Macro', '{\\unicode{x24CF}}'],
  circast: ['Macro', '\\unicode{x229B}'],
  circit: ['Macro', '\\bigcirc \\kern-17mu{\\scriptstyle{#1}}\\hskip4pt', 1],
  textcircled: ['Macro', '\\bigcirc \\kern-17mu{\\scriptstyle{#1}}\\hskip4pt', 1],

  // Table 3
  Alpha: ['Macro', '{\\rm A}'],
  Beta: ['Macro', '{\\rm B}'],
  Deltab: ['Macro', '\\boldsymbol{\\Delta}'],
  Epsilon: ['Macro', '{\\rm E}'],
  Gammab: ['Macro', '\\boldsymbol{\\Gamma}'],
  boldGamma: ['Macro', '\\boldsymbol{\\Gamma}'],
  Kappa: ['Macro', '{\\rm K}'],
  Lambdab: ['Macro', '\\boldsymbol{\\Lambda}'],
  Lambdabmit: ['Macro', '\\boldsymbol{\\Lambda}'],
  Omegab: ['Macro', '\\boldsymbol{\\Omega}'],
  Psib: ['Macro', '\\boldsymbol{\\Psi}'],
  Psibmit: ['Macro', '\\boldsymbol{\\Psi}'],
  Sigmab: ['Macro', '\\boldsymbol{\\Sigma}'],
  Sigmabmit: ['Macro', '\\boldsymbol{\\Sigma}'],
  Thetab: ['Macro', '\\boldsymbol{\\Theta}'],
  Thetabmit: ['Macro', '\\boldsymbol{\\Theta}'],
  Upsilonb: ['Macro', '\\boldsymbol{\\Upsilon}'],       
  Xibmit: ['Macro', '\\boldsymbol{\\Xi}'],

  alphab: ['Macro', '\\boldsymbol{\\alpha}'],
  betab: ['Macro', '\\boldsymbol{\\beta}'],
  chib: ['Macro', '\\boldsymbol{\\chi}'],
  deltab: ['Macro', '\\boldsymbol{\\delta}'],
  epsilonb: ['Macro', '\\boldsymbol{\\epsilon}'],
  etab: ['Macro', '\\boldsymbol{\\eta}'],
  gammab: ['Macro', '\\boldsymbol{\\gamma}'],
  iotab: ['Macro', '\\boldsymbol{\\iota}'],
  lambdab: ['Macro', '\\boldsymbol{\\lambda}'],
  mub: ['Macro', '\\boldsymbol{\\mu}'],
  nub: ['Macro', '\\boldsymbol{\\nu}'],
  omegab: ['Macro', '\\boldsymbol{\\omega}'],
  phib: ['Macro', '\\boldsymbol{\\phi}'],
  pib: ['Macro', '\\boldsymbol{\\pi}'],
  psib: ['Macro', '\\boldsymbol{\\psi}'],
  rhob: ['Macro', '\\boldsymbol{\\rho}'],
  sigmab: ['Macro', '\\boldsymbol{\\sigma}'],
  taub: ['Macro', '\\boldsymbol{\\tau}'],
  thetab: ['Macro', '\\boldsymbol{\\theta}'],
  upsilonb: ['Macro', '\\boldsymbol{\\upsilon}'],
  xib: ['Macro', '\\boldsymbol{\\xi}'],
  zetab: ['Macro', '\\boldsymbol{\\zeta}'],

  varepsilonb: ['Macro', '\\boldsymbol{\\varepsilon}'],
  varphib: ['Macro', '\\boldsymbol{\\varphi}'],
  varpib: ['Macro', '\\boldsymbol{\\varpi}'],
  varrhob: ['Macro', '\\boldsymbol{\\varrho}'],
  varsigmab: ['Macro', '\\boldsymbol{\\varsigma}'],
  varthetab: ['Macro', '\\boldsymbol{\\vartheta}'],

  // Table 4
  // These are in upgreek. REMOVE!
  // upalpha: ['Macro', '\\unicode{x03B1}'],
  // upbeta: ['Macro', '\\unicode{x03B2}'],
  // upchi: ['Macro', '\\unicode{x03C7}'],
  // updelta: ['Macro', '\\unicode{x03B4}'],
  // upepsilon: ['Macro', '\\unicode{x03F5}'],
  // upeta: ['Macro', '\\unicode{x03B7}'],
  // upgamma: ['Macro', '\\unicode{x03B3}'],
  // upiota: ['Macro', '\\unicode{x03B9}'],
  // upkappa: ['Macro', '\\unicode{x03BA}'],
  // uplambda: ['Macro', '\\unicode{x03BB}'],
  // upmu: ['Macro', '\\unicode{x03BC}'],
  // upnu: ['Macro', '\\unicode{x03BD}'],
  // upomega: ['Macro', '\\unicode{x03C9}'],
  // upphi: ['Macro', '\\unicode{x03C6}'],
  // uppi: ['Macro', '\\unicode{x03C0}'],
  // uppsi: ['Macro', '\\unicode{x03C8}'],
  // uprho: ['Macro', '\\unicode{x03C1}'],
  // upsigma: ['Macro', '\\unicode{x03C3}'],
  // uptau: ['Macro', '\\unicode{x03C4}'],
  // uptheta: ['Macro', '\\unicode{x03B8}'],
  // upupsilon: ['Macro', '\\unicode{x028A}'],
  // upvarepsilon: ['Macro', '\\unicode{x03F5}'],
  // upvarphi: ['Macro', '\\unicode{x03C6}'],
  // upvarpi: ['Macro', '\\unicode{x03D6}'],
  // upvarrho: ['Macro', '\\unicode{x03F1}'],
  // upvarsigma: ['Macro', '\\unicode{x03C2}'],
  // upvartheta: ['Macro', '\\unicode{x03D1}'],
  // upxi: ['Macro', '\\unicode{x03BE}'],
  // upzeta: ['Macro', '\\unicode{x03B6}'],

  // These are the same as in textcomp. REMOVE!
  // textbackslash: ['Macro', '\\unicode{x005C}'],
  // textbullet: ['Macro', '\\unicode{x00A5}'],
  // textcent: ['Macro', '\\unicode{x00A2}'],
  // textcurrency: ['Macro', '\\unicode{x00A4}'],
  // textdegree: ['Macro', '\\unicode{x00B0}'],
  // textdollar: ['Macro', '\\unicode{x0024}'],
  // textexclamdown: ['Macro', '\\unicode{x00A1}'],
  // textgreater: ['Macro', '\\unicode{x003E}'],
  // textlbrackdbl: ['Macro', '\\unicode{x27E6}'],
  // textless: ['Macro', '\\unicode{x003C}'],
  // textnumero: ['Macro', '\\unicode{x2116}'],
  // textperthousand: ['Macro', '\\unicode{x2030}'],
  // textquestiondown: ['Macro', '\\unicode{x00BF}'],
  // textquotedblleft: ['Macro', '\\unicode{x201C}'],
  // textquotedblright: ['Macro', '\\unicode{x201D}'],
  // textrbrackdbl: ['Macro', '\\unicode{x27E7}'],
  // textregistered: ['Macro', '\\unicode{x00AE}'],
  // textyen: ['Macro', '\\unicode{x00A5}'],

  // Table 6 in the CLSL. Not in textcomp!
  textquotedbl: ['Macro', '\\unicode{x0022}'],

  // Table 9: Rewrite?
  REALE: ['Macro', '{\\rm I\\kern-.20em E}'],
  REALK: ['Macro', '{\\rm I\\kern-.20em K}'],
  REALN: ['Macro', '{\\rm I\\kern-.20em N}'],
  REALP: ['Macro', '{\\rm I\\kern-.20em P}'],
  REALR: ['Macro', '{\\rm I\\kern-.20em R}'],
  REALT: ['Macro', '{\\rm I\\kern-.40em T}'],
  REALONE: ['Macro', '\\unicode[serif]{x1D7D9}'],
  realone: ['Macro', '\\unicode{x1D7D9}'],
  posinteger: ['Macro', '{\\rm I\\kern -0.13em N}'],
  binary: ['Macro', '{\\rm I\\kern -0.17em B}'],
  hilbert: ['Macro', '{\\rm I\\kern -0.15em H}'],
  ZED: ['Macro', '\\sf{Z}\\hskip-4pt\\sf{Z}'],

  // Table 10
  mathacute: ['Macro', '\\acute'],
  mathbreve: ['Macro', '\\breve'],
  mathcheck: ['Macro', '\\check'],
  mathdot: ['Macro', '\\dot'],
  mathddot: ['Macro', '\\ddot'],
  mathhat: ['Macro', '\\hat'],
  mathtilde: ['Macro', '\\tilde'],

  // Table 11
  // REPLACED with bboldx!
  // bbalpha: ['Macro', '\\shortmid\\kern -.57em\\unicode{x3B1}'],
  // bbbeta: ['Macro', '|\\kern -.30em\\unicode{x3B2}'],
  // bblambda: ['Macro', '\\unicode{x3BB}\\kern -.20em\\unicode{x005C}'],
  
  bla: ['Macro', '\\buildrel \\longrightarrow \\over {#1}', 1],
  boxaround: ['Macro', '{\\boxed{#1}}', 1],
  boxed: ['Macro', '{\\fbox{$#1$}}', 1],
  boxwrap: ['Macro', '{\\boxed{#1}}', 1],
  bra: ['Macro', '\\buildrel \\longleftarrow \\over {#1}', 1],
  cox: ['Macro', '\\raise1.5pt{\\scriptsize\\unicode{x25EF}\\kern -0.80em\\unicode{x25C7}}\\normalsize'],
  csi: ['Macro', '{\\iint\\kern-8pt\\raise1pt\\scriptscriptstyle{\\bigcirc}}'],
  dddots: ['Macro', '\\mathop{#1}\\limits^{\\scriptstyle\\ldots}', 1],
  de: ['Macro', '\\buildrel \\Delta \\over = '],
  doublegrave: ['Macro', '{{#1}{\\unicode{x030F}}}', 1],
  harp: ['Macro', '\\buildrel \\scriptstyle\\rightharpoonup \\over #1', 1],
  harpk: ['Macro', '{\\raise1pt\\hbox{$^{\\scriptscriptstyle\\rightharpoonup}$}\\kern-5.5pt k\\hskip1pt}'],
  harpm: ['Macro', '{\\raise1pt\\hbox{$^{\\scriptscriptstyle\\rightharpoonup}$}\\kern-5.5pt m\\hskip1pt}'],
  harpn: ['Macro', '{\\raise1pt\\hbox{$^{\\scriptscriptstyle\\rightharpoonup}$}\\kern-5.5pt n\\hskip1pt}'],
  harpr: ['Macro', '{\\raise1pt\\hbox{$^{\\scriptscriptstyle\\rightharpoonup}$}\\kern-5.5pt r\\hskip1pt}'],
  joinrel: ['Macro', '{\\mathrel{\\mkern-3.5pt} #1}', 1],
  lambdabar: ['Macro', '\\unicode{x207B}\\kern -.30em \\lambda'],
  lambdaslash: ['Macro', '\\uplambda \\kern -0.45em \\raise2.5pt{\\style{transform:rotate(-45deg); transform-origin:left baseline; display:inline-block}{\\hbox{-}}}\\kern 0.1em'],
  lilrvec: ['Macro', '\\mathop{#1}\\limits^{\\scriptstyle\\leftrightarrow}', 1],
  lrvec: ['Macro', '\\mathop{#1}\\limits^{\\leftrightarrow}', 1],
  ovalbox: ['Macro', '\\enclose{roundedbox}{#1}',1],
  overcat: ['Macro', '\\mathop{#1}\\limits^{#2}', 2],
  owedge: ['Macro', '\\bigcirc \\kern-1.05em \\wedge'],
  phase: ['Macro', '\\enclose{phasorangle}{#1}',1],
  precstar: ['Macro', '{\\prec\\hskip-4pt{\\raise1.3pt{\\scriptscriptstyle{+}}}}'],
  quaddot: ['Macro', '{\\ddot{\\hskip-2.8pt\\ddot{#1}}}', 1],
  stackvec: ['Macro', '\\lilrvec{\\lilrvec{#1}}', 1],
  ula: ['Macro', '\\buildrel{#1}\\over{\\leftarrow}', 1],
  underdog: ['Macro', '\\mathop{#1}\\limits_{#2}', 2],
  underdot: ['Macro', '{{#1}{\\unicode{x0323}}}', 1],
  undertilde: ['Macro', '{\\mathop{#1}\\limits_{\\unicode{x007E}}}', 1],
  ura: ['Macro', '\\buildrel{#1}\\over{\\rightarrow}', 1],
  wedgie: ['Macro', '{\\raise2pt\\scriptstyle\\wedge}'],


  // Table 12
  'break': ['Macro', ''],
  'null': ['Macro', ''],
  AA: ['Macro', '\\unicode[serif]{x212B}'],
  bigsqcap: ['Macro', '\\Large\\unicode{x2293}'],
  blackbox: ['Macro', '\\blacksquare'],
  blacksquarebox: ['Macro', '\\blacksquare'],
  blacktriangleup: ['Macro', '\\blacktriangle'],
  cent: ['Macro', '\\unicode{x00A2}'],
  dag: ['Macro', '\\dagger'],
  ddag: ['Macro', '\\ddagger'],
  doubleint:  ['Macro', '\\iint_{#1}', 1],
  enskip: ['Macro', '\\enspace #1\\enspace', 1],
  eqno: ['Macro', '\\tag*{$#1$}', 1],
  euro: ['Macro', '\\unicode[serif]{x20AC}'],
  indent: ['Macro', '\\qquad'],
  lhook: ['Macro', '\\hookrightarrow'],
  nsubset: ['Macro', '\\not\\subset'],
  nsubseteq: ['Macro', '\\not\\subseteq'],
  oiiint: ['Macro', '{\\LARGE{\\unicode{x2230}}}'],
  oiint: ['Macro', '{\\LARGE{\\unicode{x222F}}}'],
  operatornamewithlimits: ['Macro', '\\mathop{#1}', 1],
  // Can be removed as it is in the base macros
  // overparen: ['UnderOver','23DC'],
  pound: ['Macro', '\\unicode[serif]{x00A3}'],
  pounds: ['Macro', '\\unicode[serif]{x00A3}'],
  reallongarrow: ['Macro', '\\longrightarrow'],
  relax: ['Macro', ''],
  relbar: ['Macro', '{\\mathrel{-}}'],
  rhook: ['Macro', '\\hookleftarrow'],
  sharpb: ['Macro', '\\boldsymbol{\\sharp}'],
  squarebox: ['Macro', '{\\square}'],
  subsquare: ['Macro', '{\\scriptscriptstyle\\square}'],
  thetahatb: ['Macro', '\\boldsymbol{\\hat{\\theta}}'],
  thickspace: ['Macro', '{\\;}'],
  underparen: ['UnderOver','23DD'],
  widecheck: ['Accent', '030C', 1],
  wideparen: ['Macro', '\\overparen'],


  // table 13
  L: ['Macro', '\\unicode{x141}'],
  Mapsto: ['Macro', '\\unicode{x2907}'],
  O: ['Macro', '\\unicode{x00D8}'],
  Sha: ['Macro', '\\unicode{x0428}'],
  Squaredot: ['Macro', '\\unicode{x2B1D}'],
  Squarepipe: ['Macro', '\\unicode{x25A1}'],
  Zhe: ['Macro', '\\unicode{x0416}'],
  arrowoncirc: ['Macro', '{\\unicode{x21F4}}'],
  arrowonoplus: ['Macro', '\\unicode{x27F4}'],
  backcong: ['Macro', '\\unicode{x224C}'],
  baracc: ['Macro', '\\unicode{x207B}'],
  blackdiamond: ['Macro', '\\unicode{x2666}'],
  blackslug: ['Macro', '\\unicode{x25AE}'],
  boxast: ['Macro', '\\unicode{x29C6}'],
  boxbox: ['Macro', '\\unicode{x29C8}'],
  boxslash: ['Macro', '\\unicode{x29C4}'],
  coloneqq: ['Macro', '\\unicode{x2254}'],
  complex: ['Macro', '\\unicode{x2102}'],
  complexs: ['Macro', '\\unicode{x2102}'],
  copyright: ['Macro', '\\unicode{x00A9}'],
  cupdot: ['Macro', '\\unicode{x228D}'],
  female: ['Macro', '{\\unicode{x2640}}'],
  frbox: ['Macro', '\\unicode{x2610}'],
  hellip: ['Macro', '\\unicode{x2026}'],
  hexagon: ['Macro', '\\unicode{x02394}'],
  i: ['Macro', '\\unicode{x131}'],
  icy: ['Macro', '\\unicode{x00438}'],
  l: ['Macro', '\\unicode{x142}'],
  lddots: ['Macro', '\\unicode{x22F0}'],
  ldquo: ['Macro', '\\unicode{x201C}'],
  leftarrowtriangle: ['Macro', '\\unicode{x21FD}'],
  leftmoon: ['Macro', '\\unicode{x263E}'],
  leftsquigarrow: ['Macro', '\\unicode{x2B33}'],
  llbracket: ['Macro', '\\unicode{x27E6}'],
  llcorner: ['Macro', '\\unicode{x231E}'],
  lq: ['Macro', '\\unicode{x2018}'],
  lrcorner: ['Macro', '\\unicode{x231F}'],
  male: ['Macro', '\\unicode{x2642}'],
  mapsfrom: ['Macro', '\\unicode{x021A4}'],
  mathL: ['Macro', '\\unicode{x141}'],
  mathOslash: ['Macro', '\\unicode{x00D8}'],
  mathl: ['Macro', '\\unicode{x142}'],
  mathoslash: ['Macro', '\\unicode{x00F8}'],
  minus: ['Macro', '\\unicode{x2212}'],
  ndash: ['Macro', '\\unicode{x2212}'],
  ocircle: ['Macro', '\\unicode{x29BE}'],
  permil: ['Macro', '\\unicode{x2030}'],
  rightarrowtriangle: ['Macro', '\\unicode{x21FE}'],
  rightharpoon: ['Macro', '\\unicode{x21C0}'],
  rms: ['Macro', '\\unicode{x24C7}'],
  rrbracket: ['Macro', '\\unicode{x27E7}'],
  semaphorel: ['Macro', '\\unicode{x25E9}'],
  semaphorer: ['Macro', '\\unicode{x25EA}'],
  sha: ['Macro', '\\unicode{x0448}'],
  slash: ['Macro', '\\unicode{x2215}'],
  squaredot: ['Macro', '\\unicode{x22A1}'],
  ss: ['Macro', '\\unicode{x00DF}'],
  sun: ['Macro', '\\unicode{x263C}'],
  textschwa: ['Macro', '\\unicode{x0259}'],
  th: ['Macro', '\\unicode{x00FE}'],
  thorn: ['Macro', '\\unicode{x00FE}'],
  tr: ['Macro', '\\mathop{\\rm tr}'],

  // table 14
  BB: ['Macro', '\\mathbb'],
  EuScript: ['Macro', '\\matheus{#1}',1],
  Fraktur: ['Macro', '{\\frak #1}', 1],
  bb: ['Macro', '\\mathbb'],
  bm: ['Macro', '\\pmb{#1}', 1],
  bmit: ['Macro', '\\boldsymbol'],
  bold: ['Macro', '{\\bf{#1}}', 1],
  fraktur: ['Macro', '{\\frak #1}', 1],
  mathbi: ['Macro', '\\boldsymbol'],
  mbi: ['Macro', '\\boldsymbol'],
  mmb: ['Macro', '{\\boldsymbol #1}', 1],
  sc: ['Macro', '\\scriptsize{#1}\\normalsize', 1],
  schmi: ['Macro', '\\boldsymbol'],
  scr: ['SetFont', TexConstant.Variant.SCRIPT],
  sl:  ['SetFont', TexConstant.Variant.ITALIC],              // not sure what you want this to be
  ssr: ['Macro', '\\sf'],
  ssi: ['SetFont', TexConstant.Variant.SANSSERIFITALIC],
  ssb: ['SetFont', TexConstant.Variant.BOLDSANSSERIF],
  textsc: ['Macro', '\\scriptsize{#1}\\normalsize', 1],
  textsl: ['Macro', '{\\tt\\textit{#1}}', 1],
  texttt: ['Macro', '{\\tt\\text{#1}}', 1],
  // table 6
  // dsmath:    ['IeeeMathFont', TexConstant.Variant.DOUBLESTRUCK, 'serif'],
  // table 5
  // mathbbmss: ['IeeeMathFont', TexConstant.Variant.DOUBLESTRUCK, 'sans-serif'],

  // Table 15
  // This needs HtmlMethods package!
  nuparrow: ['Macro', '\\style{transform:matrix(1,0,0,-1,0,0) rotate(90deg); transform-origin:left baseline;}{\\unicode{x219B}}'],
  ndownarrow: ['Macro', '\\style{transform:matrix(1,0,0,-1,0,0) rotate(-90deg); transform-origin:left baseline;}{\\unicode{x219B}}'],
  blackboxfill: ['Macro', '\\style{float:right; padding-right:1em}{\\blackbox}'],

  // Rest
  // This needs HtmlMethods package!
  rotatebox: 'RotateBox',

}, IeeeMacrosMethods);


new CommandMap('ieee-macros-ignore', {
    // Things to fix
  pgtag: ['Ignore', 0],
  setcounter: ['Ignore', 2],
  '-': ['Ignore', 0],
  hbox:               ['HBox', 0],
}, IeeeMacrosMethods);


new CommandMap('ieee-macros-structures', {
  displaylines: 'ieeeMatrix',
  matrix: 'ieeeMatrix',
  vcenter: 'ieeeVCenter',
  vrule: 'ieeeVRule',
  halign: 'ieeeHAlign',
  hfill: 'ieeeHFill',
  noalign: 'ieeeNoAlign',
  mathchar: 'ieeeMathChar',
  mathaccent: 'ieeeMathAccent',
  scases: ['Matrix', '', '', 'left left', null, '.1em', null, true],
}, IeeeMacrosMethods);

new CommandMap('ieee-macros-others', {
  hskip: 'Hskip',
  noindent: ['Spacer', 0]
}, IeeeMacrosMethods);


new EnvironmentMap('ieee-macros-environments',  ParseMethods.environment, {
  scases: ['Array', null, '', '.', 'll', null, '.2em', 'T']
}, IeeeMacrosMethods);
