/*************************************************************
 *
 *  Copyright (c) 2018-2023 The MathJax Consortium
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
 * @fileoverview Configuration file for the IEEE Macros package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {Configuration} from '../../Configuration.js';
import {IeeeArrayItem} from './IeeeMacrosItems.js';
import './IeeeMacrosMappings.js';

function ieeeCleanup(arg: any) {
  let math = arg.math.math;
  //
  //  Look for constructs that should be \hline or \hdashline
  //  (mostly \noalign{\hrule}, \multispan\xleaders or \multispan\hrulefill constructs)
  //  Also convert \cr\noalign{\vskip ...} to \\[...] and remove initial \vskip
  //
  math = math.replace(/\\noalign *\{(\\vskip *-?[0-9.,]+pt *)?\\hrule *(\\vskip *-?[0-9.,]+pt *)?\}/g,"\\hline ");
  math = math.replace(/(?:\\noalign *\{\\vskip *-?[0-9.,]+p[tc] *\})?\\multispan *(?:\{\d+\}|\d+) *(?:\\hrulefill *)*(?:\\cr *|(\}))(?:\\noalign *\{\\vskip *-?[0-9.,]+p[tc] *\})?/g,"\\hline $1");
  math = math.replace(
    /(?:\\noalign *\{\\vskip *-?[0-9.,]+p[tc] *\})?\\multispan *\{\d+\} *\\xleaders *\\hbox to *([0-9.,]+) *ex\{[^}]*?width *([0-9.,]+)(ex|pt).*?\\hfill *\\cr *(?:\\noalign *\{ *\\vskip *-?[0-9.,]+p[tc] *\})?/g,
    function (_match: string, ex1: string, ex2: string, unit: string) {
      return (ex1 > ex2 || unit === "pt" ? "\\hdashline " : "\\hline ");
    }
  );
  math = math.replace(/\\cr *\\noalign *\{ *\\vskip *(-?[0-9.,]+ *(pt|pc|ex)) *\}/g,"\\\\[$1]");
  math = math.replace(/\{ *\\noalign *\{ *\\vskip *(-?[0-9.,]+ *p[tc]) *\}/g,"{");
  math = math.replace(/(\\cr|\\\\\[-?[0-9.,]+ *pt\]) *\\hrulefill */g,"\\cr\\hline ");
  math = math.replace(/\{\\hrulefill *(\\cr|\\\\\[-?[0-9.,]+ *pt\]) */g,"{\\hline ");
  //
  //  Convert \noalign{\hbox{...}} to \hbox{...}\cr (adds a new row with the interline material -- best we can do)
  //
  math = math.replace(/\\noalign *\{ *(?:\\hskip *-?[0-9.,]+pt|\\qquad)* *\\hbox *\{([^{}]*?)\} *\}/g,"\\hbox{$1}\\cr ");
  //
  //  Handle \hfill\cr\hfill in \displaylines (add some actual space, since we don't
  //  extend the equations out to the margins, and that would be too much anyway).
  //
  if (math.match(/\\displaylines/)) {
    math = math.replace(/\\hfill *\\cr *\\noalign *\{ *\\vskip (-?[0-9.,]+pt) *\} *\\hfill/g,"\\hskip 6em\\hfill\\\\[$1]\\hfill\\hskip 6em ");
    math = math.replace(/\\hfill *\\cr *\\hfill/g,"\\hskip 6em\\hfill\\cr\\hfill\\hskip 6em ");
  }
  //
  //  Fix font references and remove ones that we don't recognize
  //
  math = math.replace(/\\font\\[a-zA-Z]* *= *cmssi10 */g,"\\sf ");
  math = math.replace(/\\font(\\[a-zA-Z]*) *= *[a-z0-9]+(?: at .*?pt)? *\{(\\hbox *\{) *\1 *(.*?)\}/g,"$2$3");
  math = math.replace(/\\font(\\[a-zA-Z]*) *= *[a-z0-9]+(?: at .*?pt)? *(\\hbox *\{) *\1 *(.*?)\}/g,"$2$3}");
  //
  //  Remove unneeded dolar signs from around \quad (in case statements)
  //
  math = math.replace(/\$\\quad *\$ *&/g,"\\quad\&");
  //
  //  Fix \eqno without braces
  //
  math = math.replace(/\\eqno *([^{}]*\\hbox *\{.*?\})/g,"\\eqno{$1}");
  math = math.replace(/\\eqno *([^{}]*\{\\hbox *\{.*?\} *\})/g,"\\eqno{$1}");
  //
  //  Remove unneeded \hbox from around \hskip
  //
  math = math.replace(/\\hbox *\{ *(\\hskip *[^{}]*?)\}/g,"$1");
  //
  //  Use \Rule to create line
  //  
  math = math.replace(/\\hbox to ([^{}]*?) \{ *\\hrulefill *\}/g,"\\Rule{$1}{1pt}{0pt}");
  if (math === "\\hrulefill") math = "\\Rule{10em}{1pt}{0pt}";
  //
  //  Convert vertical rules to \vrule (picked up by ieeeVRule above).
  //
  math = math.replace(/\{\\smash\{\\hbox\{\\vrule[^{}]*?\}\}\}/g,"\\vrule");
  math = math.replace(/\\smash\{\\hbox\{\\vrule[^{}]*?\}\}/g,"\\vrule");
  math = math.replace(/\\smash\{\\vrule[^{}]*?\}/g,"\\vrule");
  //
  //  Remove \setbox construct that is used to create space
  //
  math = math.replace(/\\setbox 0=.*?\\box 0\\relax/g,"");
  //
  //  Handle \setbox used for centering negation (not great, but at least displays)
  //
  math = math.replace(/(\\math(ord|rel)){\\setbox0=\\hbox\{(\$(.*?)\$|(.*?))\} \\rlap\{.*?\}\}\\box0\}/g,"\\not$1{$4$5}");
  //
  //  Fix order of ^{...} and \limits or \nolimits
  //
  math = math.replace(/([_^]\{[^{}]*?\}) *(\\(no)?limits) */g,"$2$1");
  //
  //  Remove \limits from \underbrace or \overbrace (MathJax doesn't recognize it there)
  //
  math = math.replace(/(\\(?:und|ov)erbrace *\{(?:\{[^{}]*?\}|[^{}])*?\}) *\\limits/g,"$1");
  //
  //  Remove \kern-\nulldelimiterspace (since in MathJax \nulldelimiterspace is 0)
  //
  math = math.replace(/\\kern *-?\\nulldelimiterspace/g,"");
  //
  //  Convert units of pi to pt (not sure what they are suppossed to be)
  //
  math = math.replace(/(\\hskip *-?[0-9.,]+) *pi/g,"$1pt");
  //
  //  Remove \baslineskip settings
  //
  math = math.replace(/\\baselineskip *(= *)?-?[0-9.,]+ *pt/g,"");
  //
  //  Convert use of comma in \hskip distace to a decimal point
  //
  math = math.replace(/(\\hskip *-?\d+),/g,"$1.");
  //
  //  Remove \vadjust{\vskip ...}
  //
  math = math.replace(/\\vadjust *\{ *\\vskip *-?[0-9.,]+ex *\} */g,"");
  //
  //  Remove \noindent - Dave S. added 9/1/2015
  //
  math = math.replace(/\\noindent/g,"");    //
  //  Fix bad \AA in hbox - Dave S. added 9/1/2015
  //
  math = math.replace(/\\hbox\{\\rm \\AA\}/g,"\\AA");    //
  //  Fix bad \pgtag used by SPI - Dave S. added 9/1/2015
  //
  math = math.replace(/\\pgtag/g,"");    //
  //  Fix \setcounter problem in matrices - Dave S. added 9/1/2015
  //
  math = math.replace(/\\setcounter\{[a-zA-Z]*\}\{[0-9]*\}/g,"");

  //
  //  Fix \noindent\vskip problem  - Dave S. added 9/8/2015
  //
  math = math.replace(/\{\\vskip[0-9]*pt\}/g,"");

  //
  //  Fix \hspace* problem  - Dave S. added 11/6/2015
  //
  math = math.replace(/\\hspace\*/g,"\\hspace");

  //
  //  Fix \noindent\vskip problem with minus  - Dave S. added 9/8/2015
  //
  math = math.replace(/\{\\vskip\-[0-9]*pt\}/g,"");


  arg.math.math = math;
}

export const IeeeMacrosConfiguration = Configuration.create(
  'ieeemacros', {
    handler: {
      macro: ['ieee-macros', 'ieee-macros-ignore', 'ieee-macros-structures', 'ieee-macros-others'],
      environment: ['ieee-macros-environments']
    },
    items: {
      // BaseItems
      [IeeeArrayItem.prototype.kind]: IeeeArrayItem,
    },
    preprocessors: [ieeeCleanup],
  }
);
